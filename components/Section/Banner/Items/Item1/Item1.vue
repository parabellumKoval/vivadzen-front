<script setup>
const { t, locale } = useI18n()
const { $regionPath } = useNuxtApp();
const { user, isAuthenticated, avatar } = useAuth()

// просто таблица: локаль → размер шрифта
const sizeMap = {
  en: { line1: '60px', line2: '48px' },
  cs: { line1: '54px', line2: '51px' },
  de: { line1: '48px', line2: '43px' },
  uk: { line1: '54px', line2: '62px' },
  es: { line1: '60px', line2: '33px' },
  ru: { line1: '40px', line2: '52px' },
}

// fallback если языков станет больше
const getSize = (line) => sizeMap[locale.value]?.[line] ?? '100px'


const showAuthHandler = () => {
  if(isAuthenticated.value && user.value) {
    navigateTo($regionPath('/account/network/common'))
  } else {
    const component = defineAsyncComponent(() => import('~/components/Modal/Auth/Social/Social.vue'))
    useModal().open(component, null, null)
  }
}
</script>

<style src="./item-1.scss" lang="scss" scoped></style>
<i18n src="./lang.yaml" lang="yaml"></i18n>

<template>
  <div class="banner">
    <div class="banner-inner">
      <div class="banner-content">
        <div>
          <div :style="{ fontSize: getSize('line1') }">
            <p class="banner-title banner-title-1">{{ t('harmonize') }}</p>
          </div>
          <div :style="{ fontSize: getSize('line2') }">
          <p class="banner-title banner-title-2">{{ t('bodySpirit') }}</p>
          </div>
        </div>
        <p class="banner-desc">{{ t('ancientWisdom') }}</p>
        <div class="banner-btns">
          <NuxtLink :to="$regionPath('/catalog')" class="button promo banner-btn">{{ t('shopNow') }}</NuxtLink>
          <button @click="showAuthHandler" class="banner-btn-text">{{ t('joinCommunity') }}</button>
        </div>
      </div>
      <div class="banner-media">
        <nuxt-img
          src = "/images/banners/banner-1.png"
          width="725"
          height="670"
          sizes = "mobile:80vw tablet:800px"
          format = "avif"
          quality = "60"
          fit="outside"
          loading = "lazy"
          class="banner-media-img"
          :provider = "useImg().provider"
        ></nuxt-img>
      </div>
    </div>
  </div>
</template>