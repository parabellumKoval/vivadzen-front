<script setup>
import { ref } from 'vue'
const { t } = useI18n()
const { register } = useAuth()
const isLoading = ref(false)

const auth = ref({
  email: '',
  password: '',
  password_confirmation: '',
  privacy: false,
})

const errors = ref({
  email: null,
  password: null,
  password_confirmation: null,
})

const resetErrors = () => {
  errors.value.email = null
  errors.value.password = null
  errors.value.password_confirmation = null
}

const applyErrors = (payload) => {
  if (!payload) return
  Object.entries(payload).forEach(([key, messages]) => {
    if (Object.prototype.hasOwnProperty.call(errors.value, key) && Array.isArray(messages) && messages.length) {
      errors.value[key] = messages[0]
    }
  })
}

const validate = () => {
  resetErrors()
  let ok = true

  if (!auth.value.email) {
    errors.value.email = t('error.required')
    ok = false
  }

  if (!auth.value.password) {
    errors.value.password = t('error.auth.password.require')
    ok = false
  } else if (auth.value.password.length < 6) {
    errors.value.password = t('error.auth.password.require')
    ok = false
  }

  if (auth.value.password !== auth.value.password_confirmation) {
    errors.value.password_confirmation = t('error.auth.password.confirmation')
    ok = false
  }

  if (!auth.value.privacy) {
    useNoty().setNoty({
      content: t('noty.auth.register.privacy'),
      type: 'error'
    })
    ok = false
  }

  return ok
}

const submitHandler = async () => {
  if (!validate()) return

  isLoading.value = true
  try {
    await register({
      email: auth.value.email,
      password: auth.value.password,
    })

    useNoty().setNoty({
      content: t('noty.auth.email.confirmation.sent'),
      type: 'success'
    }, 10000)

    useModal().close()
  } catch (err) {
    const data = err?.data || {}
    if (data?.errors) applyErrors(data.errors)
    const message =
      (typeof data?.message === 'string' && data.message) ||
      t('noty.auth.register.fail')
    useNoty().setNoty({ content: message, type: 'error' }, 7000)
  } finally {
    isLoading.value = false
  }
}

const loginHandler = () => {
  useModal().open(resolveComponent('ModalAuthSocial'), null, null)
}
</script>

<style src="./../auth.scss" lang="scss" scoped></style>
<style src="./register.scss" lang="scss" scoped></style>

<i18n src="./lang.yaml" lang="yaml"></i18n>

<template>
  <modal-wrapper :title="t('label.register')" class="modal-wrapper-auth">
    <div class="modal-content-wrapper">
      
      <div class="form">
        <form-text
          v-model="auth.email"
          :error="errors?.email"
          @input="() => errors.email = null"
          :placeholder="t('form.enter.email')"
          required
        ></form-text>
        <form-password
          v-model="auth.password"
          :error="errors?.password"
          @input="() => errors.password = null"
          :placeholder="t('form.enter.password')"
          required
        ></form-password>
        <form-password
          v-model="auth.password_confirmation"
          :error="errors?.password_confirmation"
          @input="() => errors.password_confirmation = null"
          :placeholder="t('form.enter.password_confirmation')"
          required
        ></form-password>

        <div class="agree-block">
          <form-checkbox v-model="auth.privacy" :is-boolean="true">
            <span class="privacy-policy">
              {{ $t('messages.i_agreed_with') }}&nbsp;
              <NuxtLink :to="$regionPath('/privacy')" clickable class="a-link" target="_blade">{{ $t('messages.agree_privacy_policy') }}</NuxtLink>
            </span>
          </form-checkbox>
        </div>

        <button
          @click="submitHandler"
          :class="{loading: isLoading}"
          class="button primary form-button"
        >{{ t('button.register') }}</button>
      </div>

      <div class="footer">
        <div class="registration">
          <div class="label">{{ t('account') }}</div>
          <simple-button-text
            :text="t('button.enter')"
            :callback="loginHandler"
            icon="iconoir:lock"
          ></simple-button-text>
        </div>
      </div>

    </div>
  </modal-wrapper>
</template>
