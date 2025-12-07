import { computed, ref, toValue, watch, type MaybeRefOrGetter } from 'vue'

/**
 * Ensures that image consumers such as <nuxt-img> always receive a valid string source
 * and allows providing a fallback that will be substituted if the original source
 * is empty or the request fails (error event).
 */
export function useImageFallback(
  source: MaybeRefOrGetter<string | null | undefined>,
  fallback: string = '/images/avatars/no.png'
) {
  const normalized = computed(() => {
    const value = toValue(source)
    if (typeof value === 'string') {
      const trimmed = value.trim()
      if (trimmed.length > 0) {
        return trimmed
      }
    }
    return fallback
  })

  const currentSrc = ref(normalized.value)

  watch(normalized, (value) => {
    currentSrc.value = value
  })

  const onError = () => {
    if (currentSrc.value !== fallback) {
      currentSrc.value = fallback
    }
  }

  return {
    currentSrc,
    onError,
  }
}
