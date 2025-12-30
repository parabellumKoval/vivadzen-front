<script setup>
import { onUnmounted } from 'vue'
import { useSearchStore } from '~/store/search'
import { useSearchResultsStore } from '~/store/searchResults'
import { useBodyScrollLock } from '~/composables/useBodyScrollLock'
import { useIosViewportHeight } from '~/composables/useIosViewportHeight'

const { t } = useI18n()
const { $regionPath } = useNuxtApp()

const searchResultsStore = useSearchResultsStore()
const { disableScroll, enableScroll } = useBodyScrollLock()
const { viewportHeight } = useIosViewportHeight()

const categories = ref([])
const products = ref([])
const brands = ref([])
const meta = ref(null)

const timeout = ref(null)
const isLoading = ref(false)
const isShowLoading = ref(false)
const loadingTimeout = ref(null)

// COMPUTEDS
const history = computed(() => {
  return useSearchStore().getHistory
})

const isShow = computed(() => {
  return (products.value?.length || history.value?.length || searchResultsStore.searchQuery.length)
})

// Флаг, указывающий был ли хотя бы один поиск совершён
const wasSearched = computed(() => {
  return isLoading.value || isShowLoading.value || (searchResultsStore.searchQuery.length && (products.value?.length || (!products.value?.length && !timeout.value)))
})

const containerStyle = computed(() => {
  const height = viewportHeight.value
  if (!height) return undefined

  const mobileOffset = 90
  const desktopOffset = 100
  const mobileMaxHeight = Math.max(height - mobileOffset, 0)
  const desktopMaxHeight = Math.max(height - desktopOffset, 0)

  return {
    '--search-results-max-height': `${mobileMaxHeight}px`,
    '--search-results-max-height-desktop': `${desktopMaxHeight}px`,
  }
})

// METHODS
const search = async (search) => {
  timeout.value = null
  clearTimeout(loadingTimeout.value)
  isShowLoading.value = false

  const params = {
    q: search
  }

  if(!params.q?.length) {
    categories.value = null
    products.value = null
    return
  }

  isLoading.value = true

  // Показываем индикатор загрузки только если поиск длится более 500ms
  loadingTimeout.value = setTimeout(() => {
    isShowLoading.value = true
  }, 500)

  try {
    const result = await useSearchStore().livesearch(params)
    
    if(result?.data) {
      meta.value = result.meta
      products.value = result.data
    }
  } catch (error) {
    console.error('Search error:', error)
  } finally {
    isLoading.value = false
    clearTimeout(loadingTimeout.value)
    isShowLoading.value = false
  }
}

const closeHandler = () => {
  searchResultsStore.close()
}

const goSearchPageHandler = (val) => {
  let query = val ? val : searchResultsStore.searchQuery
  navigateTo($regionPath('/search?q=' + query))
}

// WATCH
watch(() => searchResultsStore.searchQuery, (v) => {
  if(!v?.length) {
    return
  }

  clearTimeout(timeout.value)

  timeout.value = setTimeout(() => {
      search(v)
  }, 200)
}, {
  deep: true,
  immediate: true
})

watch(() => searchResultsStore.isOpen, (value) => {
  if (value) {
    disableScroll()
  } else {
    enableScroll()
  }
}, { immediate: true })

onUnmounted(() => {
  enableScroll()
})
</script>

<style src="./results.scss" lang="scss" scoped />
<i18n src="./lang.yaml" lang="yaml"></i18n>

<template>
  <div v-if="searchResultsStore.isOpen" class="search-results-wrapper">
    <!-- Stage 2: Show results only if showResults is true -->
    <div v-if="searchResultsStore.showResults && isShow" class="livesearch" :style="containerStyle">

      <div class="message-box">
        <transition name="fade-in">
          <div
            v-if="isShowLoading"
            class="livesearch-label"
          >
            {{ t('searching') }}...
          </div>
          <div
            v-else-if="!wasSearched"
            class="livesearch-label"
          >
            {{ t('try_search') }}
          </div>
          <div
            v-else-if="!timeout && !isLoading && searchResultsStore.searchQuery?.length && !categories?.length && !products?.length"
            class="livesearch-label"
          >
            {{ t('no_res') }}
          </div>
          <div v-else class="livesearch-label">
            {{ t('displayed') }} {{ t('label.products', {products: products?.length}) }}. {{ t('searched') }} {{ t('label.products', {products: meta?.total}) }}.
          </div>
        </transition>
      </div>

      <div v-if="products?.length" class="livesearch-box">

        <div v-if="meta?.total > products?.length" @click="closeHandler" class="all-results-btn">
          <NuxtLink :to="$regionPath('/search?q=' + searchResultsStore.searchQuery)" class="all-results-btn-link">
            <span class="text">{{ t('all') }}</span>
            <IconCSS name="iconoir:arrow-right" class="icon"></IconCSS>
          </NuxtLink>
        </div>

        <ul class="livesearch-grid">
          <li v-for="item in products" :key="item.id" class="livesearch-grid-item">
            <product-card-live-search :item="item" @click="closeHandler"></product-card-live-search>
          </li>
        </ul>
      </div>

      <div v-if="brands?.length" class="livesearch-box">
        <div class="livesearch-label">{{ t('title.brands') }}</div>
        <ul class="livesearch-brands">
          <li v-for="item in brands" :key="item.id" class="livesearch-brands-item">
            <brand-card-live-search :item="item" @click="closeHandler"></brand-card-live-search>
          </li>
        </ul>
      </div>

      <div v-if="history?.length || categories?.length" class="livesearch-box livesearch-columns">
        
        <div v-if="categories?.length">
          <div class="livesearch-label">{{ t('title.categories') }}</div>
          <ul class="livesearch-list">
            <li v-for="item in categories" :key="item.id" class="livesearch-item">
              <NuxtLink :to="$regionPath('/' + item.slug)" @click="closeHandler" class="livesearch-link">
                <span class="value">{{ item.name }}</span>
              </NuxtLink>
            </li>
          </ul>
        </div>

        <div v-if="history?.length">
          <div class="livesearch-label">{{ t('search_history') }}</div>
          <ul class="livesearch-inline">
            <li v-for="item in history" :key="item" class="livesearch-item">
              <button @click="goSearchPageHandler(item)" class="livesearch-link">
                <span class="value">{{ item }}</span>
              </button>
            </li>
          </ul>
        </div>
      </div>

    </div>
    <div class="search-results-bg" @click="closeHandler"></div>
  </div>
</template>
