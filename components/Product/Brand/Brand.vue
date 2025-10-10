<script setup>
const {t} = useI18n()
const props = defineProps({
  product: {
    type: Object
  }
})
// COMPUTEDS
// METHODS
// HANDLERS
// WATCHERS
</script>

<style src='./brand.scss' lang='scss' scoped></style>
<!-- <i18n src='' lang='yaml'></i18n> -->

<template>
  <div class="brand">
    <span class="brand-label">{{ $t('label.brand') }}:</span>
    <NuxtLink :to="$regionPath('/brands/' + product.brand.slug)" class="brand-value text-link">
      <span>{{ product.brand.name }}</span>
    </NuxtLink>
  </div>
</template>