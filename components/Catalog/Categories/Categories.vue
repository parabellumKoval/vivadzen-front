<script setup>
const props = defineProps({
  categories: {
    type: Array
  }
})
// COMPUTEDS
// METHODS
// HANDLERS
// WATCHERS
</script>

<style src='./categories.scss' lang='scss' scoped></style>
<!-- <i18n src='' lang='yaml'></i18n> -->

<template>
  <div class="category-wrapper">
    <NuxtLink v-for="category in categories" :key="category.id" :to="$regionPath('/' + category.slug)" class="category">
      <nuxt-img
        :src = "useImg().category(category.image)"
        :alt = "category.image?.alt || category.name"
        :title = "category.image?.title || category.name"
        width="100"
        height="100"
        sizes = "mobile:100px"
        format = "webp"
        quality = "60"
        loading = "lazy"
        fit="outside"
        :placeholder="useImg().noImageGray"
        class="category-image"
      >
      </nuxt-img>
      <div class="category-name">
        {{ category.name }}
      </div>
    </NuxtLink>
  </div>
</template>