<script setup>
import LeafStars from '~/components/UI/LeafStars/LeafStars.vue'
</script>

<style src="./four.scss" lang="scss" scoped></style>

<template>
  <section class="four-wrapper">
    <div class="container">
      <div class="four-inner">
        <div class="four-header">
          <h2 class="four-header__title">
            Премиальный кратом в Чешской республике и Европе - <span class="orange">Vivadzen</span>
          </h2>
          <p class="four-header__description">
            Прямые поставки и социальная бизнес-модель позволяют нам поддерживать конкурентоспособные цены без ущерба для качества.
          </p>
        </div>

        <div class="four-body">
          <div class="four-body__item four-body__item--1">
              <div class="four-body__img-wrapper">
                <video
                  src="/video/no_bg_Timeline_1.webm"
                  class="four-body__img"
                  autoplay
                  loop
                  muted
                  playsinline
                />
                <!-- <nuxt-img
                  src="/images/landing/persone/four/kratom-no-bg.gif"
                  sizes="desktop: 400px"
                  class="four-body__img"
                /> -->
              </div>
              <LeafStars :count="5" />
              <h4 class="four-body__title">Происхождение</h4>
              <p class="four-body__description">Прямые поставки из азии тщательно отобранного качественного сырья</p>
          </div>
          <div class="four-body__item four-body__item--1">
              <div class="four-body__img-wrapper">
                <img
                  src="/video/man.gif"
                  class="four-body__img"
                />
              </div>
              <LeafStars :count="5" />
              <h4 class="four-body__title">Сертификация</h4>
              <p class="four-body__description">Продукт прошел сертификацию, лабораторные исследования и произведен в Европе </p>
          </div>
          <div class="four-body__item four-body__item--2">
              <div class="four-body__img-wrapper">
                <nuxt-img
                  src="/images/landing/toy-ship.png"
                  sizes="desktop: 400px"
                  class="four-body__img"
                />
              </div>
              <LeafStars :count="5" />
              <h4 class="four-body__title">Легальность</h4>
              <p class="four-body__description">Абсолютно легален по чешскому законодательству и имеет соответствующие маркировки</p>
          </div>
          <div class="four-body__item four-body__item--3">
              <div class="four-body__img-wrapper">
                <nuxt-img
                  src="/images/landing/toy-shop.png"
                  sizes="desktop: 400px"
                  class="four-body__img"
                />
              </div>
              <LeafStars :count="5" image="/images/landing/coin-star.png" />
              <h4 class="four-body__title">Бонусы</h4>
              <p class="four-body__description">Vivadzen производитель и продавец с классной бонусной и партнерской системой</p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
