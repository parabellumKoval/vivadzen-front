<script setup>
const { t } = useI18n()

const itemConfigs = [
  {
    key: 'discounts',
    image: '/images/landing/bonus/product.png',
    size: 'tall',
    bgColor: 'rgb(34 34 33)',
    color: 'rgb(246 124 121)',
    textColor: '#ffffff',
    symbol: '%'
  },
  {
    key: 'affiliate',
    image: '/images/landing/bonus/tree.png',
    size: 'tall',
    bgColor: 'rgb(193 231 222)',
    color: 'rgb(145 207 0)',
    symbol: '★'
  },
  {
    key: 'promocodes',
    image: '/images/landing/bonus/letter.png',
    size: 'tall',
    bgColor: 'rgb(234 234 234)',
    color: 'rgb(187 71 72)',
    symbol: '#'
  },
  {
    key: 'vivapoints',
    image: '/images/landing/bonus/bottle.png',
    size: 'mid',
    bgColor: '#faedc5',
    color: '#57a56a',
    symbol: 'V'
  }
]

const items = computed(() =>
  itemConfigs.map((item) => ({
    ...item,
    title: t(`items.${item.key}.title`),
    description: t(`items.${item.key}.description`),
    alt: t(`items.${item.key}.image_alt`)
  }))
)
</script>

<style src="./referral-bonus.scss" lang="scss" scoped></style>
<i18n src="./lang.yaml" lang="yaml"></i18n>

<template>
  <section class="bonus">
    <div class="container">
      <div class="bonus-inner">
        <div class="bonus__header">
          <h2 class="bonus__title">
            {{ t('header.title') }}
          </h2>
          <p class="bonus__lead">
            {{ t('header.lead') }}
          </p>
        </div>
        <div class="bonus__right">
          <div class="bonus__right-media">
            <nuxt-img
              src="/images/landing/box2.png"
              :alt="t('header.image_alt')"
              loading="lazy"
              class="bonus__right-media-img"
            />
          </div>
        </div>
      </div>
      <div class="bonus__track">
        <div class="bonus__track-inner">
          <div class="bonus__track-grid">
            <div
              v-for="(item, index) in items"
              :key="index"
              class="bonus__track-item"
              :class="`bonus__track-item--${item.size}`"
              :style="{ backgroundColor: item.bgColor, color: item.textColor }"
            >
              <nuxt-img
                :src="item.image"
                :alt="item.alt"
                loading="lazy"
                class="bonus__track-image"
              />
              <h4 class="bonus__track-title">
                {{ item.title }}
              </h4>
              <p class="bonus__track-description">
                {{ item.description }}
              </p>
            </div>
            <div class="bonus__track-item bonus__track-item--large">
              <div class="bonus__track-join">
                <h3 class="bonus__track-join-title">
                  {{ t('join.title') }}
                </h3>
                <p class="bonus__track-join-description">
                  {{ t('join.description') }}
                </p>
                <NuxtLink to="/account/network" class="button orange">
                  {{ t('join.button') }}
                </NuxtLink>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
