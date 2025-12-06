<script setup>
const { t } = useI18n()
</script>

<style src="./header.scss" lang="scss" scoped />

<template>
  <header class="header">
    <div class="header-container full-container">
      
      <!-- MENU -->
      <the-header-menu class="menu"></the-header-menu>

      <!-- SEARCH BTN MOBILE -->
      <the-header-search-btn v-if="$device.isMobile"></the-header-search-btn>

      <!-- LOGO -->
      <NuxtLink :to="$regionPath('/')" class="logo" clickable>
        <nuxt-img
          src = "/images/company.png"
          width = "200"
          height = "58"
          sizes = "mobile:200px tablet:200px desktop:220px"
          fit = "inside"
          format = "avif"
          class = "logo-img"
        />
      </NuxtLink>

      <!-- CATALOG -->
      <the-header-catalog v-if="!$device.isMobile" class="catalog"></the-header-catalog>

      <!-- SEARCH -->
      <the-header-search v-if="!$device.isMobile" class="search"></the-header-search>

      <div class="blank"></div>

      <!-- USER -->
      <the-header-profile class="profile"></the-header-profile>

      <!-- SEARCH -->
      <!-- <the-header-comparison v-if="$device.isMobile" class="comparison"></the-header-comparison> -->

      <!-- CART -->
      <the-header-cart class="cart"></the-header-cart>
    </div>
  </header>
</template>

<!-- <i18n src="./lang.yaml" lang="yaml"></i18n> -->