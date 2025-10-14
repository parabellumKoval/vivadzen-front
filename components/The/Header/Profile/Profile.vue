<script setup>
const { t } = useI18n()
const { $regionPath } = useNuxtApp();
const { user, isAuthenticated, avatar } = useAuth()

// COMPUTED
const showAuthHandler = () => {
  if(isAuthenticated.value && user.value) {
    navigateTo($regionPath('/account/settings'))
  } else {
    const component = defineAsyncComponent(() => import('~/components/Modal/Auth/Social/Social.vue'))
    useModal().open(component, null, null, {width: {
      min: 420, max: 420
    }})
  }
}
</script>

<style src="./profile.scss" lang="scss" scoped />
<i18n src="./lang.yaml" lang="yaml"></i18n>

<template>
  <div>
    <button v-if="isAuthenticated && user" @click="showAuthHandler" class="header-btn profile-btn" type="button" clickable>
      <ClientOnly>
        <nuxt-img
          :src="avatar"
          :provider = "useImg().provider"
          width="30"
          height="30"
          sizes = "mobile:30px tablet:30px desktop:30px"
          fit = "cover"
          quality = "80"
          class = "avatar-image"
          :placeholder="useImg().noImage"
        />
      </ClientOnly>
      <span class="hint">{{ t('profile') }}</span>
    </button>

    <button v-if="!isAuthenticated" @click="showAuthHandler" class="header-btn profile-btn" type="button" clickable>
      <IconCSS name="iconoir:user" size="30px" class="icon"></IconCSS>
      <span class="hint">{{ t('profile') }}</span>
    </button>
  </div>
</template>
