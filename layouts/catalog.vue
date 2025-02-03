<script setup>
// import {useFilterItem} from '~/composables/product/useFilterItem.ts'
// import {useSort} from '~/composables/product/useSort.ts'

const {t} = useI18n()

const { scrollToAnchor } = useAnchorScroll({
  toAnchor: {
    scrollOptions: {
      behavior: 'smooth',
      offsetTop: -90,
    }
  },
})

const props = defineProps({
  breadcrumbs: {
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
  filtersMetaInit: {
    type: Object,
    default: null
  },
  products: {
    type: Array,
    default: []
  },
  meta: {
    type: Object,
    default: {}
  },
  pending: {
    type: Boolean,
    default: false
  },
  noFilters: {
    type: Boolean,
    default: false
  },
  updateFiltersCallback: {
    default: null
  },
  updateOrderCallback: {
    default: null
  },
  updatePageCallback: {
    default: null
  },
  sortings: {
    default: null
  }
})

const {modelValue, updateModelValue} = useFilterItem()

const {options: useSortOptions} = useSort()
const sortSelectedIndex = ref(0)
const sort = ref({order_by: 'created_at', order_dir: 'desc'})

const router = useRouter()
const route = useRoute()

// COMPUTED
const sortingOptions = computed(() => {
  if(props.sortings) {
    return props.sortings
  }else {
    return useSortOptions.value
  }
})

const filtersData = computed(() => {
  return {
    'filters': props.filters,
    'meta': props.filtersMeta,
    'metaInit': props.filtersMetaInit
  }
})

// WATCH
watch(sortSelectedIndex, (v) => {
  if(sortingOptions.value[v]) {
    sort.value = {
      order_by: sortingOptions.value[v].by,
      order_dir: sortingOptions.value[v].dir
    }

    scrollHandler('title')

    if(props.updateOrderCallback) {
      props.updateOrderCallback(sort.value)
    }
  }
})

// HANDLERS
const scrollHandler = (item) => {
  nextTick(() => {
    scrollToAnchor(item)
  });
}

const updatePageHandler = (v) => {
  scrollHandler('title')

  if(props.updatePageCallback) {
    props.updatePageCallback(v)
  }
}

const updatePageMoreHandler = (v) => {
  if(props.updatePageCallback) {
    props.updatePageCallback(v, true)
  }
}

const updateSelected = (v) => {
  let values = []
  
  if(v.length) {
    // remove filters with empty values
    values = v.filter((item) => {
      if(item.values === undefined || !item.values)
        return true
      
      if(Array.isArray(item.values)){
        return item.values.length? true: false
      }else {
        return true
      }
    })
  }

  if(props.updateFiltersCallback) {
    props.updateFiltersCallback(values)
  }
}

// METHODS
// WATCHERS
watch(() => modelValue.value, (v) => {
  updateSelected(v)
}, {
  deep: true
})
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
      <div v-if="modelValue?.length" class="selected">
        <div class="container">
          <lazy-filter-selected :filters="filters"></lazy-filter-selected>
        </div>
      </div>
    </transition>

    <!-- SLOT HEADER HERE -->
    <slot name="header"></slot>

    <div class="container">
      <div :class="{'no-filters': noFilters}" class="header">
        <div v-if="meta?.total && !noFilters" class="header-title">
          {{ t('label.filters') }}
        </div>

        <div class="header-desc">
          {{ t('messages.products_found', {amount: (meta?.total || 0)}) }}
        </div>

        <div v-if="meta?.total" class="header-actions">
          <div class="sorting-wrapper">
            <button class="button mini light sorting-btn">
              <IconCSS name="iconoir:sort-down" class="inline-icon"></IconCSS>
              <span>{{ sortingOptions[sortSelectedIndex].caption }}</span>
            </button>
            <select v-model="sortSelectedIndex" class="sorting-select">
              <option
                v-for="(srt, key) in sortingOptions" 
                :key="key"
                :value="key"
              >
                {{ srt.caption }}
              </option>
            </select>
          </div>
        </div>

      </div>
    </div>

    <div :class="{'no-filters': noFilters}" class="content full-container">
      <!-- All filters -->
      <lazy-filter-list
        v-if="$device.isDesktop && filters && !noFilters && meta?.total"
        :filters="filters"
        :meta="filtersMeta"
        :meta-init="filtersMetaInit"
        :class="{pending: pending}"
        class="filters"
      ></lazy-filter-list> 

      <!-- Products list -->
      <div class="content-grid">
          <template v-if="pending">
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

    <div v-if="meta" class="container">
      <div :class="{'no-filters': noFilters}" class="content">
        <div></div>
        <div>
          <!-- Pagination -->
          <div class="pagination">
            <lazy-simple-pagination
              v-if="meta.total >= meta.per_page"
              :total="meta.last_page"
              :current="meta.current_page"
              @update:current="updatePageHandler"
            ></lazy-simple-pagination>

            <lazy-simple-pagination-more
              v-if="meta.total >= meta.per_page && meta.last_page !== meta.current_page"
              :total="meta.last_page"
              :current="meta.current_page"
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
      :data="filtersData"
      :update-order-callback="updateOrderCallback"
    ></lazy-filter-mobile-buttons>

  </div>
</template>