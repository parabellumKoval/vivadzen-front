import {useAttributeStore} from '~/store/attribute'
import {useBrandStore} from '~/store/brand'

export const useFilterNEW = () => {
  const {t} = useI18n({useScope: 'global'})

  // const attrs = ref(null)
  // const brands = ref(null)

  // const fils = computed(() => {
  //   return {
  //     attrs: attrs.value,
  //     brands: brands.value,
  //   }
  // })

  // const getFilters = async (query: Object) => {
  //   ({data: brands.value} = await getBrands(query));
  //   ({data: attrs.value} = await getAttributes(query));
  // }
  // const getFilters = async (query: Object, useAttributes: Boolean = true) => {
  //   return Promise.all([
  //     await getBrands(query),
  //     await getAttributes(query)
  //   ]).then(([brands, attributes]) => {
  //     // console.log(brands.data.value.data, attributes.data.value)
  //     if(useAttributes) {
  //       return prepareFilters(attributes?.data?.value, brands.data?.value?.data)
  //     }else {
  //       return prepareFilters([], brands.data?.value?.data)
  //     }
  //   })
  // }

  const getFilters = async (query: Object, useAttributes: Boolean = true) => {
    return await useLazyAsyncData('filters', async () => {
      return await Promise.all([
        getBrands(query),
        getAttributes(query)
      ]).then(([brands, attributes]) => {
        if(useAttributes) {
          return prepareFilters(attributes?.data?.value, brands.data?.value?.data)
        }else {
          return prepareFilters([], brands.data?.value?.data)
        }
      })
    })
  }

  const getBrands = async (query: Object) => {
    return await useBrandStore().filterLazy(query)
  }

  const getAttributes = async (query: Object) => {
    return await useAttributeStore().indexLazy(query)
  }

  const prepareFilters = (attributes: Object[], brands: Object[]) => {
    const filtersCopy = attributes?.length? [...attributes]: []

    filtersCopy.push({
      id: 'price',
      name: t('label.price'),
      si: t('label.grn'),
      isOpen: true,
      type: 'number'
    })

    if(brands?.length) {
      filtersCopy.unshift({
        id: 'brand',
        name: t('label.brand'),
        si: null,
        isOpen: true,
        noMeta: true,
        type: 'brand',
        values: [...brands]
      })
    }

    filtersCopy.unshift({
      id: 'selections',
      name: t('label.selections'),
      si: null,
      isOpen: true,
      noMeta: true,
      noSearch: true,
      type: 'checkbox',
      values: [
        {
          id: 'with_sales',
          value: '🎁 ' + t('title.sales')
        },{
          id: 'top_sales',
          value: '🛍 ' + t('label.top_sales')
        },{
          id: 'top_price',
          value: '💸 ' + t('label.top_price')
        },{
          id: 'with_rating',
          value: '💬 ' + t('label.with_rates')
        },{
          id: 'in_stock',
          value: '📦 ' + t('label.only_in_stock')
        }
      ]
    })

    return filtersCopy
  }

  const prepareAttrs = (attrs) => {

    let filters = []
    let brands = null
    let selections = null
    let price = null

    for(let attr of attrs){
      const key = attr.id
      const value = attr.values

      // Price
      if(key === 'price') {
        price = {...value}
        continue
      }

      // Brand
      if(key === 'brand') {
        brands = [...value]
        continue
      }

      // Selections
      if(key === 'selections') {
        selections = [...value]
        continue
      }

      // Filters
      if(Array.isArray(value)) {
        for(const v of value) {
          filters.push({
            attr_id: parseInt(key),
            attr_value_id: parseInt(v)
          })
        }
      }else if(typeof value === 'object'){
        filters.push({
          attr_id: parseInt(key),
          from: value.min,
          to: value.max,
        })
      }
    }
    
    return {filters, brands, selections, price}
  }

  return {
    getAttributes,
    getBrands,
    getFilters,
    prepareAttrs,
    prepareFilters
  }
}