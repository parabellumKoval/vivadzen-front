<script setup lang="ts">
type RewardKind = 'text' | 'video'

type Variant = 'card' | 'inline'

const props = withDefaults(defineProps<{ 
  kinds?: RewardKind[]
  variant?: Variant
  showTitle?: boolean
  hideLabels?: boolean
}>(), {
  kinds: () => ['text', 'video'],
  variant: 'card',
  showTitle: true,
  hideLabels: false
})

const { t } = useI18n()
const { get } = useSettings()
const { resolve } = usePoints()

const iconMap: Record<RewardKind, string> = {
  text: 'hugeicons:edit-02',
  video: 'hugeicons:play-circle-02'
}

const normalizeCurrency = (value?: string | number | null) => {
  if (!value) {
    return resolve('points')
  }

  const normalized = String(value).toLowerCase()

  if (normalized.includes('point')) {
    return resolve(normalized.includes('s') ? 'points' : 'point')
  }

  return String(value)
}

const formatAmount = (amount: number) => {
  const safeAmount = Number.isFinite(amount) ? amount : 0
  const hasFraction = Math.abs(safeAmount % 1) > 0

  return new Intl.NumberFormat(undefined, {
    minimumFractionDigits: hasFraction ? 2 : 0,
    maximumFractionDigits: 2
  }).format(safeAmount)
}

const resolveReward = (kind: RewardKind) => {
  const baseKey = `profile.referrals.triggers.review.published.${kind}`
  const settings = get(baseKey) || {}
  const enabled = settings?.enabled ?? true
  const amountSource = settings?.actor_award?.amount ?? get(`${baseKey}.actor_award.amount`)
  const amount = Number(amountSource ?? 0)
  const payoutCurrency = settings?.payout_currency ?? get(`${baseKey}.payout_currency`)

  return {
    kind,
    enabled,
    amount,
    currency: normalizeCurrency(payoutCurrency),
    formattedAmount: formatAmount(amount)
  }
}

const allRewards = computed(() => {
  return (['text', 'video'] as RewardKind[]).map(resolveReward)
})

const visibleRewards = computed(() => {
  const requested = new Set(props.kinds)
  return allRewards.value.filter((reward) => requested.has(reward.kind) && reward.enabled && reward.amount > 0)
})

const hasRewards = computed(() => visibleRewards.value.length > 0)

const wrapperClasses = computed(() => ([
  'review-reward',
  `review-reward--${props.variant}`
]))
</script>

<style src="./reward.scss" lang="scss" scoped></style>
<i18n src="./lang.yaml" lang="yaml"></i18n>

<template>
  <div :class="wrapperClasses">
    <div
      v-if="props.showTitle && props.variant === 'card'"
      class="review-reward__title"
    >
      {{ t('title') }}
    </div>

    <div v-if="hasRewards" class="review-reward__list">
      <div
        v-for="reward in visibleRewards"
        :key="reward.kind"
        class="review-reward__item"
        :class="[`review-reward__item--${props.variant}`]"
      >
        <div class="review-reward__content">
          <div v-if="!props.hideLabels" class="review-reward__label">
            {{ t(`types.${reward.kind}.label`) }}
          </div>
          <div class="review-reward__value">
            <IconCSS
              v-if="props.variant === 'card'"
              :name="iconMap[reward.kind]"
              class="review-reward__icon"
            />
            <span class="review-reward__amount">{{ reward.formattedAmount }}</span>
            <span class="review-reward__currency">{{ reward.currency }}</span>
          </div>
          <div
            v-if="props.variant === 'card' && !props.hideLabels"
            class="review-reward__note"
          >
            {{ t(`types.${reward.kind}.note`) }}
          </div>
        </div>
      </div>
    </div>

    <div v-else class="review-reward__empty">
      {{ t('empty') }}
    </div>
  </div>
</template>
