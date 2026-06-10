<script setup>
const { t } = useI18n()

const details = computed(() => ([
  {
    label: t('payments.bank_transfer.recipient'),
    value: 'ФОП Тарасенко Мирослав Васильович',
  },
  {
    label: t('payments.bank_transfer.iban_label'),
    value: 'UA639358710000067329000102077',
  },
  {
    label: t('payments.bank_transfer.edrpou_label'),
    value: '3519712799',
  },
  {
    label: t('payments.bank_transfer.bank_label'),
    value: 'ТОВ НоваПей',
  },
]))
</script>

<template>
  <div class="ua-bank-details">
    <div class="ua-bank-details__title">{{ t('payments.bank_transfer.details_title') }}</div>
    <div
      v-for="item in details"
      :key="item.label"
      class="ua-bank-details__row"
    >
      <div class="ua-bank-details__label">{{ item.label }}</div>
      <div class="ua-bank-details__value">{{ item.value }}</div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.ua-bank-details {
  display: grid;
  gap: 12px;
  width: 100%;
  padding: 16px;
  border: 1px solid $color-border;
  border-radius: $radius;
  background: rgba($color-8, 0.45);

  &__title {
    font-weight: 700;
    color: $color-0;
  }

  &__row {
    display: grid;
    gap: 4px;
  }

  &__label {
    font-size: 13px;
    color: $color-1;
  }

  &__value {
    font-weight: 600;
    color: $color-0;
    word-break: break-word;
  }
}
</style>
