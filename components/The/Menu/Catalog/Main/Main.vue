<script setup>
import { useCategoryStore } from '~/store/category'
const {t} = useI18n()
const { $regionPath } = useNuxtApp();
const emit = defineEmits([
  'changeSelected'
])

const categoryStore = useCategoryStore()
const selectedIndex = ref(null)

// COMPUTEDS

// console.log('locale in footer:', locale.value)

const categories = computed(() => {
  return categoryStore.list
})

// METHODS
const select = (index) => {
  selectedIndex.value = index
  emit('changeSelected', index)
}

// HANDLERS
const clickHandler = (index, category) => {
  const slug = category?.slug

  if(useDevice().isDesktop){
    navigateTo($regionPath('/' + slug))
    return
  }

  if(!category?.children?.length){
    navigateTo($regionPath('/' + slug))
    return
  }

  select(index)
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
        @click="clickHandler(index, category)"
        @mouseenter="hoverEventHandler(index)"
        :aria-label="category.name"
        :class="{active: selectedIndex === index}"
        class="category-item link"
        clickable
      >
        <nuxt-img
          :src = "category?.image?.src"
          width="100"
          height="100"
          sizes = "mobile:60px tablet:120px desktop:120px"
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
