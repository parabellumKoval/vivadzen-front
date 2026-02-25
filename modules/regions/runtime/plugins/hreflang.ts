import { computed, watch } from 'vue'
import { useHead, useRoute, useRuntimeConfig, useState } from '#imports'
import { useRegion } from '../composables/useRegion'
import { useHreflang } from '../composables/useHreflang'
import type { RegionsRuntimeConfig } from '../../module'

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

const normalizeHreflangRegion = (value: string | null | undefined) => String(value || '').trim().toLowerCase()
const normalizeHreflangLocale = (value: string | null | undefined) => String(value || '').trim().toLowerCase()
const extractLanguage = (value: string | null | undefined) => String(value || '').split(/[-_]/)[0]?.toLowerCase() || ''

const buildHreflangPath = (
  basePath: string,
  targetRegion: string,
  targetLocale: string | null,
  fallbackRegion: string,
  getDefaultLocaleFor: (region: string) => string
): string => {
  const cleanBase = (basePath || '/').replace(/^\/+/, '').replace(/\/+$/, '')
  const normalizedRegion = normalizeHreflangRegion(targetRegion)
  const normalizedFallback = normalizeHreflangRegion(fallbackRegion)
  const normalizedLocale = normalizeHreflangLocale(targetLocale)
  const defaultLocale = getDefaultLocaleFor(normalizedRegion)
  const segments: string[] = []

  if (normalizedRegion && normalizedRegion !== normalizedFallback) {
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

  return segments.length ? `/${segments.join('/')}` : '/'
}

const formatHref = (baseUrl: string, path: string, suffix: string) => {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`
  if (!baseUrl) {
    return `${normalizedPath}${suffix}`
  }

  return `${baseUrl}${normalizedPath}${suffix}`
}

const formatHreflang = (locale: string, region: string, fallbackRegion: string) => {
  const lang = extractLanguage(locale)
  const normalizedRegion = normalizeHreflangRegion(region)
  const normalizedFallback = normalizeHreflangRegion(fallbackRegion)
  if (!lang) return ''

  if (!normalizedRegion || normalizedRegion === normalizedFallback) {
    return lang
  }

  return `${lang}-${normalizedRegion.toUpperCase()}`
}

export default defineNuxtPlugin(() => {
  const route = useRoute()
  const runtimeConfig = useRuntimeConfig()
  const regionStore = useRegion()
  const { allowedRegions } = useHreflang()
  const allowedRegionsState = allowedRegions ?? useState<string[] | null>('hreflang-allowed-regions', () => null)

  const moduleConfig = (runtimeConfig.public?.regionsModule ||
    runtimeConfig.regionsModule ||
    {}) as Partial<RegionsRuntimeConfig>

  const fallbackRegion = computed(() => normalizeHreflangRegion(
    regionStore.fallbackRegion ||
    moduleConfig.fallbackRegion ||
    'global'
  ))

  const regionsMeta = computed(() => {
    return Object.keys(regionStore.regionsMeta || {}).length
      ? regionStore.regionsMeta
      : (moduleConfig.regionsMeta || {})
  })

  const localesByRegion = computed(() => {
    if (regionStore.localesByRegion && Object.keys(regionStore.localesByRegion).length) {
      return regionStore.localesByRegion
    }
    return moduleConfig.localesByRegion || {}
  })

  const allLocales = computed(() => {
    const merged = [
      ...(regionStore.locales || []),
      ...(moduleConfig.locales || [])
    ]
      .map(normalizeHreflangLocale)
      .filter(Boolean)

    return Array.from(new Set(merged))
  })

  const availableRegions = computed(() => {
    const defined = Object.keys(localesByRegion.value || {})
    const combined = [fallbackRegion.value, ...defined]
      .map(normalizeHreflangRegion)
      .filter(Boolean)

    return Array.from(new Set(combined))
  })

  const getLocalesForRegion = (region: string | null | undefined) => {
    const key = normalizeHreflangRegion(region)
    const bucket = localesByRegion.value?.[key] || []
    const normalized = (bucket.length ? bucket : allLocales.value)
      .map(normalizeHreflangLocale)
      .filter(Boolean)

    if (normalized.length) {
      return Array.from(new Set(normalized))
    }

    const metaDefault = regionsMeta.value?.[key]?.locale
    if (metaDefault) {
      return [normalizeHreflangLocale(metaDefault)]
    }

    return []
  }

  const getDefaultLocaleFor = (region: string | null | undefined) => {
    const key = normalizeHreflangRegion(region)
    const allowed = getLocalesForRegion(key)
    const metaDefault = normalizeHreflangLocale(regionsMeta.value?.[key]?.locale)
    if (metaDefault && allowed.includes(metaDefault)) {
      return metaDefault
    }
    return allowed[0] || allLocales.value[0] || 'en'
  }

  const regionLocaleSets = computed(() => {
    return availableRegions.value.reduce<Record<string, Set<string>>>((acc, code) => {
      acc[code] = new Set(getLocalesForRegion(code))
      return acc
    }, {})
  })

  const basePath = computed(() => {
    const path = route.path || '/'
    if (!path || path === '/') return '/'

    const segments = path.split('/').filter(Boolean)
    if (!segments.length) return '/'

    const normalizedSegments = segments.map((segment) => segment.trim()).filter(Boolean)
    const first = normalizeHreflangRegion(normalizedSegments[0])
    let startIndex = 0

    if (first && availableRegions.value.includes(first)) {
      startIndex = 1
      const localeCandidate = normalizeHreflangLocale(normalizedSegments[1])
      const localeSet = regionLocaleSets.value[first] || new Set<string>()
      if (localeCandidate && localeSet.has(localeCandidate)) {
        startIndex = 2
      }
    }

    const tail = normalizedSegments.slice(startIndex)
    return tail.length ? `/${tail.join('/')}` : '/'
  })

  const suffix = computed(() => {
    const query = buildQueryString(route.query as Record<string, unknown>)
    const hash = route.hash || ''
    return `${query}${hash}`
  })

  const baseUrl = computed(() => normalizeBaseUrl(runtimeConfig.public || {}))

  const filteredRegions = computed(() => {
    const filter = allowedRegionsState.value?.map(normalizeHreflangRegion).filter(Boolean)
    if (!filter || !filter.length) {
      return availableRegions.value
    }

    const allowedSet = new Set(filter)
    const fallback = fallbackRegion.value

    return availableRegions.value.filter((code) => code === fallback || allowedSet.has(code))
  })

  if (process.client) {
    watch(
      () => route.fullPath,
      () => { allowedRegionsState.value = null }
    )
  }

  const hreflangLinks = computed(() => {
    const entries: Array<{ id: string; rel: 'alternate'; href: string; hreflang: string }> = []
    const seen = new Set<string>()
    const suffixValue = suffix.value
    const baseUrlValue = baseUrl.value
    const basePathValue = basePath.value
    const fallback = fallbackRegion.value

    const defaultHref = formatHref(
      baseUrlValue,
      buildHreflangPath(
        basePathValue,
        fallback,
        getDefaultLocaleFor(fallback),
        fallback,
        getDefaultLocaleFor
      ),
      suffixValue
    )

    for (const regionCode of filteredRegions.value) {
      const locales = getLocalesForRegion(regionCode)
      if (!locales.length) continue

      const defaultLocale = getDefaultLocaleFor(regionCode)

      for (const localeCode of locales) {
        const hreflang = formatHreflang(localeCode, regionCode, fallback)
        if (!hreflang || seen.has(hreflang)) {
          continue
        }

        const href = formatHref(
          baseUrlValue,
          buildHreflangPath(
            basePathValue,
            regionCode,
            localeCode,
            fallback,
            getDefaultLocaleFor
          ),
          suffixValue
        )

        entries.push({
          id: `regions-hreflang-${hreflang}`,
          rel: 'alternate',
          hreflang,
          href
        })
        seen.add(hreflang)
      }

      if (!locales.includes(defaultLocale)) {
        const hreflang = formatHreflang(defaultLocale, regionCode, fallback)
        if (hreflang && !seen.has(hreflang)) {
          entries.push({
            id: `regions-hreflang-${hreflang}`,
            rel: 'alternate',
            hreflang,
            href: formatHref(
              baseUrlValue,
              buildHreflangPath(
                basePathValue,
                regionCode,
                defaultLocale,
                fallback,
                getDefaultLocaleFor
              ),
              suffixValue
            )
          })
          seen.add(hreflang)
        }
      }
    }

    if (!seen.has('x-default')) {
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
