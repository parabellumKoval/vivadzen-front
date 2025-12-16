<script setup>
const props = defineProps({
  categories: {
    type: Array
  },
  stuck: {
    type: Boolean,
    default: false
  },
  backLink: {
    type: String,
    default: null
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
  <div class="category-wrapper" :class="{ 'is-stuck': stuck }">
    <NuxtLink
      v-if="backLink"
      :to="$regionPath(backLink)"
      aria-label="Вернуться к предыдущей категории"
      class="category category--back"
      active-class=""
      exact-active-class=""
    >
      <div class="category-back-icon">
        <IconCSS name="iconoir:nav-arrow-left" size="32"></IconCSS>
      </div>
    </NuxtLink>
    <NuxtLink v-for="category in categories" :key="category.id" :to="$regionPath('/' + category.slug)" class="category">
      <div class="category-image-wrapper">
        <nuxt-img
          :src = "category.image?.src"
          :alt = "category.image?.alt || category.name"
          :title = "category.image?.title || category.name"
          width="100"
          height="100"
          sizes = "mobile:140px"
          format = "webp"
          quality = "80"
          loading = "lazy"
          fit="outside"
          :placeholder="useImg().noImageTransparent"
          class="category-image"
          provider="bunny"
        />
      </div>
      <div class="category-name">
        {{ category.name }}
      </div>
    </NuxtLink>
  </div>
</template>
