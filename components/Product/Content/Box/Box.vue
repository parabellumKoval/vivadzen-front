<script setup>
const {t} = useI18n()
const props = defineProps({
  content: {
    required: false
  },
  no_medicine: {
    default: 1
  }
})

const emit = defineEmits(['more'])
</script>

<style src="./../../box.scss" lang="scss" scoped></style>
<style src="./box.scss" lang="scss" scoped></style>
<i18n src="./lang.yaml" lang="yaml"></i18n>

<template>
  <div class="product-box">
    <div class="mobile-title">{{ t('label.desc') }}</div>

    <div class="content rich-text" v-html="content"></div>

    <button @click="emit('more')" class="button secondary darker more-btn">
      {{ t('more') }}
    </button>
  </div>
</template>