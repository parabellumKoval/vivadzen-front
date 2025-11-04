<script setup>
import {useWithdrawalStore} from '~/store/withdrawal'

const {t} = useI18n()
const {user, me} = useAuth()
const {get} = useSettings()
const {currency} = useRegion()
const converter = useConverter()
const isLoading = ref(false)


const methods = ref([
  'Bank card',
  'Paypal',
  'Western Union'
])



const balance = computed(() => {
  const value = user.value?.balance || 0
  return parseFloat(value)
})

const withdrawal = ref({
  amount: balance.value,
  method: 'Bank card',
  details: {
    bank_card: null,
    email: null,
    full_name: null,
    phone: null,
    country: null,
    city: null
  }
})

const errors = ref(null)


// COMPUTEDS

const minWithdrawalValue = computed(() => {
  return get('profile.withdrawal.minAmount') || 0
})
const balanceCurrency = computed(() => {
  return get('profile.points.name') || 'Points'
})

const isWithdrawalAvailable = computed(() => {
  return balance.value >= minWithdrawalValue.value
})

const withdrawalFiatAmount = computed(() => {
  return converter.convertPointsSync(withdrawal.value.amount, currency.value) ?? 0
})


onMounted(() => {
  converter.ensureRates().catch(() => {
    // silent: UI can still retry via sync helper when needed
  })
})

// METHODS
const setDefaultValue = () => {
  withdrawal.value.amount = balance.value
  withdrawal.value.method ='Bank card'
  withdrawal.value.details.bank_card = null
  withdrawal.value.details.email = null
  withdrawal.value.details.full_name = null
  withdrawal.value.details.phone = null
  withdrawal.value.details.country = null
  withdrawal.value.details.city = null
}

const closeHandler = () => {
  useModal().close()
}

const createHandler = () => {
  isLoading.value = true
  const withdrawalCopy = JSON.parse(JSON.stringify(withdrawal.value))
  withdrawalCopy.amount = withdrawalFiatAmount.value
  withdrawalCopy.payout_currency = currency.value

  useWithdrawalStore().create(withdrawalCopy).then(async (res) => {
    useNoty().setNoty({
      title: t('noty.withdrawal.success_title'),
      content: t('noty.withdrawal.requested'),
      type: 'success'
    }, 5000)

    closeHandler()
    setDefaultValue()
    await me(true)
  }).catch((e) => {
    console.log('e', e)
    errors.value = e?.extras
    useNoty().setNoty({
      title: t('noty.withdrawal.fail_title'),
      content: t('noty.withdrawal.fail'),
      type: 'error'
    }, 5000)
  }).finally(() => {
    isLoading.value = false
  })
}
</script>

<style src="./withdrawal.scss" lang="scss" scoped />
<i18n src="./lang.yaml" lang="yaml"></i18n>

<template>
  <modal-wrapper :title="t('title.withdrawal')">
    <div class="withdrawal">
      <div class="form-wrapper">
          <form-select
            v-model="withdrawal.method"
            :values="methods"
            :placeholder="t('method')"
            :nullable="false"
            :error="errors?.method"
            :searchable="false"
          >
          </form-select>

          <template v-if="withdrawal.method === 'Bank card'">
            <form-bank-card
              v-model="withdrawal.details.bank_card"
              :placeholder="$t('form.card_number')"
              :error="errors?.details?.bank_card"
            >
            </form-bank-card>
          </template>
          
          <template v-else-if="withdrawal.method === 'Paypal'">
            <form-text
              v-model="withdrawal.details.email"
              :placeholder="$t('form.email')"
              :error="errors?.details?.email"
            >
            </form-text>
          </template>

          <template v-else-if="withdrawal.method === 'Western Union'">
            <form-text
              v-model="withdrawal.details.full_name"
              :placeholder="$t('form.full_name')"
              :error="errors?.details?.full_name"
            >
            </form-text>
            <form-text
              v-model="withdrawal.details.phone"
              :placeholder="$t('form.phone')"
              :error="errors?.details?.phone"
            >
            </form-text>
            <form-text
              v-model="withdrawal.details.country"
              :placeholder="$t('form.country')"
              :error="errors?.details?.country"
            >
            </form-text>
            <form-text
              v-model="withdrawal.details.city"
              :placeholder="$t('form.city')"
              :error="errors?.details?.city"
            >
            </form-text>
          </template>

          <div class="info-block">
            <div class="info-label">{{ t('balance') }}</div>
            <simple-price :value="balance" :currency-code="balanceCurrency" :class="[isWithdrawalAvailable? 'high' : 'low']" class="info-value"></simple-price>
          </div>

          <div class="info-block">
            <div class="info-label">{{ t('min_withdrawal') }}</div>
            <simple-price :value="minWithdrawalValue" :currency-code="balanceCurrency" class="info-value"></simple-price>
          </div>

          <div :class="{disabled: !isWithdrawalAvailable}" class="info-block amount-block">
            <div class="info-label">{{ t('withdrawal_amount') }}</div>
            <form-amount v-model="withdrawal.amount" :min="minWithdrawalValue" :max="balance"></form-amount>
            <p class="form-hint">{{ t('form.max', {value: balance}) }}</p>
          </div>

          <div class="info-block">
            <div class="info-label">{{ t('fiat') }}</div>
            <simple-price :value="withdrawalFiatAmount" :currency-code="currency" class="info-value"></simple-price>
          </div>

          <button @click.once="createHandler()" :class="[{loading: isLoading, disabled: !isWithdrawalAvailable}]" clickable class="button primary send-btn">
            <span class="text">{{ $t('button.send_request') }}</span>
          </button>
      </div>
    </div>
  </modal-wrapper>
</template>
