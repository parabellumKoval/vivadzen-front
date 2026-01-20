<script setup>
const {t} = useI18n()
const props = defineProps({})
// COMPUTEDS
// METHODS
// HANDLERS
// WATCHERS
definePageMeta({
  layout: 'landing'
})
</script>

<!-- <style src='' lang='scss' scoped></style> -->
<!-- <i18n src='' lang='yaml'></i18n> -->

<template>
  <div>
    <section-landing-hero-banner /> 
    <section-landing-marquee-ticker :items="['NOW 100% LEGAL', 'OFFICIAL LICENSE']" />
    <section-landing-legal-market />
    <section-landing-four-premium-properties />
    <section-landing-promo-subscribe />
    <section-landing-kratom /> 
    <section-landing-hero-text /> 
    <section-landing-kratom-variety /> 

    <section-landing-kratom-variety-origins />
    <!-- <section-landing-circle-selection /> -->
    <!-- <section-landing-choice /> -->
    <section-landing-sample-set />
    <section-landing-referral-bonus />
    <!-- <section-landing-benefit />  -->
    <section-landing-google-reviews />
    <!-- <section-landing-czech-kratom /> -->
    <section-landing-welcome />
    <section-landing-contacts />
  </div>
</template>
