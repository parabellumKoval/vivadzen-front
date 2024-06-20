<script setup>
import {useCart} from '~/composables/product/useCart.ts'

const props = defineProps({
  product: {
    type: Object
  }
})

const amount = ref(1)
const {toCartHandler} = useCart(props.product)

// HANDLERS
const addToCartHandler = () => {
  const count = amount.value
  toCartHandler(count)
  amount.value = 1
}

const oneClickHandler = () => {
  useModal().open(resolveComponent('Modal1Click'), props.product, null, {width: {min: 420, max: 420}})
}
</script>

<style src="./block.scss" lang="scss" scoped></style>

<template>
  <div class="block">
    
    <div class="price-block">
      <product-price
        :price="product.price"
        :old-price="product.oldPrice"
        dir="left"
        class="price-comp"
      ></product-price>

      <product-available :in-stock="product.inStock" type="full" class="price-available"></product-available>

      <lazy-product-guarantee class="price-guarantee"></lazy-product-guarantee>
    </div>

    <div v-if="product.inStock" class="sale">
      <form-amount v-model="amount" size="large" class="sale-amount"></form-amount>

      <button @click="addToCartHandler" class="button primary sale-btn-cart">{{ $t('button.to_cart') }}</button>
      
      <button @click="oneClickHandler" class="button color-primary inline-icon sale-btn-one">
        <IconCSS name="iconoir:flash" class="icon"></IconCSS>
        <span>{{ $t('button.1_click_buy') }}</span>
      </button>
    </div>

  </div>
</template>