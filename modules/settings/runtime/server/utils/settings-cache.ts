import { ofetch } from 'ofetch'
import { useRuntimeConfig } from '#imports'

type SettingsMap = Record<string, any>

interface CacheEntry {
  data: SettingsMap
  fetchedAt: number // ms
}

interface SettingsModuleRuntimeOptions {
  apiUrl: string
  ttlSec?: number
}

const STORAGE_KEY = 'settings-cache'

function storage() {
  // Nitro storage 'cache:' goes to disk in production, memory in dev
  // https://nitro.unjs.io/guide/storage
  return useStorage<CacheEntry>('cache')
}

function now() { return Date.now() }

function getModuleOptions(): SettingsModuleRuntimeOptions {
  const config = useRuntimeConfig()
  return (config?.settingsModule || {}) as SettingsModuleRuntimeOptions
}

async function readCache(): Promise<CacheEntry | null> {
  return await storage().getItem<CacheEntry>(STORAGE_KEY)
}

async function writeCache(entry: CacheEntry) {
  await storage().setItem(STORAGE_KEY, entry)
}

async function fetchRemote(): Promise<CacheEntry | null> {
  const { apiUrl } = getModuleOptions()
  if (!apiUrl) {
    throw new Error('settingsModule.apiUrl is not configured')
  }
  const data = await ofetch<SettingsMap>(apiUrl, { retry: 0 })
  return { data, fetchedAt: now() }
}

export async function getSettingsSWR(): Promise<SettingsMap> {
  const { ttlSec } = getModuleOptions()
  const ttlMs = (ttlSec ?? 300) * 1000
  let cached = await readCache()
  const fresh = cached && (now() - cached.fetchedAt) < ttlMs

  if (cached && fresh) {
    return cached.data
  }

  if (cached) {
    // Serve stale and update in background
    ;(async () => {
      try {
        const freshEntry = await fetchRemote()
        if (freshEntry) await writeCache(freshEntry)
      } catch {}
    })()
    return cached.data
  }

  // No cache: block and fetch once
  const freshEntry = await fetchRemote()
  if (freshEntry) {
    await writeCache(freshEntry)
    return freshEntry.data
  }
  return {}
}

export async function refreshSettingsNow(): Promise<SettingsMap> {
  const freshEntry = await fetchRemote()
  if (freshEntry) {
    await writeCache(freshEntry)
    return freshEntry.data
  }
  const existing = await readCache()
  return existing?.data ?? {}
}
