import { computed } from 'vue'
import { useHead, useRoute, useRuntimeConfig } from '#imports'
import { useRegion } from '../composables/useRegion'
import type { RegionsRuntimeConfig } from '../../module'

type LocaleConfigEntry = string | { code?: string; iso?: string }

const normalizeBaseUrl = (value: any): string => {
  const raw = value?.site?.url ||
    value?.siteUrl ||
    value?.baseUrl ||
    value?.frontendUrl ||
    ''

  return typeof raw === 'string'
    ? raw.replace(/\/+$/, '')
    : ''
}

const extractI18nLocales = (source: any): Record<string, string> => {
  const entries = source?.value ?? source
  if (!Array.isArray(entries)) {
    return {}
  }

  return entries.reduce<Record<string, string>>((acc, entry: LocaleConfigEntry) => {
    if (!entry) return acc

    if (typeof entry === 'string') {
      const code = entry.trim().toLowerCase()
      if (code) {
        acc[code] = entry
      }
      return acc
    }

    if (typeof entry === 'object') {
      const code = String(entry.code || '').trim().toLowerCase()
      if (!code) {
        return acc
      }

      const iso = typeof entry.iso === 'string' && entry.iso.trim()
        ? entry.iso
        : entry.code

      acc[code] = String(iso || code)
    }

    return acc
  }, {})
}

const buildQueryString = (query: Record<string, unknown>): string => {
  if (!query) return ''
  const params = new URLSearchParams()

  for (const [key, value] of Object.entries(query)) {
    if (Array.isArray(value)) {
      value.forEach((item) => {
        if (item !== null && item !== undefined) {
          params.append(key, String(item))
        }
      })
      continue
    }

    if (value !== null && value !== undefined) {
      params.append(key, String(value))
    }
  }

  const serialized = params.toString()
  return serialized ? `?${serialized}` : ''
}

const stripPrefixedSegments = (
  path: string,
  regionSet: Set<string>,
  localeSet: Set<string>,
  fallbackRegion: string,
  getDefaultLocaleFor: (region: string) => string
): string => {
  if (!path || path === '/') return '/'

  const segments = path.split('/').filter(Boolean)
  if (!segments.length) return '/'

  const normalizedSegments = segments.map((segment) => segment.trim()).filter(Boolean)
  const first = (normalizedSegments[0] || '').toLowerCase()
  let startIndex = 0

  if (regionSet.has(first)) {
    startIndex = 1
    const localeCandidate = (normalizedSegments[1] || '').toLowerCase()
    const shouldTrimLocale = Boolean(
      localeCandidate &&
      localeSet.has(localeCandidate) &&
      (first !== fallbackRegion || localeCandidate !== getDefaultLocaleFor(first))
    )

    if (shouldTrimLocale) {
      startIndex = 2
    }
  }

  const tail = normalizedSegments.slice(startIndex)
  return tail.length ? `/${tail.join('/')}` : '/'
}

const buildLocalizedPath = (
  basePath: string,
  targetRegion: string,
  targetLocale: string | null,
  fallbackRegion: string,
  getDefaultLocaleFor: (region: string) => string
): string => {
  const cleanBase = (basePath || '/').replace(/^\/+/, '').replace(/\/+$/, '')
  const normalizedRegion = String(targetRegion || '').trim().toLowerCase()
  const normalizedLocale = (targetLocale || '').trim().toLowerCase()
  const defaultLocale = getDefaultLocaleFor(normalizedRegion)
  const segments: string[] = []

  if (normalizedRegion && normalizedRegion !== fallbackRegion) {
    segments.push(normalizedRegion)
    if (normalizedLocale && normalizedLocale !== defaultLocale) {
      segments.push(normalizedLocale)
    }
  } else if (normalizedRegion && normalizedLocale && normalizedLocale !== defaultLocale) {
    segments.push(normalizedRegion, normalizedLocale)
  }

  if (cleanBase) {
    segments.push(cleanBase)
  }

  const path = segments.length ? `/${segments.join('/')}` : '/'
  return path
}

const formatHref = (baseUrl: string, path: string, suffix: string) => {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`
  if (!baseUrl) {
    return `${normalizedPath}${suffix}`
  }

  return `${baseUrl}${normalizedPath}${suffix}`
}

export default defineNuxtPlugin((nuxtApp) => {
  const route = useRoute()
  const runtimeConfig = useRuntimeConfig()
  const regionStore = useRegion()
  const i18n = (nuxtApp as any)?.$i18n

  const moduleConfig = (runtimeConfig.public?.regionsModule ||
    runtimeConfig.regionsModule ||
    {}) as Partial<RegionsRuntimeConfig>

  const fallbackRegion = computed(() => {
    return String(regionStore.fallbackRegion || moduleConfig.fallbackRegion || 'global')
      .trim()
      .toLowerCase()
  })

  const regionsMeta = computed(() => {
    return Object.keys(regionStore.regionsMeta || {}).length
      ? regionStore.regionsMeta
      : (moduleConfig.regionsMeta || {})
  })

  const availableLocales = computed(() => {
    const source = regionStore.locales?.length
      ? regionStore.locales
      : (moduleConfig.locales || [])

    const normalized = source
      .map((code) => String(code || '').trim().toLowerCase())
      .filter(Boolean)

    if (normalized.length) {
      return normalized
    }

    return ['en']
  })

  const localeRegionMap = computed(() => {
    return Object.keys(regionStore.localeByRegion || {}).length
      ? regionStore.localeByRegion
      : (moduleConfig.localeByRegion || {})
  })

  const availableRegions = computed(() => {
    const definedRegions = regionStore.regions?.length
      ? regionStore.regions
      : (moduleConfig.regions || [])

    const combined = [fallbackRegion.value, ...definedRegions]
      .map((code) => String(code || '').trim().toLowerCase())
      .filter(Boolean)

    return Array.from(new Set(combined))
  })

  const regionSet = computed(() => new Set(availableRegions.value))
  const localeSet = computed(() => new Set(availableLocales.value))

  const getDefaultLocaleFor = (region: string) => {
    const normalized = String(region || '').trim().toLowerCase()
    return regionsMeta.value?.[normalized]?.locale || availableLocales.value[0] || 'en'
  }

  const i18nLocales = computed(() => extractI18nLocales(i18n?.locales))

  const basePath = computed(() => {
    return stripPrefixedSegments(
      route.path || '/',
      regionSet.value,
      localeSet.value,
      fallbackRegion.value,
      getDefaultLocaleFor
    )
  })

  const suffix = computed(() => {
    const query = buildQueryString(route.query as Record<string, unknown>)
    const hash = route.hash || ''
    return `${query}${hash}`
  })

  const baseUrl = computed(() => normalizeBaseUrl(runtimeConfig.public || {}))

  const hreflangLinks = computed(() => {
    const entries: Array<{ id: string; rel: string; href: string; hreflang: string }> = []
    const seen = new Set<string>()
    const localeEntries = availableLocales.value
    const suffixValue = suffix.value
    const baseUrlValue = baseUrl.value
    const basePathValue = basePath.value

    for (const localeCode of localeEntries) {
      const regionCode = String(localeRegionMap.value?.[localeCode] || fallbackRegion.value).toLowerCase()
      if (!regionSet.value.has(regionCode)) {
        continue
      }

      const href = formatHref(
        baseUrlValue,
        buildLocalizedPath(
          basePathValue,
          regionCode,
          localeCode,
          fallbackRegion.value,
          getDefaultLocaleFor
        ),
        suffixValue
      )

      const hreflang = (i18nLocales.value[localeCode] || localeCode).toLowerCase()
      if (!hreflang || seen.has(hreflang)) {
        continue
      }

      seen.add(hreflang)
      entries.push({
        id: `regions-hreflang-${hreflang}`,
        rel: 'alternate',
        hreflang,
        href
      })
    }

    const defaultHref = formatHref(
      baseUrlValue,
      buildLocalizedPath(
        basePathValue,
        fallbackRegion.value,
        getDefaultLocaleFor(fallbackRegion.value),
        fallbackRegion.value,
        getDefaultLocaleFor
      ),
      suffixValue
    )

    if (!entries.some((entry) => entry.hreflang === 'x-default')) {
      entries.push({
        id: 'regions-hreflang-x-default',
        rel: 'alternate',
        hreflang: 'x-default',
        href: defaultHref
      })
    }

    return entries
  })

  useHead(() => ({
    link: hreflangLinks.value
  }))
})
