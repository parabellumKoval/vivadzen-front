<script setup>
const { isVisible } = useHeaderScroll()
</script>

<style src="./mobile-header.scss" lang="scss" scoped />

<template>
  <header class="header" :class="{ 'header--hidden': !isVisible}">
    <div class="header-container full-container">
      <ClientOnly>
        <!-- NOTIFICATIONS -->
        <the-header-notifications class="notifications"></the-header-notifications>

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

        <the-header-region class="region"></the-header-region>
      </ClientOnly>
    </div>
  </header>
</template>

