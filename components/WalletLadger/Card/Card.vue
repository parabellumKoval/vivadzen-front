<script setup>
import Credit from './details/Credit.vue'
import Capture from './details/Capture.vue'
import Hold from './details/Hold.vue'
import Debit from './details/Debit.vue'

const OPERATION_EMOJI_MAP = {
  credit: {
    referral_reward: '\u{1F381}', // gift
    review_reward: '\u{1F4DD}', // memo
    order_reward: '\u{1F6D2}', // cart
    bonus: '\u{1F389}', // party popper
    refund: '\u{1F4B8}', // money with wings
    default: '\u{1F4B0}' // money bag
  },
  debit: {
    withdrawal: '\u{1F4B5}', // money with banknote
    order: '\u{1F4E6}', // package
    fee: '\u{1F4B8}',
    default: '\u{1F4B8}'
  },
  hold: {
    withdrawal: '\u{1F512}', // locked
    order: '\u{23F3}', // hourglass
    default: '\u{1F512}'
  },
  capture: {
    withdrawal: '\u{1F4B3}', // credit card
    order: '\u{2705}', // check mark
    default: '\u{1F4B3}'
  },
  release: {
    withdrawal: '\u{1F501}', // clockwise arrows
    order: '\u{1F501}',
    default: '\u{1F501}'
  },
  default: '\u{1F4B0}'
}

const REFERENCE_TYPE_ALIASES = {
  withdrawal_request: 'withdrawal'
}

const {t, locale} = useI18n()

const props = defineProps({
  item: {
    type: Object,
    required: true
  }
})

const detailComponent = computed(() => {
  switch (props.item.type) {
    case 'credit':
      return Credit
    case 'capture':
      return Capture
    case 'hold':
      return Hold
    case 'debit':
      return Debit
    default:
      return null
  }
})

const parseLedgerDate = (value) => {
  if (!value || typeof value !== 'string') {
    return null
  }

  const trimmed = value.trim()

  if (!trimmed) {
    return null
  }

  const match = trimmed.match(/^(\d{4})-(\d{2})-(\d{2})[ T](\d{2}):(\d{2}):(\d{2})$/)

  if (match) {
    const [, year, month, day, hour, minute, second] = match
    return new Date(Date.UTC(
      Number(year),
      Number(month) - 1,
      Number(day),
      Number(hour),
      Number(minute),
      Number(second)
    ))
  }

  const parsed = new Date(trimmed)
  return Number.isNaN(parsed.getTime()) ? null : parsed
}

const formatLedgerDate = (value) => {
  const date = parseLedgerDate(value)
  if (!date) {
    return value || '–'
  }

  try {
    return new Intl.DateTimeFormat(locale.value, {
      dateStyle: 'medium',
      timeStyle: 'short'
    }).format(date)
  } catch (error) {
    return date.toLocaleString()
  }
}

const formattedCreatedAt = computed(() => formatLedgerDate(props.item?.created_at))

const normalizedType = computed(() => (props.item?.type || '').toLowerCase())

const referenceType = computed(() => {
  return props.item?.reference?.type ||
    props.item?.reference_type ||
    props.item?.meta?.reference_type ||
    props.item?.operation_details?.reference_type ||
    props.item?.operation_details?.related_data?.reference_type ||
    null
})

const normalizedReferenceType = computed(() => {
  if (!referenceType.value) {
    return 'default'
  }

  const normalized = referenceType.value.toLowerCase()

  return REFERENCE_TYPE_ALIASES[normalized] || normalized
})

const operationDescriptionKey = computed(() => {
  if (!normalizedType.value) {
    return null
  }

  return `wallet.operations.${normalizedType.value}.${normalizedReferenceType.value || 'default'}`
})

const fallbackDescription = computed(() => props.item?.operation_details?.description || '')

const operationLabel = computed(() => {
  if (!operationDescriptionKey.value) {
    return fallbackDescription.value
  }

  const translation = t(operationDescriptionKey.value)
  return translation !== operationDescriptionKey.value ? translation : fallbackDescription.value
})

const operationEmoji = computed(() => {
  const type = normalizedType.value
  if (!type) {
    return OPERATION_EMOJI_MAP.default
  }

  const reference = normalizedReferenceType.value || 'default'
  return OPERATION_EMOJI_MAP[type]?.[reference] ??
    OPERATION_EMOJI_MAP[type]?.default ??
    OPERATION_EMOJI_MAP.default
})

const operationDescriptionDisplay = computed(() => {
  const description = operationLabel.value?.trim()
  if (!description) {
    return fallbackDescription.value || '–'
  }

  return operationEmoji.value ? `${operationEmoji.value} ${description}` : description
})

const operationTypeLabel = computed(() => {
  if (!normalizedType.value) {
    return props.item?.type_label || '–'
  }

  const key = `wallet.type_labels.${normalizedType.value}`
  const translation = t(key)

  return translation !== key
    ? translation
    : (props.item?.type_label || props.item?.type || '–')
})
</script>

<style src="./card.scss" lang="scss" scoped />

<template>
  <simple-table-row show-details="true" grid="150px 1fr 300px 150px" class="referral-row">
    <template v-slot:columns>
      <simple-table-column :label="t('wallet.created_at')" :value="formattedCreatedAt" class="date-column"></simple-table-column>
      <simple-table-column :label="t('wallet.operation_info')" :value="operationDescriptionDisplay"></simple-table-column>
      <simple-table-column :label="t('wallet.type')" :value="operationTypeLabel"></simple-table-column>
      <simple-table-column :label="t('wallet.amount')">
        <simple-price
          :value="item?.amount?.formatted"
          :currency-code="item?.amount?.currency"
          :currency-label="item?.amount?.currency_label"
        ></simple-price>
      </simple-table-column>
    </template>
    <template v-slot:details>
      <div class="detailes-box">
        <component 
          v-if="detailComponent" 
          :is="detailComponent" 
          :item="item" 
          :operation-description="operationDescriptionDisplay"
          :operation-label="operationLabel"
        />
        <div v-else class="no-details">
          {{ t('wallet.no_details_available') }}
        </div>
      </div>
    </template>
  </simple-table-row>
</template>
