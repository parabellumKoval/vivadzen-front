import type { H3Event } from 'h3'
import { defineEventHandler, useRuntimeConfig } from '#imports'
import type { RegionsRuntimeConfig } from '../../../module'

const normalize = (value: string | undefined | null) => String(value || '').trim().toLowerCase()

const setContextRegion = (event: H3Event, region: string, maybeLocale: string | null) => {
  event.context.region = region
  if (maybeLocale) {
    event.context.forcedLocale = maybeLocale
  } else {
    delete event.context.forcedLocale
  }
}

export default defineEventHandler((event) => {
  const runtimeConfig = useRuntimeConfig()
  const moduleConfig = (runtimeConfig.regionsModule ||
    runtimeConfig.public?.regionsModule ||
    {}) as Partial<RegionsRuntimeConfig>

  const fallbackRegion = normalize(moduleConfig.fallbackRegion || 'global')
  const regionsMeta = moduleConfig.regionsMeta || {}
  const regions = moduleConfig.regions?.length
    ? moduleConfig.regions
    : Object.keys(regionsMeta).filter((code) => code !== fallbackRegion)

  const locales = moduleConfig.locales?.length
    ? moduleConfig.locales
    : Array.from(new Set(Object.values(regionsMeta).map((meta) => meta.locale)))

  const localesByRegion = moduleConfig.localesByRegion || {}

  const regionSet = new Set([fallbackRegion, ...regions].map((code) => normalize(code)))

  const getLocalesForRegion = (regionCode: string) => {
    const key = normalize(regionCode)
    const bucket = localesByRegion[key]
    const normalized = (bucket && bucket.length ? bucket : locales)
      .map((locale) => normalize(locale))
      .filter(Boolean)
    return normalized.length ? Array.from(new Set(normalized)) : []
  }

  const original = event.node.req.url || '/'
  const segments = original.split('/').filter(Boolean)

  const regionCandidate = normalize(segments[0])
  if (!regionCandidate || !regionSet.has(regionCandidate)) {
    event.context.region = fallbackRegion
    return
  }

  const regionLocaleSet = new Set(getLocalesForRegion(regionCandidate))
  const localeCandidate = normalize(segments[1])
  const isLocale = Boolean(localeCandidate && regionLocaleSet.has(localeCandidate))

  const restSegments = segments.slice(1 + (isLocale ? 1 : 0))
  const restPath = restSegments.length ? `/${restSegments.join('/')}` : '/'

  setContextRegion(event, regionCandidate, isLocale ? localeCandidate : null)
  event.node.req.url = restPath

  if (process.dev) {
    console.log('[regions-module] rewrite', {
      original,
      rewritten: restPath,
      region: regionCandidate,
      locale: isLocale ? localeCandidate : null
    })
  }
})
