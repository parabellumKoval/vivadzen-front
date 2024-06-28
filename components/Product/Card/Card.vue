<script setup>
const props = defineProps({
  item: {
    type: Object,
    required: true
  },
  index: {
    type: Number,
    default: null
  }
})

const { t } = useI18n()
const localePath = useLocalePath()

const {isComparison, toComparisonHandler} = useComparison(props.item.id)
const {isFavorite, toFavoriteHandler} = useFavorite(props.item.id)
const {photos, stock, label} = useCard(props.item)
const {toCartHandler} = useCart(props.item)

// COMPUTEDS
const loading = computed(() => {
  if(props.index === null || props.index !== 0)
    return 'lazy'
  else {
    return null
  }
})

const img = useImage()

const reviewsCount = computed(() => {
  return props.item?.reviews_rating_detailes?.reviews_count || 0
})

const favoriteIcon = computed(() => {
  if(isFavorite.value) {
    return 'iconoir:heart-solid'
  }else {
    return 'iconoir:heart'
  }
})

// METHODS

// HANDLERS
const toReviewsHandler = () => {
  navigateTo(localePath('/' + props.item.slug + '#reviews'))
}
</script>

<style src="./card.scss" lang="scss" scoped />

<template>
  <div v-if="item" :class="stock" class="card">

    <div class="card-sub">
      <div v-if="label" :class="label?.class" class="label">
        {{ label.text }}
      </div>
      <div v-else></div>

      <div :class="{active: isComparison || isFavorite}" class="hover">
        <button
          @click="toComparisonHandler"
          :class="{active: isComparison}"
          class="hover-btn comparison-btn"
          clickable
        >
          <IconCSS name="ph:scales-light"></IconCSS>
        </button>

        <button
          @click="toFavoriteHandler"
          :class="{active: isFavorite}"
          class="hover-btn favorite-btn"
          clickable
        >
          <IconCSS :name="favoriteIcon"></IconCSS>
        </button>
      </div>
    </div>

    <NuxtLink
      :to="localePath('/' + item.slug)"
      :aria-label="item.name"
      clickable
      class="image-wrapper"
    >
      <nuxt-img
        v-for="(photo, index) in photos"
        :key = "index"
        :src = "photo.src"
        :alt = "photo.alt"
        :title = "photo.title"
        width="290"
        height="260"
        sizes = "mobile:180px tablet:230px desktop:300px"
        format = "avif"
        quality = "25"
        :loading = "index > 0? 'lazy': loading"
        fit="outside"
        :placeholder="useImg().noImage"
        class="image"
      ></nuxt-img>
    </NuxtLink>
    
    <div :class="{between: item.rating}" class="reviews">
      <lazy-simple-stars v-if="item?.rating" :amount="item.rating" class="rating"></lazy-simple-stars>
      
      <button v-if="reviewsCount" @click="toReviewsHandler" class="reviews-btn">
        {{ t('label.reviews', {reviews: reviewsCount}, reviewsCount) }}
      </button>
      <button v-else @click="toReviewsHandler" class="reviews-btn">
        <IconCSS name="iconoir:message" size="16"></IconCSS>
        {{ t('button.leave_review') }}
      </button>
    </div>

    <div class="name-wrapper">
      <NuxtLink
        :to="localePath(`/${item.slug}`)"
        class="name"
        clickable
      >
        {{ item.name }}
      </NuxtLink>
    </div>

    <hr class="line">

    <lazy-product-available :in-stock="item.inStock" class="amount"></lazy-product-available>

    <div class="sale">
      <button @click="() => toCartHandler(1)" type="button" class="button primary small buy-btn">
        <span class="buy-btn-name">{{ t('button.buy') }}</span>
        <IconCSS name="iconoir:shopping-bag" class="buy-btn-icon"></IconCSS>
      </button>
      <lazy-product-price :price="item.price" :old-price="item.oldPrice"></lazy-product-price>
    </div>

  </div>
</template>