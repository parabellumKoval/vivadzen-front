<script setup>
import {useCategoryStore} from '~/store/category'

const {t} = useI18n()

const setCrumbs = () => {
  breadcrumbs.value = [
    {
      name: t('title.home'),
      item: '/'
    },{
      name: t('title.catalog'),
      item: '/catalog'
    }
  ]
}
const {loadCatalog, setFiltersAndCount, loadMore, catalogQuery, setMode} = useCatalog()


// REFS
const isServer = process.server
const breadcrumbs = ref([])

// COMPUTEDS
const categories = computed(() => {
  return useCategoryStore().list
})

const title = computed(() => {
  let page = catalogQuery.value.page > 1? ', ' + t('label.page', {page: catalogQuery.value.page}): ''
  return t('title.catalog') + page
})

// METHODS
setFiltersAndCount(['selections', 'brands', 'price'])

// Loader products
const {
  data: catalog,
  pending: catalogPending,
  error: catalogError,
  refresh
} = await useAsyncData(
  'product-catalog',
  async () => {
    const response = await loadCatalog();

    return {
      filters: {
        data: response.filters?.data || catalog?.value?.filters?.data || [],
        count: response.filters?.count || catalog?.value?.filters?.count || {}
      },
      products: response.products || { data: [], meta: {} },
      sorting: response.sorting || catalog?.value?.sorting || []
    }
  }, {
    lazy: !isServer,
    server: true,
  }
);


const loadProductsAndMerge = async () => {
  const response = await loadMore(catalog.value);
  if (response) {
    catalog.value = response
  }
}

setCrumbs()

setMode('INITIAL')
</script>

<template>
  <NuxtLayout
    v-if="!catalog?.products && catalogPending"
    name="catalog-skeleton"
    :categories="true"
  ></NuxtLayout>
  <NuxtLayout
    v-else
    name="catalog"
    :title="title"
    :products-pending="catalogPending"
    
    :products="catalog?.products?.data || []"
    :products-meta="catalog?.products?.meta || {}"

    :filters="catalog?.filters?.data || []"
    :filters-meta="catalog?.filters?.count || []"

    :sorting="catalog?.sorting || []"

    :breadcrumbs="breadcrumbs"
    :refresh="refresh"
    :loadmore="loadProductsAndMerge"
  >
    <template #title>
      {{ title }}
    </template>

    <template #header>
      <lazy-catalog-categories :categories="categories"  class="full-container"></lazy-catalog-categories>
    </template>
  </NuxtLayout>
</template>