<script setup>
const {t} = useI18n()

const {methods} = useDelivery()

const m = computed(() => {
  return methods.value
  // return [
  //   {
  //     id: 1,
  //     name: t('delivery_one.title'),
  //     desc: t('delivery_one.desc'),
  //     image: '/images/logo/np-mini.png'
  //   },{
  //     id: 2,
  //     name: t('delivery_two.title'),
  //     desc: t('delivery_two.desc'),
  //     image: '/images/logo/np-mini.png'
  //   },{
  //     id: 3,
  //     name: t('delivery_three.title'),
  //     desc: t('delivery_three.desc'),
  //     image: '/images/logo/np-mini.png'
  //   }
  // ]
})

const emit = defineEmits(['more'])

</script>

<style src="./../../box.scss" lang="scss" scoped></style>
<style src="./box.scss" lang="scss" scoped></style>
<i18n src="./lang.yaml" lang="yaml"></i18n>

<template>
  <div class="product-box">
    <div class="mobile-title">{{ t('title.delivery') }}</div>
    <div class="product-box-label">
      <checkout-delivery-country></checkout-delivery-country>
    </div>
    <div class="method">
      <div v-for="method in methods" :key="method.id" class="method-item">
        <nuxt-img
          v-if="method.logo"
          :src = "method.logo"
          :provider = "useImg().provider"
          width="20"
          height="20"
          sizes = "mobile:30px tablet:30px desktop:30px"
          quality = "60"
          loading = "lazy"
          fit="outside"
          class="method-image"
        />

        <div class="method-name">{{ method.label }}</div>
        <div :class="{'amount': method.isPriceObject}" class="method-desc">
          <template v-if="!method.isPriceObject">
            {{ method.price }}
          </template>
          <template v-else>
            {{ t('delivery.from') }} <simple-price :value="method.price.amount" :currency-code="method.price.currency" />
          </template>
        </div>
      </div>
    </div>
    
    <product-delivery-free class="free-delivery"></product-delivery-free>

    <button @click="emit('more')" class="button secondary darker more-btn">
      {{ t('more') }}
    </button>
  </div>
</template>
