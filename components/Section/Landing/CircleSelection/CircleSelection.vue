<script setup>
import { ref, computed } from 'vue'

// Wheel data configuration
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

const colorWheel = ref({
  title: 'Цвет',
  icon: '🎨',
  centerImg: '/images/landing/circle-2.png',
  currentIndex: 0,
  items: [
    { name: 'Gold Kratom', img: '/images/landing/items/circle2-4.png', color: '#FFD700' },
    { name: 'White Kratom', img: '/images/landing/items/circle2-1.png', color: '#F5F5F5' },
    { name: 'Red Kratom', img: '/images/landing/items/circle2-2.png', color: '#DC143C' },
    { name: 'Green Kratom', img: '/images/landing/items/circle2-3.png', color: '#228B22' }
  ]
})

const effectWheel = ref({
  title: 'Эффект',
  icon: '✨',
  centerImg: '/images/landing/circle-1.png',
  currentIndex: 0,
  items: [
    { name: 'Расслабление', img: '/images/landing/items/circle1-1.png', icon: '😌', color: '#A8DADC' },
    { name: 'Концентрация', img: '/images/landing/items/circle1-2.png', icon: '🎯', color: '#457B9D' },
    { name: 'Энергия', img: '/images/landing/items/circle1-3.png', icon: '⚡', color: '#F77F00' },
    { name: 'Настроение', img: '/images/landing/items/circle1-4.png', icon: '😊', color: '#F94144' },
    { name: 'Комфорт', img: '/images/landing/items/circle1-5.png', icon: '💆', color: '#B5838D' },
    { name: 'Баланс', img: '/images/landing/items/circle1-6.png', icon: '⚖️', color: '#90BE6D' }
  ]
})

// Wheel combinations mapping - bidirectional relationships
const wheelCombinations = {
  // Origin -> Color -> Effect
  origin: {
    'Sumatra': { color: 'Red Kratom', effect: 'Расслабление' },
    'Borneo': { color: 'Red Kratom', effect: 'Комфорт' },
    'Maeng Da': { color: 'White Kratom', effect: 'Энергия' },
    'Malay': { color: 'Green Kratom', effect: 'Баланс' },
    'Thai': { color: 'Green Kratom', effect: 'Концентрация' }
  },
  // Color -> Origin -> Effect (reverse mapping)
  color: {
    'Red Kratom': { origins: ['Sumatra', 'Borneo'], effect: 'Комфорт' },
    'White Kratom': { origins: ['Maeng Da'], effect: 'Энергия' },
    'Green Kratom': { origins: ['Malay', 'Thai'], effect: 'Баланс' },
    'Gold Kratom': { origins: ['Sumatra'], effect: 'Расслабление' }
  },
  // Effect -> Origin -> Color (reverse mapping)
  effect: {
    'Расслабление': { origins: ['Sumatra'], color: 'Red Kratom' },
    'Комфорт': { origins: ['Borneo'], color: 'Red Kratom' },
    'Энергия': { origins: ['Maeng Da'], color: 'White Kratom' },
    'Баланс': { origins: ['Malay'], color: 'Green Kratom' },
    'Концентрация': { origins: ['Thai'], color: 'Green Kratom' }
  }
}

// Wheel rotation state
const wheels = ref([originWheel, colorWheel, effectWheel])
const wheelRotations = ref([0, 0, 0])
const targetRotations = ref([0, 0, 0])
const isAnimating = ref(false)
const animatingWheels = ref([false, false, false])

// Animate wheel to target rotation with completion callback
const animateToTarget = (wheelIndex, onComplete) => {
  animatingWheels.value[wheelIndex] = true
  
  const animate = () => {
    const current = wheelRotations.value[wheelIndex]
    const target = targetRotations.value[wheelIndex]
    const diff = target - current
    
    if (Math.abs(diff) < 0.1) {
      wheelRotations.value[wheelIndex] = target
      animatingWheels.value[wheelIndex] = false
      if (onComplete) onComplete()
      return
    }
    
    wheelRotations.value[wheelIndex] += diff * 0.15
    requestAnimationFrame(animate)
  }
  animate()
}

// Update related wheels based on current selection - bidirectional
const updateRelatedWheels = (changedWheelIndex) => {
  if (changedWheelIndex === 0) { // Origin wheel changed
    const originName = originWheel.value.items[originWheel.value.currentIndex].name
    const combination = wheelCombinations.origin[originName]
    
    if (combination) {
      // Update color wheel
      const colorIndex = colorWheel.value.items.findIndex(item => item.name === combination.color)
      if (colorIndex !== -1 && colorIndex !== colorWheel.value.currentIndex) {
        const colorSectorAngle = 360 / colorWheel.value.items.length
        targetRotations.value[1] = colorIndex * colorSectorAngle
        animateToTarget(1, () => {
          colorWheel.value.currentIndex = colorIndex
        })
      }
      
      // Update effect wheel
      const effectIndex = effectWheel.value.items.findIndex(item => item.name === combination.effect)
      if (effectIndex !== -1 && effectIndex !== effectWheel.value.currentIndex) {
        const effectSectorAngle = 360 / effectWheel.value.items.length
        targetRotations.value[2] = effectIndex * effectSectorAngle
        animateToTarget(2, () => {
          effectWheel.value.currentIndex = effectIndex
        })
      }
    }
  } else if (changedWheelIndex === 1) { // Color wheel changed
    const colorName = colorWheel.value.items[colorWheel.value.currentIndex].name
    const combination = wheelCombinations.color[colorName]
    
    if (combination) {
      // Update origin wheel (take first matching origin)
      const originIndex = originWheel.value.items.findIndex(item => 
        combination.origins.includes(item.name)
      )
      if (originIndex !== -1 && originIndex !== originWheel.value.currentIndex) {
        const originSectorAngle = 360 / originWheel.value.items.length
        targetRotations.value[0] = originIndex * originSectorAngle
        animateToTarget(0, () => {
          originWheel.value.currentIndex = originIndex
        })
      }
      
      // Update effect wheel
      const effectIndex = effectWheel.value.items.findIndex(item => item.name === combination.effect)
      if (effectIndex !== -1 && effectIndex !== effectWheel.value.currentIndex) {
        const effectSectorAngle = 360 / effectWheel.value.items.length
        targetRotations.value[2] = effectIndex * effectSectorAngle
        animateToTarget(2, () => {
          effectWheel.value.currentIndex = effectIndex
        })
      }
    }
  } else if (changedWheelIndex === 2) { // Effect wheel changed
    const effectName = effectWheel.value.items[effectWheel.value.currentIndex].name
    const combination = wheelCombinations.effect[effectName]
    
    if (combination) {
      // Update origin wheel (take first matching origin)
      const originIndex = originWheel.value.items.findIndex(item => 
        combination.origins.includes(item.name)
      )
      if (originIndex !== -1 && originIndex !== originWheel.value.currentIndex) {
        const originSectorAngle = 360 / originWheel.value.items.length
        targetRotations.value[0] = originIndex * originSectorAngle
        animateToTarget(0, () => {
          originWheel.value.currentIndex = originIndex
        })
      }
      
      // Update color wheel
      const colorIndex = colorWheel.value.items.findIndex(item => item.name === combination.color)
      if (colorIndex !== -1 && colorIndex !== colorWheel.value.currentIndex) {
        const colorSectorAngle = 360 / colorWheel.value.items.length
        targetRotations.value[1] = colorIndex * colorSectorAngle
        animateToTarget(1, () => {
          colorWheel.value.currentIndex = colorIndex
        })
      }
    }
  }
}

// Handle item click
const handleItemClick = (wheelIndex, itemIndex) => {
  if (isAnimating.value) return
  
  isAnimating.value = true
  const wheel = wheels.value[wheelIndex].value
  const itemCount = wheel.items.length
  const sectorAngle = 360 / itemCount
  
  // Set the target rotation to bring clicked item to top
  targetRotations.value[wheelIndex] = itemIndex * sectorAngle
  
  // Start animation with callback to set currentIndex after completion
  animateToTarget(wheelIndex, () => {
    wheel.currentIndex = itemIndex
    // Update related wheels after main animation completes
    updateRelatedWheels(wheelIndex)
    isAnimating.value = false
  })
}

// Computed styles for wheel rotation
const getWheelStyle = (wheelIndex) => {
  return computed(() => ({
    transform: `rotate(${wheelRotations.value[wheelIndex]}deg)`
  }))
}

// Get current selection text
const currentSelection = computed(() => {
  const origin = originWheel.value.items[originWheel.value.currentIndex].name
  const color = colorWheel.value.items[colorWheel.value.currentIndex].name
  const effect = effectWheel.value.items[effectWheel.value.currentIndex].name
  return `${origin} • ${color} • ${effect}`
})
</script>

<style src="./circle-selection.scss" lang="scss" scoped></style>

<template>
  <section class="circle-selection">
    <!-- <nuxt-img 
      src="/images/landing/bg-stars-shine.png"
      sizes="mobile:100vw tablet:3000px"
      width="2500" 
      height="1000"
      class="circle-selection--bg-1" 
    /> -->
    <div class="container">
      <div class="circle-selection__content">

        <!-- Left side: Title -->
        <div class="circle-selection__left">
          <h2 class="circle-selection__title">
            Подбери кратом <br>
            под свои <br>
            <span class="highlight">потребности</span>
          </h2>
          <div class="circle-selection__result">
            <div class="result-box">
              <span class="result-label">Ваш выбор:</span>
              <span class="result-text">{{ currentSelection }}</span>
            </div>
          </div>
        </div>

        <!-- Right side: Three wheels in triangle formation -->
        <div class="circle-selection__right">
          <!-- Triangle connecting wheel centers -->
          <svg class="triangle-connector" viewBox="0 0 1000 900" xmlns="http://www.w3.org/2000/svg">
            <!-- Large outer triangle -->
            <path 
              class="triangle-connector__line" 
              d="M 500 200 L 200 700 L 800 700 Z" 
              fill="none" 
              stroke="#ffffff" 
              stroke-width="3"
            />
            <!-- Small inner triangle in the center -->
            <path 
              class="triangle-connector__inner" 
              d="M 400 470 L 600 470 L 500 620 Z" 
              fill="none" 
              stroke="#ffffff" 
              stroke-width="3"
            />
          </svg>
          
          <!-- Decorative leaves scattered around -->
          <nuxt-img src="/images/landing/kratom-2-leaves-2.png" class="deco-leaf deco-leaf--1" />
          <nuxt-img src="/images/landing/kratom-2-leaves.png" class="deco-leaf deco-leaf--2" />
          <nuxt-img src="/images/landing/kratom-3-leaves.png" class="deco-leaf deco-leaf--3" />
          <nuxt-img src="/images/landing/kratom-leaf-1.png" class="deco-leaf deco-leaf--4" />
          <nuxt-img src="/images/landing/kratom-2-leaves.png" class="deco-leaf deco-leaf--5" />
          <nuxt-img src="/images/landing/kratom-2-leaves-2.png" class="deco-leaf deco-leaf--6" />
          <nuxt-img src="/images/landing/kratom-3-leaves.png" class="deco-leaf deco-leaf--7" />
          
          <!-- Center image between wheels -->
          <nuxt-img 
            src="/images/landing/circle-center.png"
            sizes="mobile: 250px"
            class="center-image" 
            width="150" 
            height="150"
            alt="Center decoration"
          />

          <div class="region-box">
            <div class="region-title">Region</div>
            <div class="region-desc">Chose kratom region</div>
            <ul class="region-list">
              <li>Malay</li>
              <li>Maeng Da</li>
              <li>Thai</li>
              <li>Sumatra</li>
              <li>Borneo</li>
            </ul>
          </div>
          
          <!-- Top wheel - Origin -->
          <div class="wheel wheel--top">
            <div class="wheel__container">
              <!-- Rotating background image -->
              <div class="wheel__rotatable" :style="getWheelStyle(0).value">
                <nuxt-img 
                  src="/images/landing/radial-stars-3.png"
                  class="wheel__sectors"
                  alt="Wheel background"
                />
              </div>
              
              <!-- Center image - always horizontal -->
              <div class="wheel__center">
                <span class="wheel__center-icon">
                  <nuxt-img 
                    :src="originWheel.centerImg" 
                    width="80" 
                    height="80" 
                    sizes="mobile: 80px tablet: 270px desktop: 220px"
                    alt="Origin Icon" 
                    class="wheel__center-icon-img"
                  />
                </span>
              </div>
              
              <!-- Items around circle - always horizontal -->
              <div 
                v-for="(item, index) in originWheel.items" 
                :key="index"
                class="wheel__item"
                :class="{ 'wheel__item--active': index === originWheel.currentIndex }"
                :style="{
                  transform: `rotate(${(360 / originWheel.items.length) * index - wheelRotations[0]}deg) translateY(-147px)`,
                  '--item-color': item.color
                }"
                @click="handleItemClick(0, index)"
              >
                <div class="wheel__item-content">
                  <nuxt-img 
                    v-if="item.img"
                    :src="item.img"
                    class="wheel__item-img"
                    :alt="item.name"
                  />
                  <span v-else class="wheel__item-icon">{{ item.icon }}</span>
                  
                  <!-- Text along arc -->
                  <svg class="wheel__item-arc-text" viewBox="0 0 120 80" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                      <path 
                        :id="`arc-origin-${index}`" 
                        d="M 15,15 A 45,45 0 0,0 105,15" 
                        fill="none" 
                      />
                    </defs>
                    <text class="wheel__item-arc-label">
                      <textPath 
                        :href="`#arc-origin-${index}`" 
                        startOffset="50%" 
                        text-anchor="middle"
                      >
                        {{ item.name }}
                      </textPath>
                    </text>
                  </svg>
                </div>
              </div>
              
              <!-- Arrow pointer -->
              <div class="wheel__arrow"></div>
            </div>
          </div>

          <!-- Bottom left wheel - Color -->
          <div class="wheel wheel--bottom-left">
            <div class="wheel__container">
              <!-- Rotating background image -->
              <div class="wheel__rotatable" :style="getWheelStyle(1).value">
                <nuxt-img 
                  src="/images/landing/radial-stars-3.png"
                  class="wheel__sectors"
                  alt="Wheel background"
                />
              </div>
              
              <!-- Center image - always horizontal -->
              <div class="wheel__center">
                <span class="wheel__center-icon">
                  <nuxt-img 
                    :src="colorWheel.centerImg" 
                    width="80" 
                    height="80" 
                    sizes="mobile: 80px tablet: 270px desktop: 220px"
                    alt="Color Icon" 
                    class="wheel__center-icon-img"
                  />
                </span>
              </div>
              
              <!-- Items around circle - always horizontal -->
              <div 
                v-for="(item, index) in colorWheel.items" 
                :key="index"
                class="wheel__item"
                :class="{ 'wheel__item--active': index === colorWheel.currentIndex }"
                :style="{
                  transform: `rotate(${(360 / colorWheel.items.length) * index - wheelRotations[1]}deg) translateY(-147px)`,
                  '--item-color': item.color
                }"
                @click="handleItemClick(1, index)"
              >
                <div class="wheel__item-content">
                  <nuxt-img 
                    v-if="item.img"
                    :src="item.img"
                    class="wheel__item-img"
                    :alt="item.name"
                  />
                  <span v-else class="wheel__item-icon">{{ item.icon }}</span>
                  
                  <!-- Text along arc -->
                  <svg class="wheel__item-arc-text" viewBox="0 0 120 80" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                      <path 
                        :id="`arc-color-${index}`" 
                        d="M 15,15 A 45,45 0 0,0 105,15" 
                        fill="none" 
                      />
                    </defs>
                    <text class="wheel__item-arc-label">
                      <textPath 
                        :href="`#arc-color-${index}`" 
                        startOffset="50%" 
                        text-anchor="middle"
                      >
                        {{ item.name }}
                      </textPath>
                    </text>
                  </svg>
                </div>
              </div>
              
              <!-- Arrow pointer -->
              <div class="wheel__arrow"></div>
            </div>
          </div>

          <!-- Bottom right wheel - Effect -->
          <div class="wheel wheel--bottom-right">
            <div class="wheel__container">
              <!-- Rotating background image -->
              <div class="wheel__rotatable" :style="getWheelStyle(2).value">
                <nuxt-img 
                  src="/images/landing/radial-stars-3.png"
                  class="wheel__sectors"
                  alt="Wheel background"
                />
              </div>
              
              <!-- Center image - always horizontal -->
              <div class="wheel__center">
                <span class="wheel__center-icon">
                  <nuxt-img 
                    :src="effectWheel.centerImg" 
                    width="80" 
                    height="80" 
                    sizes="mobile: 80px tablet: 270px desktop: 220px"
                    alt="Effect Icon" 
                    class="wheel__center-icon-img"
                  />
                </span>
              </div>
              
              <!-- Items around circle - always horizontal -->
              <div 
                v-for="(item, index) in effectWheel.items" 
                :key="index"
                class="wheel__item"
                :class="{ 'wheel__item--active': index === effectWheel.currentIndex }"
                :style="{
                  transform: `rotate(${(360 / effectWheel.items.length) * index - wheelRotations[2]}deg) translateY(-147px)`,
                  '--item-color': item.color
                }"
                @click="handleItemClick(2, index)"
              >
                <div class="wheel__item-content">
                  <nuxt-img 
                    v-if="item.img"
                    :src="item.img"
                    class="wheel__item-img"
                    :alt="item.name"
                  />
                  <span v-else class="wheel__item-icon">{{ item.icon }}</span>
                  
                  <!-- Text along arc -->
                  <svg class="wheel__item-arc-text" viewBox="0 0 120 80" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                      <path 
                        :id="`arc-effect-${index}`" 
                        d="M 15,15 A 25,21 0 0,0 105,15" 
                        fill="none" 
                      />
                    </defs>
                    <text class="wheel__item-arc-label">
                      <textPath 
                        :href="`#arc-effect-${index}`" 
                        startOffset="50%" 
                        text-anchor="middle"
                      >
                        {{ item.name }}
                      </textPath>
                    </text>
                  </svg>
                </div>
              </div>
              
              <!-- Arrow pointer -->
              <div class="wheel__arrow"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>


