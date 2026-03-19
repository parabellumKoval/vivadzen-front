<script setup>
import {useCategoryStore} from '~/store/category'

const {t, locale} = useI18n()
const {region} = useRegion()
const route = useRoute()
const { show: loadCampaignBySlug } = useCampaignApi()

const {loadCatalog, setFiltersAndCount, loadMore, catalogQuery, setMode} = useCatalog()

const categoryStore = useCategoryStore()

// REFS
const isServer = process.server
const campaignSlug = computed(() => {
  return typeof route.query.campaign === 'string' ? route.query.campaign : ''
})
const catalogDataKey = computed(() => {
  return 'product-catalog-' + region.value + '-' + locale.value + '-' + (campaignSlug.value || 'none')
})

// COMPUTEDS
const categories = computed(() => {
  return categoryStore.list
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
  () => catalogDataKey.value,
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

const { data: campaignData } = await useAsyncData(
  () => 'catalog-campaign-meta-' + region.value + '-' + locale.value + '-' + (campaignSlug.value || 'none'),
  async () => {
    if (!campaignSlug.value) {
      return null
    }

    return await loadCampaignBySlug(campaignSlug.value)
  },
  {
    lazy: !isServer,
    server: true
  }
)

const campaignLastKnown = ref(null)

watch(campaignSlug, (slug) => {
  if (!slug) {
    campaignLastKnown.value = null
  }
}, { immediate: true })

watch(() => campaignData.value, (value) => {
  if (campaignSlug.value && value) {
    campaignLastKnown.value = value
  }
}, { immediate: true })

const campaign = computed(() => {
  if (!campaignSlug.value) {
    return null
  }

  return campaignData.value || campaignLastKnown.value || null
})

const breadcrumbs = computed(() => {
  const items = [
    {
      name: t('title.home'),
      item: '/'
    },
    {
      name: t('title.catalog'),
      item: '/catalog'
    }
  ]

  if (campaign.value?.name) {
    items.push({
      name: campaign.value.name,
      item: route.fullPath
    })
  }

  return items
})

const currentPageNumber = computed(() => {
  const metaPage = catalog.value?.products?.meta?.current_page ?? 1;
  const queryPage = catalogQuery.value.page ?? 1;
  return Math.max(Number(metaPage) || 1, Number(queryPage) || 1, 1);
});

const title = computed(() => {
  const pageSuffix = currentPageNumber.value > 1 ? ', ' + t('label.page', {page: currentPageNumber.value}) : '';
  const baseTitle = campaign.value?.name || t('title.catalog')
  return baseTitle + pageSuffix;
});


const loadProductsAndMerge = async (page) => {
  try {
    const response = await loadMore(catalog.value, page);
    if (response) {
      catalog.value = response;
    }
  } catch (error) {
    console.error('Error loading more products:', error);
  }
};
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
    :campaign="campaign"
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

    <template #header="{ stuck }">
      <lazy-catalog-categories :categories="categories" :stuck="stuck" class="full-container"></lazy-catalog-categories>
    </template>
  </NuxtLayout>
</template>
