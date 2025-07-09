<script setup>

const props = defineProps({
  categories: {
    type: Boolean,
    default: true
  }
})

</script>

<style src="~/assets/scss/layout-catalog-skeleton.scss" lang="scss" scoped></style>

<template>
  <div class="page-base">
    <div class="container">
      <the-breadcrumbs-skeleton></the-breadcrumbs-skeleton>

      <div class="title"></div>

      <catalog-categories-skeleton v-if="props.categories" class="categories"></catalog-categories-skeleton>

      <div class="content">
        <div class="filters">
          <div class="filter"></div>
          <div class="filter"></div>
        </div>
        <div class="content-grid">
          <product-card-skeleton v-for="i in 12" :key="i"></product-card-skeleton>
        </div>
      </div>
    </div>
  </div>
</template>