import { ofetch } from 'ofetch'
import { joinURL } from 'ufo'
import { useRuntimeConfig, useStorage } from '#imports'
import type { PointRatesResponse } from '../../types'

interface CacheEntry {
  payload: PointRatesResponse
  fetchedAt: number
}

interface ConverterModuleRuntimeOptions {
  baseUrl?: string
  ratesEndpoint?: string
  ttlSec?: number
}

const STORAGE_KEY = 'converter:rates'

const now = () => Date.now()

function storage() {
  return useStorage<CacheEntry>('cache')
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
      const url = resolveRemoteUrl()
      const payload = await ofetch<PointRatesResponse>(url, { retry: 0 })
      const entry: CacheEntry = { payload, fetchedAt: now() }
      await writeCache(entry)
      return entry
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
