<script setup>
const {t} = useI18n()

const props = defineProps({
  reviews: {
    type: Array
  },
  meta: {
    type: Object
  },
  product: {
    type: Object
  },
  amount: {
    type: Number,
    default: 0
  }
})

const emit = defineEmits(['more, loadReviews'])

const reviewsComponentRef = ref(null)

const reviewHandler = () => {
  reviewsComponentRef.value.createReviewHandler()
}

defineExpose({
  reviewHandler
})
</script>

<style src="./../../box.scss" lang="scss" scoped></style>
<!-- <style src="./box.scss" lang="scss" scoped></style> -->
<i18n src="./lang.yaml" lang="yaml"></i18n>

<template>
  <div class="product-box">
    <lazy-product-reviews
      :reviews="reviews"
      :meta="meta"
      :product="product"
      :amount="amount"
      @update:current="(v) => emit('loadReviewsHandler', v)"
      ref="reviewsComponentRef"
    ></lazy-product-reviews>
    <button v-if="meta?.total && meta?.total > amount" @click="emit('more')" class="button secondary darker more-btn">
      {{ t('more_reviews') }}
    </button>

    <button v-if="$device.isDesktop && meta?.total && meta?.total > amount" @click="emit('more')" class="text-link box-btn">
      <span>{{ t('more_reviews') }}</span>
      <IconCSS name="iconoir:arrow-right" class="icon"></IconCSS>
    </button>
  </div>
</template>