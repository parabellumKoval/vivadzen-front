

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import KratomFlower1 from './KratomFlower1.svg'
import KratomFlower2 from './KratomFlower2.svg'
import KratomFlowerYellow from './KratomFlowerYellow.svg'
import KratomFlowerCream from './KratomFlowerCream.svg'

const packImg = ref(null)
const tiltX = ref(0)
const tiltY = ref(0)

const handleMouseMove = (e) => {
  const windowWidth = window.innerWidth
  const windowHeight = window.innerHeight
  
  // Calculate mouse position relative to center (-1 to 1)
  const mouseX = (e.clientX / windowWidth - 0.5) * 2
  const mouseY = (e.clientY / windowHeight - 0.5) * 2
  
  // Apply tilt (max 15 degrees)
  tiltX.value = mouseY * -10
  tiltY.value = mouseX * 15
}

onMounted(() => {
  window.addEventListener('mousemove', handleMouseMove)
})

onUnmounted(() => {
  window.removeEventListener('mousemove', handleMouseMove)
})

const benefits = [
  { title: 'Focus', icon: 'ph:lightbulb', color: 'green' },
  { title: 'Energy', icon: 'ph:lightning', color: 'orange' },
  { title: 'Gut Health', icon: 'ph:heart', color: 'red' },
  { title: 'Immune Support', icon: 'ph:shield-check', color: 'blue' },
  { title: 'Stress Support', icon: 'ph:sparkle', color: 'violet' },
]
</script>

<style src="./kratom.scss" lang="scss" scoped></style>

<template>
  <section class="kratom-section">
    <!-- Background flowers decoration -->
    
    <div class="container">
          
      <h2 class="kratom-hero__title">
        Real Premium <br> Kratom Made <br> <span class="orange">Smarter</span>
      </h2>
      <div class="kratom-hero">
        
        <div class="kratom-hero__product">
          <!-- <KratomFlowerYellow class="kratom-section__bg-flower kratom-section__bg-flower--yellow" /> -->
          <KratomFlowerCream class="kratom-section__bg-flower kratom-section__bg-flower--1" />
          <!-- Kratom Flower Shape 1 - Behind left -->
          <!-- <KratomFlower1 class="kratom-hero__flower kratom-hero__flower--1" /> -->
          <!-- Kratom Flower Shape 2 - Behind right (different style - spiky) -->
          <!-- <KratomFlower2 class="kratom-hero__flower kratom-hero__flower--2" /> -->
          <KratomFlowerCream class="kratom-section__bg-flower kratom-section__bg-flower--2" />
          
          <div class="kratom-hero__pack-wrapper">
            <nuxt-img 
              ref="packImg"
              src="/images/landing/product.png" 
              alt="Vivadzen Kratom Pack" 
              width="506"
              height="776"
              quality="90"
              fit="cover"
              sizes="mobile: 100vw tablet: 550px desktop: 550px"
              class="kratom-hero__pack-img"
              :style="{
                '--tilt-x': `${tiltX}deg`,
                '--tilt-y': `${tiltY}deg`
              }"
            />
            <nuxt-img src="/images/landing/kratom-2-leaves-2.png" class="kratom-hero__deco-leaf kratom-hero__deco-leaf--1" />
            <nuxt-img src="/images/landing/kratom-2-leaves.png" class="kratom-hero__deco-leaf kratom-hero__deco-leaf--2" />
            <nuxt-img src="/images/landing/kratom-3-leaves.png" class="kratom-hero__deco-leaf kratom-hero__deco-leaf--3" />
          </div>
        </div>

        <div class="kratom-hero__visual">
          <div class="kratom-cup">
            <div class="kratom-cup__image-container">
              <nuxt-img 
                src="/images/landing/kratom-cap.png" 
                alt="Kratom Tea" 
                width="722"
                height="725"
                quality="70"
                fit="cover"
                sizes="mobile: 100vw tablet: 750px desktop: 750px"
                class="kratom-cup__img"
              />

            <nuxt-img src="/images/landing/kratom-leaf-2.png" class="kratom-cup__leaf-2" />
            <nuxt-img src="/images/landing/kratom-leaf-1.png" class="kratom-cup__leaf-1" />
            <nuxt-img src="/images/landing/seed.png" width="1536" height="1024" class="kratom-cup__seeds" />
            </div>


            <div class="kratom-callout kratom-callout--top-left">
              <div class="kratom-callout__content">
                <strong>100% Organic Leaf</strong>
                <span>Fine Nano-grind texture</span>
              </div>
              <svg class="kratom-callout__arrow" viewBox="0 0 80 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M2 2 Q 40 2, 70 32" stroke-width="3" stroke-linecap="round" fill="none" />
                <path d="M62 34 L70 32 L69 22" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" fill="none" />
              </svg>
            </div>

            <div class="kratom-callout kratom-callout--top-right">
              <div class="kratom-callout__content">
                <strong>Alkaloid Rich</strong>
                <span>High Mitragynine content</span>
              </div>
              <svg class="kratom-callout__arrow" viewBox="0 0 80 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M78 2 Q 40 2, 10 32" stroke-width="3" stroke-linecap="round" fill="none" />
                <path d="M18 34 L10 32 L11 22" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" fill="none" />
              </svg>
            </div>

            <div class="kratom-callout kratom-callout--bottom-left">
              <div class="kratom-callout__content">
                <strong>Ethically Sourced</strong>
                <span>Direct from Borneo</span>
              </div>
              <svg class="kratom-callout__arrow" viewBox="0 0 80 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M2 38 Q 40 38, 70 8" stroke-width="3" stroke-linecap="round" fill="none" />
                <path d="M62 6 L70 8 L69 18" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" fill="none" />
              </svg>
            </div>

            <div class="kratom-callout kratom-callout--bottom-right">
              <div class="kratom-callout__content">
                <strong>Lab Tested</strong>
                <span>Purity & Safety guaranteed</span>
              </div>
              <svg class="kratom-callout__arrow" viewBox="0 0 80 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M78 38 Q 40 38, 10 8" stroke-width="3" stroke-linecap="round" fill="none" />
                <path d="M18 6 L10 8 L11 18" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" fill="none" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      <div class="kratom-benefits">
        <h3 class="kratom-benefits__title">A daily cup of Vivadzen Kratom helps with:</h3>
        
        <div class="kratom-benefits__grid">
          <div v-for="benefit in benefits" :key="benefit.title" class="kratom-benefit-card" :class="`kratom-benefit-card--${benefit.color}`">
            <div class="kratom-benefit-card__icon-box">
              <IconCSS :name="benefit.icon" class="kratom-benefit-card__icon" />
            </div>
            <span class="kratom-benefit-card__label">{{ benefit.title }}</span>
          </div>
        </div>

        <div class="kratom-benefits__cta">
          <button class="button alternate uppercase bold kratom-btn">
            Try the Original Kratom
          </button>
        </div>
      </div>
    </div>
  </section>
</template>