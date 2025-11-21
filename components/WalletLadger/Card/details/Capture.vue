<script setup>
const { t } = useI18n()

const props = defineProps({
  item: {
    type: Object,
    required: true
  }
})

// Computed properties для удобного доступа к данным
const operationDetails = computed(() => props.item.operation_details || {})
const reference = computed(() => props.item.reference || {})
const meta = computed(() => props.item.meta || {})
</script>

<template>
  <div class="wallet-details capture-details">
    <div class="details-section">
      <h4 class="section-title">{{ t('wallet.operation_info') }}</h4>
      <div class="detail-item">
        <span class="label">{{ t('wallet.description') }}:</span>
        <span class="value">{{ operationDetails.description || '–' }}</span>
      </div>
      <div class="detail-item" v-if="meta.paid !== undefined">
        <span class="label">{{ t('wallet.payment_status') }}:</span>
        <span class="value" :class="{'status-paid': meta.paid, 'status-unpaid': !meta.paid}">
          {{ meta.paid ? t('wallet.paid') : t('wallet.unpaid') }}
        </span>
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