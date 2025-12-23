<script setup>
import {useCart} from '~/composables/product/useCart.ts'
import { useStoreOnly } from '~/composables/useStoreOnly'
const {t} = useI18n()

const props = defineProps({
  product: {
    type: Object
  }
})

const amount = ref(1)
const {toCartHandler} = useCart(props.product)
const {ensureRegionSelected} = useRegionPurchaseGuard()
const { isStoreOnly, openStoreOnlyModal } = useStoreOnly(props.product)

// COMPUTEDS
const total = computed(() => {
  const price = props.product.price || 0
  return price * amount.value
})

// HANDLERS
const addToCartHandler = () => {
  ensureRegionSelected(() => {
    const count = amount.value
    toCartHandler(count)
    amount.value = 1
  })
}

const oneClickHandler = () => {
  ensureRegionSelected(() => {
    useModal().open(resolveComponent('Modal1Click'), props.product, null, {width: {min: 420, max: 420}})
  })
}

const openStoreOnlyHandler = () => {
  openStoreOnlyModal(props.product)
}
</script>

<style src="./block.scss" lang="scss" scoped></style>
<i18n src="./../lang.yaml" lang="yaml"></i18n>

<template>
  <div class="block">
    
    <div class="available-block">
      <product-available :in-stock="product.inStock" type="full" class="available-value"></product-available>
      <lazy-product-guarantee class="available-guarantee"></lazy-product-guarantee>
    </div>

    <div class="price-wrapper">
      <div class="price-block">
        <form-amount v-model="amount"></form-amount>

        <product-price
          :price="product.price"
          :old-price="product.oldPrice"
          dir="left"
          :class="{priceSale: product.sale}"
          class="price-comp"
        ></product-price>

        <div v-if="product.sale"  class="sale">
          <div classs="sale-label">{{ t('sale') }}</div>
          <div classs="sale-amount">-{{ product.sale }}%</div>
        </div>
      </div>
      <transition name="fade-in">
        <div v-if="amount > 1" class="total-price">
          <span>{{ t('total_cost_for') }} {{ amount }}{{ t('pcs') }}:</span>
          <simple-price :value="total" class="total-price-value"></simple-price>
        </div>
      </transition>
    </div>

    <div v-if="product.inStock" class="sell">
      <template v-if="isStoreOnly">
        <button @click="openStoreOnlyHandler" class="button color-primary inline-icon sell-btn-cart">
          <IconCSS name="ci:map-pin" class="icon"></IconCSS>
          <span>{{ $t('store_only.button') }}</span>
        </button>
      </template>
      <template v-else>
        <button @click="addToCartHandler" class="button primary sell-btn-cart">{{ $t('button.to_cart') }}</button>
        
        <button @click="oneClickHandler" class="button color-primary inline-icon sell-btn-one">
          <IconCSS name="streamline:flash-1-remix" class="icon"></IconCSS>
          <span>{{ $t('button.1_click_buy') }}</span>
        </button>
      </template>
    </div>

  </div>
</template>
