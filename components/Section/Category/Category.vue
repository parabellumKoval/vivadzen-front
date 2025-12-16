<script setup>
import { useCategoryStore } from '~/store/category'
const categoryStore = useCategoryStore()
const { locale } = useI18n()
const {region, regionAlias} = useRegion()
const re = useRegion()

// console.log('MC-'+locale.value+'-'+regionAlias.value)

// useAsyncData(() => {
//   console.log('REFETCH main-categories-'+locale.value+'-'+regionAlias.value)
//   return categoryStore.listMainCached()
// })
const categories = computed(() =>  {
  return categoryStore.mainList
})

// watch(locale, () => {
//   console.log('WATCH main-categories-'+locale.value+'-'+regionAlias.value)
//   // categoryStore.listMainCached(true)
// })
</script>

<style src="./category.scss" lang="scss" scoped></style>
<i18n src="./lang.yaml" lang="yaml"></i18n>

<template>
  <section v-if="categories?.length" class="">
    <div class="container">
      <div class="category-wrapper">
        <template v-for="category in categories" :key="category.id">
          <NuxtLink
            :to="$regionPath('/' + category.slug)"
            :aria-label="category.name"
            clickable
            class="category"
          >
            <div class="category-image-wrapper">
              <nuxt-img
                v-if="category?.image?.src"
                :src = "category.image.src"
                :alt = "category.image.alt || category.name"
                :title = "category.image.title || category.name"
                :class="category.image.size"
                :style="category?.extras?.image_size ? { width: category.extras.image_size + '%' } : {}"
                width="200"
                height="200"
                sizes = "mobile:200px tablet:360px desktop:360px"
                format = "avif"
                quality = "60"
                loading = "lazy"
                fit="outside"
                :placeholder="useImg().noImageTransparent"
                class="category-image"
                provider="bunny"
              >
              </nuxt-img>
            </div>
            <div class="category-content">
              <div class="category-name">{{ category.name }}</div>
              <div class="category-desc">{{ category?.extras_trans?.short_description }}</div>
            </div>
          </NuxtLink>
        </template>
      </div>
    </div>
  </section>
</template>
