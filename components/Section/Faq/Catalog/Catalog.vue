<script setup>
import {useProductStore} from '~/store/product'
import {useSupportContent} from '~/composables/useSupportContent'
// import {useCatalog} from '~/composables/product/useCatalog.ts'
const {t} = useI18n()

const props = defineProps({
  categoryData: {
    type: Object
  }
})

const chipProducts = ref([])
const popularProducts = ref([])
const {deliveryDetails, paymentDetails} = await useSupportContent()

const deliveryItems = computed(() => {
  return deliveryDetails.value.map((method) => `<b>${method.title}</b>: ${method.description}`)
})

const paymentItems = computed(() => {
  return paymentDetails.value.map((method) => `<b>${method.title}</b>: ${method.description}`)
})

const staticDelivery = computed(() => [
  t('delivery_cond1'),
  t('delivery_cond2'),
  t('delivery_cond3')
])

const deliveryAnswer = computed(() => {
  const parts = []
  const categoryName = props.categoryData.category?.name?.toLowerCase() || ''
  const deliveryList = deliveryItems.value.length ? deliveryItems.value : staticDelivery.value

  if (deliveryList.length) {
    parts.push(t('delivery_a', {category: categoryName}) + ':')
    parts.push(deliveryList)
  }

  if (paymentItems.value.length) {
    parts.push(t('payment_a', {category: categoryName}) + ':')
    parts.push(paymentItems.value)
  }

  return parts
})

// COMPUTEDS
const faq = computed(() =>{
  let list = []

  if(popularProducts.value?.length) {
    list.push({
      id: 1,
      q: t('popular_q', {category: props.categoryData.category?.name?.toLowerCase(), year: new Date().getFullYear()}),
      a: [
        t('popular_a', {category: props.categoryData.category?.name?.toLowerCase()}) + ':',
        popularProducts.value
      ]
    })
  }

  list.push({
    id: 2,
    q: t('delivery_q', {category: props.categoryData.category?.name?.toLowerCase()}),
    a: deliveryAnswer.value
  })

  if(chipProducts.value?.length) {
    list.push({
      id: 3,
      q: t('chip_q', {category: props.categoryData.category?.name?.toLowerCase()}),
      a: [
        t('chip_a', {category: props.categoryData.category?.name?.toLowerCase()}) + ':',
        chipProducts.value
      ]
    })
  }

  return list
})

// METHODS
const setInitData = () => {
  chipProducts.value = props.categoryData?.chip_products
  popularProducts.value =  props.categoryData?.popular_products
}
// const getChipProducts = async() => {
//   const query = {
//     category_id: props.category.id,
//     price: [5, 100000000],
//     order_by: 'price',
//     order_dir: 'ASC',
//     selections: ['in_stock'],
//     per_page: 5,
//     with_filters: 0
//   }

//   return await useProductStore().indexLazy(query);
// }


// const getPopularProducts = async () => {
//   const query = {
//     category_id: props.category.id,
//     order_by: 'sales',
//     order_dir: 'DESC',
//     selections: ['in_stock'],
//     per_page: 5,
//     with_filters: 0
//   }


//   return await useProductStore().indexLazy(query);
// }
// HANDLERS
// WATCHERS

// const {data: chipTemp} = await getChipProducts()
// const {data: popularTemp} = await getPopularProducts()

// watch(chipTemp, (v) => {
//   if(v?.products) {
//     chipProducts.value = v.products.data
//   }
// }, {
//   immediate: true
// })

// watch(popularTemp, (v) => {
//   if(v?.products) {
//     popularProducts.value = v.products.data
//   }
// }, {
//   immediate: true
// })
setInitData()
</script>

<i18n src='./lang.yaml' lang='yaml'></i18n>

<template>
  <section-faq :items="faq"></section-faq>
</template>
