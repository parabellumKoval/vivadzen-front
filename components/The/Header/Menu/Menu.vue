<script setup>
const {t} = useI18n()

const openHandler = (event) => {
  if(useDevice().isMobile) {
    const component = defineAsyncComponent(() => import('~/components/Modal/Menu/Mobile/Mobile.vue'))
    useModal().open(component)
  }else {
    const component = defineAsyncComponent(() => import('~/components/Modal/Menu/Info/Info.vue'))
    useModal().open(component, null, event.target.closest('[modalable]'), {width: {
      min: 420, max: 420
    }})
  }
}
</script>

<style src="./menu.scss" lang="scss" scoped ></style>
<i18n src="./lang.yaml" lang="yaml"></i18n>

<template>
  <button @click="openHandler" class="btn-menu" modalable>
    <IconCSS name="mynaui:menu" size="28" class="icon"></IconCSS>
    <span class="btn-menu-label">{{ t('menu') }}</span>
  </button>
</template>