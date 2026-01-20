<script setup>
import { ref, computed } from 'vue'

// Wheel data configuration
const originWheel = ref({
  title: 'Происхождение',
  icon: '🌏',
  centerImg: '/images/landing/circle-1.png',
  currentIndex: 0,
  items: [
    { name: 'Sumatra', icon: '🏝️', color: '#FF6B35' },
    { name: 'Borneo', icon: '🌴', img: '/images/landing/circle-1-borneo.png', color: '#4ECDC4' },
    { name: 'Maeng Da', icon: '⚡', color: '#FFD93D' },
    { name: 'Malay', icon: '🍃', color: '#6BCB77' },
    { name: 'Thai', icon: '🌿', color: '#95E1D3' }
  ]
})

const colorWheel = ref({
  title: 'Цвет',
  icon: '🎨',
  centerImg: '/images/landing/circle-2.png',
  currentIndex: 0,
  items: [
    { name: 'Gold Kratom', icon: '🟡', color: '#FFD700' },
    { name: 'White Kratom', icon: '⚪', color: '#F5F5F5' },
    { name: 'Red Kratom', icon: '🔴', color: '#DC143C' },
    { name: 'Green Kratom', icon: '🟢', color: '#228B22' }
  ]
})

const effectWheel = ref({
  title: 'Эффект',
  icon: '✨',
  centerImg: '/images/landing/circle-1.png',
  currentIndex: 0,
  items: [
    { name: 'Расслабление', icon: '😌', color: '#A8DADC' },
    { name: 'Концентрация', icon: '🎯', color: '#457B9D' },
    { name: 'Энергия', icon: '⚡', color: '#F77F00' },
    { name: 'Настроение', icon: '😊', color: '#F94144' },
    { name: 'Комфорт', icon: '💆', color: '#B5838D' },
    { name: 'Баланс', icon: '⚖️', color: '#90BE6D' }
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
    <!-- <svg style="display: none;">
      <filter id="noise">
        <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" />
        <feColorMatrix type="saturate" values="0"/>
      </filter>
    </svg> -->
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
          <nuxt-img src="/images/landing/kratom-leaf-2.png" class="deco-leaf deco-leaf--5" />
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
          
          <!-- Top wheel - Origin -->
          <div class="wheel wheel--top">
            <div class="wheel__container">
              <!-- Rotating sectors in background -->
              <div class="wheel__rotatable" :style="getWheelStyle(0).value">
                <svg class="wheel__sectors" viewBox="0 0 200 200">
                  <g v-for="(item, index) in originWheel.items" :key="`sector-${index}`">
                    <path 
                      :d="getSectorPath(originWheel.items.length, index)"
                      class="wheel__sector"
                      :class="{ 'wheel__sector--active': index === originWheel.currentIndex }"
                    />
                  </g>
                </svg>
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
                <nuxt-img 
                  v-if="item.img"
                  :src="item.img"
                  class="wheel__item-img"
                  alt="item.name"
                />
                <div v-else class="wheel__item-content">
                  <span class="wheel__item-icon">{{ item.icon }}</span>
                  <span class="wheel__item-name">{{ item.name }}</span>
                </div>
              </div>
              
              <!-- Arrow pointer -->
              <div class="wheel__arrow"></div>
            </div>
          </div>

          <!-- Bottom left wheel - Color -->
          <div class="wheel wheel--bottom-left">
            <div class="wheel__container">
              <!-- Rotating sectors in background -->
              <div class="wheel__rotatable" :style="getWheelStyle(1).value">
                <svg class="wheel__sectors" viewBox="0 0 200 200">
                  <g v-for="(item, index) in colorWheel.items" :key="`sector-${index}`">
                    <path 
                      :d="getSectorPath(colorWheel.items.length, index)"
                      class="wheel__sector"
                      :class="{ 'wheel__sector--active': index === colorWheel.currentIndex }"
                    />
                  </g>
                </svg>
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
                <nuxt-img 
                  v-if="item.img"
                  :src="item.img"
                  class="wheel__item-img"
                  alt="item.name"
                />
                <div v-else class="wheel__item-content">
                  <span class="wheel__item-icon">{{ item.icon }}</span>
                  <span class="wheel__item-name">{{ item.name }}</span>
                </div>
              </div>
              
              <!-- Arrow pointer -->
              <div class="wheel__arrow"></div>
            </div>
          </div>

          <!-- Bottom right wheel - Effect -->
          <div class="wheel wheel--bottom-right">
            <div class="wheel__container">
              <!-- Rotating sectors in background -->
              <div class="wheel__rotatable" :style="getWheelStyle(2).value">
                <svg class="wheel__sectors" viewBox="0 0 200 200">
                  <g v-for="(item, index) in effectWheel.items" :key="`sector-${index}`">
                    <path 
                      :d="getSectorPath(effectWheel.items.length, index)"
                      class="wheel__sector"
                      :class="{ 'wheel__sector--active': index === effectWheel.currentIndex }"
                    />
                  </g>
                </svg>
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
                <nuxt-img 
                  v-if="item.img"
                  :src="item.img"
                  class="wheel__item-img"
                  alt="item.name"
                />
                <div v-else class="wheel__item-content">
                  <span class="wheel__item-icon">{{ item.icon }}</span>
                  <span class="wheel__item-name">{{ item.name }}</span>
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

<script>
// Helper function to generate SVG path for sector
export default {
  methods: {
    getSectorPath(itemCount, index) {
      const angleStep = 360 / itemCount
      const startAngle = (angleStep * index - 90) * (Math.PI / 180)
      const endAngle = (angleStep * (index + 1) - 90) * (Math.PI / 180)
      const radius = 100
      const cx = 100
      const cy = 100
      
      const x1 = cx + radius * Math.cos(startAngle)
      const y1 = cy + radius * Math.sin(startAngle)
      const x2 = cx + radius * Math.cos(endAngle)
      const y2 = cy + radius * Math.sin(endAngle)
      
      const largeArc = angleStep > 180 ? 1 : 0
      
      return `M ${cx} ${cy} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2} Z`
    }
  }
}
</script>
