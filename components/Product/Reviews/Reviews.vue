<script setup>
const {t} = useI18n()
const { isAuthenticated } = useAuth()

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

const emit = defineEmits(['update:current'])


// COMPUTEDS

const productMicro = computed(() => {
  return {
    id: props.product.id,
    code: props.product.code,
    name: props.product.name,
    slug: props.product.slug,
    image: props.product.images?.length? props.product.images[0]: null,
    price: props.product.price,
    oldPrice: props.product.oldPrice,
    inStock: props.product.inStock,
  }
})

const ratingCount = computed(() => {
  return props.product.reviews_rating_detailes?.rating_count || 0
})

const reviewsCount = computed(() => {
  return props.product.reviews_rating_detailes?.reviews_count || 0
})

const reviewItems = computed(() => {
  if(props.amount === 0)
    return props.reviews
  else
    return props.reviews.slice(0, props.amount)
})

// HANDLERS

const updateCurrentHandler = (v) => {
  emit('update:current', v)
}

const createReviewHandler = () => {
  if(isAuthenticated.value) {
    useModal().open(resolveComponent('ModalReviewCreate'), productMicro.value, null, {width: {min: 420, max: 420}})
  }else{
    // useNoty().setNoty({
    //   content: t('noty.review.need_login'),
    //   type: 'warning'
    // }, 7000)
    
    useModal().open(resolveComponent('ModalAuthSocial'), null, null, {width: {min: 420, max: 420}})
  }
}

defineExpose({
  createReviewHandler
})
</script>

<style src="./reviews.scss" lang="scss" scoped></style>
<i18n src="./lang.yaml" lang="yaml"></i18n>

<template>
  <div class="reviews">

    <div class="review-form">
      <div class="review-form-title">{{ t('reviews') }}</div>
      <button @click="createReviewHandler" class="button violet wide large-icon inline-icon">
        <IconCSS name="iconoir:message-text" class="icon"></IconCSS>
        <span>{{ t('messages.leave_review') }}</span>
      </button>
    </div>

    <div v-if="product.rating" class="rating">
      <div class="rating-amount">{{ product.rating }}</div>
      <div class="rating-desc">
        <simple-stars :amount="product.rating" mobile="medium"></simple-stars>
        <div class="rating-label">{{ t('messages.rates_reviews', {rates: ratingCount, reviews: reviewsCount }) }}</div>
      </div>
    </div>
    
    <div v-if="reviewItems?.length" class="review-grid">
      <review-card-full v-for="review in reviewItems" :key="review.id" :item="review" class="review-card"></review-card-full>
    </div>
    <div v-else class="no-reviews">
      {{ t('no_reviews') }}
    </div>

    <simple-pagination
      v-if="meta.last_page > 1 && amount === 0"
      :current="meta.current_page"
      :total="meta.last_page"
      @update:current="updateCurrentHandler"
    ></simple-pagination>
  </div>
</template>
