<script setup lang="ts">
const { t } = useI18n()

// Здесь подставь свои пути к картинкам
// примеры: /images/viva/coin.png, /images/viva/p1.png, ...
const IMG = {
  coin: '/images/ref/viva-coin.png',
  earn1: '/images/ref/man-1.png',
  earn2: '/images/ref/man-2.png',
  spend3: '/images/ref/man-3.png',
  spend4: '/images/ref/man-4.png',
  rate: '/images/ref/viva-coin.png',
  swap: '/images/ref/swap-icon.png',
  czk: '/images/ref/czk-coin.png',
}

// удобный алиас, чтобы не дублировать в шаблоне
const img = useImg()
</script>

<style src='./viva.scss' lang='scss' scoped></style>
<i18n src="./lang.yaml" lang="yaml"></i18n>

<template>
  <section class="vp" aria-labelledby="vp-title">
    <div class="vp__intro">

      <div class = "vp__intro-bg" style="background-image: url('/images/coins-rain.png');"></div>

      <div class="vp__coin">
        <nuxt-img
          :src="IMG.coin"
          width="220"
          height="220"
          sizes="mobile:250px"
          format="avif"
          quality="80"
          loading="lazy"
          fit="outside"
          :placeholder="img.noImageTransparent"
          class="vp__coin-img"
        />
      </div>

      <div class="vp__sub">
        <h2 id="vp-title" class="vp__title">{{ t('viva.title') }}</h2>
        <p class="vp__desc">{{ t('viva.lead') }}</p>
      </div>

      <div class="vp__box">
        <div class="vp__rate">
          <span class="vp__rate-num vp__rate-num--1">Viva-point</span>
          <nuxt-img
            :src="IMG.rate"
            width="60"
            height="60"
            sizes="mobile:70px"
            format="avif"
            quality="60"
            loading="lazy"
            fit="outside"
            class="vp__rate-img vp__rate-img--1"
          />
          <IconCSS name="guidance:currency-exchange" class="vp__rate-swap" />
          <nuxt-img
            :src="IMG.czk"
            width="60"
            height="60"
            sizes="mobile:70px"
            format="avif"
            quality="60"
            loading="lazy"
            fit="outside"
            class="vp__rate-img vp__rate-img--2"
          />
          <span class="vp__rate-num vp__rate-num--2">Czech crown</span>
        </div>
        <NuxtLink :to="$regionPath('/vivapoints')" class="button full vp__intro-btn">
          <IconCSS name="ci:info" class="icon"/>
          <span>{{ t('viva.cta') }}</span>
        </NuxtLink>
      </div>
    </div>

    <div class="vp__grid">
      <div class="vp__h vp__h--left">{{ t('viva.hEarn') }}</div>
      <div class="vp__h vp__h--right">{{ t('viva.hSpend') }}</div>

      <!-- Earn 1 -->
      <article class="vp__card vp__card--green" data-step="1">
        <div class="vp__person">
          <nuxt-img
            :src="IMG.earn1"
            width="600"
            height="900"
            sizes="mobile:320px md:420px lg:560px"
            format="avif"
            quality="60"
            loading="lazy"
            fit="outside"
          />
        </div>
        <p class="vp__text">{{ t('viva.earn1') }}</p>
      </article>

      <!-- Earn 2 -->
      <article class="vp__card vp__card--green" data-step="2">
        <div class="vp__person">
          <nuxt-img
            :src="IMG.earn2"
            width="600"
            height="900"
            sizes="mobile:320px md:420px lg:560px"
            format="avif"
            quality="60"
            loading="lazy"
            fit="outside"
          />
        </div>
        <p class="vp__text">{{ t('viva.earn2') }}</p>
      </article>

      <!-- Spend 3 -->
      <article class="vp__card vp__card--orange" data-step="3">
        <div class="vp__person">
          <nuxt-img
            :src="IMG.spend3"
            width="600"
            height="900"
            sizes="mobile:320px md:420px lg:560px"
            format="avif"
            quality="60"
            loading="lazy"
            fit="outside"
          />
        </div>
        <p class="vp__text">{{ t('viva.spend3') }}</p>
      </article>

      <!-- Spend 4 -->
      <article class="vp__card vp__card--orange" data-step="4">
        <div class="vp__person">
          <nuxt-img
            :src="IMG.spend4"
            width="600"
            height="900"
            sizes="mobile:320px md:420px lg:560px"
            format="avif"
            quality="60"
            loading="lazy"
            fit="outside"
          />
        </div>
        <p class="vp__text">{{ t('viva.spend4') }}</p>
      </article>
    </div>
  </section>
</template>
