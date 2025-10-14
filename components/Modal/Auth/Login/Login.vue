<script setup>
import { ref } from 'vue'
const { t } = useI18n()
const { login } = useAuth()
const isLoading = ref(false)

const auth = ref({ email: '', password: '' })
const errors = ref({ email: null, password: null })

const validate = () => {
  let ok = true
  errors.value.email = null
  errors.value.password = null

  if (!auth.value.email) {
    errors.value.email = t('error.required')
    ok = false
  }
  if (!auth.value.password) {
    errors.value.password = t('error.auth.password.require')
    ok = false
  }

  return ok
}

const applyErrors = (payload) => {
  if (!payload) return
  for (const [key, messages] of Object.entries(payload)) {
    if (Object.prototype.hasOwnProperty.call(errors.value, key) && Array.isArray(messages) && messages.length) {
      errors.value[key] = messages[0]
    }
  }
}

const loginHandler = async () => {
  if (!validate()) return

  isLoading.value = true
  try {
    await login(auth.value.email, auth.value.password)
    useNoty().setNoty({
      content: t('noty.auth.login.success'),
      type: 'success'
    }, 5000)
    useModal().close()
  } catch (err) {
    const data = err?.data || {}
    if (data?.errors) applyErrors(data.errors)
    const message =
      (typeof data?.message === 'string' && data.message) ||
      t('noty.auth.login.fail')
    useNoty().setNoty({ content: message, type: 'error' }, 7000)
  } finally {
    isLoading.value = false
  }
}

const changePasswordHandler = () => {
  useModal().open(resolveComponent('ModalAuthPasswordReset'), null, null, {width: {min: 420, max: 420}})
}

const regHandler = () => {
  useModal().open(resolveComponent('ModalAuthRegister'), null, null, {width: {min: 420, max: 420}})
}
</script>

<style src="./../auth.scss" lang="scss" scoped></style>
<style src="./login.scss" lang="scss" scoped></style>

<i18n src="./lang.yaml" lang="yaml"></i18n>

<template>
  <modal-wrapper :title="t('label.login')" class="modal-wrapper-auth">
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

        <button
          @click="loginHandler"
          :class="{loading: isLoading}"
          class="button primary form-button"
        >{{ t('button.enter') }}</button>
      </div>

      <div class="footer">
        <div class="forget">
          <div class="label">{{ t('forget') }}</div>
          <simple-button-text
            :text="t('restore')"
            :callback="changePasswordHandler"
            icon="iconoir:password-error"
          ></simple-button-text>
        </div>
        <div class="registration">
          <div class="label">{{ t('have_not') }}</div>
          <simple-button-text
            :text="t('label.register')"
            :callback="regHandler"
            icon="iconoir:lock"
          ></simple-button-text>
        </div>
      </div>

    </div>
  </modal-wrapper>
</template>
