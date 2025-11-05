<script setup lang="ts">
const { t } = useI18n()
const { $regionPath } = useNuxtApp();
const { user, isAuthenticated, avatar } = useAuth()

const avatars = ref([
  '/images/ref/avatars/av-1.png',
  '/images/ref/avatars/av-2.png',
  '/images/ref/avatars/av-3.png',
  '/images/ref/avatars/av-4.png',
])

const showAuthHandler = () => {
  if(isAuthenticated.value && user.value) {
    navigateTo($regionPath('/account/network/common'))
  } else {
    const component = defineAsyncComponent(() => import('~/components/Modal/Auth/Social/Social.vue'))
    useModal().open(component, null, null, {width: {
      min: 420, max: 420
    }})
  }
}
</script>

<style src='./referral.scss' lang='scss' scoped></style>
<i18n src="./lang.yaml" lang="yaml"></i18n>

<template>
  <section class="refgrow" aria-labelledby="refgrow-title">
    <header class="refgrow__header">
      <h2 class="refgrow__title">
        {{ t('refGrow.title') }}
      </h2>
      <p class="refgrow__subtitle">
        <span class="orange">{{ t('refGrow.subtitleAccent') }}</span>
        {{ t('refGrow.subtitleRest') }}
      </p>
    </header>

    <div class="refgrow__grid">
      <!-- Колонка 1 -->
      <div class="refgrow__col">
        <div class="refgrow__icon">
          <div class="refgrow__circle" aria-hidden="true"></div>
            <nuxt-img
              src = "/images/ref/img-1.png"
              width="370"
              height="370"
              sizes = "mobile:100vw tablet:370px"
              format = "avif"
              quality = "60"
              loading = "lazy"
              fit="outside"
            >
            </nuxt-img>
        </div>

        <h3 class="refgrow__col-title">{{ t('refGrow.col1.title') }}</h3>
        <p class="refgrow__col-kicker">{{ t('refGrow.col1.kicker') }}</p>
        <p class="refgrow__col-text">{{ t('refGrow.col1.text') }}</p>
      </div>

      <!-- Колонка 2 -->
      <div class="refgrow__col">
        <div class="refgrow__icon">
          <div class="refgrow__circle" aria-hidden="true"></div>
            <nuxt-img
              src = "/images/ref/img-2.png"
              width="370"
              height="370"
              sizes = "mobile:100vw tablet:370px"
              format = "avif"
              quality = "60"
              loading = "lazy"
              fit="outside"
            >
            </nuxt-img>
        </div>

        <h3 class="refgrow__col-title">{{ t('refGrow.col2.title') }}</h3>
        <p class="refgrow__col-kicker">{{ t('refGrow.col2.kicker') }}</p>
        <p class="refgrow__col-text">{{ t('refGrow.col2.text') }}</p>
      </div>

      <!-- Колонка 3 -->
      <div class="refgrow__col">
        <div class="refgrow__icon">
          <div class="refgrow__circle" aria-hidden="true"></div>
            <nuxt-img
              src = "/images/ref/img-3.png"
              width="370"
              height="370"
              sizes = "mobile:100vw tablet:370px"
              format = "avif"
              quality = "60"
              loading = "lazy"
              fit="outside"
            >
            </nuxt-img>
        </div>

        <h3 class="refgrow__col-title">{{ t('refGrow.col3.title') }}</h3>
        <p class="refgrow__col-kicker">{{ t('refGrow.col3.kicker') }}</p>
        <p class="refgrow__col-text">{{ t('refGrow.col3.text') }}</p>
      </div>

      <!-- CTA карточка -->
      <aside class="refgrow__cta" aria-label="Join">
        <h3 class="refgrow__cta-title">{{ t('refGrow.cta.title') }}</h3>
        <p class="refgrow__cta-text">
          {{ t('refGrow.cta.text') }}
        </p>

        <ul v-if="avatars?.length" class="refgrow__avatars" aria-hidden="true">
          <li v-for="(a, i) in avatars" :key="i">
            <nuxt-img
              :src = "a"
              width="60"
              height="60"
              sizes = "mobile:80px"
              format = "avif"
              quality = "60"
              loading = "lazy"
              fit="outside"
            >
            </nuxt-img>
          </li>
        </ul>

        <button @click="showAuthHandler" class="refgrow__cta-btn button orange" type="button">
          {{ t('refGrow.cta.button') }}
        </button>
      </aside>
    </div>
  </section>
</template>
