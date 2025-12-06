<script setup>
import {useComparison} from '~/composables/product/useComparison.ts'
import {useFavorite} from '~/composables/product/useFavorite.ts'
import {useCart} from '~/composables/product/useCart.ts'

const props = defineProps({
  product: {
    type: Object
  }
})

const {isComparison, toComparisonHandler} = useComparison(props.product.id)
const {isFavorite, toFavoriteHandler} = useFavorite(props.product.id)
const {toCartHandler} = useCart(props.product)
const {ensureRegionSelected} = useRegionPurchaseGuard()

// COMPUTEDS
const favoriteIcon = computed(() => {
  if(isFavorite.value) {
    return 'iconoir:heart-solid'
  }else {
    return 'iconoir:heart'
  }
})

const imageSrc = computed(() => {
  return props.product?.images && props.product.images.length > 0 ? props.product.images[0].src : useImg().noImage
})

const isModification = computed(() => {
  if(props.product.modifications && props.product.modifications.length > 0 && props.product.short_name !== '' && props.product.short_name !== null) {
    return true
  }
  return false
})
const buyHandler = () => {
  ensureRegionSelected(() => {
    toCartHandler(1)
  })
}
</script>

<style src='./fixed.scss' lang='scss' scoped></style>
<!-- <i18n src='' lang='yaml'></i18n> -->

<template>
  <div class="sale-fixed">
    <!-- <button @click="toComparisonHandler" :class="{active: isComparison}" class="sale-fixed-btn comparison-btn">
      <IconCSS name="ph:scales-light" size="24"></IconCSS>
    </button>

    <button @click="toFavoriteHandler" :class="{active: isFavorite}" class="sale-fixed-btn favorite-btn">
      <IconCSS :name="favoriteIcon" size="24"></IconCSS>
    </button> -->

    <div>
      <nuxt-img
        :src = "imageSrc"
        sizes = "40px"
        format = "avif"
        quality = "40"
        fit="outside"
        :placeholder="useImg().noImage"
        loading="lazy"
        class="thumbnail-image"
      >
      </nuxt-img> 
    </div>
    
    <div class="content">
      <div class="name">{{ product.name }}</div>
      <div class="desc">
        <div v-if="isModification" class="modification">{{ product.short_name }}</div>
      </div>
    </div>

    <div class="price-block">
      <simple-price v-if="product.oldPrice" :value="product.oldPrice" class="price-old"></simple-price>
      <simple-price :value="product.price" class="price-base"></simple-price>
    </div>

    <button v-if="product.inStock" @click="buyHandler" class="button primary buy-btn">
      <IconCSS name="ci:shopping-cart-01" class="icon"></IconCSS>
      <!-- {{ $t('button.buy') }} -->
    </button>
  </div>
</template>
