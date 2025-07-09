<script setup>
const props = defineProps({
  price: {
    type: Number
  },
  oldPrice: {
    type: Number
  },
  dir: {
    type: String,
    default: 'right'
  }
})
</script>

<style src='./price.scss' lang='scss' scoped></style>

<template>
  <div class="price" :class="dir">
    <simple-price v-if="oldPrice" :value="oldPrice" :currency="false" class="old-pr"></simple-price>
    <simple-price v-if="price" :value="price" class="pr"></simple-price>
  </div>
</template>