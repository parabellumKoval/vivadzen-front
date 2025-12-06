<script setup>
const { t } = useI18n()
const { user: authUser, updateProfile, init } = useAuth()
const noty = useNoty()

await init()

definePageMeta({
  crumb: {
    name: 'title.account.settings',
    item: '/'
  },
  tab: 'settings'
});

const ADDRESS_FIELDS = ['email', 'phone', 'address_1', 'postcode', 'city', 'state', 'country']

const isLoading = ref(false)
const isBillingLoading = ref(false)
const isShippingLoading = ref(false)
const isLoadingPassword = ref(false)

const user = ref({
  first_name: null,
  last_name: null,
  phone: null,
  email: null
})

const createAddressState = () => {
  const state = {}
  ADDRESS_FIELDS.forEach((field) => {
    state[field] = ''
  })
  return state
}

const billing = ref(createAddressState())
const shipping = ref(createAddressState())

const mapAddressState = (value) => {
  const next = createAddressState()

  if (!value || typeof value !== 'object') {
    return next
  }

  ADDRESS_FIELDS.forEach((field) => {
    const candidate = value[field]
    next[field] = typeof candidate === 'string' ? candidate : ''
  })

  return next
}

const buildAddressPayload = (value) => {
  const payload = {}

  ADDRESS_FIELDS.forEach((field) => {
    const candidate = value[field]
    payload[field] = typeof candidate === 'string' ? candidate : ''
  })

  return payload
}

const saveInfoHandler = async () => {
  isLoading.value = true
  try {
    await updateProfile({
      first_name: user.value.first_name,
      last_name: user.value.last_name,
      phone: user.value.phone
    })
    noty.setNoty({
      content: t('noty.update.success'),
      type: 'success'
    })
  } catch (error) {
    noty.setNoty({
      content: t('noty.update.fail'),
      type: 'error'
    })
  } finally {
    isLoading.value = false
  }
}

const saveAddressSection = async (section, stateRef, loadingRef) => {
  loadingRef.value = true
  try {
    await updateProfile({ [section]: buildAddressPayload(stateRef.value) })
    noty.setNoty({
      content: t('noty.update.success'),
      type: 'success'
    })
  } catch (error) {
    noty.setNoty({
      content: t('noty.update.fail'),
      type: 'error'
    })
  } finally {
    loadingRef.value = false
  }
}

const saveBillingHandler = () => saveAddressSection('billing', billing, isBillingLoading)
const saveShippingHandler = () => saveAddressSection('shipping', shipping, isShippingLoading)

const showUpdateEmailHandler = () => {
  useModal().open(resolveComponent('ModalAuthEmailNew'), null, null, {width: {max: 420}})
}


const updatePasswordConfirmHandler = () => {
  useModal().open(resolveComponent('ModalConfirm'), {
    title: t('title_change_pass'),
    desc: t('desc_change'),
    yes: {
      title: t('button.yes'),
      callback: updatePasswordHandler
    },
    no: {
      title: t('button.cancel'),
      callback: null
    },
    type: 'good'
  }, null, {
    width: {
      max: 420
    }
  })
}

const updatePasswordHandler = () => {
  useModal().open(resolveComponent('ModalAuthPasswordReset'), user.value.email, null, {width: {max: 420}})

  // isLoadingPassword.value = true
  // useAuthStore().sendPasswordResetLink(user.value.email).then(({data, error}) => {
  //   if(data !== null)
  //     useNoty().setNoty({
  //       content: t('noty.auth.password.recovery.sent', {email: user.value.email})
  //     })
    
  //   if(error) {
  //     useNoty().setNoty({
  //       content: t(`errors.${error.message}`),
  //       type: 'error'
  //     })
  //   }
  // }).finally(() => {
  //   isLoadingPassword.value = false
  // })
}

watch(authUser, (v) => {
  if(v){
    user.value = {
      first_name: v.first_name ?? null,
      last_name: v.last_name ?? null,
      phone: v.phone ?? null,
      email: v.email ?? null
    }
    billing.value = mapAddressState(v.billing)
    shipping.value = mapAddressState(v.shipping)
  } else {
    user.value = {
      first_name: null,
      last_name: null,
      phone: null,
      email: null
    }
    billing.value = createAddressState()
    shipping.value = createAddressState()
  }
}, {
  immediate: true
})
</script>

<style src='./settings.scss' lang='scss' scoped></style>
<style src='./../account-page.scss' lang='scss' scoped></style>
<i18n src='./lang.yaml' lang='yaml'></i18n>

<template>
  <div>
    <div class="title-secondary">{{ t('title.account.settings') }}</div>
    <div class="settings-box">
      <div class="settings-label">{{ t('personal_data') }}</div>
      <div class="settings-grid">
        <form-text v-model="user.first_name" :placeholder="t('form.firstname')"></form-text>
        <form-text v-model="user.last_name" :placeholder="t('form.lastname')"></form-text>
        <form-text v-model="user.phone" :placeholder="t('form.phone')"></form-text>
        <form-text v-model="user.email" :placeholder="t('form.email')"></form-text>
      </div>
      <button
        @click="saveInfoHandler"
        class="button primary settings-action-btn"
        :disabled="isLoading"
      >{{ t('button.save') }}</button>
    </div>
    <div class="settings-box">
      <div class="settings-label">{{ t('payment_data') }}</div>
      <div class="settings-grid">
        <form-text v-model="billing.email" :placeholder="t('address_fields.email')"></form-text>
        <form-text v-model="billing.phone" :placeholder="t('address_fields.phone')"></form-text>
        <form-text v-model="billing.address_1" :placeholder="t('address_fields.address_1')"></form-text>
        <form-text v-model="billing.postcode" :placeholder="t('address_fields.postcode')"></form-text>
        <form-text v-model="billing.city" :placeholder="t('address_fields.city')"></form-text>
        <form-text v-model="billing.state" :placeholder="t('address_fields.state')"></form-text>
        <form-text v-model="billing.country" :placeholder="t('address_fields.country')"></form-text>
      </div>
      <button
        @click="saveBillingHandler"
        class="button primary settings-action-btn"
        :disabled="isBillingLoading"
      >{{ t('button.save') }}</button>
    </div>
    <div class="settings-box">
      <div class="settings-label">{{ t('delivery_data') }}</div>
      <div class="settings-grid">
        <form-text v-model="shipping.email" :placeholder="t('address_fields.email')"></form-text>
        <form-text v-model="shipping.phone" :placeholder="t('address_fields.phone')"></form-text>
        <form-text v-model="shipping.address_1" :placeholder="t('address_fields.address_1')"></form-text>
        <form-text v-model="shipping.postcode" :placeholder="t('address_fields.postcode')"></form-text>
        <form-text v-model="shipping.city" :placeholder="t('address_fields.city')"></form-text>
        <form-text v-model="shipping.state" :placeholder="t('address_fields.state')"></form-text>
        <form-text v-model="shipping.country" :placeholder="t('address_fields.country')"></form-text>
      </div>
      <button
        @click="saveShippingHandler"
        class="button primary settings-action-btn"
        :disabled="isShippingLoading"
      >{{ t('button.save') }}</button>
    </div>
    <div class="settings-box">
      <div class="settings-label">{{ t('security') }}</div>
      <div class="settings-buttons">
        <button @click="showUpdateEmailHandler" class="button secondary">
          <IconCSS name="iconoir:mail" class="inline-icon"></IconCSS>
          <span>{{ t('change_email') }}</span>
        </button>
        <button @click="updatePasswordConfirmHandler" class="button secondary">
          <IconCSS name="iconoir:password-cursor" class="inline-icon"></IconCSS>
          <span>{{ t('change_pass') }}</span>
        </button>
      </div>
    </div>
  </div>
</template>
