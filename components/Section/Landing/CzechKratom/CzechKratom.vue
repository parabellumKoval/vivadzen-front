<script setup lang="ts">
import ProductCartStatic from '~/components/Product/CartStatic/ProductCartStatic.vue'

const { t } = useI18n()
const { $regionPath } = useNuxtApp()

// REFS
const isServer = process.server

// USE CATALOG COMPOSABLE
const { loadCatalog, loadMore, setMode } = useCatalog()

// METHODS
const getInitialPerPage = () => {
  if (process.client) {
    const width = window.innerWidth
    if (width >= 2000) return 10 // 2 ряда по 5 карточек
    if (width >= 1200) return 8 // 2 ряда по 4 карточки
    return 8 // 4 ряда по 2 карточки на мобильном
  }
  return 10
}

// SET MODE
setMode('PAGINATION')

// LOAD INITIAL CATALOG WITH KRATOM CATEGORY
const { 
  data: catalog,
  pending: catalogPending,
  refresh
} = await useAsyncData(
  'czech-kratom-products',
  async () => {
    const perPage = getInitialPerPage()
    
    return await loadCatalog({
      with_products: true,
      per_page: perPage,
      page: 1,
      category_slug: 'kratom'
    })
  },
  {
    lazy: !isServer,
    server: true
  }
)

// COMPUTEDS
const products = computed(() => (catalog.value as any)?.products?.data || [])
const hasMorePages = computed(() => {
  const meta = (catalog.value as any)?.products?.meta
  return meta && meta.current_page < meta.last_page
})

const loadMoreHandler = async () => {
  if (hasMorePages.value && !catalogPending.value && catalog.value) {
    try {
      const newCatalog = await loadMore(catalog.value as any, undefined, { category_slug: 'kratom' })
      if (newCatalog) {
        catalog.value = newCatalog
      }
    } catch (error) {
      console.error('Error loading more products:', error)
    }
  }
}
</script>

<style src="./czech-kratom.scss" lang="scss" scoped></style>
<i18n src="./lang.yaml" lang="yaml"></i18n>

<template>
  <section class="czech-kratom">
    <div class="container">
      <div class="czech-kratom__header">
        <h2 class="czech-kratom__title">
          {{ t('title') }}
        </h2>
        <p class="czech-kratom__description">
          {{ t('description') }}
        </p>
      </div>

      <div v-if="!catalogPending && products.length" class="czech-kratom__grid">
        <div
          v-for="product in products"
          :key="product.id"
          class="czech-kratom__product"
        >
          <ProductCartStatic :item="product" />
        </div>
      </div>

      <div v-if="catalogPending" class="czech-kratom__loading">
        {{ t('loading') }}
      </div>

      <div v-if="hasMorePages && !catalogPending" class="czech-kratom__footer">
        <button
          @click="loadMoreHandler"
          class="button color-secondary czech-kratom__load-more"
        >
          {{ t('load_more') }}
        </button>
      </div>
    </div>

        <!-- src="/images/landing/stars-bg.jpg" -->
<!-- https://png.pngtree.com/background/20250111/original/pngtree-harness-the-fat-reducing-benefits-of-mitragyna-speciosa-kratom-leaves-textured-picture-image_13437977.jpg -->
    <div class="czech-kratom__bg-image-wrapper">
      <nuxt-img
        src="https://png.pngtree.com/background/20250111/original/pngtree-harness-the-fat-reducing-benefits-of-mitragyna-speciosa-kratom-leaves-textured-picture-image_13437977.jpg"
        width="3840"
        height="2160"
        quality="60"
        fit="contain"
        sizes="mobile: 50vw desktop: 2800px"
        class="czech-kratom__bg-image"
      />
    </div>
    
  </section>

  <section class="czech-kratom-catalog">
    <div class="container">
      <div class="czech-kratom-catalog__content">
        <div class="czech-kratom-catalog__text">
          <h2 class="czech-kratom-catalog__title">{{ t('catalog_title') }}</h2>
          <p class="czech-kratom-catalog__description">
            {{ t('catalog_description') }}
          </p>
        </div>
        <NuxtLink
          :to="$regionPath('/catalog')"
          class="button promo czech-kratom-catalog__button"
        >
          {{ t('catalog_button') }}
        </NuxtLink>
      </div>
    </div>
  </section>
</template>
