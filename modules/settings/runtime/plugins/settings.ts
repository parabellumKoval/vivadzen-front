import { computed, watch } from 'vue'
import {
  getDatasetEntry,
  type SettingsDataset,
  type SettingsServerPayload,
} from '../utils/settings-helpers'

export default defineNuxtPlugin((nuxtApp) => {
  const dataset = useState<SettingsDataset>('settings-dataset', () => ({}))
  const meta = useState<{ region: string | null; locale: string | null }>('settings-meta', () => ({
    region: null,
    locale: null,
  }))

  if (process.server) {
    const ev = useRequestEvent()
    const payload = ev?.context?.settings as SettingsServerPayload | undefined
    if (payload) {
      dataset.value = payload.all || {}
      meta.value.region = payload.region
      meta.value.locale = payload.locale
    }
  }

  const i18n = (nuxtApp as any).$i18n
  const regionStore = useRegion()

  const currentRegion = computed(() => {
    return regionStore?.region?.value ?? meta.value.region ?? 'global'
  })

  const currentLocale = computed(() => {
    return i18n?.locale?.value ?? meta.value.locale ?? null
  })

  const currentSettings = computed(() => {
    return getDatasetEntry(dataset.value, currentRegion.value, currentLocale.value)
  })

  if (regionStore?.region) {
    watch(regionStore.region, (value) => {
      meta.value.region = value ?? meta.value.region
    }, { immediate: !process.server })
  }

  if (i18n?.locale) {
    watch(i18n.locale, (value: string | null | undefined) => {
      meta.value.locale = value ?? meta.value.locale
    }, { immediate: !process.server })
  }

  const getSetting = (key: string, def?: any) => {
    const root: any = currentSettings.value || {}
    if (Object.prototype.hasOwnProperty.call(root, key)) {
      return root[key]
    }
    const parts = key.split('.')
    let cur: any = root
    for (const part of parts) {
      if (cur && Object.prototype.hasOwnProperty.call(cur, part)) {
        cur = cur[part]
      } else {
        return def
      }
    }
    return cur ?? def
  }

  return {
    provide: {
      settings: currentSettings,
      settingsAll: computed(() => dataset.value),
      getSetting,
    }
  }
})
