<script setup>
import { useCartStore } from '~~/store/cart';

const { t } = useI18n()

const openCartHandler = () => {
  const component = defineAsyncComponent(() => import('~/components/Modal/Cart/Cart.client.vue'))
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
    <div class="cart-btn-inner">
      <IconCSS name="ci:shopping-cart-01" class="icon"></IconCSS>
      <transition name="zoom">
        <div v-if="cartLength" class="budge">{{ cartLength }}</div>
      </transition>
    </div>
  </button>
</template>