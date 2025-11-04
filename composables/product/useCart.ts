import {useCartStore} from '~/store/cart'
import { ModalCart } from '#components'

type ProductProto = {
  id: number
}

export const useCart = (productData: Product) => {

  const {t} = useI18n({useScope: 'global'})

  const toCartHandler = (count: Number = 1, modification: ProductProto | null = null) => {
    let productOrModification = modification? modification: productData
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