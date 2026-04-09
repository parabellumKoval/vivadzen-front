import { defineNuxtPlugin, useRouter, useRuntimeConfig } from '#imports'

type QueryParamValue = string | number | boolean | null | undefined

type RegionalGtmContainer = string | {
  id?: string
  queryParams?: Record<string, QueryParamValue>
}

type ResolvedContainer = {
  id: string
  queryParams: Record<string, QueryParamValue>
}

type RegionalGtmConfig = {
  enabled?: boolean
  containers?: Record<string, RegionalGtmContainer | null | undefined>
  defaultContainer?: RegionalGtmContainer | null
  fallbackRegion?: string
  regionAliases?: Record<string, string>
  dataLayerName?: string
  source?: string
  defer?: boolean
  compatibility?: boolean
  debug?: boolean
  reloadOnRegionChange?: boolean
  initialDataLayer?: Record<string, unknown>
}

export type RegionalGtmApi = {
  region: string
  id: string
  dataLayerName: string
  push: (payload: Record<string, unknown>) => void
}

declare global {
  interface Window {
    [key: string]: unknown
  }
}

const normalize = (value: string | null | undefined) => String(value || '').trim().toLowerCase()

const getObject = <TValue>(value: unknown): Record<string, TValue> => {
  return value && typeof value === 'object' && !Array.isArray(value)
    ? value as Record<string, TValue>
    : {}
}

const resolveContainer = (value: RegionalGtmContainer | null | undefined): ResolvedContainer | null => {
  if (typeof value === 'string') {
    const id = value.trim()
    return id ? { id, queryParams: {} } : null
  }

  if (!value || typeof value !== 'object') {
    return null
  }

  const id = String(value.id || '').trim()
  return id
    ? { id, queryParams: getObject<QueryParamValue>(value.queryParams) }
    : null
}

const canonicalRegion = (region: string | null | undefined, config: RegionalGtmConfig) => {
  const normalized = normalize(region)
  if (!normalized) {
    return ''
  }

  return normalize(getObject<string>(config.regionAliases)[normalized]) || normalized
}

const getAliasCandidates = (region: string, config: RegionalGtmConfig) => {
  const aliases = getObject<string>(config.regionAliases)
  return Object.entries(aliases)
    .filter(([, canonical]) => normalize(canonical) === region)
    .map(([alias]) => normalize(alias))
    .filter(Boolean)
}

const getFallbackRegion = (config: RegionalGtmConfig) => {
  return canonicalRegion(config.fallbackRegion || 'global', config) || 'global'
}

const resolveRegionFromPath = (path: string, config: RegionalGtmConfig) => {
  const containers = getObject<RegionalGtmContainer | null | undefined>(config.containers)
  const fallbackRegion = getFallbackRegion(config)
  const pathname = String(path || '/').split('?')[0]?.split('#')[0] || '/'
  const firstSegment = normalize(pathname.split('/').filter(Boolean)[0])

  if (!firstSegment) {
    return fallbackRegion
  }

  const region = canonicalRegion(firstSegment, config)
  if (region && Object.prototype.hasOwnProperty.call(containers, region)) {
    return region
  }

  if (Object.prototype.hasOwnProperty.call(containers, firstSegment)) {
    return firstSegment
  }

  return fallbackRegion
}

const resolveContainerForRegion = (region: string, config: RegionalGtmConfig) => {
  const containers = getObject<RegionalGtmContainer | null | undefined>(config.containers)
  const fallbackRegion = getFallbackRegion(config)
  const candidates = Array.from(new Set([
    region,
    ...getAliasCandidates(region, config),
    fallbackRegion,
    ...getAliasCandidates(fallbackRegion, config),
  ].map(normalize).filter(Boolean)))

  for (const candidate of candidates) {
    const container = resolveContainer(containers[candidate])
    if (container) {
      return container
    }
  }

  return resolveContainer(config.defaultContainer)
}

const buildScriptUrl = (container: ResolvedContainer, config: RegionalGtmConfig, dataLayerName: string) => {
  const source = String(config.source || 'https://www.googletagmanager.com/gtm.js').trim()
  const params = new URLSearchParams({ id: container.id })

  if (dataLayerName !== 'dataLayer') {
    params.set('l', dataLayerName)
  }

  Object.entries(container.queryParams || {}).forEach(([key, value]) => {
    if (value !== undefined && value !== null && String(value).trim() !== '') {
      params.set(key, String(value))
    }
  })

  return `${source}${source.includes('?') ? '&' : '?'}${params.toString()}`
}

const getDataLayer = (dataLayerName: string) => {
  const current = window[dataLayerName]
  if (Array.isArray(current)) {
    return current as Array<Record<string, unknown>>
  }

  const next: Array<Record<string, unknown>> = []
  window[dataLayerName] = next
  return next
}

export default defineNuxtPlugin(() => {
  const runtimeConfig = useRuntimeConfig()
  const config = getObject<unknown>(runtimeConfig.public?.regionalGtm) as RegionalGtmConfig

  if (config.enabled === false) {
    return
  }

  const dataLayerName = String(config.dataLayerName || 'dataLayer').trim() || 'dataLayer'
  const region = resolveRegionFromPath(window.location.pathname, config)
  const container = resolveContainerForRegion(region, config)

  if (!container) {
    if (config.debug) {
      console.warn('[regional-gtm] No GTM container configured for region:', region)
    }
    return
  }

  const dataLayer = getDataLayer(dataLayerName)
  dataLayer.push({
    ...(config.initialDataLayer || {}),
    'gtm.start': new Date().getTime(),
    event: 'gtm.js',
    gtmRegion: region,
    pageRegion: region,
    gtmContainerId: container.id,
  })

  const script = document.createElement('script')
  script.src = buildScriptUrl(container, config, dataLayerName)
  script.setAttribute('data-regional-gtm', region)

  if (config.compatibility) {
    script.async = true
    script.defer = true
  } else if (config.defer) {
    script.defer = true
  } else {
    script.async = true
  }

  const firstScript = document.getElementsByTagName('script')[0]
  if (firstScript?.parentNode) {
    firstScript.parentNode.insertBefore(script, firstScript)
  } else {
    document.head.appendChild(script)
  }

  if (config.reloadOnRegionChange !== false) {
    const router = useRouter()
    router.beforeEach((to) => {
      const nextRegion = resolveRegionFromPath(to.path, config)
      if (nextRegion !== region) {
        window.location.assign(to.fullPath || to.path || '/')
        return false
      }
    })
  }

  return {
    provide: {
      regionalGtm: {
        region,
        id: container.id,
        dataLayerName,
        push: (payload: Record<string, unknown>) => {
          getDataLayer(dataLayerName).push(payload)
        },
      } satisfies RegionalGtmApi,
    },
  }
})
