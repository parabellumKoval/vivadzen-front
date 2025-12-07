import { watch } from 'vue'
import { useCategoryStore } from '~/store/category'

export default defineNuxtPlugin(() => {
  if (process.server) {
    return
  }

  const locale = useNuxtApp().$i18n.locale
  const regionAlias = useRegion().regionAlias
  const categoryStore = useCategoryStore()

  const refetchCategories = async () => {
    try {
      await Promise.all([
        categoryStore.listCached(null, true, false),
        categoryStore.listMainCached(false),
      ])
    } catch (error) {
      console.error('[category-refetch] Failed to refetch categories', error)
    }
  }

  let scheduled: ReturnType<typeof setTimeout> | null = null
  const scheduleRefetch = () => {
    if (scheduled) {
      clearTimeout(scheduled)
    }
    scheduled = setTimeout(() => {
      scheduled = null
      refetchCategories()
    }, 0)
  }

  watch(
    [regionAlias, locale],
    () => {
      scheduleRefetch()
    },
    { immediate: true },
  )
})
