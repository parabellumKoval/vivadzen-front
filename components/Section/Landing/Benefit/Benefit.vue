<script setup lang="ts">
const { t } = useI18n()

// COMPUTEDS
const benefits = computed(() => {
  return [
    {
      icon: 'ph:users-three-fill',
      key: 'referral',
      colorClass: 'benefit-item--referral',
      title: t('benefits.referral.title'),
      description: t('benefits.referral.description')
    },
    {
      icon: 'ph:heart-fill',
      key: 'communication',
      colorClass: 'benefit-item--communication',
      title: t('benefits.communication.title'),
      description: t('benefits.communication.description')
    },
    {
      icon: 'ph:coin-fill',
      key: 'price',
      colorClass: 'benefit-item--price',
      title: t('benefits.price.title'),
      description: t('benefits.price.description')
    },
    {
      icon: 'iconoir:chat-lines',
      key: 'consultation',
      colorClass: 'benefit-item--consultation',
      title: t('benefits.consultation.title'),
      description: t('benefits.consultation.description')
    },
    {
      icon: 'iconoir:shop',
      key: 'selection',
      colorClass: 'benefit-item--selection',
      title: t('benefits.selection.title'),
      description: t('benefits.selection.description')
    },
    {
      icon: 'iconoir:gift',
      key: 'bonus',
      colorClass: 'benefit-item--bonus',
      title: t('benefits.bonus.title'),
      description: t('benefits.bonus.description')
    }
  ]
})
</script>

<style src="./benefit.scss" lang="scss" scoped></style>
<i18n src="./lang.yaml" lang="yaml"></i18n>

<template>
  <section class="benefits-section">
    <div class="container">
      <div class="benefits-section__header">
        <h2 class="benefits-section__title">
          {{ t('title') }}
        </h2>
        <p class="benefits-section__description">
          {{ t('subtitle') }}
        </p>
      </div>

      <div class="benefits-section__grid">
        <div
          v-for="benefit in benefits"
          :key="benefit.key"
          class="benefit-item"
          :class="benefit.colorClass"
        >
          <div class="benefit-item__icon">
            <IconCSS :name="benefit.icon" />
          </div>
          <h3 class="benefit-item__title">{{ benefit.title }}</h3>
          <p class="benefit-item__description">{{ benefit.description }}</p>
        </div>
      </div>

      <div class="benefits-cta">
        <h3 class="benefits-cta__title">
          {{ t('cta.title') }}
        </h3>
        <p class="benefits-cta__description">
          {{ t('cta.description') }}
        </p>
        <button class="benefits-cta__button">
          {{ t('cta.button') }}
        </button>
      </div>
    </div>
  </section>
</template>