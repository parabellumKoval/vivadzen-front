<script setup>
// import {useFilter} from '~/composables/product/useFilter.ts'
// import {useFilterItem} from '~/composables/product/useFilterItem.ts'
// import {useCatalog} from '~/composables/product/useCatalog.ts'
import {useProductStore} from '~/store/product'

const props = defineProps({
  slug: {
    type: String,
    default: null
  },
  attributes: {
    type: Array,
    default: []
  },
  breadcrumbs: {
    type: Array
  },
  initQuery: {
    type: Object
  }
})

const {t} = useI18n()
const route = useRoute()

const {prepareAttrs} = useFilter()
const {getProducts} = useCatalog()
const {updateModelValue} = useFilterItem()

// Brands
const brands = ref([])

// Filters
const filtersMeta = ref(null)
const filtersMetaInit = ref(null)

// Products
const products = ref([])
const meta = ref(null)

// Query
const queryObject = ref({
  order: null,
  filters: null,
  brands: null,
  price: null,
  selections: null,
  page: 1
})

// const pending = ref(true)

// COMPUTED
const query = computed(() => {
  let query = {
    per_page: 20,
    page: queryObject.value.page || 1
  }

  if(queryObject.value.brands) {
    query.brands = queryObject.value.brands
  }

  if(queryObject.value.selections) {
    query.selections = queryObject.value.selections
  }

  if(queryObject.value.filters) {
    query.attrs = queryObject.value.filters
  }

  if(queryObject.value.price) {
    query.price = queryObject.value.price
  }

  if(queryObject.value.order) {
    query = {
      ...query,
      ...queryObject.value.order
    }
  }

  if(props.slug) {
    query.category_slug = props.slug
  }

  return query
})


// HANDLERS
const updateFiltersHandler = async (v) => {
  queryObject.value.page = 1;

  (
    {
      filters: queryObject.value.filters,
      brands: queryObject.value.brands,
      selections: queryObject.value.selections,
      price: queryObject.value.price,
    } = prepareAttrs(v)
  );

  await updateQueryHandler()
}

const updateOrderHandler = (v) => {
  queryObject.value.order = v;
  updateQueryHandler()
}

const updatePageHandler = (v, loadmore) => {
  queryObject.value.page = v;
  updateQueryHandler(loadmore)
}

const updateQueryHandler = async (loadmore = false) => {
  pending.value = true;

  if(loadmore)
  {
    await getProducts(query.value).then((response) => {
      console.log('response', response.products, response.meta, response.filters);
      
      products.value = products.value.concat(response.products)
      meta.value = response.meta
    }).finally(() => {
      pending.value = false
    })
  }
  else 
  {

    ({
      products: products.value,
      meta: meta.value,
      filters: filtersMeta.value
    } = await getProducts(query.value).finally(() => {
      pending.value = false
    }))

  }
}

// HOOKS
const {pending, data: tempData} = await useAsyncData(() => useProductStore().index(props.initQuery));

watch(tempData, (data) => {
  if(data?.products) {
    products.value = data.products
  }

  if(data?.meta) {
    meta.value = data.meta
  }

  if(data?.filters) {
    filtersMetaInit.value = data.filters
  }
}, {
  immediate: true
})


// WATCH

watch(() => props.slug, () => {
  updateModelValue([])
})

watch(() => meta.value, (v) => {
  if(!v) {
    return
  }

  if(v?.current_page === 1){
    useRouter().replace({query: {selections: route.query.selections}})
  }else {
    useRouter().replace({query: {page: v.current_page, selections: route.query.selections} })
  }
}, {
  deep: true
})
</script>

<template>
  <NuxtLayout
    name="catalog"
    :breadcrumbs="breadcrumbs"
    :brands="brands"
    :filters="attributes"
    :filters-meta="filtersMeta"
    :filters-meta-init="filtersMetaInit"
    :products="products"
    :meta="meta"
    :pending="pending"
    :updateFiltersCallback = "updateFiltersHandler"
    :updateOrderCallback = "updateOrderHandler"
    :updatePageCallback = "updatePageHandler"
  >

    <template #header>
      <slot name="header" />
    </template>

    <template #title>
      <slot name="title" />
    </template>

    <template #footer> 
      <slot name="footer" />
    </template>

  </NuxtLayout>
</template>