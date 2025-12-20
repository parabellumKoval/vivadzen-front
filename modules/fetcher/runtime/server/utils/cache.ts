import { ofetch } from 'ofetch'
import { hasProtocol, joinURL, withLeadingSlash, withoutTrailingSlash, withQuery } from 'ufo'
import { useRuntimeConfig, useStorage } from '#imports'

export interface FetcherContextInput {
  locale?: string | null
  region?: string | null
}

interface FetcherNormalizedContext {
  locale: string | null
  region: string | null
  key: string
}

interface FetcherResolvedEndpoint {
  key: string
  endpoint: string
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'
  query?: Record<string, any>
  body?: Record<string, any>
  headers?: Record<string, string>
  dependsOnLocale: boolean
  dependsOnRegion: boolean
  enableTtl: boolean
  ttlSec: number
  ttlMs: number
  routePath: string
  webhookPath: string
}

interface FetcherRuntimeConfig {
  baseUrl?: string
  enableTtl: boolean
  ttlSec: number
  languages: string[]
  regions: string[]
  endpoints: Record<string, FetcherResolvedEndpoint>
  routeKeyMap: Record<string, string>
  webhookKeyMap: Record<string, string>
}

interface FetcherContextDescriptor {
  locale: string | null
  region: string | null
  key: string
}

interface ContextCacheEntry<T = unknown> {
  payload: T
  fetchedAt: number
}

interface EndpointCacheEntry {
  contextSignature: string
  contexts: Record<string, ContextCacheEntry>
}

export interface FetcherPayloadResult<T = unknown> {
  key: string
  context: FetcherNormalizedContext
  payload: T
  fetchedAt: number
}

export interface RefreshFetcherResultContext {
  locale: string | null
  region: string | null
  fetchedAt: number
}

export interface RefreshFetcherResult {
  key: string
  contexts: RefreshFetcherResultContext[]
}

const STORAGE_NAMESPACE = 'cache'
const STORAGE_PREFIX = 'fetcher:'

const now = () => Date.now()

function storage() {
  return useStorage(STORAGE_NAMESPACE)
}

// Local hot cache stored in memory per server instance to skip Upstash round-trips.
const localCache = new Map<string, ContextCacheEntry>()

function buildLocalCacheKey(endpointKey: string, context: FetcherNormalizedContext) {
  return `${endpointKey}::${context.key}`
}

function readLocalCacheEntry(
  cacheKey: string,
  endpoint: FetcherResolvedEndpoint
): ContextCacheEntry | null {
  const cached = localCache.get(cacheKey)
  if (!cached) {
    return null
  }
  if (!isFresh(cached, endpoint)) {
    localCache.delete(cacheKey)
    return null
  }
  return cached
}

function writeLocalCacheEntry(cacheKey: string, entry: ContextCacheEntry) {
  localCache.set(cacheKey, entry)
}

function normalizeLookupPath(path: string) {
  if (!path) {
    return '/'
  }
    const pathWithoutQuery = path.split('?')[0]
  const withSlash = withLeadingSlash(pathWithoutQuery)
  if (withSlash === '/') {
    return '/'
  }
  return withoutTrailingSlash(withSlash)
}

function buildContextKey(locale: string | null, region: string | null) {
  return `${locale ?? ''}::${region ?? ''}`
}

function parseLocale(input?: string | null) {
  if (!input) return null
  const trimmed = input.trim()
  if (!trimmed) return null
  // Accept-Language header can contain comma-separated values, pick the first token
  const [head] = trimmed.split(',')
  return head?.trim() || null
}

function parseRegion(input?: string | null) {
  if (!input) return null
  const trimmed = input.trim()
  return trimmed.length ? trimmed : null
}

function normalizeValue(value?: string | null) {
  if (!value) return null
  const trimmed = value.trim()
  return trimmed.length ? trimmed : null
}

function runtimeConfig(): FetcherRuntimeConfig {
  const config = useRuntimeConfig()
  const runtime = (config.fetcherModule || {}) as FetcherRuntimeConfig
  if (!runtime.endpoints) {
    runtime.endpoints = {}
  }
  if (!runtime.routeKeyMap) {
    runtime.routeKeyMap = {}
  }
  if (!runtime.webhookKeyMap) {
    runtime.webhookKeyMap = {}
  }
  return runtime
}

function getEndpointByKey(key: string): FetcherResolvedEndpoint | null {
  const config = runtimeConfig()
  return config.endpoints?.[key] || null
}

function getEndpointKeyByRoute(path: string): string | null {
  const config = runtimeConfig()
  return config.routeKeyMap?.[normalizeLookupPath(path)] || null
}

function getEndpointKeyByWebhook(path: string): string | null {
  const config = runtimeConfig()
  return config.webhookKeyMap?.[normalizeLookupPath(path)] || null
}

function withApiPrefixIfNeeded(path: string): string | null {
  const normalized = normalizeLookupPath(path)
  if (!normalized || normalized === '/' || normalized.startsWith('/api/')) {
    return null
  }
  return normalizeLookupPath(`/api${normalized}`)
}

function collectEndpointContexts(
  endpoint: FetcherResolvedEndpoint,
  config: FetcherRuntimeConfig
): FetcherContextDescriptor[] {
  const localeSource =
    endpoint.dependsOnLocale && config.languages.length > 0 ? config.languages : [null]
  const regionSource =
    endpoint.dependsOnRegion && config.regions.length > 0 ? config.regions : [null]

  const descriptors: FetcherContextDescriptor[] = []
  for (const locale of localeSource) {
    for (const region of regionSource) {
      const effectiveLocale = endpoint.dependsOnLocale ? normalizeValue(locale) : null
      const effectiveRegion = endpoint.dependsOnRegion ? normalizeValue(region) : null
      const key = buildContextKey(effectiveLocale, effectiveRegion)
      if (!descriptors.find((descriptor) => descriptor.key === key)) {
        descriptors.push({
          locale: effectiveLocale,
          region: effectiveRegion,
          key
        })
      }
    }
  }
  return descriptors
}

function makeContextSignature(contexts: FetcherContextDescriptor[]) {
  return contexts.map((ctx) => ctx.key).sort().join('|')
}

async function readCacheEntry(key: string): Promise<EndpointCacheEntry | null> {
  return await storage().getItem<EndpointCacheEntry>(`${STORAGE_PREFIX}${key}`)
}

async function writeCacheEntry(key: string, entry: EndpointCacheEntry) {
  await storage().setItem(`${STORAGE_PREFIX}${key}`, entry)
}

function normalizeContextForEndpoint(
  endpoint: FetcherResolvedEndpoint,
  context: FetcherContextInput
): FetcherNormalizedContext {
  const rawLocale = parseLocale(context.locale ?? null)
  const rawRegion = parseRegion(context.region ?? null)

  const locale = endpoint.dependsOnLocale ? rawLocale : null
  const region = endpoint.dependsOnRegion ? rawRegion : null

  return {
    locale,
    region,
    key: buildContextKey(locale, region)
  }
}

function isFresh(entry: ContextCacheEntry | undefined, endpoint: FetcherResolvedEndpoint) {
  if (!entry) return false
  if (!endpoint.enableTtl) return true
  if (endpoint.ttlMs <= 0) return false
  return now() - entry.fetchedAt < endpoint.ttlMs
}

function resolveBaseUrl(endpoint: FetcherResolvedEndpoint) {
  if (endpoint.endpoint && hasProtocol(endpoint.endpoint)) {
    return null
  }
  const config = useRuntimeConfig()
  const runtime = runtimeConfig()
  const base = runtime.baseUrl || (config.public?.apiBase as string | undefined)
  if (!base) {
    throw new Error(
      `fetcherModule: baseUrl is not configured and runtimeConfig.public.apiBase is empty`
    )
  }
  return base
}

async function fetchEndpointPayload(
  endpoint: FetcherResolvedEndpoint,
  context: FetcherNormalizedContext
) {
  const baseUrl = resolveBaseUrl(endpoint)
  let url = endpoint.endpoint
  if (baseUrl && !hasProtocol(url)) {
    url = joinURL(baseUrl, url || '')
  }
  if (endpoint.query && Object.keys(endpoint.query).length > 0) {
    url = withQuery(url, endpoint.query)
  }

  const headers: Record<string, string> = {
    Accept: 'application/json',
    ...(endpoint.headers || {})
  }

  if (context.locale) {
    headers['Accept-Language'] = context.locale
  }
  if (context.region) {
    headers['X-Region'] = context.region
  }

  const requestInit: {
    method: typeof endpoint.method
    headers: Record<string, string>
    body?: any
  } = {
    method: endpoint.method,
    headers
  }

  if (endpoint.method !== 'GET' && endpoint.body !== undefined) {
    requestInit.body = endpoint.body
    if (!Object.keys(headers).some((key) => key.toLowerCase() === 'content-type')) {
      headers['Content-Type'] = 'application/json'
    }
  }

  const payload = await ofetch(url, {
    method: requestInit.method,
    headers: requestInit.headers,
    body: requestInit.body,
    retry: 0
  })

  return payload
}

async function ensureCacheEntry(
  key: string,
  endpoint: FetcherResolvedEndpoint,
  contexts: FetcherContextDescriptor[]
): Promise<EndpointCacheEntry> {
  const signature = makeContextSignature(contexts)
  const current = (await readCacheEntry(key)) || { contextSignature: '', contexts: {} }

  if (current.contextSignature !== signature) {
    const next: EndpointCacheEntry = {
      contextSignature: signature,
      contexts: {}
    }
    await writeCacheEntry(key, next)
    return next
  }

  return current
}

async function refreshContext(
  key: string,
  endpoint: FetcherResolvedEndpoint,
  normalizedContext: FetcherNormalizedContext,
  entry: EndpointCacheEntry
) {
  const payload = await fetchEndpointPayload(endpoint, normalizedContext)
  const contextEntry: ContextCacheEntry = {
    payload,
    fetchedAt: now()
  }
  entry.contexts[normalizedContext.key] = contextEntry
  await writeCacheEntry(key, entry)
  writeLocalCacheEntry(buildLocalCacheKey(key, normalizedContext), contextEntry)
  return contextEntry
}

export async function getFetcherPayload<T = unknown>(
  key: string,
  contextInput: FetcherContextInput,
  options: { forceRefresh?: boolean } = {}
): Promise<FetcherPayloadResult<T>> {
  const endpoint = getEndpointByKey(key)
  if (!endpoint) {
    throw new Error(`fetcherModule: endpoint "${key}" is not registered`)
  }

  const normalized = normalizeContextForEndpoint(endpoint, contextInput)
  const localKey = buildLocalCacheKey(key, normalized)
  const cachedLocal = readLocalCacheEntry(localKey, endpoint)
  if (cachedLocal) {
    return {
      key,
      context: normalized,
      payload: cachedLocal.payload as T,
      fetchedAt: cachedLocal.fetchedAt
    }
  }

  const config = runtimeConfig()
  const contexts = collectEndpointContexts(endpoint, config)
  const entry = await ensureCacheEntry(key, endpoint, contexts)
  const existing = entry.contexts[normalized.key]

  const shouldRefresh = options.forceRefresh === true || !isFresh(existing, endpoint)

  const contextEntry = shouldRefresh
    ? await refreshContext(key, endpoint, normalized, entry)
    : (existing as ContextCacheEntry)

  writeLocalCacheEntry(localKey, contextEntry)

  return {
    key,
    context: normalized,
    payload: contextEntry.payload as T,
    fetchedAt: contextEntry.fetchedAt
  }
}

export async function refreshFetcherEndpoint(
  key: string,
  contextInput?: FetcherContextInput
): Promise<RefreshFetcherResult> {
  const endpoint = getEndpointByKey(key)
  if (!endpoint) {
    throw new Error(`fetcherModule: endpoint "${key}" is not registered`)
  }

  const config = runtimeConfig()
  const contexts = collectEndpointContexts(endpoint, config)
  const entry = await ensureCacheEntry(key, endpoint, contexts)

  const targets: FetcherNormalizedContext[] =
    contextInput && (contextInput.locale || contextInput.region)
      ? [normalizeContextForEndpoint(endpoint, contextInput)]
      : contexts.map((ctx) =>
          normalizeContextForEndpoint(endpoint, {
            locale: ctx.locale,
            region: ctx.region
          })
        )

  const refreshed: RefreshFetcherResultContext[] = []

  for (const context of targets) {
    const updated = await refreshContext(key, endpoint, context, entry)
    refreshed.push({
      locale: context.locale,
      region: context.region,
      fetchedAt: updated.fetchedAt
    })
  }

  return {
    key,
    contexts: refreshed
  }
}

export function findFetcherEndpointKeyByRoute(path: string) {
  const direct = getEndpointKeyByRoute(path)
  if (direct) {
    return direct
  }
  const prefixed = withApiPrefixIfNeeded(path)
  return prefixed ? getEndpointKeyByRoute(prefixed) : null
}

export function findFetcherEndpointKeyByWebhook(path: string) {
  const direct = getEndpointKeyByWebhook(path)
  if (direct) {
    return direct
  }
  const prefixed = withApiPrefixIfNeeded(path)
  return prefixed ? getEndpointKeyByWebhook(prefixed) : null
}

export function inferContextFromHeaders(headers: Record<string, string | undefined>): FetcherContextInput {
  return {
    locale: parseLocale(headers['accept-language'] ?? headers['Accept-Language'] ?? null),
    region: parseRegion(headers['x-region'] ?? headers['X-Region'] ?? null)
  }
}
