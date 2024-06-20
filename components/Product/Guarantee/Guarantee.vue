<script setup>
const {t} = useI18n()
const props = defineProps({})
// COMPUTEDS
// METHODS
// HANDLERS
// WATCHERS
</script>

<style src='./guarantee.scss' lang='scss' scoped></style>
<i18n src='./lang.yaml' lang='yaml'></i18n>

<template>
  <div class="guarantee">
    <button class="guarantee-btn">
      <IconCSS name="iconoir:settings-profiles" class="guarantee-icon"></IconCSS>
      <span class="guarantee-text">{{ t('guarantee') }}</span>
    </button>
  </div>
</template>