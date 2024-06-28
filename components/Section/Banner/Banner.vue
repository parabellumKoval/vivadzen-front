<script setup></script>

<style src="./banner.scss" lang="scss" scoped></style>

<template>
  <section class="wrapper">
    <div class="item">
      <nuxt-img
        src="/images/banner.jpg"
        provider="vercel"
        width="1440"
        height="350"
        sizes = "mobile:100vw"
        format = "avif"
        fit="inside"
        quality = "50"
        class = "image"
      />
    </div>
  </section>
</template>