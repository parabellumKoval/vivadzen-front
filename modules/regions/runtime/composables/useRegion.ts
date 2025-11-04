import { computed } from 'vue'
import { useRuntimeConfig, useState, useNuxtApp } from '#imports'
import type { RegionMetaWithCode, RegionsRuntimeConfig } from '../../module'

export const useRegion = () => {
  const runtimeConfig = useRuntimeConfig()
  const moduleConfig = (runtimeConfig.public?.regionsModule || {}) as Partial<RegionsRuntimeConfig>

  const { $i18n } = useNuxtApp() as any
  const {availableLocales} = $i18n

  const regionsMeta = moduleConfig.regionsMeta || {}
  const fallbackRegion = String(
    moduleConfig.fallbackRegion ||
    Object.keys(regionsMeta)[0] ||
    'global'
  ).trim().toLowerCase()

  const regions = moduleConfig.regions?.length
    ? moduleConfig.regions
    : Object.keys(regionsMeta).filter((code) => code !== fallbackRegion)

  const locales = availableLocales || (moduleConfig.locales?.length
    ? moduleConfig.locales
    : Array.from(new Set(Object.values(regionsMeta).map((meta) => meta.locale))))

  const regionAliases = Object.entries(moduleConfig.regionAliases || {}).reduce<Record<string, string>>((acc, [code, alias]) => {
    const normalizedCode = String(code || '').trim().toLowerCase()
    const normalizedAlias = String(alias || '').trim()
    if (!normalizedCode || !normalizedAlias) {
      return acc
    }
    acc[normalizedCode] = normalizedAlias
    return acc
  }, {})

  const fallbackCurrency = moduleConfig.fallbackCurrency ||
    regionsMeta[fallbackRegion]?.currency ||
    'USD'

  const localeByRegion = Object.keys(moduleConfig.localeByRegion || {}).length
    ? moduleConfig.localeByRegion!
    : Object.entries(regionsMeta).reduce<Record<string, string>>((acc, [code, meta]) => {
      if (meta.locale) {
        acc[meta.locale] = code
      }
      return acc
    }, {})

  const currencyByRegion = Object.keys(moduleConfig.currencyByRegion || {}).length
    ? moduleConfig.currencyByRegion!
    : Object.entries(regionsMeta).reduce<Record<string, string>>((acc, [, meta]) => {
      if (meta.locale && meta.currency) {
        acc[meta.locale] = meta.currency
      }
      return acc
    }, {})

  const regionsMetaArray: RegionMetaWithCode[] = moduleConfig.regionsMetaArray?.length
    ? moduleConfig.regionsMetaArray
    : Object.entries(regionsMeta).map(([code, meta]) => ({ code, ...meta }))

  const region = useState<string>('region', () => fallbackRegion)

  const getDefaultLocaleFor = (regionCode: string | undefined) => {
    if (!regionCode) return locales[0] || 'en'
    return regionsMeta[regionCode]?.locale || locales[0] || 'en'
  }

  const currency = computed(() => {
    return regionsMeta[region.value]?.currency ||
      fallbackCurrency
  })

  const regionAlias = computed(() => {
    const currentRegion = String(region.value || '').toLowerCase()
    if (!currentRegion) {
      return ''
    }

    return regionAliases[currentRegion] || region.value
  })

  const currentUrl = (nextRegion: string | null, nextLocale: string | null = null) => {
    if (process.server) {
      return '/'
    }

    const currentPath = window.location.pathname
    const segments = currentPath.split('/').filter(Boolean)

    const regionSet = new Set([fallbackRegion, ...regions].map((code) => code.toLowerCase()))
    const localeSet = new Set(locales.map((code) => code.toLowerCase()))

    const firstSegment = segments[0]?.toLowerCase() || ''
    const hasRegionSegment = Boolean(firstSegment && regionSet.has(firstSegment))
    const explicitRegion = hasRegionSegment ? firstSegment : null
    const currentRegion = explicitRegion || fallbackRegion

    const localeIndex = hasRegionSegment ? 1 : 0
    const potentialLocale = segments[localeIndex]?.toLowerCase() || ''
    const hasLocaleSegment = hasRegionSegment && Boolean(potentialLocale && localeSet.has(potentialLocale))
    const explicitLocale = hasLocaleSegment ? potentialLocale : null

    const restStartIndex = (hasRegionSegment ? 1 : 0) + (hasLocaleSegment ? 1 : 0)

    const normalizeCandidate = (value: string | null | undefined) => {
      if (!value) return null
      const trimmed = value.trim().toLowerCase()
      return trimmed || null
    }

    const normalizedNextRegion = normalizeCandidate(nextRegion || undefined)

    let targetRegion = currentRegion
    if (normalizedNextRegion) {
      targetRegion = regionSet.has(normalizedNextRegion)
        ? normalizedNextRegion
        : fallbackRegion
    }

    const normalizedNextLocale = normalizeCandidate(nextLocale || undefined)

    let targetLocale = getDefaultLocaleFor(targetRegion)

    if (normalizedNextLocale && localeSet.has(normalizedNextLocale)) {
      targetLocale = normalizedNextLocale
    } else if (!normalizedNextLocale && nextLocale === null) {
      if (hasLocaleSegment && explicitLocale && localeSet.has(explicitLocale)) {
        targetLocale = explicitLocale
      }
    }

    const defaultLocale = getDefaultLocaleFor(targetRegion)
    const includeLocaleSegment = targetLocale !== defaultLocale
    const isFallbackRegion = targetRegion === fallbackRegion

    const finalSegments: string[] = []

    if (!isFallbackRegion) {
      finalSegments.push(targetRegion)
      if (includeLocaleSegment) {
        finalSegments.push(targetLocale)
      }
    } else if (includeLocaleSegment) {
      finalSegments.push(targetRegion)
      finalSegments.push(targetLocale)
    }

    finalSegments.push(...segments.slice(restStartIndex))

    const pathname = finalSegments.join('/')
    return pathname ? `/${pathname}` : '/'
  }

  const setRegion = (value: string) => {
    const normalized = String(value || '').trim().toLowerCase()
    region.value = normalized || fallbackRegion
  }

  return {
    currentUrl,
    setRegion,
    region,
    regionAlias,
    currency,
    regions,
    locales,
    localeByRegion,
    fallbackRegion,
    fallbackCurrency,
    currencyByRegion,
    regionAliases,
    regionsMeta,
    regionsMetaArray
  }
}
