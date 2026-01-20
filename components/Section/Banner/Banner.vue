<script setup>
import SectionBannerItemsItem1 from '~/components/Section/Banner/Items/Item1/Item1.vue'
// import SectionBannerItemsItem2 from '~/components/Section/Banner/Items/Item2/Item2.vue'
// import SectionBannerItemsItem3 from '~/components/Section/Banner/Items/Item3/Item3.vue'

const slides = [
  // SectionBannerItemsItem3, 
  SectionBannerItemsItem1, 
  // SectionBannerItemsItem2
]
const hasMultipleSlides = slides.length > 1
</script>

<style src="./banner.scss" lang="scss" scoped></style>
<style src="~/assets/scss/snap-nav.scss" lang="scss" scoped></style>

<template>
  <div class="con">
    <section class="banners-wrapper">
      <SnapCarousel
        class="banner-carousel"
        :items="slides"
        :items-per-page="{ xs: 1 }"
        :gap="30"
        :loop="hasMultipleSlides"
        :show-arrows="hasMultipleSlides"
        :show-dots="hasMultipleSlides"
        aria-label="Homepage banners"
      >
        <template #item="{ item }">
          <component :is="item" />
        </template>
        <template #prev>
          <IconCSS name="mynaui:chevron-left" size="24"></IconCSS>
        </template>
        <template #next>
          <IconCSS name="mynaui:chevron-right" size="24"></IconCSS>
        </template>
      </SnapCarousel>
    </section>
  </div>
</template>
