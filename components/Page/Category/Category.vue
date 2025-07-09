<script setup>
import {useCategoryStore} from '~/store/category'

const {loadCatalog, setFiltersAndCount, catalogQuery} = useCatalog()

const isServer = process.server

const {t} = useI18n()
const route = useRoute()

// Attributes
const breadcrumbs = ref([])

// COMPUTED
const slug = computed(() => {
  return route.path.substring(route.path.lastIndexOf('/') + 1) || null 
})


const title = computed(() => {
  let page = catalogQuery.value.page > 1? ', ' + t('label.page', {page: catalogQuery.value.page}): ''
  let title = category.value?.category?.seo?.h1 || category.value?.category?.name
  return  title + page
})

// METHODS
setFiltersAndCount(['selections', 'brands', 'attributes', 'price']);

// Category loader
const {
  data: catalog,
  pending: catalogPending,
  error: catalogError,
  refresh
} = await useAsyncData(
  'product-category-' + slug.value,
  async () => {
    const response = await loadCatalog({category_slug: slug.value});
    
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

const {
  data: category,
  pending: categoryPending,
  error: categoryError,
} = await useAsyncData(
  'category-' + slug.value,
  async () => {
    const response = await useCategoryStore().showCached(slug.value)
    const data = response.data

    // console.log('useAsyncData Category data:', data)

    if (data) {
      return data
    }
    else throw createError({ statusCode: 404, message: 'Category Not Found' })

  },
  {
    lazy: !isServer,
    server: true,
  }
)


const setSeo = (v) => {
  useHead({
    title: v?.seo?.meta_title,
    meta: [
      {
        name: 'description',
        content: v?.seo?.meta_description
      },
    ],
  })
}

const setCrumbs = (v) => {
  breadcrumbs.value = []
  let cat = v

  // categories tree
  while(cat) {
    breadcrumbs.value.unshift({
      name: cat?.name,
      item: `/${cat?.slug}`     
    })

    cat = cat.parent
  }

  breadcrumbs.value.unshift({
    name: t('title.home'),
    item: '/'
  })
    
}

watch(() => category.value?.category, (v) => {
  if(v) {
    setCrumbs(v)
    setSeo(v)
  }
}, {
    immediate: true,
    deep: true
})

</script>

<style src="./category.scss" lang="scss" scoped></style>

<template>
  <NuxtLayout
    v-if="catalogPending && catalog?.products?.data?.length === 0"
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
      <lazy-catalog-categories v-if="category?.category?.children?.length" :categories="category.category.children" class="full-container"></lazy-catalog-categories>
    </template>
    
    <template v-if="!categoryPending" #footer>
      <lazy-catalog-reviews :slug="slug" :category-name="category?.category?.name" :reviews="category?.reviews" class="review-wrapper"></lazy-catalog-reviews>

      <lazy-catalog-text
        v-if="category?.category?.content"
        :content="category?.category.content"
        class="seo-text"
      ></lazy-catalog-text>

      <lazy-section-faq-catalog v-if="category" :category-data="category" class="faq-section"></lazy-section-faq-catalog>
    </template>
  </NuxtLayout>
</template>