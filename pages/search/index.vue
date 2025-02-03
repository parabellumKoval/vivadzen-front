<script setup>
import {useSearchStore} from '~/store/search'

const {t} = useI18n()
const route = useRoute()

const searchInput = ref(null)

const query = ref({
  page: 1
})

// Filters
const filters = ref(null)

// Products
const products = ref(null)
const meta = ref(null)

// Categories
const categories = ref([])

// Brands
const brands = ref([])

const pending = ref(false)
const isLoading = ref(true)

// Breadcrumbs
const breadcrumbs = ref(null)

// COMPUTEDS
const search = computed(() => {
  return route.query.q
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

const fetchSearch = async (search, query = {}, loadmore = false) => {

  const params = {
    search: search,
    ...query
  }

  if(!params.search?.length) {
    return
  }

  isLoading.value = true

  await useAsyncData('search', () => useSearchStore().index(params)).then(({data, error}) => {
    if(data?.value?.products?.data) {
      if(loadmore) {
        products.value = products.value.concat(data.value.products.data)
      }else {
        products.value = data.value.products.data
      }

      meta.value = data.value.products.meta || null
    }

  }).finally(() => {
    isLoading.value = false
  })
}

// HANDLERS
const searchHandler = () => {
  useRouter().replace({
    query: {
      q: searchInput.value
    }
  })
}

const updateOrderHandler = (v) => {
  query.value = {
    ...query.value,
    ...v
  }

  fetchSearch(searchInput.value, query.value)
}

const updatePageHandler = (v, loadmore = false) => {
  query.value.page = v

  fetchSearch(searchInput.value, query.value, loadmore)
}

// WATCH
watch(search, (v) => {
  searchInput.value = v
  if(v) {
    setCrumbs(t('title.search_results') + ` «${v}»`)
    fetchSearch(v)
  }else {
    setCrumbs(t('title.search'))
  }
}, {
  immediate: true
})

await fetchSearch(search.value)


// Set mobile Search
onBeforeMount(() => {
  useTransport().setData({mobileSearch: false})
})

onBeforeUnmount(() => {
  ////
  useTransport().setData({mobileSearch: true})
})
</script>

<style src="./search.scss" lang="scss" scoped></style>

<template>

<NuxtLayout
  name="catalog"
  :breadcrumbs="breadcrumbs"
  :products="products"
  :meta="meta"
  :updateOrderCallback = "updateOrderHandler"
  :updatePageCallback = "updatePageHandler"
  :sortings="sortingsOptions"
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