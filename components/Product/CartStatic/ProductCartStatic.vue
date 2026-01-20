<script setup lang="ts">
import { computed, defineAsyncComponent, ref, watch } from 'vue'
import { useModal } from '~/composables/useModal'
import { useCard } from '~/composables/product/useCard'
import { useImg } from '~/composables/useImg'

const { t } = useI18n()
const { $regionPath } = useNuxtApp()
const modal = useModal()
const img = useImg()
const ProductReviewsModal = defineAsyncComponent(() => import('~/components/Modal/ProductReviews/ProductReviews.vue'))

const props = defineProps({
  item: {
    type: Object,
    required: true
  }
})

const { photos } = useCard(props.item)

const photoList = computed(() => {
  const limited = photos.value?.slice(0, 2) || []
  if(limited.length) {
    return limited
  }
  return [{
    src: img.noImage,
    alt: props.item?.name,
    title: props.item?.name
  }]
})

const productLink = computed(() => {
  if(!props.item?.slug) {
    return '#'
  }
  return $regionPath(`/${props.item.slug}`)
})

const reviewsCount = computed(() => props.item?.reviews || 0)
const ratingValue = computed(() => props.item?.rating || 0)
const ratingSummary = computed(() => {
  const rates = props.item?.ratings || 0
  const reviews = reviewsCount.value
  if(!rates && !reviews) {
    return ''
  }
  return t('messages.rates_reviews', { rates, reviews })
})

const modList = computed(() => {
  if(!props.item?.modifications) {
    return []
  }
  return props.item.modifications.filter((mod) => mod && (mod.short_name || mod.name))
})

const selectedModification = ref<any>(null)

watch(modList, (list) => {
  if(!list.length) {
    selectedModification.value = null
    return
  }

  const hasActive = list.find((mod) => selectedModification.value?.id === mod.id)
  if(hasActive) {
    return
  }

  const preferred = list.find((mod) => mod.inStock > 0) ?? list[0]
  selectedModification.value = preferred
}, { immediate: true, deep: true })

const displayPrice = computed(() => selectedModification.value?.price ?? props.item.price)
const displayOldPrice = computed(() => selectedModification.value?.oldPrice ?? selectedModification.value?.old_price ?? props.item.oldPrice)
const currencyCode = computed(() => selectedModification.value?.currency ?? props.item.currency)

const selectModification = (modification) => {
  if(!modification || modification.inStock <= 0) {
    return
  }
  selectedModification.value = modification
}

const openReviewsHandler = () => {
  modal.open(ProductReviewsModal, props.item, null, {
    width: {
      min: 320,
      max: 960
    },
    height: {
      min: 'auto',
      max: '85vh'
    }
  })
}
</script>

<style src="./product-cart-static.scss" lang="scss" scoped></style>
<i18n src="./lang.yaml" lang="yaml"></i18n>

<template>
  <div class="product-cart-static">
    <NuxtLink :to="productLink" class="product-cart-static__image-wrapper" :prefetch="false">
      <template v-for="(photo, index) in photoList" :key="photo.src + '-' + index">
        <nuxt-img
          :src="photo.src"
          :alt="photo.alt || props.item.name"
          :title="photo.title || props.item.name"
          width="260"
          height="280"
          quality="60"
          fit="contain"
          provider="bunny"
          sizes="mobile: 50vw desktop: 420px"
          :loading="index === 0 ? 'eager' : 'lazy'"
          class="product-cart-static__image"
          :class="{'is-secondary': index === 1}"
          :placeholder="img.noImage"
        />
      </template>
    </NuxtLink>

    <div class="product-cart-static__body">
      <NuxtLink :to="productLink" class="product-cart-static__name" :prefetch="false">
        {{ props.item.name }}
      </NuxtLink>

      <div class="product-cart-static__rating">
        <div class="product-cart-static__rating-stars">
          <lazy-simple-stars :amount="ratingValue" mobile="medium" desktop="medium"></lazy-simple-stars>
          <span v-if="ratingSummary" class="product-cart-static__rating-label">
            {{ ratingSummary }}
          </span>
        </div>
        <button
          v-if="reviewsCount > 0"
          type="button"
          class="product-cart-static__reviews-btn"
          @click="openReviewsHandler"
        >
          {{ t('button_reviews') }}
        </button>
      </div>

      <div class="product-cart-static__meta">
        <div v-if="modList.length" class="product-cart-static__mods">
          <button
            v-for="(modification, index) in modList"
            :key="modification.slug ?? modification.id ?? index"
            type="button"
            class="product-cart-static__mod"
            :class="{
              'is-active': selectedModification?.id === modification.id,
              'is-unavailable': modification.inStock <= 0
            }"
            :disabled="modification.inStock <= 0"
            @click="selectModification(modification)"
          >
            {{ modification.short_name || modification.name }}
          </button>
        </div>

        <div class="product-cart-static__price-block">
          <div class="product-cart-static__availability">
            <IconCSS name="ph:storefront" class="product-cart-static__availability-icon" />
            <span>{{ t('label.available') }}<br/>{{ t('label.offline_store') }}</span>
          </div>
          <div class="product-cart-static__price">
            <lazy-product-price
              :price="displayPrice"
              :old-price="displayOldPrice"
              :currency-code="currencyCode"
            ></lazy-product-price>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
