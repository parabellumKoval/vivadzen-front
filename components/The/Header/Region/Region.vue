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
  <div>
    <button @click="openModalHandler" class="region-btn" clickable>
      <Icon :name="regionMeta.flagClass"  class="icon"></Icon>
      <div class="region-content">
        <div class="region-value">
          <div class="label">{{ t('delivery_country') }}</div>
          <div class="country">{{ t(regionMeta.name) }}</div>
        </div>
        <div class="region-value">
          <div class="label">{{ t('interface_language') }}</div>
          <div class="lang">{{ localeProperties.shortName }}</div>
        </div>
      </div>
    </button>
  </div>
</template>