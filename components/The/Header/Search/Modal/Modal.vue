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
const meta = ref(null)
const searchInput = ref('')

const timeout = ref(null)
const isLoading = ref(false)
const isShowLoading = ref(false)
const loadingTimeout = ref(null)

const isOpen = ref(false)

// REF html
const simpleSearchRef = ref(null)

// COMPUTEDS
const history = computed(() => {
  return useSearchStore().getHistory
})

const isShow = computed(() => {
  return isOpen.value && (products.value?.length || history.value?.length || searchInput.value.length)
})

// Флаг, указывающий был ли хотя бы один поиск совершён
const wasSearched = computed(() => {
  return isLoading.value || isShowLoading.value || (searchInput.value.length && (products.value?.length || (!products.value?.length && !timeout.value)))
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

  await useAsyncData('livesearch-' + params.q, () => useSearchStore().livesearch(params)).then(({data, error}) => {
    // console.log('livesearch data', data)
    if(data.value.data) {
      meta.value = data.value.meta
    }

    if(data.value.data) {
      products.value = data.value.data
    }
    // if(data?.value) {
    //   categories.value = data.value.categories
    //   products.value = data.value.products
    //   brands.value = data.value.brands
    // }
  }).finally(() => {
    isLoading.value = false
    clearTimeout(loadingTimeout.value)
    isShowLoading.value = false
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

// WATCH
watch(() => searchInput.value, (v) => {
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

// Хранилище для сохранения текущей позиции прокрутки
let scrollPosition = 0;

const disableScroll = () => {
  if (process.client) {
    // 1. Сохраняем текущую позицию прокрутки
    scrollPosition = window.pageYOffset;
    
    // 2. Добавляем класс, который "фиксирует" body
    document.body.classList.add('modal-open-ios');
    
    // 3. Смещаем body вверх на сохраненную позицию, чтобы избежать "прыжка"
    document.body.style.top = `-${scrollPosition}px`;
  }
};

const enableScroll = () => {
  if (process.client) {
    // 1. Убираем фиксирующие стили
    document.body.classList.remove('modal-open-ios');
    document.body.style.top = '';
    
    // 2. Восстанавливаем сохраненную позицию прокрутки
    window.scrollTo(0, scrollPosition);
  }
};


watch(() => isOpen.value, (newVal) => {
  if (newVal) {
    disableScroll();
  } else {
    enableScroll();
  }
}, { immediate: true });

onMounted(() => {
  nextTick(() => {
    simpleSearchRef.value?.setFocus()
  })
})

onUnmounted(() => {
  // На случай, если компонент будет удален, когда модалка открыта
  enableScroll();
});
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
    >
      <template v-slot:right>
        <div v-if="timeout" class="typing">
          <div class="dot">•</div>
          <div class="dot">•</div>
          <div class="dot">•</div>
        </div>
      </template>
    </simple-search>

    <div v-if="isShow" class="livesearch">


      <transition name="fade-in">
      </transition>

      <div class="message-box">
        <transition name="fade-in">
          <div
            v-if="isShowLoading"
            class=" livesearch-label"
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
            v-else-if="!timeout && !isLoading && searchInput?.length && !categories?.length && !products?.length"
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
          <NuxtLink :to="$regionPath('/search?q=' + searchInput)" class="all-results-btn-link">
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
    <div class="livesearch-bg" @click="closeHandler"></div>
  </div>
</template>