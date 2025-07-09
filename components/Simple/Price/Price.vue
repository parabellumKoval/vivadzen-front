<script setup>
const props = defineProps({
  value: {
    type: Number
  },
  currency: {
    type: Boolean,
    default: true
  }
})
</script>

<style src="./price.scss" lang="scss" scoped />

<template>
  <div class="price" v-if="value !== null">
    <span class="value">
      <i18n-n v-if="currency" :value="value" format="currency" />
      <i18n-n v-else :value="value" format="cur" />
    </span>
  </div>
</template>