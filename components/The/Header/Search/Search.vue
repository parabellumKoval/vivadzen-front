<script setup>
import { useSearchResultsStore } from '~/store/searchResults'

const {t} = useI18n()
const route = useRoute()
const searchResultsStore = useSearchResultsStore()
const emit = defineEmits(['open', 'close'])

const searchInput = ref('')
const isActive = ref(false)

const openSearchHandler = () => {
  if (isActive.value)
    return

  isActive.value = true
  emit('open')
  searchResultsStore.openStage1()
}

const closeSearchHandler = (fromStore = false) => {
  if (!isActive.value)
    return

  isActive.value = false
  emit('close')
  searchInput.value = ''

  if (!fromStore)
    searchResultsStore.close()
}

const goToSearchPage = async () => {
  const query = searchInput.value
  closeSearchHandler()

  await navigateTo({
    path: '/search',
    query: {
      q: query
    }
  })
}

watch(() => searchInput.value, (value) => {
  if (!isActive.value)
    return

  if (value) {
    searchResultsStore.openStage2(value)
  } else {
    searchResultsStore.openStage1()
  }
})

watch(() => searchResultsStore.isOpen, (value) => {
  if (value && !isActive.value) {
    openSearchHandler()
  } else if (!value && isActive.value) {
    closeSearchHandler(true)
  }
})

watch(() => route.fullPath, () => {
  closeSearchHandler()
}, {
  immediate: true
})
</script>

<style src="./search.scss" lang="scss" scoped />

<template>
  <div :class="{active: isActive && $device.isMobile}" class="search-wrapper">
    <div class="simple-search">
      <IconCSS v-if="!$device.isMobile" name="mynaui:search" size="28px" class="simple-search-icon"></IconCSS>
      <input
        v-model="searchInput"
        @click="openSearchHandler"
        @focus="openSearchHandler"
        @keyup.enter.prevent="goToSearchPage"
        :placeholder="t('title.search')"
        class="simple-search-input"
      />
    </div>
  </div>
</template>
