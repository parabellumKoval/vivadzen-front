<script setup>
import {useAuthStore} from '~/store/auth';
import {useReviewStore} from '~/store/review'

const {t} = useI18n()

const reviews = ref([])
const feedback = ref([])

const simpleSnapSliderRef = ref(null)
const component = resolveComponent('ReviewPersonal')

const options = ref({
  card: {
    width: {
      mobile: '100%',
      desktop: '100%'
    }
  }
})

const pagination = ref({
  isActive: false,
  activeIndex: 0,
  total: 0,
  progress: 0
})

// COMPUTED

// HANDLERS
const setPaginationHandler = (val) => {
  pagination.value.isActive = val.isActive
  pagination.value.total = val.total
}

const prevHandler = () => {
  simpleSnapSliderRef.value.prevHandler()
}
const nextHandler = () => {
  simpleSnapSliderRef.value.nextHandler()
}

const selectHandler = (v) => {
  simpleSnapSliderRef.value.selectHandler(v)
  setActiveIndex(v)
}

// METHODS
const setProgress = (val) => {
  pagination.value.progress = val
}

const setActiveIndex = (val) => {
  pagination.value.activeIndex = val
}

const getProductReviewQuery = () => {
  return {
    per_page: 3,
    reviewable_type: String.raw`Backpack\Store\app\Models\Product`,
    resource: 'large'
  }
}

const getShopReviewQuery = () => {
  return {
    per_page: 3,
    reviewable_type: null,
  }
}

// HANDLERS
const moreInfoHandler = () => {
  useModal().open(resolveComponent('ModalReviewBonus'), null, null, {width: {min: 420, max: 420}})
}

const reviewHandler = () => {
  if(useAuthStore().auth) {
    useModal().open(resolveComponent('ModalReviewCreate'), null, null, {width: {min: 420, max: 420}})
  }else{
    useNoty().setNoty({
      content: t('noty.review.need_login'),
      type: 'warning'
    }, 7000)
    
    useModal().open(resolveComponent('ModalAuthSocial'), null, null, {width: {min: 420, max: 420}})
  }
}

// FETCH
const {data: reviewsData} = await useLazyAsyncData(() => useReviewStore().getAll(getProductReviewQuery()))
const {data: feedbackData} = await useLazyAsyncData(() => useReviewStore().getAll(getShopReviewQuery()))

watch(reviewsData, (v) => {
  if(v?.reviews)
    reviews.value = v.reviews
}, {
  immediate: true
})

watch(feedbackData, (v) => {
  if(v?.reviews)
    feedback.value = v.reviews
}, {
  immediate: true
})
</script>

<style src="./review.scss" lang="scss" scoped></style>
<i18n src="./lang.yaml" lang="yaml"></i18n>

<template>
  <section class="main-section">
    <div class="section-title">{{ useDevice().isMobile? t('products_reviews'): t('title.reviews') }}</div>
    <div class="wrapper">
      
      <div class="review">
        <review-product
          v-for="review in reviews"
          :key="review.id"
          :item="review"
          class="review-card"
        ></review-product>
      </div>

      <div class="feedback">

        <div class="section-title title-mobile">{{ t('shop_reviews') }}</div>

        <simple-snap-slider
          :values="feedback"
          :component="component"
          :gutter="20"
          :options="options"
          item-data-name="item"
          @setPagination="setPaginationHandler"
          @setProgress="setProgress"
          @setIndex="setActiveIndex"
          class="slider"
          ref="simpleSnapSliderRef"
        >
        </simple-snap-slider>

        
        <simple-slider-btns
          :items="pagination.total"
          :active-index="pagination.activeIndex"
          :is-arrows="true"
          :is-more-btn="false"
          @select="selectHandler"
          @prev="prevHandler"
          @next="nextHandler"
          class="nav-btns"
        >
        </simple-slider-btns>

      </div>
    </div>

    <div class="feedback-info">
      <span class="feedback-info-text">🎁 {{ t('messages.review_gift') }}</span>
      &nbsp;<button @click="moreInfoHandler" class="more-link">{{ t('label.thorough') }}...</button>
    </div>

    <div class="footer-wrapper">
      <NuxtLink :to="localePath('/reviews/shop')" class="button secondary">{{ t('reviews') }}</NuxtLink>
      <button @click="reviewHandler" class="button primary">{{ t('button.leave_review') }}</button>
    </div>
  </section>
</template>