<script setup>
const {t} = useI18n()
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
  <NuxtLink :to="$regionPath('/' + item.slug)" class="livesearch-link product-card">
    <div class="product-image-wrapper">
      <nuxt-img
        :src = "item.image?.src"
        width="207"
        height="105"
        sizes = "mobile:207px tablet:207px desktop:207px"
        format = "webp"
        quality = "60"
        loading = "lazy"
        fit="outside"
        class="product-image"
        placeholder="/images/noimage.png"
      >
      </nuxt-img>
    </div>
    <div class="product-name">{{ item.name }}</div>
    <div v-if="item.shortName" class="product-modification">{{ item.shortName }}</div>
    <div class="product-price">
      <simple-price v-if="item.oldPrice" :value="item.oldPrice" class="old-price"></simple-price>
      <simple-price v-if="item.price" :value="item.price" class="base-price"></simple-price>
    </div>
  </NuxtLink>
</template>