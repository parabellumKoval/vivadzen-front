<script setup>
const {t} = useI18n()
const props = defineProps({})
// COMPUTEDS
// METHODS
// HANDLERS
// WATCHERS

const emit = defineEmits(['more'])
</script>

<style src='./guarantee.scss' lang='scss' scoped></style>
<i18n src='./lang.yaml' lang='yaml'></i18n>

<template>
  <div class="guarantee">
    <button @click="emit('more')" class="guarantee-btn">
      <IconCSS name="iconoir:settings-profiles" class="guarantee-icon"></IconCSS>
      <span class="guarantee-text">{{ t('guarantee') }}</span>
    </button>
  </div>
</template>