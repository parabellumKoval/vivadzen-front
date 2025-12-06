<script setup>
const { t } = useI18n()

const props = defineProps({
  item: {
    type: Object,
    required: true
  },
  operationDescription: {
    type: String,
    default: ''
  },
  operationLabel: {
    type: String,
    default: ''
  }
})

// Computed properties для удобного доступа к данным
const operationDetails = computed(() => props.item.operation_details || {})
const relatedData = computed(() => operationDetails.value.related_data || {})
const eventPayload = computed(() => relatedData.value.event_payload || {})
const meta = computed(() => props.item.meta || {})

const descriptionToShow = computed(() => {
  if (props.operationDescription) {
    return props.operationDescription
  }

  if (props.operationLabel) {
    return props.operationLabel
  }

  return operationDetails.value.description || '–'
})

const triggerKey = computed(() => {
  if (!relatedData.value.trigger) {
    return null
  }

  return relatedData.value.trigger.replace(/[^a-zA-Z0-9]+/g, '_').toLowerCase()
})

const triggerLabel = computed(() => {
  if (triggerKey.value) {
    const key = `wallet.triggers.${triggerKey.value}`
    const translation = t(key)
    if (translation !== key) {
      return translation
    }
  }

  return relatedData.value.trigger_label
})
</script>

<template>
  <div class="wallet-details credit-details">
    <div class="details-section">
      <h4 class="section-title">{{ t('wallet.operation_info') }}</h4>
      <div class="detail-item">
        <span class="label">{{ t('wallet.description') }}:</span>
        <span class="value">{{ descriptionToShow }}</span>
      </div>
      <div class="detail-item" v-if="triggerLabel">
        <span class="label">{{ t('wallet.trigger') }}:</span>
        <span class="value">{{ triggerLabel }}</span>
      </div>
    </div>

    <div class="details-section" v-if="eventPayload.order_id">
      <h4 class="section-title">{{ t('wallet.related_order') }}</h4>
      <div class="detail-item">
        <span class="label">{{ t('wallet.order_id') }}:</span>
        <span class="value">#{{ eventPayload.order_id }}</span>
      </div>
      <div class="detail-item" v-if="eventPayload.total">
        <span class="label">{{ t('wallet.order_total') }}:</span>
        <span class="value">{{ eventPayload.total }} {{ eventPayload.currency }}</span>
      </div>
      <div class="detail-item" v-if="eventPayload.user_id">
        <span class="label">{{ t('wallet.user_id') }}:</span>
        <span class="value">{{ eventPayload.user_id }}</span>
      </div>
    </div>

    <div class="details-section" v-if="meta.level || meta.beneficiary_type">
      <h4 class="section-title">{{ t('wallet.referral_info') }}</h4>
      <div class="detail-item" v-if="meta.level">
        <span class="label">{{ t('wallet.referral_level') }}:</span>
        <span class="value">{{ meta.level }}</span>
      </div>
      <div class="detail-item" v-if="meta.beneficiary_type">
        <span class="label">{{ t('wallet.beneficiary_type') }}:</span>
        <span class="value">{{ t(`wallet.${meta.beneficiary_type}`) }}</span>
      </div>
      <div class="detail-item" v-if="relatedData.rewards_count">
        <span class="label">{{ t('wallet.rewards_count') }}:</span>
        <span class="value">{{ relatedData.rewards_count }}</span>
      </div>
      <div class="detail-item" v-if="relatedData.total_amount">
        <span class="label">{{ t('wallet.total_reward') }}:</span>
        <span class="value">{{ relatedData.total_amount }} {{ relatedData.currency }}</span>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import './_shared.scss';
</style>
