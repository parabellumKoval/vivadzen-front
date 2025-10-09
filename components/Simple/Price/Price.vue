<script setup lang="ts">

const props = defineProps({
  value: { type: [Number, String], required: true },
  currency: { type: Boolean, default: true }, // показывать как валюту или как число
  // можно и через проп
  currencyCode: { type: String, default: 'UAH' },
})

const route = useRoute()
// пример: брать из query-параметра ?cur=USD (если есть)
const routeCurrency = computed(() => {
  const c = String(route.query.cur || '').toUpperCase()
  // простая валидация: код 3 буквы
  return /^[A-Z]{3}$/.test(c) ? c : null
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
    currency: routeCurrency.value ?? props.currencyCode,  // приоритет query, потом проп
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