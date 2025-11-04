<script setup>
const { t } = useI18n()
const isLoading = ref(false)
const { requestEmailChange } = useAuth()

const email = ref(null)
const password = ref('')
const errors = ref({
  email: null,
  password: null
})

// METHODS

// HANDLERS
const saveHandler = async () => {
  isLoading.value = true
  try {
    await requestEmailChange({ email: email.value, password: password.value })
    useNoty().setNoty({
      content: t('noty.auth.email.confirmation.sent', {email: email.value}),
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

</script>

<style src="./new.scss" lang="sass" scoped />
<i18n src="./lang.yaml" lang="yaml"></i18n>

<template>
  <modal-wrapper :title="t('title')">
    <div>
      <p class="form-component">{{ t('new_email') }}</p>
      <div class="popup__body">
        <form-text
          v-model="email"
          :placeholder="$t('form.email')"
          :error="errors?.email"
          required
          class="form-component"
        >
        </form-text>
        <form-password
          v-model="password"
          :placeholder="$t('form.password')"
          :error="errors?.password"
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
          class="button primary full"
        >
          <span class="text">{{ t('send') }}</span>
        </button>
      </div>
    </div>
  </modal-wrapper>
</template>
