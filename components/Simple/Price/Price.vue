<script setup lang="ts">

const props = defineProps({
  value: { type: [Number, String], required: true },
  currency: { type: Boolean, default: true }, // показывать как валюту или как число
  // можно и через проп
  currencyCode: { type: String, default: 'UAH' },
})

const appCurrency = computed(() => {
  return useRegion().сurrency.value
})

const numericValue = computed(() => {
  const n = parseFloat(String(props.value))
  return Number.isFinite(n) ? n : 0
})

// динамически собираем объект формата
const numberFormat = computed(() => {
  if (!props.currency) {
    // обычное число по вашему ключу "cur"
    return { key: 'cur' }
  }
  // валюта: ключ "currency" + динамический ISO-код
  return {
    key: 'currency',
    currency: appCurrency.value ?? props.currencyCode,  // приоритет query, потом проп
    currencyDisplay: 'narrowSymbol',                      // можно переопределить опции при необходимости
  }
})

</script>

<style src="./price.scss" lang="scss" scoped />

<template>
  <div class="price" v-if="numericValue !== null">
    <span class="value">
      <i18n-n :value="numericValue" :format="numberFormat" />
    </span>
  </div>
</template>