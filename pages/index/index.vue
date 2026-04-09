<script setup>
import { useCategoryStore } from '~/store/category'

const {t, locale} = useI18n()
const { region } = useRegion()
const { get } = useSettings()
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

const resolveSettingBool = (key, fallback = true) => {
  const value = get(key, fallback)

  if (typeof value === 'string') {
    const normalized = value.trim().toLowerCase()
    if (['0', 'false', 'off', 'no'].includes(normalized))
      return false
    if (['1', 'true', 'on', 'yes'].includes(normalized))
      return true
  }

  return Boolean(value)
}

const homeSections = computed(() => ({
  banner: resolveSettingBool('site.home.sections.banner', true),
  category: resolveSettingBool('site.home.sections.category', true),
  listsMain: resolveSettingBool('site.home.sections.lists_main', true),
  about: resolveSettingBool('site.home.sections.about', true),
  reviewVideo: resolveSettingBool('site.home.sections.review_video', true),
  referral: resolveSettingBool('site.home.sections.referral', true),
  vivapoints: resolveSettingBool('site.home.sections.vivapoints', true),
  mobileSidebar: resolveSettingBool('site.home.sections.mobile_sidebar', true),
}))

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
      <section-banner v-if="homeSections.banner"></section-banner>
    </Transition>

    <section-category v-if="homeSections.category"></section-category>

    <lazy-section-lists-main
      v-if="homeSections.listsMain"
      :query="slidersQuery"
      class="home-section-margin"
    ></lazy-section-lists-main>

    <lazy-section-about v-if="homeSections.about" class="home-section-margin"></lazy-section-about>

    <!-- <lazy-section-benefits class="home-section-margin"></lazy-section-benefits> -->
    

    <div id="reviews" class="page-reveal-section">
      <section-landing-google-reviews />
    </div>
    
    <div v-if="homeSections.reviewVideo" class="container home-section-margin">
      <lazy-section-review-video></lazy-section-review-video>
    </div>

    <div v-if="homeSections.referral" class="container home-section-margin">
      <lazy-section-referral></lazy-section-referral>
    </div>

    <div v-if="homeSections.vivapoints" class="container home-section-margin home-section-margin--viva">
      <lazy-section-viva></lazy-section-viva>
    </div>

    <div v-if="$device.isMobile && homeSections.mobileSidebar" class="home-section-margin">
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
