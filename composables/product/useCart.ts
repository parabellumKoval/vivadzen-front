import {useCartStore} from '~/store/cart'
import { ModalCart } from '#components'

export const useCart = (productData: Product) => {

  const {t} = useI18n({useScope: 'global'})

  const toCartHandler = () => {
    const data = {
      ...productData,
      amount: 1
    }

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