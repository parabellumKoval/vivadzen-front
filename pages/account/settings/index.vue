<script setup>
const {t} = useI18n()
const props = defineProps({})
const { user: authUser, updateProfile, init } = useAuth()

await init()

definePageMeta({
  crumb: {
    name: 'title.account.settings',
    item: '/'
  },
  tab: 'settings'
});


const isLoading = ref(false)
const isLoadingPassword = ref(false)

const user = ref({
  first_name: null,
  last_name: null,
  phone: null,
  email: null
})

const address = ref({
  street: '',
  warehouse: '',
  city: '',
  zip: ''
})
// COMPUTEDS
// METHODS
// HANDLERS
const saveAdressHandler = () => {

}

const saveInfoHandler = async () => {
  isLoading.value = true
  try {
    await updateProfile({
      first_name: user.value.first_name,
      last_name: user.value.last_name,
      phone: user.value.phone
    })
    useNoty().setNoty({
      content: t('noty.update.success'),
      type: 'success'
    })
  } catch (error) {
    useNoty().setNoty({
      content: t('noty.update.fail'),
      type: 'error'
    })
  } finally {
    isLoading.value = false
  }
}

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

// WATCHERS
watch(authUser, (v) => {
  if(v){
    user.value = {
      first_name: v.first_name ?? null,
      last_name: v.last_name ?? null,
      phone: v.phone ?? null,
      email: v.email ?? null
    }
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
      >{{ t('button.save') }}</button>
    </div>
    <div class="settings-box">
      <div class="settings-label">{{ t('title.delivery') }}</div>
      <div class="settings-grid">
        <form-text v-model="address.street" :placeholder="t('form.delivery.address')"></form-text>
        <form-text v-model="address.city" :placeholder="t('form.delivery.settlement')"></form-text>
        <form-text v-model="address.zip" :placeholder="t('form.delivery.zip')"></form-text>
        <form-text v-model="address.warehouse" :placeholder="t('form.delivery.warehouse')"></form-text>
      </div>
      <button @click="saveAdressHandler" class="button primary settings-action-btn">{{ t('button.save') }}</button>
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
