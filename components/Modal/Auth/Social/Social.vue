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
  <modal-wrapper class="modal-wrapper-auth">
    <div class="content-wrapper">
      <div class="promo" style="background-image: url('/images/coins-rain.png');">

        <nuxt-img
          src = "/images/mining.png"
          width = "801"
          height = "991"
          sizes = "mobile:200vw tablet:800px desktop:800px"
          fit = "inside"
          format = "avif"
          class = "promo-image"
        />
      </div>

      <div class="content-right">
        <div class="content-title">
          {{ t('hero.title') }}
          <span class="orange">{{ t('hero.cta') }}</span>
        </div>
        <ul class="benefits-list">
          <li>
            <IconCSS name="hugeicons:discount-01" class="icon"></IconCSS>
            <div class="benefits-title">{{ t('benefits.discount.title') }}</div>
            <div class="benefits-description">{{ t('benefits.discount.description') }}</div>
          </li>
          <li>
            <IconCSS name="hugeicons:user-multiple-03" class="icon"></IconCSS>
            <div class="benefits-title">{{ t('benefits.referral.title') }}</div>
            <div class="benefits-description">{{ t('benefits.referral.description') }}</div>
          </li>
          <li>
            <IconCSS name="hugeicons:comment-03" class="icon"></IconCSS>
            <div class="benefits-title">{{ t('benefits.reviews.title') }}</div>
            <div class="benefits-description">{{ t('benefits.reviews.description') }}</div>
          </li>
          <li>
            <IconCSS name="hugeicons:shopping-cart-check-02" class="icon"></IconCSS>
            <div class="benefits-title">{{ t('benefits.bonus.title') }}</div>
            <div class="benefits-description">{{ t('benefits.bonus.description') }}</div>
          </li>
          <li>
            <IconCSS name="hugeicons:wallet-done-02" class="icon"></IconCSS>
            <div class="benefits-title">{{ t('benefits.cashout.title') }}</div>
            <div class="benefits-description">{{ t('benefits.cashout.description') }}</div>
          </li>
        </ul>
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
        <!-- <div class="footer">
          <div class="registration">
            <div class="label">{{ t('no_account') }}</div>
            <simple-button-text :text="t('label.register')" icon="iconoir:lock" :callback="regHandler"></simple-button-text>
          </div>
        </div> -->
      </div>
    </div>
  </modal-wrapper>
</template>
