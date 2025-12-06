<script setup>
import { useCategoryStore } from '~/store/category'
const timeout = ref(null)
const articlesByTag = ref({})
const activeTag = ref(null)
const activeIndex = ref(0)

//
const categoryStore = useCategoryStore()
const { locale } = useI18n()
const { region } = useRegion()


const { refresh: refreshMainCategories } = useAsyncData('main-categories-'+locale.value+'-'+region.value, () =>
  categoryStore.listMainCached()
)


const categories = computed(() =>  {
  return categoryStore.mainList
})

const getTag = (category) => {
  if(category.tags && category.tags[0]) {
    return category.tags[0].text || null
  }
  return null
}

// Initialize activeTag from first category
watch(categories, (newCategories) => {
  if (newCategories && newCategories.length > 0 && !activeTag.value) {
    activeTag.value = getTag(newCategories[0])
  }
}, { immediate: true })

const slideChangedHandler = (newIndex) => {
  clearTimeout(timeout.value)

  timeout.value = setTimeout(() => {
    activeIndex.value = newIndex
    const newTag = getTag(categories.value[newIndex])
    activeTag.value = newTag || null
  }, 300)
  
}

const {data: dataArticles} = await useAsyncData('homepage-main-articles-'+locale.value+'-'+region.value, () => useFetcherData('homepage-main-articles'))

watch(dataArticles, (value) => {

  if(value.data) {
    articlesByTag.value = value.data
  }
}, { immediate: true })

// watch(() => [locale.value, region.value], () => {
//   void refreshArticles()
//   void refreshMainCategories()
// })
</script>

<style src="./about.scss" lang="scss" scoped></style>
<style src="~/assets/scss/snap-nav.scss" lang="scss" scoped></style>
<template>
  <section class="about about-wrapper main-section" aria-label="About Hemp">
    <div class="about-content">
      <SnapCarousel
        mode="page"
        :items="categories"
        :items-per-page="1"
        :loop="true"
        :show-arrows="true"
        :show-dots="true"
        class="about-carousel"
        @pageChange="slideChangedHandler"
      >
        <template #item="{ item }">
          <SectionAboutItem :item="item" />
        </template>
        <template #prev>
          <IconCSS name="mynaui:chevron-left" size="24"></IconCSS>
        </template>
        <template #next>
          <IconCSS name="mynaui:chevron-right" size="24"></IconCSS>
        </template>
      </SnapCarousel>
      
      <SectionAboutSidebar
        v-if="!$device.isMobile"
        :categories="categories"
        :articles-by-tag="articlesByTag"
        :active-tag="activeTag"
        :guidebooks-link="$regionPath('/blog')"
      />
    </div>
  </section>
</template>
