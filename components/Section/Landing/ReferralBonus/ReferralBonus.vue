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
    <div class="bonus-inner">
      <div class="bonus__header">
        <h2 class="bonus__title">
          Получайте бонусы, рекомендуя Vivadzen
        </h2>
        <p class="bonus__lead">
          Рекомендации и партнерство — часть нашей культуры. Приглашайте заинтересованных людей и получайте преимущества и бонусы.
        </p>
        <!-- <p class="bonus__lead">
          Реферальная программа доступна каждому клиенту. Рекомендуйте магазин
          заинтересованным людям и получайте преимущества и бонусы.
        </p> -->
        <div class="bonus__cta">
          <span class="bonus__cta-note">
            Менеджеры расскажут детали в магазине, а подключиться можно прямо здесь, на сайте.
          </span>
          <NuxtLink to="/account/network" class="button secondary">
            Присоединиться
          </NuxtLink>
        </div>
      </div>
      <div class="bonus__right">
        <div>
          
        </div>
        <nuxt-img
          src="/images/landing/photo-4.png"
          alt="Трехуровенная партнерская программа"
          loading="lazy"
          class="bonus__bg"
        />
        <video
          class="bonus__bg-video"
          autoplay
          loop
          muted
          playsinline
          preload="metadata"
        >
          <source src="/video/offer2.mp4" type="video/mp4">
        </video>
        <!-- <video
          class="bonus__bg-video-2"
          autoplay
          loop
          muted
          playsinline
          preload="metadata"
        >
          <source src="/video/offer-right-2.mp4" type="video/mp4">
        </video> -->
      </div>
    </div>
    <div class="bonus__track">
      <div class="bonus__track-inner">

      </div>
    </div>
  </section>
</template>
