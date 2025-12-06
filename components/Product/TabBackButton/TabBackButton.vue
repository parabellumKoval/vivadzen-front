<script setup>
const props = defineProps({
  fallback: {
    type: String,
    default: '/catalog'
  }
})

const canHistoryBack = ref(false)
const router = useRouter()
const { $regionPath } = useNuxtApp()

const normalizedFallback = computed(() => {
  const value = typeof props.fallback === 'string' && props.fallback.length ? props.fallback : '/catalog'
  return value.startsWith('/') ? value : `/${value}`
})

onMounted(() => {
  if (process.client && typeof window !== 'undefined' && window.history) {
    canHistoryBack.value = window.history.length > 1
  }
})

const handleClick = () => {
  if (process.client && canHistoryBack.value) {
    router.back()
    return
  }

  const target = $regionPath ? $regionPath(normalizedFallback.value) : normalizedFallback.value
  router.push(target)
}
</script>

<template>
  <button
    type="button"
    class="tab-back-button"
    aria-label="Вернуться назад"
    @click="handleClick"
  >
    <IconCSS name="iconoir:nav-arrow-left" size="24"></IconCSS>
  </button>
</template>

<style scoped lang="scss">
.tab-back-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  color: $color-8;
  background-color: transparent;
  border: none;
  cursor: pointer;
  backdrop-filter: blur(10px);
  transition: background-color 0.3s ease;

  // &:focus-visible {
  //   outline: 2px solid rgba(255, 255, 255, 0.7);
  //   outline-offset: 2px;
  // }

  // &:active {
  //   background-color: darken(#6bb967, 6%);
  // }
}
</style>
