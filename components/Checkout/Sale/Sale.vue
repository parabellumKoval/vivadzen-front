<script setup>
import {useCartStore} from '~/store/cart'

const {t} = useI18n()
const { $regionPath } = useNuxtApp();
const { orderable, user } = useAuth()
const {currency, region, fallbackRegion} = useRegion()

const props = defineProps({
  cart: {
    type: Object
  }
})

const emit = defineEmits(['scrollToError'])


// COMPUTEDS
const isDefaultRegion = computed(() => {
  return region.value === fallbackRegion
})
const personalDiscount = computed(() => {
  return user.value?.discount_percent || 0
})
const personalDiscountedTotal = computed(() => {
  return useCartStore().personalDiscount
})

const productsLength = computed(() => {
  return useCartStore().cart?.length || 0
})

const productsTotal = computed(() => {
  return useCartStore().totalProducts
})

const finishTotal = computed(() => {
  const v = useCartStore().finishTotal
  return v < 0 ? 0 : v
})

const total = computed(() => {
  return useCartStore().total
})

const order = computed(() => {
  return useCartStore().order
})

const promocodeSale = computed(() => {
  return useCartStore().promocodeSale
})


// METHODS

// HANDLERS
const goCompleteHandler = () => {
  const payload = { ...orderable.value }
  useCartStore().createOrder(payload).then((response) => {
    if(response?.code) {
      useCartStore().$reset()
      navigateTo($regionPath('/checkout/complete/' + response.code))
    }
  }).catch((e) => {
    useNoty().setNoty({
      title: t('error.error'),
      content: t('error.check_fields'),
      type: 'error'
    }, 7000)

    emit('scrollToError')
  })
}

const goPayHandler = () => {
  const payload = { ...orderable.value }
  useCartStore().validate(payload).then((response) => {
    if(response) {
      navigateTo($regionPath('/checkout/payment'))
    }
  }).catch((e) => {
    useNoty().setNoty({
      title: t('error.error'),
      content: t('error.check_fields'),
      type: 'error'
    }, 7000)

    emit('scrollToError')
  })
}
// WATCHERS
</script>

<style src='./sale.scss' lang='scss' scoped></style>

<template>
  <div class="sale">
    <div class="sale-list">
      <div class="sale-item">
        <div class="sale-label">{{ productsLength }} {{ t('messages.products_total') }}</div>
        <div class="sale-value">
          <simple-price :value="productsTotal" class="price price-total"></simple-price>
        </div>
      </div>

      <div v-if="personalDiscount" class="sale-item">
        <div class="sale-label">{{ t('messages.personal_discount') }} {{ personalDiscount }}%</div>
        <div class="sale-value">
          -<simple-price :value="personalDiscountedTotal" class="price price-total"></simple-price>
        </div>
      </div>

      <checkout-sale-delivery></checkout-sale-delivery>

      <div v-if="order.bonusInFiat" class="sale-item">
        <div class="sale-label">{{ t('messages.bonuses_use') }}</div>
        <div class="sale-value">
          -<simple-price :value="order.bonusInFiat" :currency-code="currency"></simple-price>
        </div>
      </div>

      <div v-if="promocodeSale" class="sale-item">
        <div class="sale-label">{{ t('label.promocode') }}</div>
        <div class="sale-value">
          -<simple-price :value="promocodeSale" class="price"></simple-price>
        </div>
      </div>
      
      <div class="sale-features">

        <product-delivery-free :value="total" class="free-delivery-box"></product-delivery-free>

        <checkout-bonus></checkout-bonus>

        <checkout-promocode></checkout-promocode>

        <div class="sale-footer">
          <div class="sale-item">
            <div class="sale-label">{{ t('messages.to_pay') }}</div>
            <div class="sale-value large">
              <simple-price :value="finishTotal" class="price price-total"></simple-price>
            </div>
          </div>
        </div>

        
      </div>

      <transition name="fade-in">
        <button
          v-if="order.payment.method === 'liqpay_online'"
          @click="goPayHandler"
          :class="{disabled: isDefaultRegion}"
          class="button primary sale-button"
        >
          <span>{{ t('button.pay') }}</span>
        </button>
        <button
          v-else
          @click="goCompleteHandler"
          :class="{disabled: isDefaultRegion}"
          class="button primary sale-button"
        >
          <span>{{ t('button.create_order') }}</span>
        </button>
      </transition>
    </div>
  </div>
</template>
