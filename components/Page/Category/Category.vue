<script setup>
import {useCategoryStore} from '~/store/category'

const {loadCatalog, setFiltersAndCount, catalogQuery, setMode, loadMore} = useCatalog()

const isServer = process.server

const {t, locale} = useI18n()
const route = useRoute()
const {region} = useRegion()
const categoryStore = useCategoryStore()

// Attributes
const breadcrumbs = ref([])

// COMPUTED
const slug = computed(() => {
  return route.path.substring(route.path.lastIndexOf('/') + 1) || null 
})

const catalogCategories = computed(() => categoryStore.list || [])

const findCategoryInTree = (nodes, targetSlug, parent = null) => {
  if (!Array.isArray(nodes) || !targetSlug) {
    return null
  }

  for (const node of nodes) {
    if (!node) {
      continue
    }

    if (node.slug === targetSlug) {
      return {node, parent}
    }

    if (Array.isArray(node.children) && node.children.length) {
      const found = findCategoryInTree(node.children, targetSlug, node)
      if (found) {
        return found
      }
    }
  }

  return null
}


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

const loadProductsAndMerge = async (page) => {
  if (!catalog.value) {
    return;
  }

  const response = await loadMore(catalog.value, page, {
    category_slug: slug.value,
  });
  if (response) {
    catalog.value = response;
  }
};

const {
  data: category,
  pending: categoryPending,
  error: categoryError,
} = await useAsyncData(
  'category-' + slug.value + '-' + region.value + '-' + locale.value,
  async () => {
    const response = await categoryStore.showCached(slug.value)
    const data = response.data

    console.log('category-' + slug.value + '-' + region.value + '-' + locale.value, data)

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

const displayCategories = computed(() => {
  const currentCategory = category.value?.category
  const directChildren = Array.isArray(currentCategory?.children) ? currentCategory.children : []
  if (directChildren.length) {
    return directChildren
  }

  const allCategories = catalogCategories.value
  if (!allCategories?.length) {
    return []
  }

  const lookupSlug = currentCategory?.slug || slug.value
  const found = lookupSlug ? findCategoryInTree(allCategories, lookupSlug) : null

  if (Array.isArray(found?.node?.children) && found.node.children.length) {
    return found.node.children
  }

  if (Array.isArray(found?.parent?.children) && found.parent.children.length) {
    return found.parent.children
  }

  return allCategories
})

const categoriesBackLink = computed(() => {
  const currentSlug = category.value?.category?.slug || slug.value
  if (!currentSlug || currentSlug === 'catalog') {
    return null
  }

  const allCategories = catalogCategories.value
  if (allCategories?.length) {
    const found = findCategoryInTree(allCategories, currentSlug)
    if (found?.parent?.slug) {
      return `/${found.parent.slug}`
    }
  }

  return '/catalog'
})

const currentPageNumber = computed(() => {
  const metaPage = catalog.value?.products?.meta?.current_page ?? 1;
  const queryPage = catalogQuery.value.page ?? 1;
  return Math.max(Number(metaPage) || 1, Number(queryPage) || 1, 1);
});

const title = computed(() => {
  const baseTitle = category.value?.category?.seo?.h1 || category.value?.category?.name || t('title.catalog');
  const pageSuffix = currentPageNumber.value > 1 ? ', ' + t('label.page', {page: currentPageNumber.value}) : '';
  return `${baseTitle}${pageSuffix}`;
});


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

const extractCategoryTrail = (category) => {
  if (!category) {
    return []
  }

  if (Array.isArray(category.parent) && category.parent.length) {
    return [...category.parent]
      .reverse()
      .map((node) => ({
        name: node?.name || '',
        slug: node?.slug || ''
      }))
      .filter((node) => node.slug)
  }
}

const setCrumbs = (v) => {
  const categoryTrail = (extractCategoryTrail(v) || []).map((node) => ({
    name: node.name,
    item: `/${node.slug}`
  }))

  breadcrumbs.value = [
    {
      name: t('title.home'),
      item: '/'
    },
    {
      name: t('title.catalog'),
      item: '/catalog'
    },
    ...categoryTrail
  ]
}

watch(() => category.value?.category, (v) => {
  console.log('category changed:', v)
  if(v) {
    setCrumbs(v)
    setSeo(v)
  }
}, {
    immediate: true,
    deep: true
})

setMode('INITIAL')
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

    <template #header="{ stuck }">
      <lazy-catalog-categories
        v-if="displayCategories.length"
        :categories="displayCategories"
        :stuck="stuck"
        :back-link="categoriesBackLink"
        class="full-container"
      ></lazy-catalog-categories>
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
