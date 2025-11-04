<script setup>
const {locale, t} = useI18n()
const {methods} = useDelivery()
const {address} = useContacts()

const text = await queryContent('delivery').locale(locale.value).findOne()

const m = computed(() => {
  return methods.value.map((method) => {
    method.desc = text[method.key] + (method.key === 'default_pickup' ? ` <b>${address.value}</b>` : '')
    return method
  })
})

</script>

<style src="./info.scss" lang="scss" scoped />

<template>
  <div class="delivery">
    
    <div class="subtitle">
      <div>{{ t('delivery.subtitle') }}</div>
      <checkout-delivery-country class="country" ></checkout-delivery-country>
    </div>

    <product-methods :items="m" class="deliveries"></product-methods>

    <ContentQuery path="delivery" :locale="locale" find="one">
      <template #default="{ data }">
        <div v-html="data.info"></div>
      </template>
    </ContentQuery>
  </div>
</template>
