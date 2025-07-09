<script setup>
const {t} = useI18n()
const localePath = useLocalePath()

const props = defineProps({
  item: {
    required: true
  }
})
// COMPUTEDS
// METHODS
// HANDLERS
// WATCHERS
</script>

<style src='./livesearch.scss' lang='scss' scoped></style>
<!-- <i18n src='' lang='yaml'></i18n> -->

<template>
  <NuxtLink :to="localePath('/brands/' + item.slug)" class="brand-item">
    <nuxt-img
      :src = "useImg().brand(item.image)"
      width="50"
      height="60"
      sizes = "mobile:50px tablet:50px desktop:50px"
      format = "webp"
      quality = "60"
      loading = "lazy"
      fit="outside"
      class="brand-image"
      placeholder="/images/noimage.png"
    >
    </nuxt-img>
    <span class="value">{{ item.name }}</span>
  </NuxtLink>
</template>