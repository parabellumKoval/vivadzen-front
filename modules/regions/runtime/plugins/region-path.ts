import { useRuntimeConfig } from '#imports'
import { useRegion } from '../composables/useRegion'
import type { RegionsRuntimeConfig } from '../../module'

const normalize = (value: string | null | undefined) => String(value || '').trim().toLowerCase()

export default defineNuxtPlugin((nuxtApp) => {
  const i18n = (nuxtApp as any).$i18n
  const regionStore = useRegion()
  const runtimeConfig = useRuntimeConfig()
  const moduleConfig = (runtimeConfig.public?.regionsModule ||
    runtimeConfig.regionsModule ||
    {}) as Partial<RegionsRuntimeConfig>

  const regionsMeta = Object.keys(regionStore.regionsMeta || {}).length
    ? regionStore.regionsMeta
    : (moduleConfig.regionsMeta || {})

  const fallbackRegion = normalize(
    moduleConfig.fallbackRegion ||
    regionStore.fallbackRegion ||
    'global'
  )

  const locales = (regionStore.locales.length
    ? regionStore.locales
    : (moduleConfig.locales || [])
  ).map((code) => normalize(code)).filter(Boolean)

  const getLocalesForRegion = regionStore.getLocalesForRegion || ((regionCode?: string | null) => {
    const key = normalize(regionCode)
    const bucket = moduleConfig.localesByRegion?.[key] || []
    const normalized = (bucket.length ? bucket : locales).map((locale) => normalize(locale)).filter(Boolean)
    return normalized.length ? Array.from(new Set(normalized)) : locales
  })

  const getDefaultLocaleFor = regionStore.getDefaultLocaleFor || ((region: string | undefined) => {
    const key = normalize(region)
    const allowed = getLocalesForRegion(key)
    return regionsMeta[key]?.locale || allowed[0] || 'en'
  })

  const regionPath = (path: string, opts: { absolute?: boolean } = {}) => {
    const cleanPath = path.replace(/^\//, '')
    const region = normalize(regionStore.region.value || fallbackRegion)
    const locale = normalize(i18n?.locale?.value)
    const allowedLocales = new Set(getLocalesForRegion(region))
    const targetLocale = locale && allowedLocales.has(locale) ? locale : getDefaultLocaleFor(region)
    const defaultLocale = getDefaultLocaleFor(region)

    const segments: string[] = []

    if (region !== fallbackRegion) {
      segments.push(region)
      if (targetLocale && targetLocale !== defaultLocale) {
        segments.push(targetLocale)
      }
    } else if (targetLocale && targetLocale !== defaultLocale) {
      segments.push(region, targetLocale)
    }

    if (cleanPath) {
      segments.push(cleanPath)
    }

    const localized = segments.length ? `/${segments.join('/')}` : '/'

    if (opts.absolute) {
      const baseUrl = runtimeConfig.public?.baseUrl || runtimeConfig.public?.siteUrl || ''
      return `${baseUrl}${localized}`
    }

    return localized
  }

  nuxtApp.provide('regionPath', regionPath)
})
