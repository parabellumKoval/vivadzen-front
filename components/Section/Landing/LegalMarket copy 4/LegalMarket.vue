<script setup>
</script>

<style src="./legal-market.scss" lang="scss" scoped></style>

<template>
  <section class="legal-wrapper">
    <div class="container">
      <div class="legal-inner">
        <div class="legal-left">
          <h2 class="legal-left__title">
            Легальный рынок кратома — ваша <span class="orange">Безопасность</span>
          </h2>
          <p class="legal-left__description">
            Чешская Республика ввела лицензирование продажи кратома — это 
            значительный шаг к прозрачному и регулируемому рынку. Vivadzen 
            полностью соответствует новым требованиям. Мы не адаптируемся в 
            последнюю минуту, а с самого начала строили долгосрочный, легальный 
            проект. Это защищает вас, наш бизнес и качество продукции.
          </p>
        </div>

        <div class="legal-right">
          <div class="legal-right__item legal-right__item--1">
              <div class="legal-right__img-wrapper">
                <nuxt-img
                  src="/images/landing/toy-man.png"
                  sizes="desktop: 400px"
                  class="legal-right__img"
                />
              </div>
              <h4 class="legal-right__title">Официальная Лицензия</h4>
              <p class="legal-right__description">Полное соответствие законодательству Чехии.</p>
          </div>
          <div class="legal-right__item legal-right__item--2">
              <div class="legal-right__img-wrapper">
                <nuxt-img
                  src="/images/landing/toy-ship.png"
                  sizes="desktop: 400px"
                  class="legal-right__img"
                />
              </div>
              <h4 class="legal-right__title">Прозрачность</h4>
              <p class="legal-right__description">Понятная документация и маркировка продуктов.</p>
          </div>
          <div class="legal-right__item legal-right__item--3">
              <div class="legal-right__img-wrapper">
                <nuxt-img
                  src="/images/landing/toy-shop.png"
                  sizes="desktop: 400px"
                  class="legal-right__img"
                />
              </div>
              <h4 class="legal-right__title">Лабораторные Тесты</h4>
              <p class="legal-right__description">Контроль качества на каждом этапе производства</p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
