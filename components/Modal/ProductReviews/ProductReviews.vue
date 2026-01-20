<script setup lang="ts">
import { computed, ref, watch, defineAsyncComponent } from 'vue'
import { useModal } from '~/composables/useModal'
import { useReviewStore } from '~/store/review'
import { useImg } from '~/composables/useImg'

const { t } = useI18n()
const { $regionPath } = useNuxtApp()
const modal = useModal()
const reviewStore = useReviewStore()
const img = useImg()
const ReviewCardStatic = defineAsyncComponent(() => import('~/components/Review/Card/Static/Static.vue'))

const product = computed<Product | null>(() => modal.active?.data ?? null)

const reviews = ref([])
const meta = ref({})
const isLoading = ref(false)

const reviewQuery = computed(() => {
  if(!product.value) {
    return null
  }

  const id = product.value.group_id || product.value.id
  if(!id) {
    return null
  }

  return {
    per_page: 6,
    reviewable_id: id,
    reviewable_slug: product.value.base_modification_slug || product.value.slug,
    reviewable_type: 'App\\Models\\Product'
  }
})

const loadReviews = async (page = 1, refresh = false) => {
  if(!reviewQuery.value) {
    reviews.value = []
    meta.value = {}
    return
  }

  isLoading.value = true

  const query = {
    ...reviewQuery.value,
    page
  }

  await reviewStore.getAll(query, refresh).then((data) => {
    reviews.value = data.reviews || []
    meta.value = data.meta || {}
  }).finally(() => {
    isLoading.value = false
  })
}

watch(reviewQuery, (value) => {
  if(value) {
    void loadReviews(1, true)
  }
}, { immediate: true })

const updateCurrentHandler = (page: number) => {
  void loadReviews(page)
}

const productImage = computed(() => {
  return product.value?.images?.[0]?.src || product.value?.image?.src || img.noImage
})

const productLink = computed(() => {
  if(!product.value?.slug) {
    return '/'
  }

  return $regionPath(`/${product.value.slug}`)
})
</script>

<style src="./product-reviews.scss" lang="scss" scoped></style>
<i18n src="./lang.yaml" lang="yaml"></i18n>

<template>
  <modal-wrapper :title="t('title')">
    <div class="product-reviews-modal">
      <div v-if="product" class="product-reviews-modal__head">
        <NuxtLink :to="productLink" class="product-reviews-modal__image" :prefetch="false">
          <nuxt-img
            :src="productImage"
            width="200"
            height="200"
            sizes="200px"
            quality="60"
            fit="outside"
            :placeholder="img.noImage"
            provider="bunny"
          />
        </NuxtLink>
        <div class="product-reviews-modal__info">
          <NuxtLink :to="productLink" class="product-reviews-modal__name" :prefetch="false">
            {{ product.name }}
          </NuxtLink>
          <div class="product-reviews-modal__rating">
            <lazy-simple-stars :amount="product.rating || 0" mobile="medium" desktop="medium"></lazy-simple-stars>
            <span v-if="product.rating" class="product-reviews-modal__rating-label">
              {{ t('messages.rates_reviews', { rates: product.ratings || 0, reviews: product.reviews || 0 }) }}
            </span>
          </div>
        </div>
      </div>

      <div v-if="isLoading" class="product-reviews-modal__loading">
        {{ t('loading') }}
      </div>

      <div v-else class="product-reviews-modal__list">
        <template v-if="reviews.length">
          <ReviewCardStatic
            v-for="review in reviews"
            :key="review.id"
            :item="review"
          />
          <simple-pagination
            v-if="meta?.last_page > 1"
            :current="meta?.current_page || 1"
            :total="meta?.last_page"
            @update:current="updateCurrentHandler"
            class="product-reviews-modal__pagination"
          ></simple-pagination>
        </template>
        <div v-else class="product-reviews-modal__empty">
          {{ t('no_reviews') }}
        </div>
      </div>
    </div>
  </modal-wrapper>
</template>
