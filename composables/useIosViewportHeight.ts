import { ref, onMounted, onUnmounted } from 'vue'

const getViewportHeight = () => {
  if (!process.client) return 0
  return window.visualViewport?.height ?? window.innerHeight
}

const getViewportWidth = () => {
  if (!process.client) return 0
  return window.innerWidth
}

export const useIosViewportHeight = () => {
  const viewportHeight = ref(getViewportHeight())
  const viewportWidth = ref(getViewportWidth())

  const updateViewportSize = () => {
    if (!process.client) return

    viewportHeight.value = getViewportHeight()
    viewportWidth.value = getViewportWidth()
  }

  let visualViewport: VisualViewport | null = null

  onMounted(() => {
    updateViewportSize()

    const doc = document
    window.addEventListener('resize', updateViewportSize)
    window.addEventListener('orientationchange', updateViewportSize)
    doc.addEventListener('focusin', updateViewportSize)
    doc.addEventListener('focusout', updateViewportSize)

    visualViewport = window.visualViewport
    if (visualViewport) {
      visualViewport.addEventListener('resize', updateViewportSize)
      visualViewport.addEventListener('scroll', updateViewportSize)
    }
  })

  onUnmounted(() => {
    window.removeEventListener('resize', updateViewportSize)
    window.removeEventListener('orientationchange', updateViewportSize)
    document.removeEventListener('focusin', updateViewportSize)
    document.removeEventListener('focusout', updateViewportSize)

    if (visualViewport) {
      visualViewport.removeEventListener('resize', updateViewportSize)
      visualViewport.removeEventListener('scroll', updateViewportSize)
      visualViewport = null
    }
  })

  return {
    viewportHeight,
    viewportWidth,
  }
}
