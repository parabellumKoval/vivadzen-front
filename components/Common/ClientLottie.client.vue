<script setup lang="ts">
import { ref, useAttrs } from 'vue'
import { Vue3Lottie } from 'vue3-lottie'

const props = defineProps({
  animationLink: {
    type: String,
    required: true,
  },
  width: {
    type: [String, Number],
    default: '100%',
  },
  height: {
    type: [String, Number],
    default: 'auto',
  },
  loop: {
    type: [Boolean, Number],
    default: false,
  },
  autoPlay: {
    type: Boolean,
    default: false,
  },
})

const attrs = useAttrs()
const inner = ref<InstanceType<typeof Vue3Lottie> | null>(null)

defineExpose({
  goToAndPlay: (...args: unknown[]) => inner.value?.goToAndPlay?.(...args),
  play: (...args: unknown[]) => inner.value?.play?.(...args),
  pause: (...args: unknown[]) => inner.value?.pause?.(...args),
  stop: (...args: unknown[]) => inner.value?.stop?.(...args),
})
</script>

<template>
  <Vue3Lottie
    ref="inner"
    v-bind="props"
    v-bind="attrs"
  />
</template>
