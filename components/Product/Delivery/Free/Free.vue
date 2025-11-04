<script setup>
const {t} = useI18n()
const {get} = useSettings()

const props = defineProps({
  value: {
    type: Number,
    default: null
  }
})

const freeDeliveryAmount = computed(() => {
  return get('shipping.free_min_price') || 0
})

const freeDelivery = computed(() => {
  const enabled = get('shipping.free_enabled') || 0

  if(props.value === null) {
    return enabled
  }else {
    return enabled && props.value >= freeDeliveryAmount.value
  }
})
</script>

<style src="./free.scss" lang="scss" scoped></style>
<i18n src="./lang.yaml" lang="yaml"></i18n>

<template>
  <transition name="fade-in">
  <div v-if="freeDelivery" class="free-delivery">
    <IconCSS name="solar:gift-bold-duotone" class="free-delivery-icon"></IconCSS>
    <span class="free-delivery-name">
      {{ t('free') }}
      <span class="free-delivery-desc">{{ t('order') }} <span class="bold">{{ t('from') }} <simple-price :value="freeDeliveryAmount" class="free-delivery-price"></simple-price></span> <span v-if="value !== null">&nbsp;{{ t('activated') }}</span>.</span>
    </span>
  </div>
  </transition>
</template>