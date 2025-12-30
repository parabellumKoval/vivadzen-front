<script setup>
import { ref } from 'vue'

const { t } = useI18n()
const { isVisible } = useHeaderScroll()
const isSearchOpen = ref(false)
const openSearchHandler = () => {
  isSearchOpen.value = true
}
const closeSearchHandler = () => {
  isSearchOpen.value = false
}
</script>

<style src="./header.scss" lang="scss" scoped />

<template>
  <header class="header" :class="{ 'header--hidden': !isVisible, 'header--search-open': isSearchOpen }">
    <div class="header-container full-container">

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
      <the-header-catalog class="catalog"></the-header-catalog>

      <!-- MENU -->
      <the-header-menu class="menu"></the-header-menu>

      <div class="blank"></div>

      <!-- SEARCH -->
      <the-header-search
        class="search"
        @open="openSearchHandler"
        @close="closeSearchHandler"
      ></the-header-search>

      <!-- USER -->
      <the-header-profile class="profile"></the-header-profile>

      <!-- NOTIFICATIONS -->
      <the-header-notifications class="notifications"></the-header-notifications>

      <!-- CART -->
      <the-header-cart class="cart"></the-header-cart>
    </div>
  </header>
</template>

<!-- <i18n src="./lang.yaml" lang="yaml"></i18n> -->
