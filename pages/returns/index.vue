<script setup>
const {t, locale} = useI18n()

const data = await queryContent('returns').locale(locale.value).findOne()
const breadcrumbs = [
  {
    name: t('title.home'),
    item: '/'
  },{
    name: t('title.returns'),
    item: '/returns'
  }
]

console.log('data returns', data)
// COMPUTEDS
// METHODS
// HANDLERS
// WATCHERS
</script>

<style src='~/assets/scss/_rich-text.scss' lang='scss' scoped></style>
<style src='./returns.scss' lang='scss' scoped></style>
<!-- <i18n src='' lang='yaml'></i18n> -->

<template>
  <div class="page-base">
    <div class="container">
      <the-breadcrumbs :crumbs="breadcrumbs"></the-breadcrumbs>

      <div class="title-common">{{ t('title.returns') }}</div>

          <div class="rich-text" v-html="data.text"></div>

    </div>
  </div>
</template>