<script setup>
import {useSearchStore} from '~/store/search'

const {t} = useI18n()
const route = useRoute()

const searchInput = ref(null)

const isServer = process.server

// Breadcrumbs
const breadcrumbs = ref(null)

// COMPUTEDS
const search = computed(() => {
  return route.query.q
})

const query = computed(() => {
  return {
    q: search.value,
    page: Number(route.query.page) || 1,
    order: route.query.order || undefined,
    dir: route.query.dir || undefined
  }
})

const sortingsOptions = computed(() => {
  return [
    {
      by: 'default',
      dir: 'default',
      caption: t('label.sorting.default')
    }, {
      by: 'price',
      dir: 'asc',
      caption: t('label.sorting.price_asc')
    }, {
      by: 'price',
      dir: 'desc',
      caption: t('label.sorting.price_desc')
    }
  ];
})

// METHODS
const setCrumbs = (title) => {
  breadcrumbs.value = [
    {
      name: t('title.home'),
      item: '/'
    },{
      name: title,
      item: '/search'
    }
  ]
}

const loadSearch = async () => {
  if(!query.value.q?.length) {
    return {
      data: [],
      meta: {}
    }
  }

  const response = await useSearchStore().index(query.value, 'small')
  
  // Преобразуем meta из формата Meilisearch в формат Laravel
  const meilisearchMeta = response?.meta || {}
  const transformedMeta = {
    current_page: meilisearchMeta.page || 1,
    per_page: meilisearchMeta.per_page || 20,
    total: meilisearchMeta.total || 0,
    last_page: meilisearchMeta.total && meilisearchMeta.per_page 
      ? Math.ceil(meilisearchMeta.total / meilisearchMeta.per_page) 
      : 1,
    has_more: meilisearchMeta.has_more || false
  }
  
  return {
    data: response?.data || [],
    meta: transformedMeta
  }
}

// Loader products
const {
  data: searchResults,
  pending: searchPending,
  error: searchError,
  refresh
} = await useAsyncData(
  'search-' + searchInput.value,
  async () => {
    const response = await loadSearch();
    return {
      products: response
    }
  }, {
    lazy: !isServer,
    server: true
  }
);

const loadProductsAndMerge = async (page) => {
  try {
    const currentMeta = searchResults.value?.products?.meta;
    
    if (!currentMeta) {
      return;
    }

    const pageToLoad = page ?? (Number(currentMeta.current_page) || 1) + 1;

    if (currentMeta.last_page && pageToLoad > currentMeta.last_page) {
      return;
    }

    const params = {
      ...query.value,
      page: pageToLoad
    };

    if(!params.q?.length) {
      return;
    }

    const response = await useSearchStore().index(params, 'small');
    const newProducts = response?.data || [];
    
    // Преобразуем meta из формата Meilisearch в формат Laravel
    const meilisearchMeta = response?.meta || {}
    const transformedMeta = {
      current_page: meilisearchMeta.page || pageToLoad,
      per_page: meilisearchMeta.per_page || 20,
      total: meilisearchMeta.total || 0,
      last_page: meilisearchMeta.total && meilisearchMeta.per_page 
        ? Math.ceil(meilisearchMeta.total / meilisearchMeta.per_page) 
        : 1,
      has_more: meilisearchMeta.has_more || false
    }

    searchResults.value = {
      products: {
        data: [
          ...(searchResults.value?.products?.data || []),
          ...newProducts
        ],
        meta: transformedMeta
      }
    };
  } catch (error) {
    console.error('Error loading more products:', error);
  }
};

// HANDLERS
const searchHandler = () => {
  useRouter().push({
    query: {
      q: searchInput.value
    }
  })
}

// WATCH
watch(search, (v) => {
  searchInput.value = v
  if(v) {
    setCrumbs(t('title.search_results') + ` «${v}»`)
  }else {
    setCrumbs(t('title.search'))
  }
}, {
  immediate: true
})

// Watch for query changes (page, sorting, search query)
watch(
  () => [route.query.q, route.query.page, route.query.order, route.query.dir],
  (newVal, oldVal) => {
    // Проверяем что query действительно изменился
    if (JSON.stringify(newVal) !== JSON.stringify(oldVal)) {
      refresh()
    }
  }
)

// Clear only active filters state (not URL) when entering search page
const {updateActiveFilters} = useFilter()
onMounted(() => {
  updateActiveFilters([])
})

// Set mobile Search
onBeforeMount(() => {
  useTransport().setData({mobileSearch: false})
})

onBeforeUnmount(() => {
  useTransport().setData({mobileSearch: true})
})
</script>

<style src="./search.scss" lang="scss" scoped></style>

<template>

<NuxtLayout
  name="catalog"
  :breadcrumbs="breadcrumbs"
  :products="searchResults?.products?.data || []"
  :products-meta="searchResults?.products?.meta || {}"
  :products-pending="searchPending"
  :refresh="refresh"
  :loadmore="loadProductsAndMerge"
  :sorting="sortingsOptions"
  no-filters
>
  <template #title>
    <template v-if="search">
      {{ t('title.search_results') }} «<span class="title-search">{{ search }}</span>»
    </template>
    <template v-else>
      {{ t('title.search') }}
    </template>
  </template>

  <template #header>
    <div class="container">
      <simple-search
        v-model="searchInput"
        @keyup.enter="searchHandler"
        @btn:click="searchHandler"
        :is-close-btn="false"
        class="simple-search"
      ></simple-search>
    </div>
  </template>
</NuxtLayout>
</template>