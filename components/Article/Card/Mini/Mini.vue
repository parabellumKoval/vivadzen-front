<script setup>
const {t} = useI18n()
const props = defineProps({
  item: {
    type: Object,
    required: true
  }
})
// COMPUTEDS
// METHODS
// HANDLERS
// WATCHERS
</script>

<style src='./mini.scss' lang='scss' scoped></style>
<!-- <i18n src='' lang='yaml'></i18n> -->

<template>
  <NuxtLink
    
    :to="$regionPath('/blog/' + item.slug)"
    class="article"
  >
      <nuxt-img
        :src = "item.image?.src"
        :alt = "item.image?.alt || item.name"
        :title = "item.image?.title || item.name"
        :class = "item.image?.size"
        width = "100"
        height = "100"
        sizes = "mobile:100px"
        format = "avif"
        quality = "60"
        loading = "lazy"
        fit = "outside"
        :placeholder="useImg().noImage"
        class = "article-image"
      />
      <div class="article-content">
        <div class="article-title">{{ item.title }}</div>
        <div class="article-time">
          <IconCSS name="iconoir:clock" class="icon"></IconCSS>
          <span v-if="item.time" class="label">{{ parseFloat(item.time).toFixed(0) }} {{ t('label.min_read') }}</span>
        </div>
      </div>
  </NuxtLink>
</template>