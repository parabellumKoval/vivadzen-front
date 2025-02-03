<script setup>
const {t} = useI18n()

const props = defineProps({
  items: {
    type: Array
  }
})

const list = ref(null)
const scrollLeft = ref(0)

// COMPUTED
const maxRight = computed(() => {
  if(!list.value)
    return 0;

  return list.value.scrollWidth - list.value.clientWidth
})

// METHODS
const getValue = (value) => {
  if(Array.isArray(value)) {
    return value.map(item => item.value).join(', ')
  }else {
    return value
  }
}
const setOffset = (e) => {
  scrollLeft.value = e.target.scrollLeft 
}

// HANDLERS
const scrollLeftHandler = () => {
  const maxLeft = list.value.scrollWidth - list.value.clientWidth
  list.value.scrollLeft = maxLeft
}

const scrollRightHandler = () => {
  list.value.scrollLeft = 0
}

</script>

<style src="./horizontal.scss" lang="scss" scoped></style>

<template>
  <div class="params">
    <button v-if="scrollLeft > 0" @click="scrollRightHandler" class="left-btn nav-btn">
      <IconCSS name="iconoir:nav-arrow-left" class="icon"></IconCSS>
    </button>
    <ul @scroll="setOffset" class="list" ref="list">
      <li v-for="(item, index) in items" :key="index" class="list-item">
        <span class="list-label">{{ item.name }}</span>
        <span class="list-value">{{ getValue(item.value) }}</span>
      </li>
    </ul>
    <button v-if="scrollLeft / maxRight < 1" @click="scrollLeftHandler" class="right-btn nav-btn">
      <IconCSS name="iconoir:nav-arrow-right" class="icon"></IconCSS>
    </button>
  </div>
</template>