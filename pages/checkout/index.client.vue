<script setup>
import {useCartStore} from '~/store/cart'

definePageMeta({
  bg: '#eee6dd',
  ssr: false
});

const { scrollToAnchor } = useAnchorScroll({
  toAnchor: {
    scrollOptions: {
      behavior: 'smooth',
      offsetTop: -90,
    }
  },
})

const {t} = useI18n()
const { user, token, isAuthenticated, init, me } = useAuth()
const {fetchCartProducts, isFieldRequired} = useCartStore()
await init()
const breadcrumbs = [
  {
    name: t('title.home'),
    item: '/'
  },{
    name: t('title.catalog'),
    item: '/catalog'
  }
]

const isCheckoutListActive = ref(false)
const errorHtml = ref(null)
const authType = ref('new')

// COMPUTEDS
const products = computed(() => {
  return useCartStore().cart
})

const order = computed(() => {
  return useCartStore().order
})

const errors = computed(() => {
  return useCartStore().errors
})

const userErrors = computed(() => {
  return errors.value.user && Object.keys(errors.value.user).length? true: false
})

const deliveryErrors = computed(() => {
  return errors.value.delivery && Object.keys(errors.value.delivery).length? true: false
})

const paymentErrors = computed(() => {
  return errors.value.payment && Object.keys(errors.value.payment).length? true: false
})

const total = computed(() => {
  return useCartStore().total
})

const userFirstName = computed(() => {
  if(user.value?.first_name) {
    return user.value.first_name;
  }else if(user.value?.fullname) {
    return user.value.fullname.split(' ')[0]
  }else {
    return null;
  }
})

const userLastName = computed(() => {
  if(user.value?.last_name) {
    return user.value.last_name;
  }else if(user.value?.fullname) {
    let nameArray = user.value.fullname.split(' ')
    return nameArray[1]? nameArray[1]: null
  }else {
    return null;
  }
})

const isUserNameRequired = computed(() => {
  if(order.value.payment?.method === 'bank_transfer') {
    return true
  }

  if(order.value.delivery?.method === 'packeta_address' || order.value.delivery?.method === 'packeta_warehouse') {
    return true
  }
})

const auth = isAuthenticated

/**
 * computed-свойство, которое определяет:
 * — если в rules.user.children.firstname.required === true → true
 * — иначе, если есть requiredIf: { field, values } → см. order[field] и values.includes(...)
 * — иначе → false
 */
// const isUserFirstNameRequired = computed(() => {
//   console.log('rules', rules.value)
//   return isFieldRequired('user.children.firstname')
// })


// METHODS



const scrollHandler = (item) => {
  nextTick(() => {
    scrollToAnchor(item)
  });
}

const setUserData = () => {
  order.value.user.first_name = !order.value.user.first_name? userFirstName.value: order.value.user.first_name
  order.value.user.last_name = !order.value.user.last_name? userLastName.value: order.value.user.last_name
  order.value.user.phone = !order.value.user.phone? (user.value?.phone || null): order.value.user.phone
  order.value.user.email = !order.value.user.email? (user.value?.email || null): order.value.user.email
}

// HANDLERS
const openCatalogHandler = () => {
  useModal().open(resolveComponent('ModalCatalog'), null)
}

const scrollToErrorHandler = () => {
  if(errors.value.user && Object.keys(errors.value.user).length) {
    scrollHandler('customer-box')
    return
  }
  
  if(errors.value.delivery && Object.keys(errors.value.delivery).length) {
    scrollHandler('delivery-box')
    return
  }

  if(errors.value.payment && Object.keys(errors.value.payment).length) {
    scrollHandler('payment-box')
    return
  }
}


// WATCH
watch(() => order.value.delivery.settlement, (v) => {
  order.value.delivery.warehouse = null
  order.value.delivery.street = null
})

// Change delivery method
watch(() => order.value.delivery.method, (v) => {
  let shipping = ''

  if(v === 'pickup') {
    shipping = 'Pickup'
  }else if(v === 'address') {
    shipping = 'Novaposhta to address'
  }else if(v === 'warehouse') {
    shipping = 'Novaposhta to warehouse'
  }

  useGoogleEvent().setEvent('АddShippingInfo', {products: products.value, total: total.value, shipping: shipping })

  errors.value.delivery = {}
}, {
  immediate: true
})

// Change payment method
watch(() => order.value.payment.method, (v) => {
  let payment = ''

  if(v === 'online') {
    payment = 'Monobank online'
  }else if(v === 'cash') {
    payment = 'Novaposhta cash'
  }
  useGoogleEvent().setEvent('АddPaymentInfo', {products: products.value, total: total.value, payment: payment })
  
  errors.value.delivery = {}
}, {
  immediate: true
})

watch(() => authType.value, (v) => {
  errors.value.user = {}
})

const ensureAuthUser = () => {
  if(user.value && user.value.id) {
    setUserData()
    // useCartStore().setUser(user.value)
  }
}

watch(() => user.value, () => {
  ensureAuthUser()
}, {
  deep: true,
  immediate: true
})

watch(
  [() => user.value, () => token.value],
  ([currentUser, currentToken]) => {
    if (!currentUser && currentToken) {
      me(true).catch(() => {})
    }
  },
  { immediate: true }
)


await useAsyncData('cart-products', async () => await fetchCartProducts())

// Reset errors
useCartStore().clearErrors()
setUserData()

useAsyncData('get-rules', async() => await useCartStore().rules())

useGoogleEvent().setEvent('BeginCheckout', {products: products.value, total: total.value})

</script>

<style src="./checkout.scss" lang="scss" scoped></style>
<i18n src="./lang.yaml" lang="yaml"></i18n>

<template>
  <div class="container">
    <div class="page-base">
      <the-breadcrumbs :crumbs="breadcrumbs"></the-breadcrumbs>

      <div class="title">
        <span class="title-common">{{ t('title.checkout') }}</span>
      </div>

      <div class="content">
        <div class="content-main">

          <!-- PRODUCTS -->
          <div class="checkout-box">
            <div class="title-secondary">{{ t('title.cart') }}</div>
            <template v-if="products?.length">
              <product-card-checkout
                v-for="product in products"
                :key="product.id"
                :item="product"
                class="checkout-product"
              ></product-card-checkout>
            </template>
            <template v-else>
              <div>
                {{ t('no_products') }} 
                <button @click="openCatalogHandler" class="text-link"><span>{{ t('catalog') }}</span></button> 
                {{ t('select') }}
              </div>
            </template>

            <div v-show="isCheckoutListActive" class="checkout-extrabox" >
              <lazy-checkout-list @isActive="(v) => isCheckoutListActive = v"></lazy-checkout-list>
            </div>
          </div>


          <!-- DELIVERY -->
          <div :class="{error: deliveryErrors}" id="delivery-box" class="checkout-box">
            <div class="title-secondary">{{ t('title.delivery') }}</div>
            <checkout-delivery></checkout-delivery>
          </div>


          <!-- PAYMENT -->
          <div :class="{error: paymentErrors}" id="payment-box" class="checkout-box">
            <div class="title-secondary">{{ t('title.payment') }}</div>
            <checkout-payment></checkout-payment>
          </div>

          <!-- CUSTOMER -->
          <div :class="{error: userErrors}" id="customer-box" class="checkout-box">
            <div class="title-secondary">{{ t('label.customer') }}</div>
      
            <checkout-user class="checkout-user"></checkout-user>

            <div class="form-grid">
              <form-text
                v-if="isUserNameRequired"
                v-model="order.user.first_name"
                :error="errors?.user?.first_name"
                @input="() => errors?.user?.first_name && (errors.user.first_name = null)"
                :placeholder="t('form.firstname')"
                :required="isFieldRequired('user.children.first_name')"
              ></form-text>
              <form-text
                v-if="isUserNameRequired"
                v-model="order.user.last_name"
                :error="errors?.user?.last_name"
                @input="() => errors?.user?.last_name && (errors.user.last_name = null)"
                :placeholder="t('form.lastname')"
                :required="isFieldRequired('user.children.last_name')"
              ></form-text>
              <form-phone
                v-model="order.user.phone"
                :error="errors?.user?.phone"
                @input="() => errors?.user?.phone && (errors.user.phone = null)"
                :placeholder="t('form.phone')"
                :required="isFieldRequired('user.children.phone')"
              ></form-phone>
              <form-text
                v-model="order.user.email"
                :error="errors?.user?.email"
                @input="() => errors?.user?.email && (errors.user.email = null)"
                :placeholder="t('form.email')"
                :required="isFieldRequired('user.children.email')"
              ></form-text>
            </div>

          </div>


          <div id="comment-box" class="checkout-box">
            <div class="title-secondary">{{ t('title.other') }}</div>
            <div class="form-row">
              <form-textarea
                v-model="order.comment"
                :error="errors?.comment"
                @input="() => errors?.comment && (errors.comment = null)"
                :placeholder="t('form.comment')"
              ></form-textarea>
            </div>
          </div>

        </div>
        <div class="content-sale">
          <div class="content-sale-sticky">
            <div class="checkout-box">
              <div class="title-secondary">{{ t('label.total') }}</div>
              <checkout-sale @scrollToError="scrollToErrorHandler"></checkout-sale>
            </div>

            <checkout-contacts class="contacts-box"></checkout-contacts>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
