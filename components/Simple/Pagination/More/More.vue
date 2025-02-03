<script setup>
const props = defineProps({
  total: {
    type: Number,
    required: true
  },

  current: {
    type: Number,
    default: 1
  },

  shownPages: {
    type: Number,
    default: 3
  }
})

const emit = defineEmits([
  'update:current'
])

const {t} = useI18n()
// COMPUTEDS
// METHODS
// HANDLERS
const nextHandler = () => {
  const value = props.current + 1
  if(value <= props.total)
    emit('update:current', value)
}
// WATCHERS
</script>

<style src='./more.scss' lang='scss' scoped />
<!-- <i18n src='' lang='yaml'></i18n> -->

<template>
  <button @click="nextHandler" class="button small loadmore-btn">
    <IconCSS name="ph:arrow-counter-clockwise" size="20" ></IconCSS>
    <span>{{ t('button.load_more') }}</span>
  </button>
</template>