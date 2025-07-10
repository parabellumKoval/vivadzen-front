<script setup>
import {useCatalog} from '~/composables/product/useCatalog.ts'
const {t} = useI18n()

const { scrollToAnchor } = useAnchorScroll({
  toAnchor: {
    scrollOptions: {
      behavior: 'smooth',
      offsetTop: -90,
    }
  },
})

const route = useRoute()

const props = defineProps({
  title: {
    type: String,
    default: ''
  },
  breadcrumbs: {
    type: Array,
    default: []
  },
  filterOptions: {
    type: Array,
    default: []
  },
  filters: {
    type: Array,
    default: []
  },
  filtersMeta: {
    type: Object,
    default: null
  },
  filtersPending: {
    type: Boolean,
    default: false
  },
  products: {
    type: Array,
    default: []
  },
  productsMeta: {
    type: Object,
    default: {}
  },
  productsPending: {
    type: Boolean,
    default: false
  },
  sorting: {
    type: Object,
    default: []
  },
  noFilters: {
    type: Boolean,
    default: false
  },
  refresh: {
    type: Promise,
    default: null
  },
  loadmore: {
    type: Function,
    default: null
  },
})

const emit = defineEmits(['update:mode'])

const {setQuery, setMode, loadFilters} = useCatalog()

// COMPUTED
const filtersData = computed(() => {
  return {
    'filters': props.filters,
    'meta': props.filtersMeta,
  }
})

// METHODS
const beforeFilterSetToUrl = () => {
  setMode('FILTER')
}

const { addOrUpdateQueryParams } = useLazyComposable(
  'useQuerySingleton',
  ['addOrUpdateQueryParams'],
  {beforeUpdateCallback: beforeFilterSetToUrl}
);

const {activeFilters, activeAttrs, initFiltersFromUrl} = useFilter()

// HANDLERS
const scrollHandler = (item) => {
  nextTick(() => {
    scrollToAnchor(item)
  });
}

const updateOrderHandler = (v) => {
  scrollHandler('title')
  setMode('PAGINATION')
  addOrUpdateQueryParams.value({...v}, true, false)
}

const updatePageHandler = (v) => {
  scrollHandler('title')
  setMode('PAGINATION')
  addOrUpdateQueryParams.value({page: v}, true, false, false)
}

const updatePageMoreHandler = () => {
  props.loadmore()
}

const updateSelected = () => {
  props.refresh()
}


// WATCHERS
watch(() => route.query, (newQuery, oldQuery) => {
  const queryChanged = JSON.stringify(newQuery) !== JSON.stringify(oldQuery);

  if (queryChanged ) {
    updateSelected()
  }
}, {
  deep: true
})

// When new catalog page is loaded or switched to new catalog page
watch(() => route.path, (v) => {
  // console.log('Catalog page changed:', v)
  // reset mode
  setMode('INITIAL')

  // initialize filters from URL query params
  initFiltersFromUrl()
}, {
  immediate: true
})

//
watch(() => props.products, (list) => {
  if (list && list.length > 0) {
    useGoogleEvent().setEvent('ViewItemList', {name: props.title, id: route.fullPath, products: list})
  }
}, { immediate: true })
</script>

<style src="~/assets/scss/layout-catalog.scss" lang="scss" scoped></style>

<template>
  <div class="page-base">
    <div class="container">
      <the-breadcrumbs :crumbs="breadcrumbs"></the-breadcrumbs>

      <h1 id="title" class="title-common">
        <!-- SLOT TITLE HERE -->
        <slot name="title" />
      </h1>
    </div>

    <transition name="fade-in">
      <div v-if="activeAttrs?.length && !filtersPending" class="selected">
        <div class="container">
          <lazy-filter-selected :filters="filters"></lazy-filter-selected>
        </div>
      </div>
    </transition>

    <!-- SLOT HEADER HERE -->
    <slot name="header"></slot>

    <div class="container">
      <div :class="{'no-filters': noFilters}" class="header">
        <div v-if="!noFilters" class="header-title">
          {{ t('label.filters') }}
        </div>

        <div class="header-desc">
          {{ t('messages.products_found', {amount: (productsMeta?.total || 0)}) }}
        </div>

        <div v-if="productsMeta?.total" class="header-actions">
          <catalog-sort-btn :sortings="sorting" @update="updateOrderHandler"></catalog-sort-btn>
        </div>

      </div>
    </div>

    <div :class="{'no-filters': noFilters}" class="content full-container">
      <!-- All filters -->
      <lazy-filter-list
        v-if="$device.isDesktop && filters && !noFilters"
        :filters="filters"
        :meta="filtersMeta"
        :class="{pending: productsPending}"
        class="filters"
      ></lazy-filter-list> 

      <!-- Products list -->
      <div v-if="!productsPending && !products.length" class="content-empty">
        <div class="content-empty-message">{{ t('messages.no_catalog_results')}}</div>
      </div>
      <div v-else class="content-grid">
          <template v-if="productsPending">
            <product-card-skeleton
              v-for="i in 20"
              :key="i"
            ></product-card-skeleton>
          </template>
          <template v-else>
            <transition-group name="fade-in">
              <lazy-product-card
                v-for="(product, index) in products"
                :key="product.id"
                :item="product"
                :index="index"
                class="content-grid-item"
              ></lazy-product-card>
            </transition-group>
          </template>
      </div>
    </div>

    <div v-if="productsMeta" class="container">
      <div :class="{'no-filters': noFilters}" class="content">
        <div></div>
        <div>
          <!-- Pagination -->
          <div class="pagination">
            <lazy-simple-pagination
              v-if="productsMeta.total >= productsMeta.per_page"
              :total="productsMeta.last_page"
              :current="productsMeta.current_page"
              @update:current="updatePageHandler"
            ></lazy-simple-pagination>

            <lazy-simple-pagination-more
              v-if="productsMeta.total >= productsMeta.per_page && productsMeta.last_page !== productsMeta.current_page"
              :total="productsMeta.last_page"
              :current="productsMeta.current_page"
              @update:current="updatePageMoreHandler"
            ></lazy-simple-pagination-more>
          </div>

          <!-- SLOT FOOTER HERE -->
          <slot name="footer" />

        </div>
      </div>
    </div>

    <lazy-filter-mobile-buttons
      v-if="$device.isMobile && filters && !noFilters"
      :sortings="sorting"
      :data="filtersData"
      :update-order-callback="updateOrderHandler"
    ></lazy-filter-mobile-buttons>

  </div>
</template>