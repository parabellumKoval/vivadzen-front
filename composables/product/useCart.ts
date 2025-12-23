import { useCartStore } from '~/store/cart'
import { ModalCart } from '#components'
import { useStoreOnly } from '~/composables/useStoreOnly'

type ProductProto = {
  id: number
}

export const useCart = (productData?: Product) => {

  const {t} = useI18n({useScope: 'global'})
  const { isStoreOnly, openStoreOnlyModal } = useStoreOnly(productData)

  const resolveStoreOnlyFlag = (target: any): boolean => {
    if (target && typeof target === 'object') {
      const direct = target.storeOnly ?? target.store_only ?? target.store_only_flag
      if (direct !== null && direct !== undefined) {
        return Boolean(direct)
      }

      const mods = Array.isArray(target.modifications) ? target.modifications : []
      if (mods.length) {
        return mods.some((mod) => {
          if (!mod || typeof mod !== 'object') return false
          return Boolean(mod.storeOnly ?? mod.store_only ?? mod.store_only_flag)
        })
      }
    }

    return isStoreOnly.value
  }

  const toCartHandler = (count: Number = 1, modification: ProductProto | null = null) => {
    const productOrModification = modification ? modification : productData
    if (resolveStoreOnlyFlag(productOrModification)) {
      openStoreOnlyModal(productOrModification)
      return
    }

    if (!productOrModification) {
      return
    }

    const data = {
      ...productOrModification,
      amount: count
    }
    
    useGoogleEvent().setEvent('AddToCart', productOrModification)

    useCartStore().add(data).then(() => {
      useModal().open(ModalCart, null, null, {width: {
        min: 968, max: 968
      }})
    })
  }

  return {
    toCartHandler
  }
}
