<script setup lang="ts">
const { t } = useI18n()

const email = ref('')
const isSubmitting = ref(false)
const isSuccess = ref(false)

const handleSubmit = async () => {
  if (!email.value || isSubmitting.value) return
  
  isSubmitting.value = true
  
  // TODO: Implement actual email submission
  await new Promise(resolve => setTimeout(resolve, 1000))
  
  isSuccess.value = true
  isSubmitting.value = false
}
</script>

<style src="./promo-subscribe.scss" lang="scss" scoped></style>
<i18n src="./lang.yaml" lang="yaml"></i18n>

<template>
  <section class="promo-subscribe">
    <div class="container">
      <div class="promo-subscribe__content">
        <div class="promo-subscribe__badge">
          -15%
        </div>
        
        <div class="promo-subscribe__text">
          <h3 class="promo-subscribe__title">
            {{ t('title') }}
          </h3>
          <p class="promo-subscribe__description">
            {{ t('description') }}
          </p>
        </div>

        <form 
          v-if="!isSuccess"
          class="promo-subscribe__form" 
          @submit.prevent="handleSubmit"
        >
          <input
            v-model="email"
            type="email"
            class="promo-subscribe__input"
            :placeholder="t('placeholder')"
            required
          />
          <button 
            type="submit" 
            class="promo-subscribe__button"
            :disabled="isSubmitting"
          >
            <span v-if="!isSubmitting">{{ t('button') }}</span>
            <span v-else class="promo-subscribe__loader"></span>
          </button>
        </form>

        <div v-else class="promo-subscribe__success">
          <IconCSS name="ph:check-circle-fill" />
          <span>{{ t('success') }}</span>
        </div>
      </div>
    </div>
  </section>
</template>
