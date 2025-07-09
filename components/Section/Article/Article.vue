<script setup>
import {useArticleStore} from '~/store/article'
const localePath = useLocalePath()

const {t} = useI18n()
const articles = ref([])

const {data: dataArticles} = await useArticleStore().indexLazy({per_page: 6})

watch(dataArticles, (v) => {
  if(v?.data) {
    articles.value = v.data
  }
}, {
  immediate: true,
  deep: true
})
</script>

<style src="./article.scss" lang="scss" scoped></style>
<i18n src="./lang.yaml" lang="yaml"></i18n>

<template>
  <section class="main-section">
    <div class="section-title">{{ t('title.articles') }}</div>
    <div v-if="articles" class="articles-wrapper">
      <article-card v-for="(article, index) in articles" :key="article.id" :index="index" :item="article" class="articles-item"></article-card>
    </div>
    <div class="footer-wrapper">
      <NuxtLink :to="localePath('/blog')" class="button secondary">{{ t('articles') }}</NuxtLink>
    </div>
  </section>
</template>