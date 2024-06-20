<script setup>
const {t} = useI18n()

const props = defineProps({
  items: {
    type: Array
  }
})

</script>

<style src="./../../box.scss" lang="scss" scoped></style>
<style src="./box.scss" lang="scss" scoped></style>
<i18n src="./lang.yaml" lang="yaml"></i18n>

<template>
  <div class="product-box">
    <lazy-simple-list-params v-if="$device.isDesktop" :items="items" class="params-vertical"></lazy-simple-list-params>
    <lazy-simple-list-params-horizontal v-else :items="items" class="params-horizontal"></lazy-simple-list-params-horizontal>

    <button v-if="$device.isDesktop" @click="paramsHandler" class="text-link box-btn">
      <span>{{ t('all_attrs') }}</span>
      <IconCSS name="iconoir:arrow-right" class="icon"></IconCSS>
    </button>
  </div>
</template>