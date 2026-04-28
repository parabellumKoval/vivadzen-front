<script setup>
import {useOrderStore} from '~/store/order';
import {useCartStore} from '~/store/cart'

definePageMeta({
  bg: '#eee6dd'
});

const {t} = useI18n() 

const order = ref(null)

const code = computed(() => {
  return useRoute().params.code
})

const title = computed(() => {
  // console.log('order.status', order.value?.status)
  if(order.value?.status === 'failed') {
    return t('title.checkout_complete_failed')
  }else {
    return t('title.checkout_complete')
  }
})


const breadcrumbs =  computed(() => {
  return [
    {
      name: t('title.home'),
      item: useToLocalePath()('/')
    },{
      name: t('title.checkout'),
      item: useToLocalePath()('/checkout')
    },{
      name: title,
      item: useToLocalePath()('/checkout/complete')
    }
  ]
})

const user = computed(() => {
  return order.value?.user || null
})

const delivery = computed(() => {
  return order.value?.delivery || null
})

const warehouseDeliveryMethods = ['novaposhta_warehouse', 'packeta_warehouse']
const addressDeliveryMethods = ['novaposhta_address', 'packeta_address', 'messenger_address', 'default_address']

const normalizeDeliveryLine = (value) => {
  return String(value || '').replace(/\s+/g, ' ').trim()
}

const deliveryDetails = computed(() => {
  if (!delivery.value) {
    return []
  }

  const method = String(delivery.value.method || '').trim()
  const streetLine = normalizeDeliveryLine([delivery.value.street, delivery.value.house, delivery.value.room].filter(Boolean).join(' '))

  if (method === 'default_pickup') {
    const pickupLine = normalizeDeliveryLine(delivery.value.warehouse || streetLine || delivery.value.settlement)
    return pickupLine
      ? [{ label: t('label.our_address'), value: pickupLine }]
      : []
  }

  if (warehouseDeliveryMethods.includes(method)) {
    return [
      { label: t('form.delivery.city'), value: normalizeDeliveryLine(delivery.value.settlement) },
      { label: t('form.delivery.warehouse'), value: normalizeDeliveryLine(delivery.value.warehouse) },
    ].filter((item) => item.value)
  }

  if (addressDeliveryMethods.includes(method)) {
    return [
      { label: t('form.delivery.city'), value: normalizeDeliveryLine(delivery.value.settlement) },
      { label: t('form.delivery.street'), value: streetLine },
      { label: t('form.delivery.zip'), value: normalizeDeliveryLine(delivery.value.zip) },
    ].filter((item) => item.value)
  }

  return [
    { label: t('form.delivery.city'), value: normalizeDeliveryLine(delivery.value.settlement) },
    { label: t('form.delivery.warehouse'), value: normalizeDeliveryLine(delivery.value.warehouse) },
    { label: t('form.delivery.street'), value: streetLine },
    { label: t('form.delivery.zip'), value: normalizeDeliveryLine(delivery.value.zip) },
  ].filter((item) => item.value)
})

const payment = computed(() => {
  return order.value?.payment || null
})

const products = computed(() => {
  return order.value?.products || null
})

const campaignDiscountTotal = computed(() => {
  return Number(order.value?.campaignDiscountTotal || 0)
})

const campaigns = computed(() => {
  return Array.isArray(order.value?.campaigns) ? order.value.campaigns : []
})

useAsyncData('show-order', async() => await useOrderStore().getOrder(code.value))
  .then(({data, error}) => {
    order.value = data.value
    useGoogleEvent().setEvent('Purchase', {
      products: products.value || [],
      total: order.value?.price,
      code: order.value?.code,
      currency: order.value?.currencyCode || order.value?.currency,
      coupon: order.value?.promocode,
      shipping: order.value?.delivery?.method,
      payment: order.value?.payment?.method,
      shippingAmount: order.value?.delivery?.price,
      discount: campaignDiscountTotal.value,
    })
  })

useCartStore().$reset()
</script>

<style src="./complete.scss" lang="scss" scoped />
<i18n src="./lang.yaml" lang="yaml"></i18n>

<template>
  <div class="container">
    <div class="page-base complete-page">

      <the-breadcrumbs :crumbs="breadcrumbs"></the-breadcrumbs>

      <div class="title-common">{{ title }}</div>

      <div v-if="order" class="wrapper">
        <div class="content">
        
          <div class="grid box">
            <div class="title-secondary full-width">{{ t('common') }}</div>

            <div v-if="order.code" class="cell cell-column">
              <div class="label">{{ t('number') }}</div>
              <div class="value">{{ order.code }}</div>
            </div>

            <div v-if="order.status" class="cell cell-column cell-status">
              <div class="label">{{ t('status') }}</div>
              <div :class="order.status" class="value">{{ $t(`status.${order.status}`) }}</div>
            </div>

            <div v-if="order.created_at" class="cell cell-column">
              <div class="label">{{ t('date') }}</div>
              <div class="value">{{ $d(order.created_at, 'long') }}</div>
            </div>
          </div>

          <div class="grid box">
            <div class="column">
              <div class="title-secondary">{{ t('user') }}</div>
              <div v-if="user?.first_name" class="cell">
                <div class="label">{{ $t('form.firstname') }}</div>
                <div class="value">{{ user.first_name }}</div>
              </div>
              <div v-if="user?.last_name" class="cell">
                <div class="label">{{ $t('form.lastname') }}</div>
                <div class="value">{{ user.last_name }}</div>
              </div>
              <div v-if="user?.phone" class="cell">
                <div class="label">{{ $t('form.phone') }}</div>
                <div class="value">{{ user.phone }}</div>
              </div>
              <div v-if="user?.email" class="cell">
                <div class="label">{{ $t('form.email') }}</div>
                <div class="value">{{ user.email }}</div>
              </div>
            </div>

            <div class="column">
              <div class="title-secondary">{{ t('delivery') }}</div>
              <div v-if="order?.delivery_status" class="cell">
                <div class="label">{{ t('status') }}</div>
                <div :class="order.delivery_status" class="value">{{ $t(`delivery_status.${order.delivery_status}`) }}</div>
              </div>
              <div v-if="delivery?.method" class="cell">
                <div class="label">{{ $t('form.method') }}</div>
                <div class="value">{{ $t(`form.delivery.${delivery.method}`) }}</div>
              </div>
              <div
                v-for="(item, index) in deliveryDetails"
                :key="`delivery-detail-${index}`"
                class="cell"
              >
                <div class="label">{{ item.label }}</div>
                <div class="value">{{ item.value }}</div>
              </div>
            </div>

            <div class="column">
              <div class="title-secondary">{{ t('payment') }}</div>
              <div v-if="order?.pay_status" class="cell">
                <div class="label">{{ t('status') }}</div>
                <div :class="order.pay_status" class="value">{{ $t(`pay_status.${order.pay_status}`) }}</div>
              </div>
              <div v-if="order?.price" class="cell cell-price">
                <div class="label">{{ t('total') }}</div>
                <div class="value">
                  <simple-price :value="order.price"></simple-price>
                </div>
              </div>
              <div v-if="campaignDiscountTotal > 0" class="cell">
                <div class="label">{{ t('campaign.discount_line') }}</div>
                <div class="value">-<simple-price :value="campaignDiscountTotal"></simple-price></div>
              </div>
              <div v-if="campaigns.length" class="cell">
                <div class="label">{{ t('campaign.campaign_title') }}</div>
                <div class="value">{{ campaigns.map((item) => item.name).filter(Boolean).join(', ') }}</div>
              </div>
              <div v-if="payment?.method" class="cell">
                <div class="label">{{ $t('form.method') }}</div>
                <div class="value">{{ $t(`form.payment.${payment.method}`) }}</div>
              </div>
              <div class="cell cell-status">
                <div class="label">{{ t('status') }}</div>
                <div class="value success">{{ t('pay_status.' + order.payStatus) }}</div>
              </div>
              <div v-if="payment.method === 'bank_transfer'" class="cell">
                  <div class="text">{{ t('use_qr_or_invoice') }}</div>
                  <div class="label">{{ t('form.enter.invoice_qr') }}</div>
                  <div class="value">
                    <img :src="order.invoiceQrUrl" />
                  </div>
              </div>
              <div v-if="payment.method === 'bank_transfer'" class="cell">
                  <div class="label">{{ t('form.enter.invoice_pdf') }}</div>
                  <div class="value value-btn">
                    <a :href="order.invoiceDownloadUrl" target="_blank" class="button primary">{{ t('button.download_invoice') }}</a>
                  </div>
              </div>
            </div>
          </div>
          

          <div v-if="products" class="product-wrapper box">
            <div class="title-secondary">{{ t('cart') }}</div>
            <div class="product-grid">
              <product-card-checkout-static
                v-for="product in products"
                :key="product.id"
                :item="product"
                class="product-card"
              >
              </product-card-checkout-static>
            </div>
          </div>

        </div>
        <aside class="aside">
          <div class="box">
            <checkout-thanks></checkout-thanks>
          </div>
          <div class="box">
            <checkout-contacts></checkout-contacts>
          </div>
        </aside>
      </div>
    </div>
  </div>
</template>
