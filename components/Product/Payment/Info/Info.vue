<script setup>
const {locale, t} = useI18n()

const {methodsInfo} = usePayment()

const text = await queryContent('payment').locale(locale.value).findOne()

const m = computed(() => {
  return methodsInfo.value.map((method) => {
    method.desc = text[method.key]
    return method
  })
})

</script>

<style src="./info.scss" lang="scss" scoped />

<template>
  <div class="payment">
    
    <div class="subtitle">
      <div>{{ t('payments.subtitle') }}</div>
      <checkout-delivery-country class="country"></checkout-delivery-country>
    </div>

    <product-methods :items="m" class="payments"></product-methods>

    <ContentQuery path="payment" :locale="locale" find="one">
      <template #default="{ data }">
        <div v-html="data.info"></div>
      </template>
    </ContentQuery>
  </div>
</template>