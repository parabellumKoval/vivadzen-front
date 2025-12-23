import { computed, defineAsyncComponent, toValue, type MaybeRefOrGetter } from 'vue'

type StoreOnlyTarget = Record<string, any> | null | undefined

const resolveFlag = (value: StoreOnlyTarget): boolean => {
  if (!value) return false

  const directFlag = value.storeOnly ?? value.store_only ?? value.store_only_flag
  if (directFlag !== null && directFlag !== undefined) {
    return Boolean(directFlag)
  }

  const mods = Array.isArray(value.modifications) ? value.modifications : []
  if (!mods.length) return false

  return mods.some((mod) => {
    if (!mod || typeof mod !== 'object') return false
    return Boolean(mod.storeOnly ?? mod.store_only ?? mod.store_only_flag)
  })
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
