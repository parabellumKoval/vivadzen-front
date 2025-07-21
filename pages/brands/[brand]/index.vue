<script setup>
import {useBrandStore} from '~/store/brand'

const {t} = useI18n()
const route = useRoute()

const {loadCatalog, setFiltersAndCount, loadMore, catalogQuery, setMode} = useCatalog()

// REFS
const isServer = process.server
const loadingAmount = ref(0);

// Brand
const brand = ref(null)

const breadcrumbs = ref([])

// COMPUTEDS
const slug = ref(route?.params?.brand) || null

const title = computed(() => {
  let page = catalogQuery.value.page > 1? ', ' + t('label.page', {page: catalogQuery.value.page}): ''
  let title = brand?.seo?.h1 || t('company_prod') + ' ' + brand.value?.name
  return  title + page
})

// METHODS
setFiltersAndCount(['selections', 'price']);

// Loader products
const {
  data: catalog,
  pending: catalogPending,
  error: catalogError,
  refresh
} = await useAsyncData(
  'product-brand-' + slug.value,
  async () => {
    const response = await loadCatalog({brand_slug: slug.value});
    
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
  loadingAmount.value += 1;
  const response = await loadMore(catalog.value);
  if (response) {
    catalog.value = response
  }
}

const setSeo = () => {
  useHead({
    title: brand.value?.seo?.meta_title || t('seo_title_template', {brand: brand.value?.name}),
    meta: [
      {
        name: 'description',
        content: brand.value?.seo?.meta_description || t('seo_desc_template', {brand: brand.value?.name})
      },
    ],
  })
}

const setCrumbs = () => {
  breadcrumbs.value = [
    {
      name: t('title.home'),
      item: '/'
    },{
      name: t('title.brands'),
      item: '/brands'
    },{
      name: brand.value?.name,
      item: `/brands/${brand.value?.slug}`
    }
  ]
}


// HANDLERS

// WATCHERS

// HOOKS
await useAsyncData(`brand-${slug.value}`, () => useBrandStore().show(slug.value)).then(({data}) => {
  if(data.value) {
    brand.value = data.value
    setCrumbs()
  }
});

setSeo()

setMode('INITIAL')
</script>

<style src='./brand.scss' lang='scss' scoped></style>
<i18n src='./lang.yaml' lang='yaml'></i18n>

<template>
  <NuxtLayout
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
      {{title }}
    </template>

    <template #header>
      <div v-if="brand?.content || brand?.image" class="container">
        <div class="brand-content">
          <div></div>
          <catalog-brand :item="brand"></catalog-brand>
        </div>
      </div>
    </template>
  </NuxtLayout>
</template>