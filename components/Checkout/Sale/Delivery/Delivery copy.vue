<script setup lang="ts">
import {useDeliveryStore} from '~/store/delivery'
import { useCartStore } from '~/store/cart'


const {t} = useI18n()
const { currency, region } = useRegion()
const converter = useConverter()
const { quote } = useDeliveryStore()
// const {isReady, quote } = usePacketaRates()


const order = computed(() => {
  return useCartStore().order
})

const cartWeight = ref(850) // g — возьми из корзины
const cartSubtotal = ref(1350) // валюта в рамках конфигурации направления
const destination = ref('CZ') // ISO2 страны получателя

const deliveryData = computed(() => {
  return {
    methodKey: order.value.delivery.method,
    destinationCountry: region.value,
    weightG: 1000,
    codAmount: 0,
    codEnabled: 0
  }
})

const isDeliveryDataReady = computed(() => {
  return Boolean(
    order.value?.delivery?.method &&
    region.value
  )
})

// watch(isDeliveryDataReady, async (ready) => {
//   if (!ready) return

//   const payload = {
//     methodKey: order.value.delivery.method,
//     destinationCountry: region.value,
//     weightG: cartWeight.value,
//     codAmount: 0,
//     codEnabled: 0
//   }

//   if(payload.methodKey == null) return

//   try {
//     const data = await quote(payload, true)
//     console.log('Delivery price fetched:', data)
//   } catch (e) {
//     console.error('Error fetching delivery price:', e)
//   }
// }, { immediate: true })

// const price = computed(() => {
//   if (!isReady.value) return null
//   return quote({
//     origin: 'CZ',
//     destination: destination.value,
//     method: 'pickup',
//     weight_g: cartWeight.value,
//     subtotal: cartSubtotal.value,
//     cod: false
//   })
// })

// const { data: priceData, refresh: refreshPrice } = useAsyncData('delivery_price', () => quote(deliveryData.value))

const { data: priceData, refresh: refreshPrice } = await useAsyncData(
  'delivery_price',
  () => quote(deliveryData.value, false),
  {
    server: false,
    watch: [deliveryData.value]
  }
)

watch(priceData, (newPrice) => {
  console.log('Delivery price updated:', newPrice)
}, { immediate: true })

// onMounted(() => {
//   converter.ensureRates().catch(() => {})
// })

// const convertedPrice = computed(() => {
//   const base = price.value
//   if (!base) return null

//   const targetCurrency = currency.value
//   if (!targetCurrency) return base

//   const convertedAmount = converter.convertFiatToFiatSync(
//     base.amount,
//     base.currency,
//     targetCurrency
//   )

//   if (convertedAmount == null) {
//     return base
//   }

//   if (!Number.isFinite(convertedAmount)) {
//     return base
//   }

//   return {
//     amount: convertedAmount,
//     currency: targetCurrency
//   }
// })
</script>

<style src='./delivery.scss' lang='scss' scoped></style>

<template>
  <div class="sale-item">
    <div class="sale-label">{{ t('messages.delivery_price') }}</div>
    <div class="sale-value">
      <simple-price
        v-if="convertedPrice"
        :value="convertedPrice.amount"
        :currency-code="convertedPrice.currency"
        class="price"
      ></simple-price>
      <span v-else>—</span>
    </div>
  </div>
</template>
