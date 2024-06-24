<script setup>
import {useAuthStore} from '~/store/auth'

const { t } = useI18n()
const isLoading = ref(false)

const email = ref(null)
const errors = ref({
  email: null
})

// METHODS

// HANDLERS
const saveHandler = () => {
  isLoading.value = true

  useAuthStore().update({email: email.value}, '/account/email-change').then(({data, error}) => {

    if(data && data.user)
      useNoty().setNoty({
        content: t('noty.auth.email.confirmation.sent', {email: email.value}),
        type: 'success'
      })
    
    if(error)
      useNoty().setNoty({
        content: t(`errors.${error.message}`),
        type: 'error'
      })

  }).finally(() => {
    isLoading.value = false
  })
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