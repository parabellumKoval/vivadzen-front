import { navigateTo, useRuntimeConfig, useRequestEvent, useRegion } from '#imports'
import type { RegionsRuntimeConfig } from '../../module'

export default defineNuxtRouteMiddleware(async (to) => {
  const { $i18n } = useNuxtApp()
  const runtimeConfig = useRuntimeConfig()
  const store = useRegion()

  const moduleConfig = (runtimeConfig.public?.regionsModule ||
    runtimeConfig.regionsModule ||
    {}) as Partial<RegionsRuntimeConfig>

  const fallbackRegion = String(
    store.fallbackRegion ||
    moduleConfig.fallbackRegion ||
    'global'
  ).trim().toLowerCase()
  const regions = (store.regions.length ? store.regions : (moduleConfig.regions || []))
    .map((code) => String(code || '').trim().toLowerCase())
    .filter(Boolean)
  const locales = (store.locales.length ? store.locales : (moduleConfig.locales || []))
    .map((code) => String(code || '').trim().toLowerCase())
    .filter(Boolean)
  const regionsMeta = Object.keys(store.regionsMeta || {}).length
    ? store.regionsMeta
    : (moduleConfig.regionsMeta || {})

  const getDefaultLocaleFor = (region: string | undefined) => {
    if (!region) return locales[0] || 'en'
    return regionsMeta[region]?.locale || locales[0] || 'en'
  }

  const regionSet = new Set([fallbackRegion, ...regions].map((code) => code.toLowerCase()))
  const localeSet = new Set(locales.map((code) => code.toLowerCase()))

  const ensureLocale = async (locale: string) => {
    const maybePromise = $i18n?.setLocale?.(locale)
    if (maybePromise && typeof maybePromise.then === 'function') {
      await maybePromise
    }
  }

  if (process.server) {
    const event = useRequestEvent()
    const region = (event?.context?.region as string) || fallbackRegion
    const forced = (event?.context?.forcedLocale as string) || null
    const targetLocale = forced || getDefaultLocaleFor(region)

    store.setRegion(region)
    await ensureLocale(targetLocale)
    return
  }

  const parts = to.path.split('/').filter(Boolean)
  const [segment1, segment2] = parts

  const normalizedRegion = (segment1 || '').toLowerCase()
  const isRegion = regionSet.has(normalizedRegion)
  const region = isRegion ? normalizedRegion : fallbackRegion

  const normalizedLocale = (segment2 || '').toLowerCase()
  const isLocale = localeSet.has(normalizedLocale)

  const targetLocale = isLocale
    ? normalizedLocale
    : getDefaultLocaleFor(region)

  store.setRegion(region)
  await ensureLocale(targetLocale)

  if (region === fallbackRegion && isRegion) {
    const defaultLocale = getDefaultLocaleFor(region)
    const shouldStripLocale = !isLocale || normalizedLocale === defaultLocale

    if (shouldStripLocale) {
      const sliceIndex = isLocale ? 2 : 1
      const remaining = parts.slice(sliceIndex)
      const normalizedPath = `/${remaining.join('/')}` || '/'

      if (normalizedPath !== to.path) {
        return navigateTo({
          path: normalizedPath,
          query: to.query,
          hash: to.hash
        }, { replace: true })
      }
    }
  }
})
