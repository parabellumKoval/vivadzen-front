<script setup>
const {t} = useI18n()

definePageMeta({
  subTab: 0
});

const runtimeConfig = useRuntimeConfig()
const {get, all} = useSettings()
const {user} = useAuth()
console.log('user', user)

const balance = computed(() => {
  return user.value?.balance || 0
})

const referralLevels = computed(() => {
  return get('profile.referrals.triggers.store.order_paid.levels') || []
})


const isPayForOrderEnabled = computed(() => {
  return get('profile.pay_for_order.enabled') || false
})

const isWithdrawalEnabled = computed(() => {
  return get('profile.withdrawal.enabled') || false
})

const minWithdrawalValue = computed(() => {
  return get('profile.withdrawal.minAmount') || 0
})

const {name: balanceCurrency} = usePoints()

const referralCode = computed(() => {
  return user.value?.referral_code || 'N/A'
})

const refKey = computed(() => {
  return runtimeConfig.public.authBridge.referrals.queryParam || 'ref'
})
const referralLink = computed(() =>{
    return `${runtimeConfig.public.siteUrl}/?${refKey.value}=${referralCode.value}`
})

const props = defineProps({})
// COMPUTEDS

// METHODS
// HANDLERS
const openWithdrawalHandler = (event) => {
  const component = defineAsyncComponent(() => import('~/components/Modal/Withdrawal/Withdrawal.client.vue'))
  useModal().open(component, null, null)
}
// WATCHERS
</script>

<style src='./common.scss' lang='scss' scoped></style>
<i18n src='./lang.yaml' lang='yaml'></i18n>

<template>
  <div>
    <div class="header">
      <div class="header-item">
        <div class="label">{{ t('current') }}</div>
        <div class="value">
          <simple-price
            :value="balance"
            :currency-code="balanceCurrency"
            :currency-label="balanceCurrency"
            class="value-price"
          ></simple-price>
        </div>
      </div>
      <div class="header-item">
        <div class="label">{{ t('your_code') }}</div>
        <div class="value">
          <promocode-code :value="referralCode" class="value-code"></promocode-code>
        </div>
      </div>
      <div class="header-item header-item-link">
        <div class="label">{{ t('your_link') }}</div>
        <div class="value">
          <form-link v-model="referralLink" placeholder="https://"></form-link>
        </div>
      </div>
    </div>
    <ul class="conds">
      <li v-if="isPayForOrderEnabled" class="conds-item">{{ t('desc_1') }}</li>
      <li v-if="isWithdrawalEnabled" class="conds-item">
        {{ t('desc_2_1') }} 
        <button @click="openWithdrawalHandler" class="text-link">
          <span>{{ t('desc_2_2') }}</span>
        </button>
        {{ t('desc_2_3', {amount: minWithdrawalValue, currency: balanceCurrency}) }}
      </li>
    </ul>
    <div class="percent">
      <div v-for="level in referralLevels" class="percent-item">
        <div class="percent-value">{{ level?.value }}<span class="symbol">%</span></div>
        <div class="percent-text">
          {{ t('income') }}  🤝 {{ t('level') }} <span class="select">{{ level?.level }}</span>
        </div>
      </div>

      <!-- <div class="percent-item">
        <div class="percent-value">3<span class="symbol">%</span></div>
        <div class="percent-text">
          {{ t('income') }} <span class="select">{{ t('second') }}</span> 🤝 🤝 {{ t('level') }}
        </div>
      </div> -->
    </div>
  </div>
</template>
