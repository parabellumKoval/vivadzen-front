<script setup>
const {t, locale} = useI18n()

const breadcrumbs = [
  {
    name: t('title.home'),
    item: '/'
  },{
    name: t('title.remove_userdata'),
    item: '/remove-userdata'
  }
]
// COMPUTEDS
// METHODS
// HANDLERS
// WATCHERS
</script>

<style src='~/assets/scss/_rich-text.scss' lang='scss' scoped></style>
<style src='./terms.scss' lang='scss' scoped></style>
<!-- <i18n src='' lang='yaml'></i18n> -->

<template>
<div class="page-base">
  <div class="container">
    <the-breadcrumbs :crumbs="breadcrumbs"></the-breadcrumbs>

    <div class="title-common">{{ t('title.remove_userdata') }}</div>

    <div class="rich-text"> 
      Instraction
    </div>
  </div>
</div>
</template>