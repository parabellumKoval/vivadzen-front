import { computed } from 'vue'
import { useRuntimeConfig, useState, useNuxtApp } from '#imports'
import type { RegionMetaWithCode, RegionsRuntimeConfig } from '../../module'

const normalize = (value: string | null | undefined) => String(value || '').trim().toLowerCase()

export const useRegion = () => {
  const runtimeConfig = useRuntimeConfig()
  const moduleConfig = (runtimeConfig.public?.regionsModule || {}) as Partial<RegionsRuntimeConfig>

  const { $i18n } = useNuxtApp() as any
  const { availableLocales } = $i18n

  const regionsMeta = moduleConfig.regionsMeta || {}
  const fallbackRegion = normalize(
    moduleConfig.fallbackRegion ||
    Object.keys(regionsMeta)[0] ||
    'global'
  )

  const regions = moduleConfig.regions?.length
    ? moduleConfig.regions
    : Object.keys(regionsMeta).filter((code) => code !== fallbackRegion)

  const locales = availableLocales || (moduleConfig.locales?.length
    ? moduleConfig.locales
    : Array.from(new Set(Object.values(regionsMeta).map((meta) => meta.locale))))

  const localesByRegion = moduleConfig.localesByRegion || {}

  const regionAliases = Object.entries(moduleConfig.regionAliases || {}).reduce<Record<string, string>>((acc, [code, alias]) => {
    const normalizedCode = normalize(code)
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
        acc[normalize(meta.locale)] = meta.currency
      }
      return acc
    }, {})

  const regionsMetaArray: RegionMetaWithCode[] = moduleConfig.regionsMetaArray?.length
    ? moduleConfig.regionsMetaArray
    : Object.entries(regionsMeta).map(([code, meta]) => ({ code, ...meta }))

  const region = useState<string>('region', () => fallbackRegion)

  const getLocalesForRegion = (regionCode: string | null | undefined) => {
    const normalizedRegion = normalize(regionCode)
    const bucket = localesByRegion[normalizedRegion]
    const normalizedLocales = (bucket && bucket.length ? bucket : locales || [])
      .map(normalize)
      .filter(Boolean)

    if (normalizedLocales.length) {
      return Array.from(new Set(normalizedLocales))
    }

    const metaDefault = regionsMeta[normalizedRegion]?.locale
    if (metaDefault) {
      return [normalize(metaDefault)]
    }

    return ['en']
  }

  const getDefaultLocaleFor = (regionCode: string | null | undefined) => {
    const normalizedRegion = normalize(regionCode)
    const allowed = getLocalesForRegion(normalizedRegion)
    const metaDefault = normalize(regionsMeta[normalizedRegion]?.locale)
    if (metaDefault && allowed.includes(metaDefault)) {
      return metaDefault
    }
    return allowed[0] || 'en'
  }

  const regionLocales = computed(() => getLocalesForRegion(region.value))

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

    const regionSet = new Set([fallbackRegion, ...regions].map((code) => normalize(code)).filter(Boolean))

    const firstSegment = segments[0]?.toLowerCase() || ''
    const hasRegionSegment = Boolean(firstSegment && regionSet.has(firstSegment))
    const explicitRegion = hasRegionSegment ? firstSegment : null
    const currentRegion = explicitRegion || fallbackRegion

    const localeIndex = hasRegionSegment ? 1 : 0
    const regionLocaleSet = new Set(getLocalesForRegion(currentRegion))
    const potentialLocale = segments[localeIndex]?.toLowerCase() || ''
    const hasLocaleSegment = hasRegionSegment && Boolean(potentialLocale && regionLocaleSet.has(potentialLocale))
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

    const targetLocaleSet = new Set(getLocalesForRegion(targetRegion))
    const normalizedNextLocale = normalizeCandidate(nextLocale || undefined)

    let targetLocale = getDefaultLocaleFor(targetRegion)

    if (normalizedNextLocale && targetLocaleSet.has(normalizedNextLocale)) {
      targetLocale = normalizedNextLocale
    } else if (!normalizedNextLocale && nextLocale === null) {
      if (hasLocaleSegment && explicitLocale && targetLocaleSet.has(explicitLocale)) {
        targetLocale = explicitLocale
      }
    }

    const defaultLocale = getDefaultLocaleFor(targetRegion)
    const includeLocaleSegment = targetLocale !== defaultLocale && targetLocaleSet.has(targetLocale)
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
    const normalized = normalize(value)
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
    localesByRegion,
    regionLocales,
    getLocalesForRegion,
    getDefaultLocaleFor,
    localeByRegion,
    fallbackRegion,
    fallbackCurrency,
    currencyByRegion,
    regionAliases,
    regionsMeta,
    regionsMetaArray
  }
}
