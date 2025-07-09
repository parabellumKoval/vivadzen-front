<script setup>
const props = defineProps({
  item: {
    type: Object
  }
})

const {t} = useI18n()
const isOpen = ref(false)

// COMPUTEDS
const image = computed(() => {
  return props.item?.images[0] || null
})

// METHODS
const toggleHandler = () => {
  isOpen.value = !isOpen.value
}

// HANDLERS
// WATCHERS
</script>

<style src='./brand.scss' lang='scss' scoped></style>
<style src='~/assets/scss/_rich-text.scss' lang='scss' scoped></style>
<!-- <i18n src='' lang='yaml'></i18n> -->

<template>
  <div :class="[{active: isOpen}]" class="brand-wrapper">
    <div class="brand-image-wrapper">
      <nuxt-img
        :src='useImg().brand(image)'
        :alt='image?.alt || item.name'
        :title='image?.title || item.name'
        width='100'
        height='100'
        sizes='mobile:100vw tablet:100px desktop:260px'
        format='webp'
        quality='60'
        loading='lazy'
        fit='outside'
        :placeholder="useImg().noImageGray"
        placeholder-class="image-placeholder"
        class='brand-image'
      />
    </div>
    <div class="brand-content">
      <div v-if="item.content?.length <= 10" class="brand-name title-secondary">{{ item.name }}</div>
      <div class="brand-desc">
        <div class="rich-text" v-html="item.content"></div>
      </div>
      <div :class="[{active: isOpen}]" class="more-btn">
        <button @click="toggleHandler" class="text-link">
          <transition name="fade-in">
            <span v-if="isOpen">{{ t('button.collapse') }}</span>
            <span v-else>{{ t('button.expand') }}</span>
          </transition>
          <transition name="fade-in">
            <IconCSS v-if="isOpen" name="iconoir:nav-arrow-left"></IconCSS>
            <IconCSS v-else name="iconoir:nav-arrow-right"></IconCSS>
          </transition>
        </button>
      </div>
    </div>
  </div>
</template>