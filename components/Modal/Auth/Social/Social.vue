<script setup>
import { useAppPersistStore } from '~/store/appPersist';

const { t } = useI18n()
const { socialSignIn } = useAuth()
const route = useRoute()

// HANDLERS
const regHandler = () => {
  useModal().open(resolveComponent('ModalAuthRegister'), null, null, {width: {min: 420, max: 420}})
}

const emailLoginHandler = () => {
  useModal().open(resolveComponent('ModalAuthLogin'), null, null, {width: {min: 420, max: 420}})
}

const googleHandler = async () => {
  useAppPersistStore().setFrom('login')
  const redirect = typeof window !== 'undefined' ? `${window.location.origin}${route.fullPath}` : undefined
  await socialSignIn('google', redirect ? { redirect_uri: redirect } : undefined)
}

const facebookHandler = async () => {
  useAppPersistStore().setFrom('login')
  const redirect = typeof window !== 'undefined' ? `${window.location.origin}${route.fullPath}` : undefined
  await socialSignIn('facebook', redirect ? { redirect_uri: redirect } : undefined)
}
</script>

<style src="./../auth.scss" lang="scss" scoped></style>
<style src="./social.scss" lang="scss" scoped></style>
<i18n src="./lang.yaml" lang="yaml"></i18n>

<template>
  <modal-wrapper :title="t('label.auth_enter')" class="modal-wrapper-auth">
    <div class="modal-content-wrapper">
      <div class="buttons">
        <button @click="googleHandler" class="button google-bg">
          <IconCSS name="iconoir:google" class="icon"></IconCSS>
          <span class="text">{{ t('enter_with') }} Google</span>
        </button>

        <button @click="facebookHandler" class="button facebook-bg">
          <IconCSS name="iconoir:facebook" class="icon"></IconCSS>
          <span class="text">{{ t('enter_with') }} Facebook</span>
        </button>

        <button @click="emailLoginHandler" class="button color-dark">
          <IconCSS name="iconoir:mail-opened" class="icon"></IconCSS>
          <span class="text">{{ t('enter_with') }} Email</span>
        </button>
      </div>
      <div class="footer">
        <div class="registration">
          <div class="label">{{ t('no_account') }}</div>
          <simple-button-text :text="t('label.register')" icon="iconoir:lock" :callback="regHandler"></simple-button-text>
        </div>
      </div>
    </div>
  </modal-wrapper>
</template>
