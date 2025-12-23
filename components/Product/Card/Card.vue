<script setup>
import { useStoreOnly } from '~/composables/useStoreOnly'
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
const {$regionPath} = useNuxtApp();

const {isComparison, toComparisonHandler} = useComparison(props.item.id)
const {isFavorite, toFavoriteHandler} = useFavorite(props.item.id)
const {photos, stock, label} = useCard(props.item)
const {toCartHandler} = useCart(props.item)
const {ensureRegionSelected} = useRegionPurchaseGuard()
const { isStoreOnly, openStoreOnlyModal } = useStoreOnly(props.item)


// Inject
const listData = inject('list', {id: '', name: ''});

// COMPUTEDS
const loading = computed(() => {
  if(props.index === null || props.index !== 0)
    return 'lazy'
  else {
    return null
  }
})

const img = useImage()

const hasModifications = computed(() => {
  return props.item?.modifications && props.item.modifications.length > 1
})

const reviewsCount = computed(() => {
  return props.item?.reviews || 0
})

const favoriteIcon = computed(() => {
  if(isFavorite.value) {
    return 'mynaui:heart-solid'
  }else {
    return 'mynaui:heart'
  }
})

const reviewsPath = computed(() => {
  return $regionPath('/' + props.item.slug + '#reviews')
})

// METHODS
// HANDLERS
const toReviewsHandler = () => {
  navigateTo($regionPath('/' + props.item.slug + '#reviews'))
}

const setGoogleEventHandler = () => {
  useGoogleEvent().setEvent('SelectItem', {name: listData.name, id: listData.id, product: {...props.item, index: props.index}})
}

const openChoseModificationModalHandler = (event) => {
  ensureRegionSelected(() => {
    const component = defineAsyncComponent(() => import('~/components/Modal/Modification/Modification.vue'))
    useModal().open(component, props.item, null)
  })
}

const addToCartHandler = () => {
  ensureRegionSelected(() => {
    toCartHandler(1)
  })
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
      :to="$regionPath('/' + item.slug)"
      :aria-label="item.name"
      :prefetch="false"
      @click="setGoogleEventHandler"
      clickable
      class="image-wrapper"
    >
      <nuxt-img
        v-for="(photo, index) in photos"
        :key = "index"
        :src = "photo?.src"
        :alt = "photo?.alt"
        :title = "photo?.title"
        width="290"
        height="260"
        sizes = "mobile:180px tablet:230px desktop:350px"
        quality = "50"
        :loading = "index > 0? 'lazy': loading"
        fit="outside"
        :placeholder="useImg().noImage"
        format = "webp"
        class="image"
        provider="bunny"
      ></nuxt-img>
    </NuxtLink>
    
    <div class="reviews">
      <lazy-simple-stars  :amount="item.rating" class="rating"></lazy-simple-stars>
      <div v-if="reviewsCount > 0" class="reviews-count">
        ({{ t('label.reviews', {reviews: reviewsCount}) }})
      </div>
    </div>

    <div class="name-wrapper">
      <NuxtLink
        :to="$regionPath(`/${item.slug}`)"
        class="name"
        clickable
        :prefetch="false"
        @click="setGoogleEventHandler"
      >
        {{ item.name }}
      </NuxtLink>
    </div>

    <lazy-product-available :in-stock="item.inStock" class="amount"></lazy-product-available>

    <div class="sale">
      <lazy-product-price :price="item.price" :old-price="item.oldPrice" :currency-code="item.currency" ></lazy-product-price>
      <button v-if="hasModifications" @click="openChoseModificationModalHandler" type="button" class="button primary small buy-btn">
        <IconCSS name="mynaui:plus-solid" class="buy-btn-icon"></IconCSS>
      </button>
      <template v-else>
        <button
          v-if="!isStoreOnly"
          @click="addToCartHandler"
          type="button"
          class="button primary small buy-btn"
        >
          <IconCSS name="mynaui:cart" class="buy-btn-icon"></IconCSS>
        </button>
        <button
          v-else
          @click="openStoreOnlyModal"
          type="button"
          class="button color-primary small buy-btn store-only-btn"
        >
          <IconCSS name="ph:storefront" class="buy-btn-icon"></IconCSS>
          <span>{{ $t('store_only.button') }}</span>
        </button>
      </template>
    </div>

  </div>
</template>
