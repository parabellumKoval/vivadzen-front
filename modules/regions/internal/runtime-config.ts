import type { Nuxt } from 'nuxt/schema'
import type {
  RegionDefinitions,
  RegionsModuleOptions,
  RegionsRuntimeConfig,
  RegionMetaWithCode
} from '../types'
import {
  DEFAULT_FALLBACK_REGION,
  collectLocalesFromDefinitions,
  buildCurrencyByLocaleMap,
  buildLocaleByRegionMap,
  computeRegionCodes,
  normalizeRegionAliases,
  normalizeRegionDefinitions
} from './region-definitions'

const extractLocaleCodesFromI18n = (nuxt: Nuxt): string[] => {
  const locales = (nuxt.options as any)?.i18n?.locales
  if (!Array.isArray(locales)) return []

  const codes = locales
    .map((entry) => {
      if (!entry) return null
      if (typeof entry === 'string') return entry
      if (typeof entry === 'object' && typeof entry.code === 'string') return entry.code
      return null
    })
    .filter((code): code is string => Boolean(code))

  const seen = new Set<string>()
  const normalized: string[] = []
  for (const code of codes) {
    const lower = code.toLowerCase()
    if (!seen.has(lower)) {
      seen.add(lower)
      normalized.push(lower)
    }
  }
  return normalized
}

const resolveFallbackRegion = (
  nuxt: Nuxt,
  definitions: RegionDefinitions,
  candidate?: string
): string => {
  const codes = Object.keys(definitions)
  if (!codes.length) {
    throw new Error('[regions-module] regionsModule.regions must define at least one region')
  }

  if (candidate) {
    const normalized = candidate.toLowerCase()
    if (definitions[normalized]) {
      return normalized
    }
    nuxt.options.logger?.warn?.(
      `[regions-module] Unknown fallback region "${candidate}" - falling back to defaults`
    )
  }

  if (definitions[DEFAULT_FALLBACK_REGION]) {
    return DEFAULT_FALLBACK_REGION
  }

  return codes[0]
}

export const resolveRuntimeConfig = (nuxt: Nuxt, options: RegionsModuleOptions): RegionsRuntimeConfig => {
  const regionMeta = normalizeRegionDefinitions(options.regions)
  const regionAliases = normalizeRegionAliases(regionMeta, options.regionAliases)
  const fallbackRegion = resolveFallbackRegion(nuxt, regionMeta, options.fallbackRegion)
  const regions = computeRegionCodes(regionMeta, fallbackRegion)

  const localeByRegion = buildLocaleByRegionMap(regionMeta)
  const currencyByRegion = buildCurrencyByLocaleMap(regionMeta)

  const i18nLocales = extractLocaleCodesFromI18n(nuxt)
  const definitionLocales = collectLocalesFromDefinitions(regionMeta)

  // let locales = i18nLocales.length
  //   ? definitionLocales.filter((locale) => i18nLocales.includes(locale))
  //   : definitionLocales
  let locales = i18nLocales

  if (!locales.length) {
    locales = definitionLocales.length ? definitionLocales : i18nLocales
  }

  const fallbackLocale = regionMeta[fallbackRegion]?.locale ||
    regionMeta[DEFAULT_FALLBACK_REGION]?.locale ||
    locales[0] ||
    'en'

  if (!locales.includes(fallbackLocale)) {
    locales.push(fallbackLocale)
  }

  locales = Array.from(new Set(locales))

  if (!locales.length) {
    locales = [fallbackLocale || 'en']
  }

  const fallbackCurrency = regionMeta[fallbackRegion]?.currency || 'USD'
  const regionsMetaArray: RegionMetaWithCode[] = Object.entries(regionMeta).map(([code, meta]) => ({
    code,
    ...meta
  }))

  return {
    regions,
    regionAliases,
    locales,
    fallbackRegion,
    fallbackCurrency,
    regionsMeta: regionMeta,
    regionsMetaArray,
    localeByRegion,
    currencyByRegion
  }
}
