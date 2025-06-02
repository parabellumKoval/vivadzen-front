import {useCartStore} from '~/store/cart'
import { ModalCart } from '#components'

export const useCart = (productData: Product) => {

  const {t} = useI18n({useScope: 'global'})

  const toCartHandler = (count: Integer = 1) => {
    const data = {
      ...productData,
      amount: count
    }
    
    useGoogleEvent().setEvent('AddToCart', productData)

    useCartStore().add(data).then(() => {
    
      useModal().open(ModalCart, null, null, {width: {
        min: 968, max: 968
      }})

      // useNoty().setNoty({
      //   content: t('noty.product_to_cart', {product: productData.name})
      // }, 2000)
    })
  }

  return {
    toCartHandler
  }
}