<script setup>
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

<template>
  <button @click="openHandler" class="btn-menu btn" modalable>
    <IconCSS name="iconoir:menu" size="24" class="icon"></IconCSS>
  </button>
</template>