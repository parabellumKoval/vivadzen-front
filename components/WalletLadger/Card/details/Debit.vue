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
const reference = computed(() => props.item.reference || {})
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
</script>

<template>
  <div class="wallet-details debit-details">
    <div class="details-section">
      <h4 class="section-title">{{ t('wallet.operation_info') }}</h4>
      <div class="detail-item">
        <span class="label">{{ t('wallet.description') }}:</span>
        <span class="value">{{ descriptionToShow }}</span>
      </div>
      <div class="detail-item" v-if="meta.currency">
        <span class="label">{{ t('wallet.currency') }}:</span>
        <span class="value">{{ meta.currency }}</span>
      </div>
    </div>

    <div class="details-section" v-if="relatedData.order_id || reference.type === 'order'">
      <h4 class="section-title">{{ t('wallet.order_info') }}</h4>
      <div class="detail-item" v-if="relatedData.order_id">
        <span class="label">{{ t('wallet.order_id') }}:</span>
        <span class="value">#{{ relatedData.order_id }}</span>
      </div>
      <div class="detail-item" v-else-if="reference.id">
        <span class="label">{{ t('wallet.order_id') }}:</span>
        <span class="value">#{{ reference.id }}</span>
      </div>
      <div class="detail-item" v-if="relatedData.meta && relatedData.meta.context && relatedData.meta.context.order_code">
        <span class="label">{{ t('wallet.order_code') }}:</span>
        <span class="value">{{ relatedData.meta.context.order_code }}</span>
      </div>
    </div>

    <div class="details-section" v-if="relatedData.meta && relatedData.meta.context">
      <h4 class="section-title">{{ t('wallet.context_info') }}</h4>
      <div class="detail-item" v-if="relatedData.meta.context.currency">
        <span class="label">{{ t('wallet.context_currency') }}:</span>
        <span class="value">{{ relatedData.meta.context.currency }}</span>
      </div>
      <div class="detail-item" v-if="relatedData.meta.context.reference_type">
        <span class="label">{{ t('wallet.reference_type') }}:</span>
        <span class="value">{{ t(`wallet.${relatedData.meta.context.reference_type}`) }}</span>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import './_shared.scss';
</style>
