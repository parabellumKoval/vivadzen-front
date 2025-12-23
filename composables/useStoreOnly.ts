import { computed, defineAsyncComponent, toValue, type MaybeRefOrGetter } from 'vue'

type StoreOnlyTarget = Record<string, any> | null | undefined

const resolveFlag = (value: StoreOnlyTarget): boolean => {
  if (!value) return false
  return Boolean(
    value.storeOnly ??
    value.store_only ??
    value.store_only_flag
  )
}

export const useStoreOnly = (product?: MaybeRefOrGetter<StoreOnlyTarget>) => {
  const resolveProduct = (override?: StoreOnlyTarget) => {
    if (typeof override !== 'undefined') {
      return override
    }

    if (typeof product === 'undefined') {
      return null
    }

    return toValue(product)
  }

  const isStoreOnly = computed(() => resolveFlag(resolveProduct()))

  const openStoreOnlyModal = (override?: StoreOnlyTarget) => {
    const payload = resolveProduct(override) || {}
    const component = defineAsyncComponent(() => import('~/components/Modal/StoreOnly/StoreOnly.vue'))
    useModal().open(component, { product: payload }, null, { width: { min: 520, max: 760 } })
  }

  return {
    isStoreOnly,
    openStoreOnlyModal
  }
}
