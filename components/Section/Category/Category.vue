<script setup>
import { useCategoryStore } from '~/store/category'
const {t} = useI18n()


//
const categories = computed(() => {
  const allCategories = useCategoryStore().list
  return allCategories.filter(category => {
    if (category.extras?.on_main === '1') return true
    else return false
  })
})


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
                width="200"
                height="200"
                sizes = "mobile:50vw tablet:360px desktop:360px"
                format = "avif"
                quality = "60"
                loading = "lazy"
                fit="outside"
                :placeholder="useImg().noImage"
                class="category-image"
                provider="ipx"
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
