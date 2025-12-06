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
  <div class="wallet-details hold-details">
    <div class="details-section">
      <h4 class="section-title">{{ t('wallet.operation_info') }}</h4>
      <div class="detail-item">
        <span class="label">{{ t('wallet.description') }}:</span>
        <span class="value">{{ descriptionToShow }}</span>
      </div>
    </div>

    <div class="details-section" v-if="meta.target || meta.fx_rate || meta.target_amount">
      <h4 class="section-title">{{ t('wallet.currency_conversion') }}</h4>
      <div class="detail-item" v-if="meta.target">
        <span class="label">{{ t('wallet.target_currency') }}:</span>
        <span class="value">{{ meta.target }}</span>
      </div>
      <div class="detail-item" v-if="meta.fx_rate">
        <span class="label">{{ t('wallet.exchange_rate') }}:</span>
        <span class="value">{{ meta.fx_rate }}</span>
      </div>
      <div class="detail-item" v-if="meta.target_amount">
        <span class="label">{{ t('wallet.target_amount') }}:</span>
        <span class="value">{{ meta.target_amount }} {{ meta.target }}</span>
      </div>
    </div>

    <div class="details-section" v-if="reference.type && reference.id">
      <h4 class="section-title">{{ t('wallet.related_operation') }}</h4>
      <div class="detail-item">
        <span class="label">{{ t('wallet.reference_type') }}:</span>
        <span class="value">{{ t(`wallet.${reference.type}`) }}</span>
      </div>
      <div class="detail-item">
        <span class="label">{{ t('wallet.reference_id') }}:</span>
        <span class="value">#{{ reference.id }}</span>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import './_shared.scss';
</style>
