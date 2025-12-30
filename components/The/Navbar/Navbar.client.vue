<script setup>
const {t} = useI18n()
const props = defineProps({})

const searchIsOpen = ref(false)
// COMPUTEDS
// METHODS
const openAffiliateModal = () => {
  useModal().open(resolveComponent('ModalAffiliate'), null, null)
}

const openSearchHandler = (v) => {
  searchIsOpen.value = v
}
// HANDLERS
// WATCHERS
</script>

<style src='./navbar.scss' lang='scss' scoped></style>
<!-- <i18n src='' lang='yaml'></i18n> -->

<template>
  <div :class="{'searchable': searchIsOpen}" class="navbar">
    <the-header-menu class="menu"></the-header-menu>
    <the-header-search-btn @open="openSearchHandler"></the-header-search-btn>
    <div class="cta">
      <button class="cta-button" @click="openAffiliateModal">
        <nuxt-img
          src = "/images/front-coin.png"
          width = "50"
          height = "50"
          quality="80"
          sizes="mobile:60px"
          fit = "inside"
          format = "webp"
          class = "icon"
        />
      </button>
    </div>
    <the-header-profile class="profile"></the-header-profile>
    <the-header-cart class="navbar-cart"></the-header-cart>
  </div>
</template>