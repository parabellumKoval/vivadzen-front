<script setup>
import LegalFlower1 from './LegalFlower1.svg'
import LegalFlower2 from './LegalFlower2.svg'
</script>

<style src="./legal-market.scss" lang="scss" scoped></style>

<template>
  <section class="legal-market">
    <!-- Background decorative elements -->
    <LegalFlower1 class="legal-market__bg-deco legal-market__bg-deco--1" />
    <LegalFlower2 class="legal-market__bg-deco legal-market__bg-deco--2" />
    <nuxt-img 
      src="/images/landing/kroshka-bg.png" 
      class="legal-market__bg-deco legal-market__bg-deco--3" 
    />
    <div class="legal-market__grid">

      <div class="grid-item grid-item--title-1">
        <h2 class="legal-market__title">
          Легальный рынок — ваша <span class="orange">Безопасность</span>
        </h2>
      </div>

      <div class="grid-item grid-item--title-2">
        <p class="legal-market__description">
          Чешская Республика ввела лицензирование продажи кратома — это 
          значительный шаг к прозрачному и регулируемому рынку. Vivadzen 
          полностью соответствует новым требованиям. Мы не адаптируемся в 
          последнюю минуту, а с самого начала строили долгосрочный, легальный 
          проект. Это защищает вас, наш бизнес и качество продукции.
        </p>
      </div>
      
      <!-- Row 1: Card - Image - Card -->
      <div class="feature-card grid-item grid-item--feature-1">
        <h4 class="feature-card__title">Официальная Лицензия</h4>
        <p class="feature-card__description">Полное соответствие законодательству Чехии.</p>
      </div>
      
      <div class="grid-item grid-item--kratom">
        <nuxt-img 
          src="/images/landing/round-kratom.png" 
          alt="Kratom"
          class="legal-market__kratom-img"
        />
      </div>
      
      <div class="feature-card grid-item grid-item--feature-2">
        <h4 class="feature-card__title">Прозрачность</h4>
        <p class="feature-card__description">Понятная документация и маркировка продуктов.</p>
      </div>
      
      <!-- Row 2: Glass card with flag - Green card - 2 Glass cards -->
      <div class="glass-card grid-item grid-item--image grid-item--image-1">
        <nuxt-img 
          src="/images/landing/toy-man.png" 
          alt="Kratom Leaves"
          class="grid-item--image-img"
        />
      </div>
      
      <div class="glass-card grid-item grid-item--image grid-item--image-2">
        <nuxt-img 
          src="/images/landing/toy-ship.png" 
          alt="Kratom Powder"
          class="grid-item--image-img"
        />
      </div>
      
      <!-- Empty cell at position 6 -->
      
      <div class="glass-card grid-item grid-item--image grid-item--image-3">
        <nuxt-img 
          src="/images/landing/flag.png" 
          alt="Czech Republic Flag"
          class="glass-card__flag"
        />
      </div>
      
      <div class="feature-card grid-item grid-item--feature-3">
        <h4 class="feature-card__title">Лабораторные Тесты</h4>
        <p class="feature-card__description">Контроль качества на каждом этапе производства.</p>
      </div>
      
      <div class="glass-card grid-item grid-item--image grid-item--image-4">
        <nuxt-img 
          src="/images/landing/toy-shop.png" 
          alt="Shop"
          class="grid-item--image-img contain"
        />
      </div>

    </div>

  </section>
</template>
