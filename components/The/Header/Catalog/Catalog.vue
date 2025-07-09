<script setup>

const { t } = useI18n()

const openMenuHandler = () => {
  const component = defineAsyncComponent(() => import('~/components/Modal/Catalog/Catalog.vue'))
  useModal().open(component, null, null, {width: {
    min: 'calc(100vw - 90px)',
    max: 'calc(100vw - 90px)'
  }})
}
</script>

<style src="./catalog.scss" lang="scss" scoped />
<i18n src="./lang.yaml" lang="yaml"></i18n>

<template>
  <button @click="openMenuHandler" class="catalog-btn btn" type="button" clickable>
    <IconCSS name="iconoir:view-grid" size="24px" class="icon"></IconCSS>
    <span class="text">{{ t('catalog') }}</span>
  </button>
</template>