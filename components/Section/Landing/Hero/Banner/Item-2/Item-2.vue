<script setup>
const { t } = useI18n()

const bgImage = 'https://st.depositphotos.com/14487672/52636/i/450/depositphotos_526360554-stock-photo-mitragyna-speciosa-fresh-kratom-leaves.jpg'

const advantages = [
  {
    id: 1,
    title: t('banner_item_2.advantage_1'),
    icon: 'fluent-emoji-high-contrast:leaf-fluttering-in-wind'
  },
  {
    id: 2,
    title: t('banner_item_2.advantage_2'),
    icon: 'fluent-emoji-high-contrast:input-latin-letters'
  },
  {
    id: 3,
    title: t('banner_item_2.advantage_3'),
    icon: 'fluent-emoji-high-contrast:sports-medal'
  },
  {
    id: 4,
    title: t('banner_item_2.advantage_4'),
    icon: 'fluent-emoji-high-contrast:old-key'
  }
]
</script>

<style src='./item-2.scss' lang='scss' scoped></style>
<i18n src='./lang.yaml' lang='yaml'></i18n>

<template>
  <section class="hero-banner-item-2">
    <!-- Фоновое изображение -->
    <div class="hero-banner-item-2__bg-wrapper">
      <!-- <nuxt-img
        :src="bgImage"
        :alt="t('banner_item_2.bg_alt')"
        width="1920"
        height="1080"
        quality="70"
        fit="cover"
        sizes="mobile: 100vw tablet: 100vw desktop: 100vw"
        class="hero-banner-item-2__bg-image"
      /> -->
      <video
        autoplay
        loop
        muted
        playsinline
        class="hero-banner-item-2__bg-video"
      >
        <source src="/video/banner.mp4" type="video/mp4">
      </video>
      <div class="hero-banner-item-2__overlay"></div>
    </div>

    <!-- Основной контент -->
    <div class="hero-banner-item-2__content">
      <div class="container">

        
        <div class="hero-banner-top">
          <!-- Логотип и лицензия -->
          <div class="hero-banner-item-2__license">
            <nuxt-img
              src="/images/company-white-color.png"
              width="246"
              height="50"
              fit="cover"
              sizes="mobile: 80px tablet: 270px desktop: 270px"
              class="license-logo"
            />
            <p class="license-text">{{ t('banner_item_2.license_text') }}</p>
          </div>
          <div class="hero-banner-top__line"></div>
          <!-- Рейтинг -->
          <div class="hero-banner-item-2__rating">
            <div class="rating-stars">
              <span class="star" v-for="i in 5" :key="i">★</span>
            </div>
            <p class="rating-text">{{ t('banner_item_2.rating_text') }}</p>
          </div>
        </div>

        <!-- Заголовок -->
        <h1 class="hero-banner-item-2__title">
          {{ t('banner_item_2.title') }}
        </h1>

        <!-- Описание -->
        <p class="hero-banner-item-2__description">
          {{ t('banner_item_2.description') }}
        </p>

        <!-- Кнопки -->
        <div class="hero-banner-item-2__buttons">
          <button class="button promo">
            {{ t('banner_item_2.btn_catalog') }}
          </button>
          <button class="button color-secondary">
            {{ t('banner_item_2.btn_shop') }}
          </button>
        </div>

        <!-- Преимущества -->
        <div class="hero-banner-item-2__advantages-section">
          <h2 class="hero-banner-item-2__advantages-title">
            {{ t('banner_item_2.advantages_title') }}
          </h2>
          <div class="hero-banner-item-2__advantages">
            <div class="advantage-card" v-for="advantage in advantages" :key="advantage.id">
              <IconCSS :name="advantage.icon" class="advantage-icon" />
              <p class="advantage-text">{{ advantage.title }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
