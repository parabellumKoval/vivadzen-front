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
