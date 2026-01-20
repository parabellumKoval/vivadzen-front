<script setup lang="ts">
const { t } = useI18n()

const videoRef = ref<HTMLVideoElement | null>(null)
const hasInteracted = ref(false)
const isPlaying = ref(false)

const handleMouseEnter = () => {
  hasInteracted.value = true
  isPlaying.value = true
  videoRef.value?.play()
}

const handleMouseLeave = () => {
  isPlaying.value = false
  videoRef.value?.pause()
}

const originWheel = ref({
  title: 'Происхождение',
  icon: '🌏',
  centerImg: '/images/landing/circle-3.png',
  currentIndex: 0,
  items: [
    // Sumatra
    { name: '',  img: '/images/landing/items/circle3-2.png', color: '#FF6B35' },
    // Borneo
    { name: '', img: '/images/landing/items/circle3-3.png', color: '#4ECDC4' },
    // Maeng Da
    { name: '', img: '/images/landing/items/circle3-5.png', color: '#FFD93D' },
    // Malay
    { name: '', img: '/images/landing/items/circle3-4.png', color: '#6BCB77' },
    // Thai
    { name: '',  img: '/images/landing/items/circle3-1.png', color: '#95E1D3' }
  ]
})

const handleItemClick = (key, index) => {
  // No action needed for now
}
</script>

<style src="./choice.scss" lang="scss" scoped></style>
<i18n src="./lang.yaml" lang="yaml"></i18n>

<template>
  <section class="choice-section">
    <div class="choice-section__content">

      <!-- Left - Question -->
      <div class="choice-section__left">
        <h2 class="choice-section__question">
          {{ t('question') }}
        </h2>

        <div 
          v-for="(item, index) in originWheel.items" 
          :key="index"
          class="wheel__item"
          @click="handleItemClick(0, index)"
        >
          <div class="wheel__item-content">
            <nuxt-img 
              :src="item.img"
              class="wheel__item-img"
              :alt="item.name"
            />
          </div>
        </div>
        
      </div>

      <!-- Center - Image/Video -->
      <div 
        class="choice-section__center"
        @mouseenter="handleMouseEnter"
        @mouseleave="handleMouseLeave"
      >
        <nuxt-img
          v-if="!hasInteracted"
          src="/images/landing/persone/man-5.jpg"
          alt="Kratom effects"
          class="choice-section__image"
          loading="lazy"
        />
        <video
          ref="videoRef"
          class="choice-section__video"
          :class="{ 'choice-section__video--visible': hasInteracted }"
          src="/images/landing/persone/energy.mp4"
          muted
          loop
          playsinline
        />
      </div>

      <!-- Right - Title & Description -->
      <div class="choice-section__right">
        <h3 class="choice-section__title">
          {{ t('title') }}
        </h3>
        <p class="choice-section__description">
          {{ t('description') }}
        </p>
      </div>
    </div>
    <!-- <nuxt-img
      src="/images/landing/persone/man-3.jpg"
      alt="Kratom effects"
      class="choice-section__image-bg"
      sizes="desktop:2500px"
      loading="lazy"
    /> -->
  </section>
</template>
