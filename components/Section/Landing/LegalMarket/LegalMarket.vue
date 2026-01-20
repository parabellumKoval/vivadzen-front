<script setup>
</script>

<style src="./legal-market.scss" lang="scss" scoped></style>

<template>
  <section class="legal-wrapper">
    
    <!-- Czech flag at bottom -->
    <div class="legal-flag">
      <div class="legal-flag__top"></div>
      <div class="legal-flag__bottom"></div>
      <div class="legal-flag__triangle"></div>
    </div>

    <!-- <nuxt-img
      src="/images/landing/flag.png"
      sizes="desktop: 400px"
      class="flag-img"
    /> -->
    <div class="container">
      <div class="legal-inner">
        <div class="legal-left">
          <h2 class="legal-left__title">
            Легальный рынок кратома <br> — ваша <span class="orange">Безопасность</span>
          </h2>
          <p class="legal-left__description">
            Чешская Республика ввела лицензирование продажи кратома — это 
            значительный шаг к прозрачному и регулируемому рынку. Vivadzen 
            полностью соответствует новым требованиям. Мы не адаптируемся в 
            последнюю минуту, а с самого начала строили долгосрочный, легальный 
            проект. Это защищает вас, наш бизнес и качество продукции.
          </p>
          <button class="button secondary bold uppercase legal-left__button">
            <IconCSS name="ix:eye-magnifying-glass" class="inline-icon" />
            <span>Лицензия производителя</span>
          </button>
        </div>

        <div class="legal-right">
          <div class="legal-right__item legal-right__item--1">
              <div class="legal-right__img-wrapper">
                <nuxt-img
                  src="/images/landing/logo.png"
                  sizes="desktop: 400px"
                  class="legal-right__img"
                />
              </div>
              <h4 class="legal-right__title">Мы легально производим</h4>
              <p class="legal-right__description">Полное соответствие законодательству Чехии.</p>
          </div>
          <div class="legal-right__item legal-right__item--2">
              <div class="legal-right__img-wrapper">
                <nuxt-img
                  src="/images/landing/botl.png"
                  sizes="desktop: 400px"
                  class="legal-right__img"
                />
                <svg class="legal-right__stamp" viewBox="0 0 300 300">
                  <defs>
                    <path id="circlePath2" d="M 150,150 m -75,0 a 75,75 0 1,1 150,0 a 75,75 0 1,1 -150,0" />
                  </defs>
                  <text>
                    <textPath class="legal-right__stamp-text" href="#circlePath2" startOffset="0%" textLength="471" lengthAdjust="spacing">
                      LEGAL  CERTIFIED  EU  PRODUCT  ◆  LEGAL  CERTIFIED  EU  PRODUCT  ◆
                    </textPath>
                  </text>
                </svg>
              </div>
              <h4 class="legal-right__title">Вы легально приобретаете</h4>
              <p class="legal-right__description">Понятная документация и маркировка продуктов.</p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
