<script setup>
// import {useFetchReview} from '~/composables/review/useFetchReview.ts'
import {useReviewStore} from '~/store/review'

definePageMeta({
  tab: 0
});

const emit = defineEmits(['set:amount', 'scroll:top'])

const {t} = useI18n()
const reviews = ref([])
const reviewsMeta = ref({})


const getReviewQuery = () => {
  return {
    per_page: 12,
    reviewable_type: null,
  }
}

const {data: shopReviews} = await useLazyAsyncData('shop-reviews-page', () => useReviewStore().getAll(getReviewQuery()))

watch(shopReviews, (v) => {
  if(v) {
    reviews.value = v.reviews
    reviewsMeta.value = v.meta
  }

  emit('set:amount', {type: 'shop', value: reviewsMeta.value.total})
}, {
  immediate: true
})

useFetchReview().getReviewsAmount('products').then((v) => {
  emit('set:amount', {type: 'products', value: v})
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

<style src="./shop.scss" lang="scss" scoped></style>

<template>
  <div class="review-wrapper">
    <div class="review-grid">
      <review-card-personal
        v-for="review in reviews"
        :key="review.id"
        :item="review"
        class="shop-review-card"
      ></review-card-personal>
    </div>
    <simple-pagination
      v-if="reviewsMeta.last_page > 1"
      :total="reviewsMeta.last_page"
      :current="reviewsMeta.current_page"
      @update:current="updatePageHandler"
      class="review-pagination"
    ></simple-pagination>
  </div>
</template>