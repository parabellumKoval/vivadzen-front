
<script setup>
const props = defineProps({
  item: {
    type: Object
  },
  index: {
    type: Number,
    default: null
  }
})

const {t} = useI18n()

const loading = computed(() => {
  if(props.index === null || props.index !== 0)
    return 'lazy'
  else {
    return null
  }
})
console.log('item', props.item)
</script>

<style src="./card.scss" lang="scss" scoped></style>

<template>
  <NuxtLink :to="$regionPath('/blog/' + item.slug)" class="article-card">
    <nuxt-img
      :src = "item.image?.src"
      :alt = "item.image?.alt || item.name"
      :title = "item.image?.title || item.name"
      :class = "item.image?.size"
      width = "290"
      height = "260"
      sizes = "mobile:70vw tablet:230px desktop:300px"
      format = "avif"
      quality = "60"
      :loading = "loading"
      fit = "outside"
      :placeholder="useImg().noImage"
      class = "article-image"
    />

    <div class="article-title">{{ item.title }}</div>

    <div class="article-time">
      <IconCSS name="iconoir:clock" size="16" class="icon"></IconCSS>
      <span v-if="item.time" class="label">{{ parseFloat(item.time).toFixed(0) }} {{ t('label.min_read') }}</span>
    </div>
  </NuxtLink>
</template>