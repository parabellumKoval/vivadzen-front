<script setup>
const {t, locale} = useI18n()
const text = await queryContent('main').locale(locale.value).findOne()
// const text = await queryContent('main').locale(locale.value).find()
console.log('text', text)
</script>

<style src="./seo.scss" lang="scss" scoped></style>
<style src="~/assets/scss/_rich-text.scss" lang="scss" scoped></style>

<i18n src="./lang.yaml" lang="yaml"></i18n>

<template>
  <section class="main-section">
    <!-- <ContentRenderer :value="text" /> -->
    <div class="rich-text lists-margin" v-html="text.content"></div>
  </section>
</template>