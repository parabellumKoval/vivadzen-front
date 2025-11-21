<script setup>
import Credit from './details/Credit.vue'
import Capture from './details/Capture.vue'
import Hold from './details/Hold.vue'
import Debit from './details/Debit.vue'

const {t} = useI18n()

const props = defineProps({
  item: {
    type: Object,
    required: true
  }
})

// COMPUTED
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
</script>

<style src="./card.scss" lang="scss" scoped />

<template>
  <simple-table-row show-details="true" grid="150px 1fr 300px 150px" class="referral-row">
    <template v-slot:columns>
      <simple-table-column :label="t('wallet.created_at')" :value="item.created_at"></simple-table-column>
      <simple-table-column :label="t('wallet.operation_info')" :value="item.operation_details.description || '–'"></simple-table-column>
      <simple-table-column :label="t('wallet.type')" :value="item.type_label"></simple-table-column>
      <simple-table-column :label="t('wallet.amount')">
        <simple-price :value="item?.amount?.formatted" :currency-code="item?.amount?.currency"></simple-price>
      </simple-table-column>
    </template>
    <template v-slot:details>
      <div class="detailes-box">
        <component 
          v-if="detailComponent" 
          :is="detailComponent" 
          :item="item" 
        />
        <div v-else class="no-details">
          {{ t('wallet.no_details_available') }}
        </div>
      </div>
    </template>
  </simple-table-row>
</template>