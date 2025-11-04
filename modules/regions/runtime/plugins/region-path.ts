import { useRuntimeConfig } from '#imports'
import { useRegion } from '../composables/useRegion'
import type { RegionsRuntimeConfig } from '../../module'

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
  const fallbackRegion = String(
    moduleConfig.fallbackRegion ||
    regionStore.fallbackRegion ||
    'global'
  ).trim().toLowerCase()
  const locales = (regionStore.locales.length
    ? regionStore.locales
    : (moduleConfig.locales || [])
  ).map((code) => String(code || '').trim().toLowerCase()).filter(Boolean)

  const getDefaultLocaleFor = (region: string | undefined) => {
    if (!region) return locales[0] || 'en'
    return regionsMeta[region]?.locale || locales[0] || 'en'
  }

  const regionPath = (path: string, opts: { absolute?: boolean } = {}) => {
    const cleanPath = path.replace(/^\//, '')
    const locale = (i18n?.locale?.value || '').toLowerCase()
    const region = (regionStore.region.value || fallbackRegion).toLowerCase()
    const defaultLocale = getDefaultLocaleFor(region)

    const segments: string[] = []

    if (region !== fallbackRegion) {
      segments.push(region)
      if (locale && locale !== defaultLocale) {
        segments.push(locale)
      }
    } else if (locale && locale !== defaultLocale) {
      segments.push(region, locale)
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
