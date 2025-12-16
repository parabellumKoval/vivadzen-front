<script setup>
const {t} = useI18n()

const props = defineProps({
  item: {
    type: Object,
    required: true
  }
})

// console.log('categories', categorieitem.value);

const getTag = (category) => {
  if(category.tags && category.tags[0]) {
    return category.tags[0].text || null
  }
  return null
}

</script>

<style src="./item.scss" lang="scss" scoped></style>
<i18n src="./lang.yaml" lang="yaml"></i18n>

<template>
  <article class="slide">
    <div class="slide-inner">
      <div class="slide-media">
        <nuxt-img
          :src = "item.image?.src"
          :alt = "item.image?.alt || item.title"
          :title = "item.image?.title || item.title"
          width="500"
          height="500"
          sizes = "mobile:400px tablet:500px desktop:600px"
          format = "webp"
          quality = "60"
          loading = "lazy"
          fit="outside"
          class="category-image"
          provider="bunny"
        ></nuxt-img>
      </div>

      <div class="slide-content">
        <p class="slide-eyebrow">{{ item.name }}</p>

        <div
          class="slide-title font-alegreya"
          v-html="item.extras_trans?.caption"
        ></div>

        <div v-if="item.extras_trans?.full_description" class="slide-full_desc" v-html="item.extras_trans?.full_description"></div>

        <div class="slide-chips" role="list">
          <template v-if="item.children?.length">
            <NuxtLink v-for="child in item.children" :to="$regionPath('/' + child.slug)" :key="child.id" class="slide-chip" role="listitem">
              {{ child.name }}
            </NuxtLink>
          </template>
          <NuxtLink :to="$regionPath('/' + item.slug)"  class="slide-chip all" role="listitem">
            {{ t('all_types') }}
            <IconCSS name="mynaui:arrow-right" class="icon"></IconCSS>
          </NuxtLink>
        </div>

      </div>
    </div>
  </article>
</template>
