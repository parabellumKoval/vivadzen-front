<script setup>
const { t, locale } = useI18n()
const { $regionPath } = useNuxtApp()

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

// Копирование промокода в буфер обмена
const copyPromoCode = async () => {
  try {
    await navigator.clipboard.writeText(t('promo_code'))
    useNoty().setNoty({
      content: t('promo_code') + ' скопирован!',
      type: 'success'
    })
  } catch (err) {
    useNoty().setNoty({
      content: 'Ошибка при копировании',
      type: 'error'
    })
  }
}

</script>

<style src="./item.scss" lang="scss" scoped></style>
<i18n src="./lang.yaml" lang="yaml"></i18n>

<template>
  <div class="banner">
    <div class="glass-content">
      
      <div class="decor-layer">
        <Icon name="ph:snowflake-bold" class="icon-decor snowflake-1" />
        <Icon name="ph:sparkle-fill" class="icon-decor sparkle-1" />
        <Icon name="ph:star-four-fill" class="icon-decor star-1" />
      </div>

      <svg class="arc-svg" viewBox="0 0 700 180">
        <defs>
          <linearGradient id="hugeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" style="stop-color:#FF8400;stop-opacity:1" />
            <stop offset="50%" style="stop-color:#ffbd59;stop-opacity:1" />
            <stop offset="100%" style="stop-color:#73c56f;stop-opacity:1" />
          </linearGradient>
        </defs>
        
        <path id="bigArc" d="M 25,150 Q 350,20 675,150" fill="transparent" />
        
        <text class="arc-text">
          <textPath xlink:href="#bigArc" startOffset="50%" text-anchor="middle">
            {{ t('arc_text') }}
          </textPath>
        </text>
      </svg>

      <div class="discount-wrapper">
        <h2 class="discount-text">{{ t('discount') }}</h2>
        <span class="discount-sub">{{ t('discount_sub') }}</span>
      </div>

      <div class="promo-box">
        <p class="promo-text">
          {{ t('use_promo') }}
          <span class="code-pill" @click="copyPromoCode">
            {{ t('promo_code') }}
          </span>
        </p>
      </div>

      <NuxtLink :to="$regionPath('/catalog')" class="shop-btn">
        {{ t('shop_btn') }}
        <Icon name="ph:arrow-right-bold" class="btn-icon" />
      </NuxtLink>

    </div>
    <div class="banner-media">
      <nuxt-img
        v-if="$device.isMobile"
        src="/images/banners/banner5-mobile.jpg"
        width="1568"
        height="2607"
        sizes = "mobile:80vw"
        format = "avif"
        quality = "60"
        fit="outside"
        loading = "lazy"
        class="banner-media-img"
        :provider = "useImg().provider"
      ></nuxt-img>
      <nuxt-img
        v-else
        src="/images/banners/banner5.jpg"
        width="2980"
        height="1344"
        sizes = "tablet:1920px desktop:2200px"
        format = "avif"
        quality = "60"
        fit="outside"
        loading = "lazy"
        class="banner-media-img"
        :provider = "useImg().provider"
      ></nuxt-img>
    </div>
  </div>
</template>