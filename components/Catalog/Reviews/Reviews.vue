<script setup>
import {useReviewStore} from '~/store/review'

const props = defineProps({
  slug: {
    type: String
  },
  category: {
    type: Object
  }
})

const {t} = useI18n()

// Reviews
const reviews = ref([])
const reviewsMeta = ref({})

const {pending, data: reviewsData} = await useLazyAsyncData(() => useReviewStore().getAll({
  per_page: 6,
  category_slug: props.slug,
  resource: 'large'
}))

watch(reviewsData, (v) => {
  if(v?.reviews) {
    reviews.value = v.reviews
  }
  
  if(v?.meta) {
    reviewsMeta.value = v.meta
  }
}, {
  immediate: true
})
</script>

<style src="./reviews.scss" lang="scss" scoped></style>
<i18n src="./lang.yaml" lang="yaml"></i18n>

<template>
  <div v-if="reviewsMeta?.total" class="review">
    <div class="title-secondary review-title">{{ t('review') }} {{ category.name }}</div>
    <div class="review-header">
      <simple-stars :amount="reviewsMeta?.rating_avg || 0"></simple-stars>
      <div class="review-count">
        {{ t('messages.rates_reviews', {rates: (reviewsMeta?.rating_count || 0),reviews: (reviewsMeta?.total || 0)}) }}
      </div>
    </div>
    <review-product v-for="review in reviews" :key="review.id" :item="review" type="mini" class="review-item"></review-product>
  </div>
</template>