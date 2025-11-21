<script setup>
import { useCategoryStore } from '~/store/category'
const {t} = useI18n()

const timeout = ref(null);
const articles = ref([])
const activeTag = ref('kanabinoidy')
const activeIndex = ref(0)

//
const categories = computed(() => {
  const allCategories = useCategoryStore().list
  return allCategories.filter(category => {
    if (category.extras?.on_main === '1') return true
    else return false
  })
})

const activeArticles = computed(() => {
  if(activeTag.value) {
    return articles.value[activeTag.value] || []
  }else {
    return []
  }
})

// console.log('categories', categories.value);

const getTag = (category) => {
  if(category.tags && category.tags[0]) {
    return category.tags[0].text || null
  }
  return null
}
const activeCategoryDesc = computed(() => {
  const category = categories.value[activeIndex.value];
  return category? category?.name + ' guidebooks' : '';
})


const slideChangedHandler = (newIndex) => {
  clearTimeout(timeout.value);

  timeout.value = setTimeout(() => {
    activeIndex.value = newIndex;
    const newTag = getTag(categories.value[newIndex])
    activeTag.value = newTag || null
  }, 300);
  
}

const {data: dataArticles} = await useAsyncData('homepage-main-articles', () => useFetcherData('homepage-main-articles'))

watch(dataArticles, (value) => {

  if(value.data) {
    articles.value = value.data
  }
}, { immediate: true })
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
      
      <div class="sidebar">
        <div class="sidebar-title">Guidebook</div>
        <div class="sidebar-content">
          <div class="sidebar-content-label">{{ activeCategoryDesc }}</div>
          <Transition name="fade-in">
            <template v-if="activeArticles.length">
              <TransitionGroup name="fade-in" tag="div" class="sidebar-articles">
                <ArticleCardMini v-for="article in activeArticles" :key="article.id" :item="article" />
              </TransitionGroup>
            </template>
            <template v-else>
              <div class="no-articles">No articles available.</div>
            </template>
          </Transition>
        </div>
        <NuxtLink :to="$regionPath('/blog')" class="button primary sidebar-btn">All guidebooks</NuxtLink>
      </div>
    </div>
  </section>
</template>
