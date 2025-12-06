<script setup>
const { t, locale } = useI18n()
const { $regionPath } = useNuxtApp();

// просто таблица: локаль → размер шрифта
const sizeMap = {
  en: { line1: '60px', line2: '50px' },
  cs: { line1: '54px', line2: '55px' },
  de: { line1: '48px', line2: '45px' },
  uk: { line1: '54px', line2: '62px' },
  es: { line1: '60px', line2: '35px' },
  ru: { line1: '40px', line2: '54px' },
}

// fallback если языков станет больше
const getSize = (line) => sizeMap[locale.value]?.[line] ?? '100px'

</script>

<style src="./item.scss" lang="scss" scoped></style>
<i18n src="./lang.yaml" lang="yaml"></i18n>

<template>
  <div class="banner">
    <div class="banner-inner">
      <div class="banner-content">
        <div>
          <div :style="{ fontSize: getSize('line1') }">
            <p class="banner-title banner-title-1 font-alegreya">
              {{ t('title') }} <span class="green">{{ t('titleAccent') }}</span>
            </p>
          </div>
        </div>
        <p class="banner-desc">
          {{ t('descBefore') }} <span class="sale-label">{{ t('discountLabel') }}</span> {{ t('descAfter') }}
        </p>
        <div class="banner-btns">
          <NuxtLink :to="$regionPath('/catalog')" class="button promo banner-btn">{{ t('shopNow') }}</NuxtLink>
        </div>
      </div>
    </div>
    <div class="banner-media">
      <nuxt-img
        v-if="$device.isMobile"
        src="/images/banners/banner-2-mobile.png"
        width="600"
        height="1090"
        sizes = "mobile:80vw"
        format = "avif"
        quality = "60"
        fit="outside"
        loading = "lazy"
        class="banner-media-img"
      ></nuxt-img>
      <nuxt-img
        v-else
        src="/images/banners/banner-2.png"
        width="2200"
        height="1000"
        sizes = "mobile:100vw tablet:2200px"
        format = "avif"
        quality = "60"
        fit="outside"
        loading = "lazy"
        class="banner-media-img"
      ></nuxt-img>
    </div>
  </div>
</template>