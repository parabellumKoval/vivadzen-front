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
  categoryData: {
    type: Object,
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

const {prepareAttrs, prepareFilters} = useFilter()
const {getProducts} = useCatalog()
const {updateModelValue} = useFilterItem()

const blockProductsUpdate = ref(true)

// Brands
const brands = ref([])

// Filters
const filtersMeta = ref(null)
const filtersMetaInit = ref(null)

// Products
const products = ref([])
const meta = ref(null)

// Attributes
const attributesData = ref(null)

// Query
const queryObject = ref({
  order: null,
  filters: null,
  brands: null,
  price: null,
  selections: null,
  page: 1
})

const pending = ref(false)

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

  if(!blockProductsUpdate.value) {
    await updateQueryHandler()
  }
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

// METHODS
const tempData = ref(null)

const setInitData = async () => {
  if(props.categoryData) {
    products.value = props.categoryData.products.data
    meta.value = props.categoryData.products.meta
    filtersMetaInit.value = props.categoryData.filters
    // brands.value = props.categoryData.brands
    attributesData.value = prepareFilters(props.categoryData.attributes, props.categoryData.brands)
  }else {
    ({data: tempData.value} = await useProductStore().index(props.initQuery));
    attributesData.value = props.attributes
  }
}

// HOOKS
// const {pending, data: tempData} = await useAsyncData(() => useProductStore().index(props.initQuery));
// const {pending, data: tempData} = await useProductStore().index(props.initQuery)

watch(tempData, (data) => {
  if(!data) {
    return
  }

  if(data?.value?.products?.data) {
    products.value = data.value.products.data
  }

  if(data?.value?.products?.meta) {
    meta.value = data.value.products.meta
  }

  if(data?.value?.filters) {
    filtersMetaInit.value = data.value.filters
  }
}, {
  immediate: true
})


await setInitData()


// WATCH
// watch(() => props.slug, (v) => {
//   updateModelValue([])
// }, {
//   immediate: true,
//   deep: true
// })

onMounted(() => {
  blockProductsUpdate.value = false
})

onBeforeUnmount(() => {
  updateModelValue([])
  blockProductsUpdate.value = true
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
    :filters="attributesData"
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