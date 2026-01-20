<template>
  <div class="support">
    <nuxt-img
      src="/images/landing/support-man.png"
      alt="Vivadzen Kratom Pack"
      width="1024"
      height="1024"
      quality="90"
      fit="cover"
      sizes="mobile: 100vw tablet: 550px desktop: 550px"
      class="support__img"
    />
    <div class="support__content">
      <h3 class="support__title">Нужна помощь с выбором?</h3>
      <p class="support__desc">
        Наши эксперты всегда готовы помочь вам подобрать идеальный сорт и цвет кратома,
        соответствующий вашим потребностям и предпочтениям.
      </p>
      <nuxt-link to="/contact" class="button orange support__link">Связаться с нами</nuxt-link>
    </div>
  </div>
</template>

<style src="./support.scss" lang="scss" scoped></style>
