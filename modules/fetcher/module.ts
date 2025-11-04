import { addImports, addServerHandler, createResolver, defineNuxtModule } from '@nuxt/kit'
import { withoutTrailingSlash, withLeadingSlash } from 'ufo'

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'

export interface FetcherEndpointOptions {
  /**
   * Unique identifier for the endpoint. Used as cache key.
   */
  key: string
  /**
   * Remote endpoint path (relative or absolute) that should be fetched.
   */
  endpoint: string
  /**
   * HTTP method used when hitting the remote endpoint. Defaults to GET.
   */
  method?: HttpMethod
  /**
   * Optional query that will be appended to the remote endpoint.
   */
  query?: Record<string, any>
  /**
   * Optional request body (used for non-GET requests).
   */
  body?: Record<string, any>
  /**
   * Extra headers that should be attached to the remote request.
   */
  headers?: Record<string, string>
  /**
   * Whether payloads depend on locale. Defaults to true.
   */
  dependsOnLocale?: boolean
  /**
   * Whether payloads depend on region. Defaults to true.
   */
  dependsOnRegion?: boolean
  /**
   * Override TTL behaviour for this endpoint.
   */
  enableTtl?: boolean
  /**
   * Override TTL duration for this endpoint (seconds).
   */
  ttlSec?: number
  /**
   * Public API route that serves cached payloads.
   */
  routePath?: string
  /**
   * Webhook route that forces cache refresh.
   */
  webhookPath?: string
}

export interface FetcherModuleOptions {
  /**
   * Base URL used for remote requests. Falls back to runtimeConfig.public.apiBase.
   */
  baseUrl?: string
  /**
   * Global TTL toggle. Defaults to true.
   */
  enableTtl?: boolean
  /**
   * Global TTL duration in seconds. Defaults to 600 seconds.
   */
  ttlSec?: number
  /**
   * List of locales that should be prefetched.
   */
  languages?: string[]
  /**
   * List of regions that should be prefetched.
   */
  regions?: string[]
  /**
   * Endpoint definitions.
   */
  endpoints?: FetcherEndpointOptions[]
}

export interface FetcherResolvedEndpoint {
  key: string
  endpoint: string
  method: HttpMethod
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

const DEFAULT_OPTIONS: Required<Omit<FetcherModuleOptions, 'baseUrl'>> & { baseUrl?: string } = {
  baseUrl: undefined,
  enableTtl: true,
  ttlSec: 600,
  languages: [],
  regions: [],
  endpoints: []
}

function normalizePath(path: string | undefined, fallback: string): string {
  const raw = path && path.trim().length ? path : fallback
  const withSlash = withLeadingSlash(raw)
  if (withSlash === '/') {
    return '/'
  }
  return withoutTrailingSlash(withSlash)
}

function normalizeMethod(method?: string): HttpMethod {
  const value = (method || 'GET').toUpperCase()
  if (!['GET', 'POST', 'PUT', 'PATCH', 'DELETE'].includes(value)) {
    throw new Error(`fetcherModule: unsupported HTTP method "${method}"`)
  }
  return value as HttpMethod
}

export default defineNuxtModule<FetcherModuleOptions>({
  meta: {
    name: 'fetcher-module',
    configKey: 'fetcherModule'
  },
  defaults: DEFAULT_OPTIONS,
  setup (moduleOptions, nuxt) {
    const resolver = createResolver(import.meta.url)
    const runtimeDir = resolver.resolve('./runtime')

    nuxt.options.build.transpile = nuxt.options.build.transpile || []
    if (!nuxt.options.build.transpile.includes(runtimeDir)) {
      nuxt.options.build.transpile.push(runtimeDir)
    }

    nuxt.options.alias = nuxt.options.alias || {}
    nuxt.options.alias['#fetcher-module'] = runtimeDir

    const runtimeConfigOverride = nuxt.options.runtimeConfig?.fetcherModule ?? {}

    const mergedOptions: FetcherModuleOptions = {
      ...DEFAULT_OPTIONS,
      ...moduleOptions,
      ...runtimeConfigOverride
    }

    const enableTtl = mergedOptions.enableTtl !== false
    const ttlSec =
      typeof mergedOptions.ttlSec === 'number' && Number.isFinite(mergedOptions.ttlSec)
        ? mergedOptions.ttlSec
        : DEFAULT_OPTIONS.ttlSec

    const languages = Array.isArray(mergedOptions.languages)
      ? mergedOptions.languages.filter((lang) => typeof lang === 'string' && lang.length > 0)
      : []
    const regions = Array.isArray(mergedOptions.regions)
      ? mergedOptions.regions.filter((region) => typeof region === 'string' && region.length > 0)
      : []

    const endpointsInput = Array.isArray(mergedOptions.endpoints) ? mergedOptions.endpoints : []

    const endpoints: Record<string, FetcherResolvedEndpoint> = {}
    const routeKeyMap: Record<string, string> = {}
    const webhookKeyMap: Record<string, string> = {}

    for (const endpoint of endpointsInput) {
      if (!endpoint || typeof endpoint !== 'object') {
        continue
      }

      if (!endpoint.key || typeof endpoint.key !== 'string') {
        throw new Error('fetcherModule: every endpoint must declare a "key" string')
      }

      const key = endpoint.key
      if (endpoints[key]) {
        throw new Error(`fetcherModule: duplicate endpoint key "${key}"`)
      }

      if (!endpoint.endpoint || typeof endpoint.endpoint !== 'string') {
        throw new Error(`fetcherModule: endpoint "${key}" is missing remote "endpoint" URL`)
      }

      const routePath = normalizePath(endpoint.routePath, `/api/_fetcher/${key}`)
      const webhookPath = normalizePath(endpoint.webhookPath, `${routePath}/refresh`)

      if (routeKeyMap[routePath]) {
        throw new Error(
          `fetcherModule: duplicate routePath "${routePath}" used by "${routeKeyMap[routePath]}" and "${key}"`
        )
      }

      if (webhookKeyMap[webhookPath]) {
        throw new Error(
          `fetcherModule: duplicate webhookPath "${webhookPath}" used by "${webhookKeyMap[webhookPath]}" and "${key}"`
        )
      }

      const resolvedEnableTtl = endpoint.enableTtl ?? enableTtl
      const resolvedTtlSec =
        typeof endpoint.ttlSec === 'number' && Number.isFinite(endpoint.ttlSec)
          ? endpoint.ttlSec
          : ttlSec

      const resolved: FetcherResolvedEndpoint = {
        key,
        endpoint: endpoint.endpoint,
        method: normalizeMethod(endpoint.method),
        query: endpoint.query,
        body: endpoint.body,
        headers: endpoint.headers,
        dependsOnLocale: endpoint.dependsOnLocale ?? true,
        dependsOnRegion: endpoint.dependsOnRegion ?? true,
        enableTtl: resolvedEnableTtl,
        ttlSec: resolvedEnableTtl ? Math.max(resolvedTtlSec, 0) : 0,
        ttlMs: resolvedEnableTtl && resolvedTtlSec > 0 ? resolvedTtlSec * 1000 : 0,
        routePath,
        webhookPath
      }

      endpoints[key] = resolved
      routeKeyMap[routePath] = key
      webhookKeyMap[webhookPath] = key

      addServerHandler({
        route: resolved.routePath,
        handler: resolver.resolve('./runtime/server/api/data.get')
      })

      addServerHandler({
        route: resolved.webhookPath,
        handler: resolver.resolve('./runtime/server/api/refresh.post')
      })
    }

    const runtimeConfig: FetcherRuntimeConfig = {
      baseUrl: mergedOptions.baseUrl,
      enableTtl,
      ttlSec,
      languages,
      regions,
      endpoints,
      routeKeyMap,
      webhookKeyMap
    }

    nuxt.options.runtimeConfig = {
      ...nuxt.options.runtimeConfig,
      fetcherModule: runtimeConfig,
      public: {
        ...nuxt.options.runtimeConfig.public,
        fetcherModule: {
          routes: Object.fromEntries(
            Object.values(endpoints).map((endpoint) => [endpoint.key, endpoint.routePath])
          )
        }
      }
    }

    nuxt.hook('nitro:config', (nitroConfig) => {
      nitroConfig.runtimeConfig = nitroConfig.runtimeConfig || {}
      nitroConfig.runtimeConfig.fetcherModule = {
        ...(nitroConfig.runtimeConfig.fetcherModule || {}),
        ...runtimeConfig
      }
      nitroConfig.runtimeConfig.public = nitroConfig.runtimeConfig.public || {}
      nitroConfig.runtimeConfig.public.fetcherModule = {
        ...(nitroConfig.runtimeConfig.public.fetcherModule || {}),
        routes: Object.fromEntries(
          Object.values(endpoints).map((endpoint) => [endpoint.key, endpoint.routePath])
        )
      }
      nitroConfig.alias = nitroConfig.alias || {}
      nitroConfig.alias['#fetcher-module'] = runtimeDir
    })

    addImports([
      {
        name: 'useFetcherData',
        from: resolver.resolve('./runtime/composables/useFetcherData')
      },
      {
        name: 'refreshFetcherEndpoint',
        from: resolver.resolve('./runtime/server/utils/cache')
      }
    ])
  }
})

export type { FetcherModuleOptions, FetcherEndpointOptions, FetcherResolvedEndpoint }
