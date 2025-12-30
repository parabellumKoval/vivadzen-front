<script setup>
import { useSearchResultsStore } from '~/store/searchResults'
import { useBodyScrollLock } from '~/composables/useBodyScrollLock'

const { t } = useI18n()
const emit = defineEmits(['close', 'setInput'])
const searchResultsStore = useSearchResultsStore()

const searchInput = ref('')
const isOpen = ref(false)

// REF html
const simpleSearchRef = ref(null)

// METHODS
const closeHandler = () => {
  setTimeout(() => {
    searchInput.value = ''
    isOpen.value = false
    searchResultsStore.close()
    simpleSearchRef.value?.blurHandler?.()
    emit('close')
  }, 50)
}

const focusHandler = () => {
  isOpen.value = true
  // Stage 1: open with background, no results yet
  searchResultsStore.openStage1()
}

const blurHandler = () => {
  // Blur handler for simple search component
}

const { disableScroll, enableScroll } = useBodyScrollLock()

// WATCH
watch(() => searchInput.value, (v) => {
  if(v) {
    // Stage 2: user starts typing, show results
    searchResultsStore.openStage2(v)
  } else if(isOpen.value) {
    // Back to Stage 1: only background visible
    searchResultsStore.openStage1()
  }
})

watch(() => isOpen.value, (newVal) => {
  if (newVal) {
    disableScroll();
  } else {
    enableScroll();
  }
}, { immediate: true });

onMounted(() => {
  nextTick(() => {
    simpleSearchRef.value?.setFocus?.()
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
      :is-close-btn="false"
      @input:focus="focusHandler"
      @input:blur="blurHandler"
      @close="closeHandler"
      class="simple-search"
      ref="simpleSearchRef"
    >
      <template v-slot:right></template>
    </simple-search>

    <div class="livesearch-bg" @click="closeHandler"></div>
  </div>
</template>
