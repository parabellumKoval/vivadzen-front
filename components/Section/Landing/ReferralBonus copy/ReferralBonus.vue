<script setup>

const items = [
  {
    title: 'Накопительная скидка до 10%',
    description: 'Чем больше покупок, тем выше персональная скидка — все считается автоматически.',
    image: '/images/landing/superman.png',
    alt: 'Накопительная система скидок',
    size: 'tall'
  },
  {
    title: 'Еженедельные промокоды для вас и друзей',
    description: 'Персональные коды, которыми удобно делиться — экономия с каждой посылкой.',
    image: '/images/landing/kratom-cap.png',
    alt: 'Еженедельные промокоды',
    size: 'short'
  },
  {
    title: 'Трехуровневая партнерская программа',
    description: 'Создайте систему пассивного дохода и получайте процент с покупок вашей сети.',
    image: '/images/landing/mock/2.png',
    alt: 'Трехуровневая партнерская программа',
    size: 'taller'
  },
  {
    title: 'VivaPoints за активность в экосистеме',
    description: 'Мы поощряем участие бонусными баллами, которые можно использовать в магазине.',
    image: '/images/landing/stupa2.png',
    alt: 'VivaPoints за активность',
    size: 'mid'
  }
]
</script>

<style src="./referral-bonus.scss" lang="scss" scoped></style>

<template>
  <section class="bonus">
    <nuxt-img
      src="/images/landing/leaves-2.png"
      alt="Трехуровенная партнерская программа"
      loading="lazy"
      class="bonus__decore-img-1"
    />
    <div class="container">
      <div class="bonus-inner">
        <div class="bonus__header">
          <h2 class="bonus__title">
            На Vivadzen вы найдете все виды бонусов и вознаграждений
          </h2>
          <p class="bonus__lead">
            Мы ценим живое сообщество: рекомендации, партнерство и личные контакты
            работают у нас как онлайн, так и офлайн.
          </p>
          <p class="bonus__lead">
            Реферальная программа доступна каждому клиенту. Рекомендуйте магазин
            заинтересованным людям и получайте преимущества и бонусы.
          </p>
          <div class="bonus__cta">
            <span class="bonus__cta-note">
              Менеджеры расскажут детали в магазине, а подключиться можно прямо здесь, на сайте.
            </span>
            <NuxtLink to="/account/network" class="button secondary">
              Присоединиться
            </NuxtLink>
          </div>
        </div>

        
        <div class="bonus__grid-track">
          <div class="bonus__grid-wrapper">
            <div class="bonus__grid">
              <div class="bonus__item bonus__item--media">
                <nuxt-img
                  src="/images/landing/mock/4.png"
                  alt="Трехуровенная партнерская программа"
                  loading="lazy"
                  class="bonus__item--media-img"
                />
              </div>
              <div
                v-for="item in items"
                :key="item.title"
                class="bonus__item bonus__item--box"
                :class="`bonus__item--${item.size}`"
              >
                <div class="bonus__media">
                  <nuxt-img
                    :src="item.image"
                    :alt="item.alt"
                    loading="lazy"
                    class="bonus__media-img"
                  />
                </div>
                <div class="bonus__content">
                  <h3 class="bonus__item-title">{{ item.title }}</h3>
                  <p class="bonus__item-text">{{ item.description }}</p>
                </div>
              </div>

              <!-- <div class="bonus__item bonus__item--phone">
                <div class="bonus__media">
                  <nuxt-img
                    src="/images/landing/mock/1.png"
                    alt="Трехуровенная партнерская программа"
                    loading="lazy"
                    class="bonus__media-img"
                  />
                </div>
                <div class="bonus__content">
                  <h3 class="bonus__item-title">Трехуровенная партнерская программа</h3>
                  <p class="bonus__item-text">
                    Создайте систему пассивного дохода и получайте процент с покупок вашей сети.
                  </p>
                </div>
              </div> -->
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
