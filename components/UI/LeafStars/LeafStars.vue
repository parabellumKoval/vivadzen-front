<script setup lang="ts">
interface Props {
  count?: number
  maxCount?: number
  image?: string
  size?: string
}

const props = withDefaults(defineProps<Props>(), {
  count: 5,
  maxCount: 5,
  image: '/images/landing/leaf-star.png',
  size: '24px'
})

const stars = computed(() => {
  const validCount = Math.min(Math.max(0, props.count), props.maxCount)
  return Array.from({ length: props.maxCount }, (_, i) => i < validCount)
})
</script>

<template>
  <div class="leaf-stars" :style="{ '--star-size': size }">
    <div
      v-for="(isActive, index) in stars"
      :key="index"
      class="leaf-stars__item"
      :class="{ 'leaf-stars__item--active': isActive }"
    >
      <nuxt-img
        :src="image"
        :alt="`Star ${index + 1}`"
        class="leaf-stars__img"
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.leaf-stars {
  display: flex;
  align-items: center;
  gap: 4px;

  &__item {
    width: var(--star-size, 24px);
    height: var(--star-size, 24px);
    opacity: 0.3;
    filter: grayscale(100%);
    transition: opacity 0.3s ease, filter 0.3s ease;

    &--active {
      opacity: 1;
      filter: grayscale(0%);
    }
  }

  &__img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
}
</style>
