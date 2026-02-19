<script setup>
import { useFeedbackStore } from '~~/store/feedback';
import { useCategoryStore } from '~/store/category'

const {t, locale} = useI18n()
const {get} = useSettings()
const {vendors} = useDelivery()
const categoryStore = useCategoryStore()
const { region } = useRegion()
const { messengers, networks } = useSocial()

const sub = ref({
  type: 'subscription',
  email: null
})
const errors = ref(null)

const menu = computed(() => {
  return {
    customer: useMenu().customer.value,
    info: useMenu().info.value
  }
})

const payments = ref([
  ...usePaymentVendor().main
])


const deliveries = computed(() => {
  return vendors.value || []
})


useAsyncData('main-categories-'+locale.value+'-'+region.value, () =>
  categoryStore.listMainCached()
)
const categories = computed(() =>  {
  return categoryStore.mainList
})

// METHODS
const resetSub = () => {
  sub.value.email = null
}

const resetErrors = () => {
  errors.value = null
}

// HANDLERS
const subHandler = () => {

  useFeedbackStore().create(sub.value).then(({data, error}) => {

    if(data.value) {
      // useNoty().setNoty({
      //   content: t('noty.subscription.sent'),
      //   type: 'success'
      // }, 5000)
      useInfoModal().open({
        title: t('noty.subscription.sent_title'),
        message: t('noty.subscription.sent'),
        type: 'success',
        buttonText: t('button.ok')
      })

      resetSub()
      resetErrors()
    }

    if(error.value) {
      throw error
    }

  }).catch((e) => {

    useNoty().setNoty({
      title: t('noty.subscription.fail'),
      content: t('error.check_fields'),
      type: 'error'
    }, 5000)

    errors.value = e
  })
}
 
</script>

<style src="./footer.scss" lang="scss" scoped />
<i18n src="./lang.yaml" lang="yaml"></i18n>

<template>
  <footer class="footer">
    <div class="company">
      <div class="company-logo-container full-container">
          <nuxt-img
            src = "/images/company-white-color.png"
            :provider = "useImg().provider"
            width="200"
            height="58"
            sizes = "mobile:220px"
            format = "avif"
            loading = "lazy"
            fit="outside"
            class="brand-logo"
          />
          <div class="company-logo-container-categories">

            <div class="category-wrapper">
              <template v-for="category in categories" :key="category.id">
                <NuxtLink
                  :to="$regionPath('/' + category.slug)"
                  :aria-label="category.name"
                  clickable
                  class="category"
                >
                  <nuxt-img
                    v-if="category?.image?.src"
                    :src = "category.image.src"
                    :alt = "category.image.alt || category.name"
                    :title = "category.image.title || category.name"
                    :class="category.image.size"
                    width="200"
                    height="200"
                    sizes = "mobile:130px tablet:270px desktop:270px"
                    format = "webp"
                    quality = "60"
                    fit="outside"
                    :placeholder="useImg().noImageTransparent"
                    class="category-image"
                    provider="bunny"
                  >
                  </nuxt-img>
                  <div class="category-name">{{ category.name }}</div>
                </NuxtLink>
              </template>
            </div>
          </div>
      </div>
      <div class="company-container full-container">
        <div class="brand">
          <div class="footer-label">Vivadzen.com</div>
          <div class="brand-desc" v-html="get('site.common.description')"></div>
        </div>

        <div class="phone">
          <div class="footer-label">{{ t('label.contact_phones') }}</div>
          <a :href="'tel:' + useContacts().phone" class="phone-item">{{ useContacts().phone }}</a>
        </div>

        <div class="social">
          <div class="footer-label">{{ t('label.messengers') }}</div>
          <div v-if="messengers.length" class="social-group">
            <div class="social-items">
              <a
                v-for="messenger in messengers"
                :key="messenger?.key"
                :href="messenger?.link"
                :class="messenger?.key + '-bg'"
                class="social-item"
              >
                <IconCSS :name="messenger?.icon" class="social-icon"></IconCSS>
              </a>
            </div>
          </div>
        </div>

        <div class="social">
          <div class="footer-label">{{ t('label.social_networks') }}</div>
          
          <div v-if="networks.length" class="social-group">
            <div class="social-items">
              <a
                v-for="network in networks"
                :key="network?.key"
                :href="network?.link"
                :class="network?.key + '-bg'"
                class="social-item"
              >
                <IconCSS :name="network?.icon" class="social-icon"></IconCSS>
              </a>
            </div>
          </div>
        </div>

        <div class="address">
          <div class="footer-label">{{ t('label.address') }}</div>
          <div class="address-item">
            <IconCSS name="iconoir:map" class="address-icon"></IconCSS>
            <a href="/" class="address-link">{{ useContacts().address }}</a>
          </div>
          <div class="address-item">
            <IconCSS name="iconoir:mail" class="address-icon"></IconCSS>
            <a :href="'mailto:' + useContacts().email" class="address-link">{{ useContacts().email }}</a>
          </div>
        </div>
      </div>
      
    </div>

    <div class="nav">
      <div class="nav-container full-container">
        <div class="left-side">
          <div class="sub">
            <div class="footer-label">{{ t('label.sub_title') }}</div>
            <div class="sub-title">{{ t('label.sub_desc') }}</div>

            <div class="sub-form">
              <form-text
                v-model="sub.email"
                :error="errors?.email"
                @input="() => errors.email = null"
                :placeholder="t('form.enter.email')"
                class="sub-input"
              ></form-text>
              <button @click="subHandler" class="button promo sub-btn">{{ t('button.sub') }}</button>
            </div>
          </div>

          <the-footer-region></the-footer-region>
        </div>

        <hr class="footer-hr nav-hr" />

        <div class="menu menu-1">
          <div class="footer-label">{{ t('label.guide') }}</div>
          <ul class="menu-ul">
            <li v-for="item in menu.customer" :key="item.id">
              <NuxtLink :to="$regionPath(item.link)" class="menu-link">{{ item.title }}</NuxtLink>
            </li>
          </ul>
        </div>

        <div class="menu menu-2">
          <div class="footer-label">{{ t('label.common_info') }}</div>
          <ul class="menu-ul">
            <li v-for="item in menu.info" :key="item.id">
              <NuxtLink :to="$regionPath(item.link)" class="menu-link">{{ item.title }}</NuxtLink>
            </li>
          </ul>
        </div>

        <div class="vendors">
          
          <div class="payment">
            <div class="footer-label">{{ t('we_receive') }}</div>
            <div class="payment-inner">
              <div v-for="payment in payments" :key="payment.id" class="payment-item">
                <nuxt-img
                  :src = "payment.logo"
                  :provider = "useImg().provider"
                  width="50"
                  height="50"
                  sizes = "mobile:50px tablet:75px desktop:75px"
                  format = "avif"
                  loading = "lazy"
                  fit="outside"
                  class="payment-logo"
                />
              </div>
            </div>
          </div>

          <div v-if="deliveries?.length" class="delivery">
            <div class="footer-label">{{ t('delivery') }}</div>
            <div class="delivery-inner">
              <div v-for="delivery in deliveries" :key="delivery.id" class="delivery-item">
                <nuxt-img
                  :src = "delivery.logo"
                  :provider = "useImg().provider"
                  width="50"
                  height="50"
                  sizes = "mobile:50px tablet:75px desktop:75px"
                  format = "avif"
                  loading = "lazy"
                  fit="outside"
                  class="delivery-logo"
                />
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>

    <hr class="footer-hr" />

    <div class="last-section">
      vivadzen.com ©2021 - {{ new Date().getFullYear() }} / {{ t('rights') }}
    </div>

  </footer>
</template>
