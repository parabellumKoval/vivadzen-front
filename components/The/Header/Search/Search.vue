<script setup>
const route = useRoute()

const searchInput = ref(null)
const isActive = ref(false)

const focusHandler = () => {
  isActive.value = true
}

const blurHandler = () => {
  // if(!useDevice().isMobile) {
  //   isActive.value = false
  // }
}

const closeHandler = () => {
  isActive.value = false
}

const setInput = (search) => {
  searchInput.value = search
}

const goToSearchPage = async () => {
  closeHandler()

  await navigateTo({
    path: '/search',
    query: {
      q: searchInput.value
    }
  })
}

watch(() => route.fullPath, (v) => {
  closeHandler()
}, {
  immediate: true
})
</script>

<style src="./search.scss" lang="scss" scoped />

<template>
  <div :class="{active: isActive && $device.isMobile}" class="search-wrapper">
    <simple-search
      v-model="searchInput"
      @input:focus="focusHandler"
      @input:blur="blurHandler"
      @close="closeHandler"
      @btn:click="goToSearchPage"
      class="simple-search"
    ></simple-search>

    <transition name="fade-in">
      <lazy-the-header-search-modal
        v-if="isActive"
        :search-input="searchInput"
        @close="closeHandler"
        @setInput="setInput"
        class="search-modal"
      ></lazy-the-header-search-modal>
    </transition>
  </div>
</template>