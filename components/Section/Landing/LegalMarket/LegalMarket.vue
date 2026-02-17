<script setup>
const { t } = useI18n()
const { openLicenseModal } = useDocumentsModal()
</script>

<style src="./legal-market.scss" lang="scss" scoped></style>
<i18n src="./lang.yaml" lang="yaml"></i18n>
<i18n src="./../lang.yaml" lang="yaml"></i18n>

<template>
  <section class="legal-wrapper">
    <div class="legal-flag">
      <div class="legal-flag__top"></div>
      <div class="legal-flag__bottom"></div>
      <div class="legal-flag__triangle"></div>
    </div>

    <div class="container">
      <div class="legal-inner">
        <div class="legal-left">
          <h2 class="legal-left__title">
            {{ t('title') }} <br> — {{ t('title_suffix') }} <span class="orange">{{ t('title_highlight') }}</span>
          </h2>
          <p class="legal-left__description">
            {{ t('description') }}
          </p>
          <button class="button secondary bold uppercase legal-left__button" type="button" @click="openLicenseModal">
            <IconCSS name="ix:eye-magnifying-glass" class="inline-icon" />
            <span>{{ t('license_button') }}</span>
          </button>
        </div>

        <div class="legal-right">
          <div class="legal-right__item legal-right__item--1">
            <div class="legal-right__img-wrapper">
              <nuxt-img
                src="/images/landing/logo.png"
                sizes="desktop: 400px"
                class="legal-right__img"
                :alt="t('right.item1.image_alt')"
              />
            </div>
            <h4 class="legal-right__title">{{ t('right.item1.title') }}</h4>
            <p class="legal-right__description">{{ t('right.item1.description') }}</p>
          </div>
          <div class="legal-right__item legal-right__item--2">
            <div class="legal-right__img-wrapper">
              <nuxt-img
                src="/images/landing/botl.png"
                sizes="desktop: 400px"
                class="legal-right__img"
                :alt="t('right.item2.image_alt')"
              />
              <svg class="legal-right__stamp" viewBox="0 0 300 300">
                <defs>
                  <path id="circlePath2" d="M 150,150 m -75,0 a 75,75 0 1,1 150,0 a 75,75 0 1,1 -150,0" />
                </defs>
                <text>
                  <textPath class="legal-right__stamp-text" href="#circlePath2" startOffset="0%" textLength="471" lengthAdjust="spacing">
                    {{ t('stamp_text') }}
                  </textPath>
                </text>
              </svg>
            </div>
            <h4 class="legal-right__title">{{ t('right.item2.title') }}</h4>
            <p class="legal-right__description">{{ t('right.item2.description') }}</p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
