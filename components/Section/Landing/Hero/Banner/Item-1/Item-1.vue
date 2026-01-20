<script setup>
const { t } = useI18n()

// const bgImage = 'https://png.pngtree.com/background/20250111/original/pngtree-harness-the-fat-reducing-benefits-of-mitragyna-speciosa-kratom-leaves-textured-picture-image_13437977.jpg'
const bgImage = 'https://st.depositphotos.com/14487672/52636/i/450/depositphotos_526360554-stock-photo-mitragyna-speciosa-fresh-kratom-leaves.jpg'
const mainImage = 'https://images.unsplash.com/photo-1542157768-b4e5e3d1f2c0?w=600&h=600&fit=crop'

const props = defineProps({})
// COMPUTEDS
// METHODS
// HANDLERS
// WATCHERS
</script>

<style src='./item-1.scss' lang='scss' scoped></style>
<i18n src='./lang.yaml' lang='yaml'></i18n>

<template>
  <section class="hero-banner">
    <!-- Фоновое изображение -->
    <div class="hero-banner__bg-wrapper">
      <nuxt-img
        :src="bgImage"
        :alt="t('banner.bg_alt')"
        width="1920"
        height="1080"
        quality="70"
        fit="cover"
        sizes="mobile: 100vw tablet: 100vw desktop: 100vw"
        class="hero-banner__bg-image"
      />
      <div class="hero-banner__gradient"></div>
    </div>

    <!-- Основной контент -->
    <div class="hero-banner__content">
      <div class="container">
        <!-- Декоративные SVG элементы -->
        <svg class="hero-banner__decoration hero-banner__decoration--left" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
          <circle cx="100" cy="100" r="80" fill="none" stroke="rgba(115, 197, 111, 0.1)" stroke-width="2"/>
          <circle cx="100" cy="100" r="60" fill="none" stroke="rgba(115, 197, 111, 0.15)" stroke-width="2"/>
          <circle cx="100" cy="100" r="40" fill="none" stroke="rgba(255, 132, 0, 0.1)" stroke-width="2"/>
        </svg>

        <svg class="hero-banner__decoration hero-banner__decoration--right" viewBox="0 0 300 300" xmlns="http://www.w3.org/2000/svg">
          <path d="M150 50 L250 100 L250 200 L150 250 L50 200 L50 100 Z" fill="none" stroke="rgba(255, 132, 0, 0.08)" stroke-width="2"/>
          <path d="M150 80 L220 120 L220 180 L150 220 L80 180 L80 120 Z" fill="none" stroke="rgba(115, 197, 111, 0.08)" stroke-width="2"/>
        </svg>

        <div class="hero-banner__inner">
          <!-- Левая часть - текст и кнопки -->
          <div class="hero-banner__left">
            <div class="hero-banner__label">
              <IconCSS name="ph:shield-check-fill" class="hero-banner__label-icon" />
              <span>{{ t('banner.label') }}</span>
            </div>

            <h1 class="hero-banner__title">
              {{ t('banner.title') }}
            </h1>

            <p class="hero-banner__description">
              {{ t('banner.description') }}
            </p>

            <div class="hero-banner__buttons">
              <button class="button promo">
                {{ t('banner.btn_catalog') }}
              </button>
              <button class="button color-secondary">
                {{ t('banner.btn_shop') }}
              </button>
            </div>
          </div>

          <!-- Правая часть - изображение -->
          <div class="hero-banner__right">
            <nuxt-img
              :src="mainImage"
              :alt="t('banner.main_alt')"
              width="600"
              height="600"
              quality="80"
              fit="contain"
              sizes="mobile: 100vw tablet: 300px desktop: 600px"
              class="hero-banner__main-image"
            />
          </div>
        </div>
      </div>
    </div>
  </section>
</template>