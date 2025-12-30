<script setup>
const {t, localeProperties} = useI18n()
const {regionsMeta, region} = useRegion()
const props = defineProps({})

// COMPUTEDS
// METHODS
// HANDLERS
// WATCHERS
const regionMeta = computed(() => {
  return regionsMeta[region.value]
})
const openModalHandler = (event) => {
  const component = defineAsyncComponent(() => import('~/components/Modal/Region/Region.client.vue'))
  useModal().open(component, null, null)
}
</script>

<style src='./region.scss' lang='scss' scoped></style>
<i18n src='./lang.yaml' lang='yaml'></i18n>

<template>
  <button @click="openModalHandler" class="region-block" clickable>
    <div class="supheader-btn region-unit">
      <Icon :name="regionMeta.flagClass"  class="icon"></Icon>
      <div class="unit-info">
        <span class="unit-info-label">{{ t('delivery_country') }}</span>
        <span class="unit-info-value">{{ t(regionMeta.name) }}</span>
      </div>
    </div>
    <div class="supheader-delim"></div>
    <div class="supheader-btn region-unit">
      <IconCSS name="hugeicons:language-skill" class="icon"></IconCSS>
      <div class="unit-info">
        <span class="unit-info-label">{{ t('interface_language') }}</span>
        <span class="unit-info-value">{{ localeProperties.name }}</span>
      </div>
    </div>
  </button>
</template>