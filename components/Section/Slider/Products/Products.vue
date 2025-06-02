<script setup>
import { useProductStore } from '~/store/product'

const props = defineProps({
  title: {
    type: String,
    default: "Products"
  },
  query: {
    type: Object
  },
  link: {
    type: String,
    default: ''
  },
  fetchOptions: {
    type: Object
  }
})

const {t} = useI18n()

const products = ref([])
const options = ref({
  card: {
    width: {
      mobile: '180px',
      desktop: '285px'
    }
  }
})

// await useAsyncData('products-main-' + props.title, () => useProductStore().index(props.query))
// .then(({data}) => {
//   console.log('data', data)
//   if(data?.value?.products) {
//     products.value = data.value.products
//   }
// })
const {data: tempData} = await useProductStore().index(props.query, props.fetchOptions)

watch(tempData, (v) => {
  if(v?.products?.data) {
    products.value = v.products.data
  }
}, {
  immediate: true,
  deep: true
})

const productCard = resolveComponent('ProductCard')
</script>

<style src="./products.scss" lang="scss" scoped></style>

<template>
  <section v-if="products && products.length" class="main-section">
    <div class="section-title">{{ title }}</div>

    <div>
      <section-snap-slider
        :items="products"
        :component="productCard"
        :gutter="0"
        :options="options"
        :title="$t('button.view_all')"
        :link="link"
        item-data-name="item"
      >
      </section-snap-slider>
    </div>
  </section>
</template>