
import {useProductStore} from '~/store/product'

export const useCatalog = (query: Object) => {
  const catalogMeta = useState('catalogMeta', () => {return {}})
  const pending = useState('pendingState', () => {return false})

  const getProducts = (query: Object, name = 'catalog', state = true) => {
    if(state) {
      pending.value = true
    }

    const options = {
      key: name
    }

    return useProductStore().indexLazy(query, options).then(({data, error}) => {
      if(error?.value){
        throw error.value
      }

      if(state) {
        catalogMeta.value = data?.value?.products?.meta
      }

      return {
        products: data?.value?.products?.data,
        meta: data?.value?.products?.meta,
        filters: data?.value?.filters
      }
    })

    // return await useLazyAsyncData(name, () => useProductStore().indexLazy(query)).then(({data, error}) => {

    //   if(error?.value){
    //     throw error.value
    //   }

    //   if(state) {
    //     catalogMeta.value = data?.value?.meta
    //   }

    //   return {
    //     products: data?.value?.products,
    //     meta: data?.value?.meta,
    //     filters: data?.value?.filters
    //   }
    // }).finally(() => {
    //   if(state) {
    //     pending.value = false
    //   }
    // })
  }

  return {
    getProducts,
    catalogMeta,
    pending
  }
}