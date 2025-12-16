import { navigateTo, useRuntimeConfig, useRequestEvent, useRegion } from '#imports'
import type { RegionsRuntimeConfig } from '../../module'

const normalize = (value: string | null | undefined) => String(value || '').trim().toLowerCase()

export default defineNuxtRouteMiddleware(async (to) => {
  const { $i18n } = useNuxtApp()
  const runtimeConfig = useRuntimeConfig()
  const store = useRegion()

  const moduleConfig = (runtimeConfig.public?.regionsModule ||
    runtimeConfig.regionsModule ||
    {}) as Partial<RegionsRuntimeConfig>

  const fallbackRegion = normalize(
    store.fallbackRegion ||
    moduleConfig.fallbackRegion ||
    'global'
  )
  const regions = (store.regions.length ? store.regions : (moduleConfig.regions || []))
    .map((code) => normalize(code))
    .filter(Boolean)
  const locales = (store.locales.length ? store.locales : (moduleConfig.locales || []))
    .map((code) => normalize(code))
    .filter(Boolean)
  const localesByRegion = Object.keys(store.localesByRegion || {}).length
    ? store.localesByRegion
    : (moduleConfig.localesByRegion || {})
  const regionsMeta = Object.keys(store.regionsMeta || {}).length
    ? store.regionsMeta
    : (moduleConfig.regionsMeta || {})

  const getLocalesForRegion = store.getLocalesForRegion || ((region?: string | null) => {
    const key = normalize(region)
    const bucket = localesByRegion[key]
    const normalized = (bucket && bucket.length ? bucket : locales).map((value) => normalize(value)).filter(Boolean)
    return normalized.length ? Array.from(new Set(normalized)) : locales
  })

  const getDefaultLocaleFor = store.getDefaultLocaleFor || ((region?: string) => {
    const key = normalize(region)
    const allowed = getLocalesForRegion(key)
    const metaLocale = normalize(regionsMeta[key]?.locale)
    if (metaLocale && allowed.includes(metaLocale)) {
      return metaLocale
    }
    return allowed[0] || 'en'
  })

  const regionSet = new Set([fallbackRegion, ...regions].map((code) => normalize(code)))

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

  const normalizedRegion = normalize(segment1)
  const isRegion = regionSet.has(normalizedRegion)
  const region = isRegion ? normalizedRegion : fallbackRegion

  const regionLocaleSet = new Set(getLocalesForRegion(region))
  const normalizedLocale = normalize(segment2)
  const isLocale = isRegion && regionLocaleSet.has(normalizedLocale)

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
