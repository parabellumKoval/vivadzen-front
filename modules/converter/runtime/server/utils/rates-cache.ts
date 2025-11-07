import { ofetch } from 'ofetch'
import { joinURL } from 'ufo'
import { useRuntimeConfig, useStorage } from 'nitropack/runtime'
import type { PointRatesResponse } from '../../types'

interface CacheEntry {
  payload: PointRatesResponse
  fetchedAt: number
}

interface FailureEntry {
  lastFailedAt: number
  failureCount: number
  retryAfter: number
}

interface ConverterModuleRuntimeOptions {
  baseUrl?: string
  ratesEndpoint?: string
  ttlSec?: number
}

const STORAGE_KEY = 'converter:rates'
const FAILURE_KEY = 'converter:failures'

// Максимальное количество попыток
const MAX_RETRY_ATTEMPTS = 5
// Начальная задержка в миллисекундах
const INITIAL_RETRY_DELAY = 5000
// Максимальная задержка в миллисекундах
const MAX_RETRY_DELAY = 300000 // 5 минут

const now = () => Date.now()

function storage() {
  return useStorage('cache')
}

function failureStorage() {
  return useStorage('cache')
}

function getModuleOptions() {
  const config = useRuntimeConfig()
  const moduleConfig = (config.converterModule || {}) as ConverterModuleRuntimeOptions
  const ttlSec = typeof moduleConfig.ttlSec === 'number' ? moduleConfig.ttlSec : 300
  const ttlMs = ttlSec > 0 ? ttlSec * 1000 : 0
  const baseUrl = moduleConfig.baseUrl || (config.public?.apiBase as string | undefined)

  return {
    baseUrl,
    ratesEndpoint: moduleConfig.ratesEndpoint || '/points/rates',
    ttlSec,
    ttlMs,
  }
}

function resolveRemoteUrl() {
  const { baseUrl, ratesEndpoint } = getModuleOptions()
  if (!baseUrl) {
    throw new Error(
      'converterModule.baseUrl is not configured and runtimeConfig.public.apiBase is empty'
    )
  }
  return joinURL(baseUrl, ratesEndpoint || '')
}

async function readCache(): Promise<CacheEntry | null> {
  return await storage().getItem<CacheEntry>(STORAGE_KEY)
}

async function writeCache(entry: CacheEntry) {
  await storage().setItem(STORAGE_KEY, entry)
}

async function readFailureInfo(): Promise<FailureEntry | null> {
  return await failureStorage().getItem<FailureEntry>(FAILURE_KEY)
}

async function writeFailureInfo(entry: FailureEntry) {
  await failureStorage().setItem(FAILURE_KEY, entry)
}

async function clearFailureInfo() {
  await failureStorage().removeItem(FAILURE_KEY)
}

function calculateRetryDelay(failureCount: number): number {
  // Экспоненциальная задержка с джиттером
  const delay = Math.min(
    INITIAL_RETRY_DELAY * Math.pow(2, failureCount),
    MAX_RETRY_DELAY
  )
  // Добавляем случайный джиттер ±25%
  const jitter = delay * 0.25 * (Math.random() * 2 - 1)
  return Math.floor(delay + jitter)
}

async function shouldSkipRetry(): Promise<boolean> {
  const failureInfo = await readFailureInfo()
  if (!failureInfo) return false
  
  const currentTime = now()
  
  // Если превышен лимит попыток
  if (failureInfo.failureCount >= MAX_RETRY_ATTEMPTS) {
    // Проверяем, прошло ли достаточно времени для сброса счётчика
    const timeSinceLastFailure = currentTime - failureInfo.lastFailedAt
    if (timeSinceLastFailure < MAX_RETRY_DELAY) {
      return true
    }
    // Сбрасываем счётчик после длительного времени
    await clearFailureInfo()
    return false
  }
  
  // Проверяем, можно ли повторить попытку
  return currentTime < failureInfo.retryAfter
}

async function recordFailure() {
  const failureInfo = await readFailureInfo()
  const currentTime = now()
  
  const newFailureCount = failureInfo ? failureInfo.failureCount + 1 : 1
  const retryDelay = calculateRetryDelay(newFailureCount - 1)
  
  await writeFailureInfo({
    lastFailedAt: currentTime,
    failureCount: newFailureCount,
    retryAfter: currentTime + retryDelay
  })
  
  console.warn(`[converter-module] Fetch failed (attempt ${newFailureCount}/${MAX_RETRY_ATTEMPTS}). Next retry in ${Math.round(retryDelay / 1000)}s`)
}

const isFresh = (entry: CacheEntry | null, ttlMs: number) => {
  if (!entry) return false
  if (ttlMs <= 0) return false
  return now() - entry.fetchedAt < ttlMs
}

let inflight: Promise<CacheEntry> | null = null

async function fetchAndStore(): Promise<CacheEntry> {
  console.log('fetchAndStore', inflight, resolveRemoteUrl())
  if (!inflight) {
    const request = (async () => {
      // Проверяем, можем ли мы делать запрос
      const skipRetry = await shouldSkipRetry()
      if (skipRetry) {
        throw new Error('Too many recent failures, skipping retry')
      }

      const url = resolveRemoteUrl()
      try {
        const payload = await ofetch<PointRatesResponse>(url, { retry: 0 })
        const entry: CacheEntry = { payload, fetchedAt: now() }
        await writeCache(entry)
        // Успешный запрос - очищаем информацию о неудачах
        await clearFailureInfo()
        return entry
      } catch (error) {
        // Записываем неудачу
        await recordFailure()
        throw error
      }
    })()
    inflight = request
    request.finally(() => {
      if (inflight === request) {
        inflight = null
      }
    })
  }
  return inflight
}

export async function getRatesSWR(force = false): Promise<CacheEntry> {
  console.log('getRatesSWR')
  if (force) {
    return await fetchAndStore()
  }

  const { ttlMs } = getModuleOptions()
  const cached = await readCache()
  if (isFresh(cached, ttlMs) && cached) {
    return cached
  }

  if (cached) {
    void fetchAndStore().catch((error) => {
      console.error('[converter-module] background refresh failed', error)
    })
    return cached
  }

  return await fetchAndStore()
}

export async function refreshRatesNow(): Promise<CacheEntry> {
  return await fetchAndStore()
}
