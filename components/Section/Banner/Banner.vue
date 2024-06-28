<script setup></script>

<style src="./banner.scss" lang="scss" scoped></style>

<template>
  <section class="wrapper">
    <div class="item">
      <nuxt-img
        src = "/images/banner.jpg"
        :provider = "useImg().provider"
        width = "1440"
        height = "350"
        sizes = "mobile:100vw"
        fit = "inside"
        class = "image"
      />
    </div>
  </section>
</template>