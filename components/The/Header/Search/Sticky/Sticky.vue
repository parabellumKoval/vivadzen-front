<script setup>
const {t} = useI18n()
const lastScroll = ref(0)
const isActive = ref(true)
const isFocus = ref(false)
const search = ref(null)
// COMPUTEDS
// METHODS
const scrollHandler = (e) => {

  if(isFocus.value) {
    isActive.value = true
    return
  }

  if(lastScroll.value < window.scrollY || window.scrollY <= 3) {
    isActive.value = false
  }else {
    isActive.value = true
  }

  lastScroll.value = window.scrollY

}
// HANDLERS
const focusHandler = () => {
  isFocus.value = true
}
const blurHandler = () => {
  isFocus.value = false
}

// WATCHERS
onBeforeUnmount(() => {
  nextTick().then(() => {
    window.removeEventListener('scroll', scrollHandler)
  })
})

onMounted(() => {
  nextTick().then(() => {
    window.addEventListener('scroll', scrollHandler);
  })
})
</script>

<style src='./sticky.scss' lang='scss' scoped></style>
<i18n src='./lang.yaml' lang='yaml'></i18n>

<template>
  <div :class="[{hide: !isActive}, {focus: isFocus}]" class="search-wrapper">
    <div class="search-inner" clickable>
      <lazy-the-header-search-modal></lazy-the-header-search-modal>
    </div>
    <!-- <div class="search-inner" clickable>
      <IconCSS name="iconoir:search" size="20px" class="search-input-icon"></IconCSS>
      <input
        v-model="search"
        @focus="focusHandler"
        @blur="blurHandler"
        :placeholder="t('placeholder')"
        class="search-input"
      />
    </div>

    <transition name="opacity">
      <lazy-the-header-search-modal
        v-if="true"
        :search-input="search"
      ></lazy-the-header-search-modal>
    </transition> -->
  </div>
</template>