// middleware/region.global.ts
import { setCookie } from 'h3';
import {useRegionStore} from '~/store/region'

const DEFAULT_LOCALE_BY_REGION: Record<string, string> = {
  ua: 'uk',
  cz: 'cs',
  de: 'de',
  es: 'es',
  global: 'en',
};

export default defineNuxtRouteMiddleware((to) => {
  const { $i18n } = useNuxtApp()
  const store = useRegionStore()

  if (process.server) {
    const ev = useRequestEvent()
    const region = (ev?.context?.region as string) || 'global'
    const forced = (ev?.context?.forcedLocale as string) || null
    const target = forced || DEFAULT_LOCALE_BY_REGION[region] || 'en'
    
    store.setRegion(region)
    $i18n.setLocale(target)
  } else {
    const parts = to.path.split('/').filter(Boolean)
    const [p1, p2] = parts
    const isRegion = ['ua','cz','de','es'].includes(p1 || '')
    const region = isRegion ? p1 : 'global'
    const target = (['uk','ru','cs','de','en','es'].includes(p2 || '')) 
      ? p2
      : (DEFAULT_LOCALE_BY_REGION[region] || 'en')

    store.setRegion(region)
    $i18n.setLocale(target)
  }
})
