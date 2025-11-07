import { computed, useRuntimeConfig, useState } from '#imports'
import type { ConverterPayload, PointRatesResponse } from '../types'
import { ofetch } from 'ofetch'

type FetchOptions = { forceRefresh?: boolean }
type SyncOptions = FetchOptions & { lazy?: boolean }

interface ConverterState {
  payload: PointRatesResponse | null
  fetchedAt: number | null
  ttlMs: number | null
  promise: Promise<PointRatesResponse> | null
  error: unknown
  lastErrorTime: number | null
  errorCount: number
}

const isFiniteNumber = (value: unknown): value is number =>
  typeof value === 'number' && Number.isFinite(value)

const normalizeCode = (code: string) => code.trim().toUpperCase()
const now = () => Date.now()

// Константы для контроля ошибок
const MAX_ERROR_COUNT = 5
const ERROR_COOLDOWN_MS = 300000 // 5 минут

function shouldSkipRetryDueToErrors(state: ConverterState): boolean {
  if (state.errorCount >= MAX_ERROR_COUNT && state.lastErrorTime) {
    const timeSinceLastError = now() - state.lastErrorTime
    return timeSinceLastError < ERROR_COOLDOWN_MS
  }
  return false
}

export function useConverter() {
  const config = useRuntimeConfig()
  const moduleConfig = (config.public?.converterModule || {}) as {
    apiRoutePath?: string
    ttlSec?: number
  }

  const apiRoutePath = moduleConfig.apiRoutePath || '/api/_converter/rates'
  const defaultTtlMs =
    typeof moduleConfig.ttlSec === 'number' && moduleConfig.ttlSec > 0
      ? moduleConfig.ttlSec * 1000
      : 0

  const state = useState<ConverterState>('converter:rates', () => ({
    payload: null,
    fetchedAt: null,
    ttlMs: null,
    promise: null,
    error: null,
    lastErrorTime: null,
    errorCount: 0,
  }))

  const hasFreshLocalPayload = () => {
    if (!state.value.payload || !state.value.fetchedAt) return false
    const effectiveTtl = state.value.ttlMs ?? defaultTtlMs
    if (!effectiveTtl || effectiveTtl <= 0) return false
    return now() - state.value.fetchedAt < effectiveTtl
  }

  const fetchRates = async (opts?: FetchOptions): Promise<PointRatesResponse> => {
    const forceRefresh = opts?.forceRefresh ?? false

    if (!forceRefresh && state.value.promise) {
      return state.value.promise
    }

    const requestPromise = ofetch<ConverterPayload>(apiRoutePath, {
        method: 'GET',
        query: forceRefresh ? { force: '1' } : undefined,
      })
      .then((response) => {
        state.value.payload = response.payload
        state.value.fetchedAt = response.fetchedAt
        state.value.ttlMs = response.ttlMs ?? defaultTtlMs
        state.value.error = null
        state.value.errorCount = 0
        state.value.lastErrorTime = null
        return response.payload
      })
      .catch((error) => {
        const currentTime = now()
        state.value.error = error
        state.value.errorCount = state.value.errorCount + 1
        state.value.lastErrorTime = currentTime
        
        console.error(`[converter] Fetch failed (attempt ${state.value.errorCount})`, error)
        throw error
      })
      .finally(() => {
        if (state.value.promise === requestPromise) {
          state.value.promise = null
        }
      })

    state.value.promise = requestPromise
    return requestPromise
  }

  const ensureRates = async (
    forceOrOptions?: boolean | FetchOptions
  ): Promise<PointRatesResponse> => {
    const forceRefresh =
      typeof forceOrOptions === 'boolean'
        ? forceOrOptions
        : forceOrOptions?.forceRefresh ?? false

    if (!forceRefresh && state.value.payload && hasFreshLocalPayload()) {
      return state.value.payload
    }

    return await fetchRates({ forceRefresh })
  }

  const ensureRatesSync = (opts?: SyncOptions): PointRatesResponse | null => {
    const forceRefresh = opts?.forceRefresh ?? false
    const fresh = hasFreshLocalPayload()

    if (!forceRefresh && fresh && state.value.payload) {
      return state.value.payload
    }

    // Проверяем, нужно ли пропустить запрос из-за ошибок
    const skipDueToErrors = shouldSkipRetryDueToErrors(state.value)
    
    if (!opts?.lazy && !skipDueToErrors) {
      void fetchRates({ forceRefresh }).catch((error) => {
        console.warn('[converter] Background fetch failed:', error)
        // suppress errors for sync flow; consumers can retry explicitly
      })
    } else if (skipDueToErrors) {
      console.warn('[converter] Skipping fetch due to recent failures')
    }

    if (!forceRefresh && state.value.payload) {
      return state.value.payload
    }

    return null
  }

  const withPayload = <T>(
    opts: SyncOptions | undefined,
    handler: (payload: PointRatesResponse) => T | null
  ): T | null => {
    const payload = ensureRatesSync(opts)
    return payload ? handler(payload) : null
  }

  const findRateValue = (payload: PointRatesResponse, code: string): number | null => {
    if (!code) return null
    const normalized = normalizeCode(code)
    const entry = payload.rates.find(
      (item) => normalizeCode(item.code) === normalized
    )
    return entry && isFiniteNumber(entry.rate) ? entry.rate : null
  }

  const withRate = <T>(
    code: string,
    opts: SyncOptions | undefined,
    handler: (rate: number) => T | null
  ): T | null => {
    if (!code) return null
    return withPayload(opts, (payload) => {
      const rate = findRateValue(payload, code)
      return rate === null ? null : handler(rate)
    })
  }

  const getRate = async (
    code: string,
    opts?: FetchOptions
  ): Promise<number | null> => {
    if (!code) return null
    const payload = await ensureRates(opts)
    return findRateValue(payload, code)
  }

  const getRateSync = (code: string, opts?: SyncOptions): number | null =>
    withRate(code, opts, (rate) => rate)

  const convertPointsSync = (
    points: number,
    code: string,
    opts?: SyncOptions
  ): number | null => {
    if (!isFiniteNumber(points)) return null
    return withRate(code, opts, (rate) => points * rate)
  }

  const convertFiatToPointsSync = (
    amount: number,
    code: string,
    opts?: SyncOptions
  ): number | null => {
    if (!isFiniteNumber(amount)) return null
    return withRate(code, opts, (rate) => {
      if (rate === 0) return null
      return amount / rate
    })
  }

  const convertFiatToFiatSync = (
    amount: number,
    fromCode: string,
    toCode: string,
    opts?: SyncOptions
  ): number | null => {
    if (!isFiniteNumber(amount)) return null
    if (!fromCode || !toCode) return null
    if (normalizeCode(fromCode) === normalizeCode(toCode)) return amount

    return withPayload(opts, (payload) => {
      const fromRate = findRateValue(payload, fromCode)
      const toRate = findRateValue(payload, toCode)
      if (fromRate === null || toRate === null || fromRate === 0) return null
      return (amount / fromRate) * toRate
    })
  }
  
  // Инициализируем данные только если нет ошибок
  if (!state.value.payload && !state.value.promise && !shouldSkipRetryDueToErrors(state.value)) {
    void fetchRates().catch((error) => {
      console.warn('[converter] Initial fetch failed:', error)
      // silent background fetch failure; consumers can retry
    })
  }

  const rates = computed(() => state.value.payload?.rates ?? [])
  const base = computed(() => state.value.payload?.base ?? null)
  const pending = computed(() => !!state.value.promise)
  const error = computed(() => state.value.error ?? null)
  const errorCount = computed(() => state.value.errorCount)
  const lastErrorTime = computed(() => state.value.lastErrorTime)
  const fetchedAt = computed(() => state.value.fetchedAt)
  const hasFreshRates = computed(() => hasFreshLocalPayload())
  const isInErrorCooldown = computed(() => shouldSkipRetryDueToErrors(state.value))

  return {
    base,
    rates,
    pending,
    error,
    errorCount,
    lastErrorTime,
    isInErrorCooldown,
    fetchedAt,
    fetchRates,
    ensureRates,
    ensureRatesSync,
    getRate,
    getRateSync,
    convertPointsSync,
    convertFiatToPointsSync,
    convertFiatToFiatSync,
    hasFreshRates,
    refresh: () => fetchRates({ forceRefresh: true }),
    // Функция для сброса ошибок
    clearErrors: () => {
      state.value.error = null
      state.value.errorCount = 0
      state.value.lastErrorTime = null
    }
  }
}
