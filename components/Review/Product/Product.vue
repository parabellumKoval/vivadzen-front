<script setup>
const props = defineProps({
  item: {
    type: Object
  },
  hideReplies: {
    type: Boolean,
    default: false
  }
})

</script>

<style src="./product.scss" lang="scss" scoped></style>

<template>
  <div v-if="item" class="review-wrapper">
    <div v-if="item.product" class="product">
      <product-card-micro :item="item.product"></product-card-micro>
    </div>
    <div class="devide"></div>
    <review-card-full :item="item" :hide-replies="hideReplies" class="review-mini"></review-card-full>
  </div>
</template>