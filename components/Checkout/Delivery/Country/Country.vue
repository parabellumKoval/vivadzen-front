<script setup>
const {t} = useI18n()
const props = defineProps({})
const {regionsMeta, region} = useRegion()
// COMPUTEDS
const currentRegion = computed(() => {
  return regionsMeta[region.value] ?? null
})
// METHODS
// HANDLERS
const openModalHandler = (event) => {
  const component = defineAsyncComponent(() => import('~/components/Modal/Region/International/International.vue'))
  useModal().open(component, null, null)
}

// WATCHERS
// console.log('currentRegion', currentRegion)
</script>

<style src='./country.scss' lang='scss' scoped></style>
<i18n src='./lang.yaml' lang='yaml'></i18n>

<template>
  <div class="country">
    <div class="country-label">{{ t('country') }}:</div>
    <div @click="openModalHandler" class="country-value">
      <template v-if="currentRegion">
        <Icon :name="currentRegion.flagClass" class="icon"></Icon>
        <div class="country-value-label">{{ currentRegion.name }}</div>
      </template>
      <template v-else>
        {{ t('label.select_country') }}
      </template>
    </div>
  </div>
</template>
