<script setup>
const openHandler = (event) => {
  if(useDevice().isMobile) {
    useModal().open(resolveComponent('ModalMenuMobile'))
  }else {
    useModal().open(resolveComponent('ModalMenuInfo'), null, event.target.closest('[modalable]'), {width: {
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