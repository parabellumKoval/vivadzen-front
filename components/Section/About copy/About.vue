<script setup>
import { useCategoryStore } from '~/store/category'
const {t} = useI18n()

const articles = ref([])

//
const categories = computed(() => {
  const allCategories = useCategoryStore().list
  return allCategories.filter(category => {
    if (category.extras?.on_main === '1') return true
    else return false
  })
})

// console.log('categories', categories.value);

const getTag = (category) => {
  if(category.tags && category.tags[0]) {
    return category.tags[0].text || null
  }
  return null
}

const {data: dataArticles} = await useAsyncData('homepage-main-articles', () => useFetcherData('homepage-main-articles'))

watch(dataArticles, (value) => {

  if(value.data) {
    articles.value = value.data
  }
}, { immediate: true })
</script>

<style src="./about.scss" lang="scss" scoped></style>
<i18n src="./lang.yaml" lang="yaml"></i18n>

<template>
  <section class="hemp-section main-section" aria-label="About Hemp">
    <div
      class="slides"
      role="region"
      :aria-label="ariaLabel"
    >
      <article
        v-for="(s, i) in categories"
        :key="i"
        class="slide"
      >
        <div class="slide-inner">
          <div class="slide-media">
            <nuxt-img
              :src = "s.image?.src"
              :alt = "s.image?.alt || s.title"
              :title = "s.image?.title || s.title"
              width="500"
              height="500"
              sizes = "mobile:100vw tablet:500px desktop:600px"
              format = "webp"
              quality = "60"
              loading = "lazy"
              fit="outside"
              class="category-image"
            ></nuxt-img>
          </div>

          <div class="slide-content">
            <p class="slide-eyebrow">{{ s.name }}</p>

            <div
              class="slide-title font-alegreya"
              v-html="s.extras_trans?.caption"
            ></div>

            <div v-if="s.extras_trans?.full_description" class="slide-full_desc" v-html="s.extras_trans?.full_description"></div>

            <div v-if="s.children?.length" class="slide-chips" role="list">
              <NuxtLink v-for="child in s.children" :to="$regionPath('/' + child.slug)" :key="child.id" class="slide-chip" role="listitem">
                {{ child.name }}
              </NuxtLink>
            </div>
          </div>
        </div>
      </article>
    </div>

    <!-- Нативный скроллбар внизу (без JS) -->
    <div class="progress-rail" aria-hidden="true"></div>
  </section>
</template>
