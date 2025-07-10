

<script setup>
import { ref, watch, computed, onBeforeUnmount } from 'vue'

const props = defineProps({
  min: { type: Number, default: 0 },
  max: { type: Number, default: 100 },
  step: { type: Number, default: 1 },
  modelValue: {
    type: Array,
    default: () => [20, 80],
  },
})

const emit = defineEmits(['update:modelValue'])

const slider = ref(null)
const dragging = ref(null)
const internalValue = ref([...props.modelValue])
const inputMin = ref(internalValue.value[0])
const inputMax = ref(internalValue.value[1])

watch(() => props.modelValue, (val) => {
  internalValue.value = [...val]
  inputMin.value = val[0]
  inputMax.value = val[1]
})

watch(internalValue, ([minVal, maxVal]) => {
  inputMin.value = minVal
  inputMax.value = maxVal
})


watch(() => props.min, (v) => {
  internalValue.value[0] = v
  inputMin.value = v
})

watch(() => props.max, (v) => {
  internalValue.value[1] = v
  inputMax.value = v
})

const leftPercent = computed(() => getPercent(internalValue.value[0]))
const rightPercent = computed(() => getPercent(internalValue.value[1]))
const widthPercent = computed(() => rightPercent.value - leftPercent.value)

function getPercent(val) {
  return ((val - props.min) / (props.max - props.min)) * 100
}

let sliderRect = null

function startDrag(type, event) {
  dragging.value = type
  sliderRect = slider.value.getBoundingClientRect()
  window.addEventListener('mousemove', onMouseMove)
  window.addEventListener('mouseup', stopDrag)
}

function snapToStep(val) {
  const step = props.step
  const base = props.min
  return Math.round((val - base) / step) * step + base
}

function onMouseMove(e) {
  if (!sliderRect || !dragging.value) return
  const x = e.clientX - sliderRect.left
  const percent = x / sliderRect.width
  let rawVal = props.min + percent * (props.max - props.min)
  let clamped = Math.min(Math.max(rawVal, props.min), props.max)
  clamped = snapToStep(clamped)

  if (dragging.value === 'min') {
    internalValue.value[0] = Math.min(clamped, internalValue.value[1])
  } else {
    internalValue.value[1] = Math.max(clamped, internalValue.value[0])
  }

  emit('update:modelValue', [...internalValue.value])
}

function stopDrag() {
  dragging.value = null
  window.removeEventListener('mousemove', onMouseMove)
  window.removeEventListener('mouseup', stopDrag)
}

function onInputChange(type) {
  const minVal = snapToStep(inputMin.value)
  const maxVal = snapToStep(inputMax.value)

  if (type === 'min') {
    const newMin = Math.min(Math.max(minVal, props.min), internalValue.value[1])
    internalValue.value[0] = newMin
  } else {
    const newMax = Math.max(Math.min(maxVal, props.max), internalValue.value[0])
    internalValue.value[1] = newMax
  }

  emit('update:modelValue', [...internalValue.value])
}
</script>

<style src="./double.scss" lang="scss" scoped />

<template>
  <div class="custom-slider-wrapper">
    <div class="input-wrapper">
      <input
        type="number"
        v-model.number="inputMin"
        @input="onInputChange('min')"
        :min="props.min"
        :max="internalValue[1]"
        :step="props.step"
         class="input-form"
      />
      <div class="input-line"></div>
      <input
        type="number"
        v-model.number="inputMax"
        @input="onInputChange('max')"
        :min="internalValue[0]"
        :max="props.max"
        :step="props.step"
         class="input-form"
      />
    </div>

    <div class="custom-slider" ref="slider">
      <div class="track"></div>
      <div
        class="range"
        :style="{ left: `${leftPercent}%`, width: `${widthPercent}%` }"
      ></div>
      <div
        class="thumb left-thumb"
        :style="{ left: `${leftPercent}%` }"
        @mousedown.prevent="startDrag('min', $event)"
      ></div>
      <div
        class="thumb right-thumb"
        :style="{ left: `${rightPercent}%` }"
        @mousedown.prevent="startDrag('max', $event)"
      ></div>
    </div>
  </div>
</template>
