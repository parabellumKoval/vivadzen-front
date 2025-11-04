<script setup></script>

<style src="./item-1.scss" lang="scss" scoped></style>

<template>
  <div class="banner">
    <div class="banner-inner">
      <div class="banner-content">
        <div>
          <p class="banner-title banner-title-1 font-alegreya">Harmonize</p>
          <p class="banner-title banner-title-2 font-alegreya">Body & Spirit</p>
        </div>
        <p class="banner-desc">Unlock ancient wisdom through Vivadzen sacred plants</p>
        <div class="banner-btns">
          <a href="/catalog" class="button primary banner-btn">Shop Now</a>
          <button class="banner-btn-text">Join the community</button>
        </div>
      </div>
      <div class="banner-image">
        <!-- <img src="/images/banners/banner-1.png" alt="Vivadzen Banner Image" /> -->
            <nuxt-img
              src = "/images/banners/banner-1.png"
              width="100"
              height="100"
              sizes = "mobile:100px"
              format = "webp"
              quality = "60"
              loading = "lazy"
              fit="outside"
              class="category-image"
            ></nuxt-img>
      </div>
    </div>
  </div>
</template>