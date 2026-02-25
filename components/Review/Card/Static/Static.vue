<script setup>
import { computed } from 'vue'
import { useRegion } from '~/modules/regions/runtime/composables/useRegion'

const { t } = useI18n()
const { regionsMeta } = useRegion()

const props = defineProps({
  item: {
    type: Object,
    required: true
  }
})

const getFlagIcon = (code) => {
  let codeLower = code ? String(code).toLowerCase() : null
  codeLower = codeLower === 'zz' ? 'global' : codeLower
  return regionsMeta[codeLower]?.flagClass || null
}

const flagIcon = computed(() => getFlagIcon(props.item?.country))
const isVerified = computed(() => props.item?.extras?.verified_purchase === '1')
const ratingAmount = computed(() => props.item?.rating || 0)
const formattedName = computed(() => props.item?.owner?.name || 'Incognito')
const reviewPhotos = computed(() => {
  const list = Array.isArray(props.item?.photos) ? props.item.photos : []

  return list
    .map((photo) => {
      const src = photo?.url || photo?.src || photo?.path || null
      if (!src) {
        return null
      }

      return {
        src,
        alt: photo?.alt || photo?.title || 'Review photo',
      }
    })
    .filter(Boolean)
})
const hasPhotos = computed(() => reviewPhotos.value.length > 0)
</script>

<style src="./static.scss" lang="scss" scoped></style>
<i18n src="./lang.yaml" lang="yaml"></i18n>

<template>
  <div class="review-card-static">
    <div class="review-card-static__header">
      <div class="review-card-static__left">
        <div class="review-card-static__name">{{ formattedName }}</div>
        <div class="review-card-static__date">{{ $d(item.created_at, 'long') }}</div>
      </div>
      <div v-if="flagIcon" class="review-card-static__flag">
        <Icon :name="flagIcon" class="icon"></Icon>
      </div>
    </div>

    <div v-if="ratingAmount" class="review-card-static__rating">
      <simple-stars :amount="ratingAmount" mobile="medium"></simple-stars>
    </div>

    <div v-if="isVerified" class="review-card-static__verified">
      <IconCSS name="iconoir:user-cart" class="verified-icon"></IconCSS>
      <span>{{ t('verified_purchase') }}</span>
    </div>

    <div v-if="hasPhotos" class="review-card-static__photos">
      <div
        v-for="(photo, index) in reviewPhotos"
        :key="photo.src + '-' + index"
        class="review-card-static__photo-item"
      >
        <nuxt-img
          :provider="useImg().provider"
          :src="photo.src"
          width="400"
          height="300"
          sizes="mobile:180px tablet:220px desktop:260px"
          quality="70"
          loading="lazy"
          fit="cover"
          class="review-card-static__photo"
          :alt="photo.alt"
          :placeholder="useImg().noImage"
        ></nuxt-img>
      </div>
    </div>

    <div class="review-card-static__text">
      {{ item.text }}
    </div>

    <div v-if="item.extras?.advantages" class="review-card-static__adv">
      <div class="review-card-static__label">{{ t('dignity') }}</div>
      <div>{{ item.extras?.advantages }}</div>
    </div>
    <div v-if="item.extras?.flaws" class="review-card-static__adv">
      <div class="review-card-static__label">{{ t('flaws') }}</div>
      <div>{{ item.extras?.flaws }}</div>
    </div>
  </div>
</template>
