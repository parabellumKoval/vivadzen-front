<script setup>
import { useProductStore } from '~/store/product'

const props = defineProps({
  title: {
    type: String,
    default: "Products"
  },
  listId: {
    type: String,
    default: ''
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

const options = ref({
  card: {
    width: {
      mobile: '180px',
      desktop: '285px'
    }
  }
})

const isServer = process.server
const { data: products, pending} = await useAsyncData(
  'products-main-' + props.title,
  async () => {
    const response = await useProductStore().list(props.query, 'product')
    console.log(response)
    // return response.data.value.products.data
  },{
    lazy: !isServer,
    server: true,
  }
)

const productCard = resolveComponent('ProductCard')
const productCardSkeleton = resolveComponent('ProductCardSkeleton')

const skeletonItems = Array.from({ length: 12 }, (_, i) => ({ id: 'skeleton-' + i }))

watch(products, (newProducts) => {
  if (newProducts && newProducts.length > 0) {
    useGoogleEvent().setEvent('ViewItemList', {name: props.title, id: props.listId, products: newProducts})
  }
}, { immediate: true })

// Provide list Data
provide('list', {id: props.listId, name: props.title}); 
</script>

<style src="./products.scss" lang="scss" scoped></style>

<template>
  <section class="main-section">
    <div class="section-title">{{ title }}</div>

    <div>
      <section-snap-slider
        :items="pending ? skeletonItems : products"
        :component="pending ? productCardSkeleton : productCard"
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