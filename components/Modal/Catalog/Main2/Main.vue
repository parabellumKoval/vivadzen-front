<script setup>
const {t} = useI18n()

const props = defineProps({
  categories: {
    type: Array
  }
})

const selectedIndex = ref(null)

// COMPUTEDS

// METHODS
const getPhotoSrc = (image) => {
  if(image?.src) {
    return '/server/images/categories/' + image.src
  } else {
    return '/images/noimage.png'
  }
}
// HANDLERS

const selectHandler = (index) => {
  selectedIndex.value = index
  useModal().open(resolveComponent('ModalCatalogSub'), index)
}

const hoverEventHandler = (index) => {
  if(useDevice().isDesktop) {
    selectHandler(index)
  }
}
// WATCHERS
</script>

<style src='./main.scss' lang='scss' scoped></style>
<!-- <i18n src='' lang='yaml'></i18n> -->

<template>
  <div :class="{'mobile-active': !sub || !sub.length}" class="category-wrapper">
    <div class="category-inner">
      <button
        v-for="(category, index) in categories"
        :key="category.id"
        @click="selectHandler(index)"
        @mouseenter="hoverEventHandler(index)"
        :aria-label="category.name"
        :class="{active: selectedIndex === index}"
        class="category-item link"
        clickable
      >
        <nuxt-img
          v-if="category.image.src"
          :src = "getPhotoSrc(category.image)"
          width="40"
          height="40"
          sizes = "mobile:60px tablet:60px desktop:60px"
          format = "webp"
          quality = "60"
          loading = "lazy"
          fit="outside"
          placeholder="/images/noimage.png"
          class="category-image"
        >
        </nuxt-img>
        <div class="category-name">{{ category.name }}</div>
        <IconCSS v-if=" selectedIndex === index" name="iconoir:nav-arrow-right" class="category-icon"></IconCSS>
      </button>
    </div>
  </div>
</template>