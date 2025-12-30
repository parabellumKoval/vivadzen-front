<script setup>

const { t } = useI18n()

const openMenuHandler = (event) => {
  const component = defineAsyncComponent(() => import('~/components/Modal/Catalog/Catalog.client.vue'))
  useModal().open(component, null, event.target.closest('[modalable]'), {
    width: {
      min: '1280px',
      max: '1760px'
    },
    align: { x: 'left', y: 'top' },
    // detach: { x: true }
  })
}
</script>

<style src="./catalog.scss" lang="scss" scoped />
<i18n src="./lang.yaml" lang="yaml"></i18n>

<template>
  <button @click="openMenuHandler" class="catalog-btn btn" type="button" modalable clickable>
    <IconCSS name="mynaui:grid" size="28px" class="icon"></IconCSS>
    <span class="text">{{ t('catalog') }}</span>
  </button>
</template>
