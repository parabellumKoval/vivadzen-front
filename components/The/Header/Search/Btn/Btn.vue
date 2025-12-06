<script setup>
const {t} = useI18n()
const props = defineProps({})
const isActive = ref(false)
// COMPUTEDS
// METHODS
const openSearchHandler = () => {
  isActive.value = true
}
const closeHandler = () => {
  isActive.value = false
}


// HANDLERS
// WATCHERS
</script>

<style src='./btn.scss' lang='scss' scoped></style>
<!-- <i18n src='' lang='yaml'></i18n> -->

<template>
  <button @click="openSearchHandler" class="header-btn search-btn" type="button" clickable>
    <IconCSS name="ci:search-magnifying-glass" class="icon"></IconCSS>
    <!-- <IconCSS name="iconoir:search" class="icon"></IconCSS> -->
  </button> 

  <transition name="fade-in">
    <lazy-the-header-search-modal
      v-if="isActive"
      @close="closeHandler"
      class="search-modal"
    ></lazy-the-header-search-modal>
  </transition>
</template>