import type { H3Event } from 'h3'
import { defineEventHandler, useRuntimeConfig } from '#imports'
import type { RegionsRuntimeConfig } from '../../../module'

const normalize = (value: string | undefined | null) => (value || '').toLowerCase()

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

  const fallbackRegion = moduleConfig.fallbackRegion || 'global'
  const regionsMeta = moduleConfig.regionsMeta || {}
  const regions = moduleConfig.regions?.length
    ? moduleConfig.regions
    : Object.keys(regionsMeta).filter((code) => code !== fallbackRegion)

  const locales = moduleConfig.locales?.length
    ? moduleConfig.locales
    : Array.from(new Set(Object.values(regionsMeta).map((meta) => meta.locale)))

  const original = event.node.req.url || '/'
  const match = original.match(/^\/([^/]+)(?:\/([^/]+))?(\/.*)?$/)

  if (!match) {
    event.context.region = fallbackRegion
    return
  }

  const [, rawRegion, rawLocale, restRaw] = match
  const regionSet = new Set([fallbackRegion, ...regions].map((code) => code.toLowerCase()))
  const localeSet = new Set(locales.map((code) => code.toLowerCase()))

  const region = normalize(rawRegion)
  const maybeLocale = normalize(rawLocale) || null
  const rest = restRaw || '/'

  if (!regionSet.has(region)) {
    event.context.region = fallbackRegion
    return
  }

  if (maybeLocale && localeSet.has(maybeLocale)) {
    setContextRegion(event, region, maybeLocale)
  } else {
    setContextRegion(event, region, null)
  }

  event.node.req.url = rest || '/'

  if (process.dev) {
    console.log('[regions-module] rewrite', { original, rewritten: rest, region, maybeLocale })
  }
})
