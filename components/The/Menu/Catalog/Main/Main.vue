<script setup>
import { useCategoryStore } from '~/store/category'
const {t} = useI18n()
const { $regionPath } = useNuxtApp();
const emit = defineEmits([
  'changeSelected'
])

const selectedIndex = ref(null)

// COMPUTEDS

const categories = computed(() => {
  return useCategoryStore().list
})

// METHODS
const select = (index) => {
  selectedIndex.value = index
  emit('changeSelected', index)
}

// HANDLERS
const clickHandler = (index, slug) => {
  if(useDevice().isDesktop){
    navigateTo($regionPath('/' + slug))
  }else {
    select(index)
  }
}

const hoverEventHandler = (index) => {
  if(useDevice().isDesktop) {
    select(index)
  }
}
// WATCHERS
</script>

<style src='./main.scss' lang='scss' scoped></style>
<!-- <i18n src='' lang='yaml'></i18n> -->

<template>
  <div class="category-wrapper">
    <div class="category-inner">
      <button
        v-for="(category, index) in categories"
        :key="category?.id"
        @click="clickHandler(index, category.slug)"
        @mouseenter="hoverEventHandler(index)"
        :aria-label="category.name"
        :class="{active: selectedIndex === index}"
        class="category-item link"
        clickable
      >
        <nuxt-img
          :src = "useImg().category(category.image)"
          width="40"
          height="40"
          sizes = "mobile:60px tablet:60px desktop:60px"
          format = "webp"
          quality = "60"
          loading = "lazy"
          fit="outside"
          :placeholder="useImg().noImage"
          class="category-image"
        >
        </nuxt-img>
        <div class="category-name">{{ category.name }}</div>
        <IconCSS v-if="selectedIndex === index" name="iconoir:nav-arrow-right" class="category-icon"></IconCSS>
      </button>
    </div>
  </div>
</template>