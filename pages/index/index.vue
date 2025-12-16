<script setup>
import { useCategoryStore } from '~/store/category'

const {t, locale} = useI18n()
const { region } = useRegion()
const categoryStore = useCategoryStore()

await useAsyncData('main-categories-sidebar-'+locale.value+'-'+region.value, () =>
  categoryStore.listMainCached()
)

const categories = computed(() => categoryStore.mainList)

const { data: mobileArticlesData } = await useAsyncData('homepage-main-articles-mobile-'+locale.value+'-'+region.value, () =>
  useFetcherData('homepage-main-articles')
)

const mobileArticles = computed(() => {
  return mobileArticlesData.value?.data || {}
})

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
    <Transition name="block-from-top" appear>
      <section-banner></section-banner>
    </Transition>

    <section-category></section-category>

    <lazy-section-lists-main :query="slidersQuery" class="home-section-margin"></lazy-section-lists-main>

    <lazy-section-about class="home-section-margin"></lazy-section-about>

    <!-- <lazy-section-benefits class="home-section-margin"></lazy-section-benefits> -->
    
    <div class="container home-section-margin">
      <lazy-section-review-video></lazy-section-review-video>
    </div>

    <div class="container home-section-margin">
      <lazy-section-referral></lazy-section-referral>
    </div>

    <div class="container home-section-margin home-section-margin--viva">
      <lazy-section-viva></lazy-section-viva>
    </div>

    <div v-if="$device.isMobile" class="home-section-margin">
      <SectionAboutSidebar
        :categories="categories"
        :articles-by-tag="mobileArticles"
        :guidebooks-link="$regionPath('/blog')"
      />
    </div>

    <!-- <div class="container">
      <section-seo></section-seo>
    </div> -->
  </DelayHydration>
</template>
