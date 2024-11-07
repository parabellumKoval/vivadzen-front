<script setup>
const {t} = useI18n()
const props = defineProps({})
// COMPUTEDS
// METHODS
// HANDLERS
// WATCHERS
</script>

<style src='./no-medicine.scss' lang='scss' scoped></style>
<i18n src='./lang.yaml' lang='yaml'></i18n>

<template>
  <div class="no-medicine">{{ t('no_medicine') }}</div>
</template>