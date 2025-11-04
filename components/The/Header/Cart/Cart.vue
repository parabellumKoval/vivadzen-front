<script setup>
import { useCartStore } from '~~/store/cart';

const { t } = useI18n()

const openCartHandler = () => {
  const component = defineAsyncComponent(() => import('~/components/Modal/Cart/Cart.vue'))
  useModal().open(component, null, null, {width: {
    min: 968, max: 968
  }})
}

const cartLength = computed(() => {
  return useCartStore().cartLength
})

</script>

<style src="./cart.scss" lang="scss" scoped />

<template>
  <button @click="openCartHandler" class="header-btn cart-btn" type="button" clickable>
    <IconCSS name="mynaui:cart" size="34px" class="icon"></IconCSS>
    <transition name="zoom">
      <div v-if="cartLength" class="budge">{{ cartLength }}</div>
    </transition>
  </button>
</template>