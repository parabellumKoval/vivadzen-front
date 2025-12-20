<script setup>
import {useCategoryStore} from '~/store/category'

const {loadCatalog, setFiltersAndCount, catalogQuery, setMode, loadMore} = useCatalog()

const isServer = process.server

const {t, locale} = useI18n()
const route = useRoute()
const {region} = useRegion()
const categoryStore = useCategoryStore()
const { setHreflangRegions, clearHreflangRegions } = useHreflang()
const { $regionPath } = useNuxtApp()

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

    throw createError({ statusCode: 404, statusMessage: 'Category Not Found', fatal: true })

  },
  {
    lazy: !isServer,
    server: true,
  }
)

const getCatalogRedirectPath = () => (typeof $regionPath === 'function' ? $regionPath('/catalog') : '/catalog')

const redirectToCatalog = async () => {
  const target = getCatalogRedirectPath()
  if (process.server) {
    return await navigateTo(target, { redirectCode: 302 })
  }
  return navigateTo(target, { replace: true })
}

const propagateCategoryError = async (err) => {
  if (!err) {
    return
  }

  const statusCode = err.statusCode || err.status || err?.response?.status || 404

  if (statusCode === 404) {
    await redirectToCatalog()
    return
  }

  const payload = {
    statusCode,
    statusMessage: err.statusMessage || err.message || 'Category Not Found',
    fatal: true
  }

  if (process.server) {
    throw createError(payload)
  }

  showError(payload)
}

await propagateCategoryError(categoryError.value)

if (process.client) {
  watch(categoryError, async (err) => {
    if (err) {
      await propagateCategoryError(err)
    }
  })
}

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


const buildSeoValue = (templateKey, suffixKey, params) => {
  const template = t(templateKey, params) || ''
  const suffix = t(suffixKey) || ''
  if (template && suffix) {
    return `${template} | ${suffix}`
  }
  return template || suffix
}

const setSeo = (v) => {
  const templateParams = { category: v?.name }
  const defaultTitle = buildSeoValue('seo_title_template', 'seo_title_suffix', templateParams)
  const defaultDescription = buildSeoValue('seo_desc_template', 'seo_desc_suffix', templateParams)
  console.log('Setting SEO for category:', v, v?.seo?.meta_title, defaultTitle, defaultDescription)

  useHead({
    title: v?.seo?.meta_title || defaultTitle,
    meta: [
      {
        name: 'description',
        content: v?.seo?.meta_description || defaultDescription
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
  if(v) {
    setCrumbs(v)
    setSeo(v)
  }
}, {
    immediate: true,
    deep: true
})

watch(() => category.value?.category?.available_regions, (regions) => {
  if (Array.isArray(regions) && regions.length) {
    setHreflangRegions(regions)
  } else {
    setHreflangRegions(null)
  }
}, {
  immediate: true
})

onBeforeUnmount(() => {
  clearHreflangRegions()
})

setMode('INITIAL')
</script>

<style src="./category.scss" lang="scss" scoped></style>
<i18n src="./lang.yaml" lang="yaml"></i18n>

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
