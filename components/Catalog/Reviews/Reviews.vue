<script setup>
// import {useReviewStore} from '~/store/review'

const props = defineProps({
  slug: {
    type: String
  },
  categoryName: {
    type: String
  },
  reviews: {
    type: Array
  }
})

const {t} = useI18n()

// Reviews
const reviews = ref([])
const reviewsMeta = ref({})

// METHODS
const setInitData = () => {
  if(props.reviews) {
    reviews.value = props.reviews.data
    reviewsMeta.value = props.reviews.meta
  }
}

setInitData()
</script>

<style src="./reviews.scss" lang="scss" scoped></style>
<i18n src="./lang.yaml" lang="yaml"></i18n>

<template>
  <div v-if="reviewsMeta?.total" class="review">
    <div class="title-secondary review-title">{{ t('review') }} {{ categoryName }}</div>
    <div class="review-header">
      <simple-stars :amount="reviewsMeta?.rating_avg || 0" class="simple-start"></simple-stars>
      <div class="review-count">
        {{ t('messages.rates_reviews', {rates: (reviewsMeta?.rating_count || 0),reviews: (reviewsMeta?.total || 0)}) }}
      </div>
      <NuxtLink :to="$regionPath('/reviews/products')" class="text-link"><span>{{ t('button.view_all_reviews') }}</span></NuxtLink>
    </div>
    <review-product v-for="review in reviews" :key="review.id" :item="review" :hide-replies="true" class="review-item"></review-product>
  </div>
</template>