<script setup>
const {t} = useI18n()


const slidersQuery = computed(() => {
  return {}
})

//
const setSeo = () => {
  useHead({
    title: t('seo_title'),
    meta: [
      {
        name: 'description',
        content: t('seo_desc')
      },
    ],
  })
}

setSeo()
</script>

<i18n src="./lang.yaml" lang="yaml"></i18n>

<template>
  <DelayHydration>
    <section-banner></section-banner>

    <lazy-section-category></lazy-section-category>

    <lazy-section-lists-main :query="slidersQuery" class="home-section-margin"></lazy-section-lists-main>

    <lazy-section-about class="home-section-margin"></lazy-section-about>
    
    <div class="container home-section-margin">
      <lazy-section-review-video></lazy-section-review-video>
    </div>

    <div class="container home-section-margin">
      <lazy-section-referral></lazy-section-referral>
    </div>

    <div class="container home-section-margin">
      <lazy-section-viva></lazy-section-viva>
    </div>

    <!-- <div class="container">
      <section-review></section-review>
      <lazy-section-adv></lazy-section-adv>
    </div> -->
    
    <div class="container">
      <lazy-section-article></lazy-section-article>
    </div>
    

    <!-- <div class="container">
      <section-seo></section-seo>
    </div> -->
  </DelayHydration>
</template>