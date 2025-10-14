<script setup>
import { ref, computed } from 'vue'
const { t } = useI18n()
const { resetPassword } = useAuth()
const modal = useModal()
const modalPayload = computed(() => modal.active?.data)
const isLoading = ref(false)

const user = ref({
  password: '',
  password_confirmation: '',
})

const errors = ref({
  password: null,
  password_confirmation: null
})

const applyErrors = (payload) => {
  if (!payload) return
  Object.entries(payload).forEach(([key, messages]) => {
    if (Object.prototype.hasOwnProperty.call(errors.value, key) && Array.isArray(messages) && messages.length) {
      errors.value[key] = messages[0]
    }
  })
}

const validate = () => {
  errors.value.password = null
  errors.value.password_confirmation = null

  if (!user.value.password) {
    errors.value.password = t('error.auth.password.require')
    return false
  }

  if (user.value.password !== user.value.password_confirmation) {
    errors.value.password_confirmation = t('error.auth.password.confirmation')
    useNoty().setNoty({
      content: t('error.auth.password.confirmation'),
      type: 'error'
    }, 7000)
    return false
  }

  return true
}

const saveHandler = async () => {
  if(!validate()) return

  const payload = modalPayload.value
  if (!payload?.token || !payload?.email) {
    useNoty().setNoty({
      content: t('noty.update.fail'),
      type: 'error'
    }, 7000)
    return
  }

  isLoading.value = true
  try {
    await resetPassword(
      payload.token,
      payload.email,
      user.value.password,
      user.value.password_confirmation
    )

    useNoty().setNoty({
      content: t('noty.auth.password.changed.success'),
      type: 'success'
    })

    useModal().close()
    navigateTo('/')
  } catch (err) {
    const data = err?.data || {}
    if (data?.errors) applyErrors(data.errors)
    const message =
      (typeof data?.message === 'string' && data.message) ||
      t('noty.update.fail')
    useNoty().setNoty({ content: message, type: 'error' }, 7000)
  } finally {
    isLoading.value = false
  }
}

</script>


<style src="./../../auth.scss" lang="scss" scoped />
<style src="./new.scss" lang="scss" scoped />

<i18n src="./lang.yaml" lang="yaml"></i18n>

<template>
<modal-wrapper :title="t('title')">
  <div class="modal-content-wrapper">
    <div class="popup__body">
      <form-password
        v-model="user.password"
        :placeholder="$t('form.enter.password')"
        :error="errors?.password"
        required
        class="form-component"
      >
      </form-password>

      <form-password
        v-model="user.password_confirmation"
        :placeholder="$t('form.enter.password_confirmation')"
        :error="errors?.password_confirmation"
        required
        class="form-component"
      >
      </form-password>
    </div>

    <div class="footer">
      <button
        @click="saveHandler"
        :class="{loading: isLoading}"
        clickable
        class="button primary btn"
      >
        <span class="text">{{ $t('button.save') }}</span>
      </button>
    </div>
  </div>
</modal-wrapper>
</template>
