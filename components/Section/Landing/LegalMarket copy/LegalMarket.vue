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
    <div class="container">
      <div class="legal-market__content">

        <h2 class="legal-market__title">
          Легальный рынок — ваша <span class="orange">Безопасность</span>
        </h2>
        
        <p class="legal-market__description">
          Чешская Республика ввела лицензирование продажи кратома — это 
          значительный шаг к прозрачному и регулируемому рынку. Vivadzen 
          полностью соответствует новым требованиям. Мы не адаптируемся в 
          последнюю минуту, а с самого начала строили долгосрочный, легальный 
          проект. Это защищает вас, наш бизнес и качество продукции.
        </p>
        
        <div class="legal-market__features">
          <!-- Row 1: Card - Image - Card -->
          <div class="feature-card feature-card--orange legal-market__grid-item legal-market__grid-item--1">
            <div class="feature-card__icon">
              <Icon name="ph:shield-check" size="32" />
            </div>
            <h4 class="feature-card__title">Официальная Лицензия</h4>
            <p class="feature-card__description">Полное соответствие законодательству Чехии.</p>
          </div>
          
          <div class="legal-market__center-image legal-market__grid-item legal-market__grid-item--2">
            <nuxt-img 
              src="/images/landing/round-kratom.png" 
              alt="Kratom"
              class="legal-market__kratom-img"
            />
          </div>
          
          <div class="feature-card feature-card--orange legal-market__grid-item legal-market__grid-item--3">
            <div class="feature-card__icon">
              <Icon name="ph:file-magnifying-glass" size="32" />
            </div>
            <h4 class="feature-card__title">Прозрачность</h4>
            <p class="feature-card__description">Понятная документация и маркировка продуктов.</p>
          </div>
          
          <!-- Row 2: Glass card with flag - Green card - 2 Glass cards -->
          <div class="glass-card legal-market__grid-item legal-market__grid-item--4">
            <nuxt-img 
              src="/images/landing/toy-man.png" 
              alt="Kratom Leaves"
              class="glass-card__image"
            />
          </div>
          
          <div class="glass-card legal-market__grid-item legal-market__grid-item--5">
            <nuxt-img 
              src="/images/landing/toy-ship.png" 
              alt="Kratom Powder"
              class="glass-card__image"
            />
          </div>
          
          <!-- Empty cell at position 6 -->
          
          <div class="glass-card legal-market__grid-item legal-market__grid-item--7">
            <nuxt-img 
              src="/images/landing/flag.png" 
              alt="Czech Republic Flag"
              class="glass-card__flag"
            />
          </div>
          
          <div class="feature-card feature-card--green legal-market__grid-item  legal-market__grid-item--8">
            <div class="feature-card__icon">
              <Icon name="ph:flask" size="32" />
            </div>
            <h4 class="feature-card__title">Лабораторные Тесты</h4>
            <p class="feature-card__description">Контроль качества на каждом этапе производства.</p>
          </div>

        </div>
      </div>
    </div>
  </section>
</template>
