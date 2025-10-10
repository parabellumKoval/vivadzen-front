<script setup>
import {useSearchStore} from '~/store/search'

const { t } = useI18n()
const { $regionPath } = useNuxtApp();
// const props = defineProps({
//   searchInput: {
//     type: String
//   }
// })

const emit = defineEmits(['close', 'setInput'])

const categories = ref([])
const products = ref([])
const brands = ref([])
const searchInput = ref('')

const timeout = ref(null)
const isLoading = ref(false)

const isOpen = ref(false)

// REF html
const simpleSearchRef = ref(null)

// COMPUTEDS
const history = computed(() => {
  return useSearchStore().getHistory
})

// METHODS
const search = async (search) => {
  timeout.value = null

  const params = {
    search: search
  }

  if(!params.search?.length) {
    categories.value = null
    products.value = null
    return
  }

  isLoading.value = true

  await useAsyncData('livesearch', () => useSearchStore().livesearch(params)).then(({data, error}) => {
    if(data?.value) {
      categories.value = data.value.categories
      products.value = data.value.products
      brands.value = data.value.brands
    }
  }).finally(() => {
    isLoading.value = false
  })
}

const setInput = (search) => {
  emit('setInput', search)
}

const closeHandler = () => {
  setTimeout(() => {
    searchInput.value = ''
    isOpen.value = false
    simpleSearchRef.value.blurHandler()
    emit('close')
  }, 50)
}
const focusHandler  = () => {
  isOpen.value = true
}

const goSearchPageHandler = (val) => {
  let query = val? val: searchInput.value
  navigateTo($regionPath('/search?q=' + query))
}

// const blurHandler  = () => {
//   isOpen.value = false
// }

// WATCH
watch(() => searchInput.value, (v) => {
  if(!v?.length) {
    return
  }

  clearTimeout(timeout.value)

  timeout.value = setTimeout(() => {
      search(v)
  }, 1000)
}, {
  deep: true,
  immediate: true
})
</script>

<style src="./modal.scss" lang="scss" scoped />
<i18n src="./lang.yaml" lang="yaml"></i18n>

<template>
  <div class="livesearch-wrapper">

    <simple-search
      v-model="searchInput"
      :btn-label="t('all')"
      @input:focus="focusHandler"
      @input:blur="blurHandler"
      @btn:click="goSearchPageHandler"
      @close="closeHandler"
      class="simple-search"
      ref="simpleSearchRef"
    ></simple-search>

    <div v-if="isOpen" class="livesearch">

      <transition name="fade-in">
        <div
          v-if="isLoading"
          class="livesearch-box message-box"
        >
          {{ t('searching') }}...
        </div>
      </transition>

      <div v-if="timeout" class="typing">
        <div class="dot">•</div>
        <div class="dot">•</div>
        <div class="dot">•</div>
      </div>

      <transition name="fade-in">
        <div
          v-if="!timeout && !isLoading && searchInput?.length && !categories?.length && !products?.length"
          class="livesearch-box message-box"
        >
          {{ t('no_res') }}
        </div>
      </transition>

      <div v-if="products?.length" class="livesearch-box">
        <div class="livesearch-label">{{ t('title.products') }}</div>
        <ul class="livesearch-grid">
          <li v-for="item in products" :key="item.id" class="livesearch-grid-item">
            <product-card-live-search :item="item" @click="closeHandler"></product-card-live-search>
          </li>
        </ul>

        <div @click="closeHandler" class="all-results-btn">
          <NuxtLink :to="$regionPath('/search?q=' + searchInput)" class="all-results-btn-link">
            <span class="text">{{ t('all') }}</span>
            <IconCSS name="iconoir:arrow-right" class="icon"></IconCSS>
          </NuxtLink>
        </div>
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


      <span
        v-if="categories?.length || products?.length || brands?.length"
        class="powered-by"
      >
        <span class="powered-by-text">Powered by</span>

        <nuxt-img
          :provider="useImg().provider"
          src="/images/algolia.png"
          width="30"
          height="30"
          sizes = "mobile:50px tablet:50px desktop:50px"
          format = "webp"
          quality = "100"
          loading = "lazy"
          fit="outside"
          class="algolia"
        />
      </span>
    </div>
    <div v-if="isOpen" class="livesearch-bg" @click="closeHandler"></div>
  </div>
</template>