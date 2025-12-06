import { computed, defineAsyncComponent } from 'vue'

export const useRegionPurchaseGuard = () => {
  const regionStore = useRegion()
  const modal = useModal()

  const normalizedRegion = computed(() => String(regionStore.region.value || '').toLowerCase())
  const normalizedFallback = computed(() => String(regionStore.fallbackRegion || '').toLowerCase())

  const isInternational = computed(() => {
    if (!normalizedFallback.value) {
      return false
    }
    return normalizedRegion.value === normalizedFallback.value
  })

  const openRegionModal = () => {
    const component = defineAsyncComponent(() => import('~/components/Modal/Region/International/International.vue'))
    modal.open(component, null, null)
  }

  const ensureRegionSelected = (action?: () => void) => {
    if (isInternational.value) {
      openRegionModal()
      return false
    }

    action?.()
    return true
  }

  return {
    isInternational,
    openRegionModal,
    ensureRegionSelected
  }
}
