<script setup>
const { t } = useI18n()

definePageMeta({
  layout: 'landing'
})

const marqueeItems = computed(() => [
  t('marquee.items.0'),
  t('marquee.items.1')
])
</script>

<i18n src="./lang.yaml" lang="yaml"></i18n>

<template>
  <div class="czech-kratom-page">

    <section-landing-hero-header />
    <section-landing-hero-banner id="home" />
    <section-landing-marquee-ticker id="ticker" :items="marqueeItems" />
    <section-landing-legal-market id="legal" />
    <section-landing-timeline-section id="timeline" />
    <section-landing-promo-subscribe id="promo" />
    <section-landing-kratom id="kratom" />
    <section-landing-kratom-variety id="colors" />
    <section-landing-kratom-variety-origins id="origins" />
    <section-landing-sample-set id="sample" />
    <section-landing-referral-bonus id="bonus" />
    <section-landing-google-reviews id="reviews" />
    <section-landing-contacts id="contacts" />
    <section-landing-welcome id="welcome" />
  </div>
</template>
