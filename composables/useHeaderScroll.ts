/**
 * Composable для отслеживания скролла и управления видимостью хедера
 * На мобильных: хедер скрывается при прокрутке вниз и появляется при прокрутке вверх
 */
export const useHeaderScroll = () => {
  const isVisible = ref(true)
  const headerTop = ref(60) // 0 когда хедер скрыт, 60 когда виден
  let lastScrollY = 0
  let ticking = false
  let scrollUpStartY = 0 // Позиция, с которой началась прокрутка вверх
  let scrollDownStartY = 0 // Позиция, с которой началась прокрутка вниз
  const SCROLL_THRESHOLD = 160 // Пиксели для задержки появления/скрытия хедера

  const handleScroll = () => {
    const currentScrollY = window.scrollY

    // Скрываем хедер при прокрутке вниз (с задержкой)
    if (currentScrollY > lastScrollY && currentScrollY > SCROLL_THRESHOLD) {
      scrollUpStartY = 0 // Сбросим счетчик прокрутки вверх
      if (scrollDownStartY === 0) {
        scrollDownStartY = currentScrollY // Запомним позицию, когда началась прокрутка вниз
      }
      if (currentScrollY - scrollDownStartY >= SCROLL_THRESHOLD) {
        isVisible.value = false
        headerTop.value = 0
      }
    }
    // Показываем хедер при прокрутке вверх (с задержкой)
    else if (currentScrollY < lastScrollY) {
      scrollDownStartY = 0 // Сбросим счетчик прокрутки вниз
      if (scrollUpStartY === 0) {
        scrollUpStartY = currentScrollY // Запомним позицию, когда началась прокрутка вверх
      }
      if (scrollUpStartY - currentScrollY >= SCROLL_THRESHOLD) {
        isVisible.value = true
        headerTop.value = 60
      }
    }
    // Показываем хедер если в начале страницы
    else if (currentScrollY <= SCROLL_THRESHOLD) {
      isVisible.value = true
      headerTop.value = 60
      scrollDownStartY = 0
      scrollUpStartY = 0
    }

    lastScrollY = currentScrollY
  }

  const onScroll = () => {
    if (!ticking) {
      window.requestAnimationFrame(handleScroll)
      ticking = true
    }
    ticking = false
  }

  onMounted(() => {
    if (process.client) {
      window.addEventListener('scroll', onScroll, { passive: true })
    }
  })

  onUnmounted(() => {
    if (process.client) {
      window.removeEventListener('scroll', onScroll)
    }
  })

  return {
    isVisible,
    headerTop
  }
}
