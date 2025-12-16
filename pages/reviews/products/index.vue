<script setup>
// import {useFetchReview} from '~/composables/review/useFetchReview.ts'
import {useReviewStore} from '~/store/review'

const reviews = ref([])
const reviewsMeta = ref({})

definePageMeta({
  tab: 1
});

const emit = defineEmits(['set:amount', 'scroll:top'])

const getReviewQuery = () => {
  return {
    per_page: 12,
    reviewable_type: String.raw`App\Models\Product`,
    // resource: 'large'
  }
}

const {data: productReviews} = await useLazyAsyncData('product-reviews-page', () => useReviewStore().getAll(getReviewQuery()))

watch(productReviews, (v) => {
  if(v) {
    reviews.value = v.reviews
    reviewsMeta.value = v.meta
  }

  emit('set:amount', {type: 'products', value: reviewsMeta.value.total})
}, {
  immediate: true
})

useFetchReview().getReviewsAmount('shop').then((v) => {
  emit('set:amount', {type: 'shop', value: v})
})

const updatePageHandler = async (page) => {
  const query = {
    ...getReviewQuery(),
    page: page
  }

  await useReviewStore().getAll(query).then((r) => {

    if(r) {
      reviews.value = r.reviews
      reviewsMeta.value = r.meta
    }
    
    emit('scroll:top')
  })

}

</script>

<style src="./products.scss" lang="scss" scoped></style>

<template>
  <div class="review-wrapper">
    <div class="review-grid">
      <review-product v-for="review in reviews" :key="review.id" :item="review" type="full" class="shop-review-card"></review-product>
    </div>
    
    <simple-pagination
      :total="reviewsMeta.last_page"
      :current="reviewsMeta.current_page"
      @update:current="updatePageHandler"
      class="review-pagination"
    ></simple-pagination>
  </div>
</template>
