<script setup>
import { useCategoryStore } from '~/store/category'
const {t} = useI18n()

// COMPUTEDS
const categories = computed(() => {
  return useCategoryStore().list
})

const selectedCategory = computed(() => {
  if(selectedIndex.value === null)
    return null
  else
    return categories.value[selectedIndex.value]
})

const selectedIndex = computed(() => {
  return parseInt(useModal().active.data)
})

const sub = computed(() => {
  if(selectedIndex.value === null)
    return []
  else 
    return [
      {
        id: selectedCategory.value.id,
        name: t('label.all_products'),
        slug: selectedCategory.value.slug,
        isCommon: true
      },
      ...selectedCategory.value.children
    ]
})

//
const backHandler = () => {
  useModal().open(resolveComponent('ModalMenuMobile'), null, null)
}
</script>

<style src="./sub.scss" lang="scss" scoped />

<template>
  <modal-wrapper class="m-wrapper">
    <div class="sub-outer">

      <div v-if="selectedCategory" class="sub-header">
        <button @click="backHandler" class="sub-btn">
          <IconCSS name="iconoir:nav-arrow-left" size="24"></IconCSS>
        </button>
        <nuxt-img
          v-if="selectedCategory.image.src"
          :src = "selectedCategory.image.src"
          width="40"
          height="40"
          sizes = "mobile:60px tablet:60px desktop:60px"
          format = "webp"
          quality = "60"
          loading = "lazy"
          fit="outside"
          :placeholder="useImg().noImage"
          class="category-image"
          provider="bunny"
        >
        </nuxt-img>
        <div class="sub-title">{{ selectedCategory.name }}</div>
      </div>

      <div class="catalog">
        <the-menu-catalog-sub
          :items="sub"
        ></the-menu-catalog-sub>
      </div>

    </div>
  </modal-wrapper>
</template>