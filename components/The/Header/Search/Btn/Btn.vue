<script setup>
import { useSearchResultsStore } from '~/store/searchResults'

const {t} = useI18n()
const props = defineProps({})
const emit = defineEmits(['open'])
const isActive = ref(false)
const searchInput = ref(null)
const inputRef = ref(null)
const searchResultsStore = useSearchResultsStore()

// METHODS
const openSearchHandler = () => {
  isActive.value = true
  searchResultsStore.openStage1()
  emit('open', true)
  nextTick(() => {
    inputRef.value?.focus()
  })
}

const closeHandler = () => {
  isActive.value = false
  searchInput.value = null
  searchResultsStore.close()
  emit('open', false)
}

// WATCHERS
watch(() => searchInput.value, (v) => {
  if(v) {
    searchResultsStore.openStage2(v)
  } else {
    searchResultsStore.openStage1()
  }
})
</script>

<style src='./btn.scss' lang='scss' scoped></style>
<i18n src='./lang.yaml' lang='yaml'></i18n>

<template>
  <div :class="{'active':isActive}" class="search-wrapper">
    <button @click="openSearchHandler" class="header-btn search-btn" type="button" clickable>
      <IconCSS name="ci:search-magnifying-glass" class="icon"></IconCSS>
    </button> 

     <!-- @blur="closeHandler" -->
    <div class="search-field">
      <input
        v-if="isActive"
        v-model="searchInput"
        ref="inputRef"
        type="text"
        class="search-input"
        :placeholder="t('placeholder')"
       
      />
      <button
        v-if="isActive"
        @click="closeHandler"
        class="search-close-btn"
        type="button"
        clickable
      >
        <IconCSS name="ci:close-md" class="icon"></IconCSS>
      </button>
    </div>
  </div>
</template>