<script setup>
const props = defineProps({
  filter: {
    type: Object
  },

  meta: {
    type: Object,
    default: () => {min: 0; max: 0}
  },
})


const {updateRangeValue, thisFilter} = useFilterItem(props.filter.id)

const limits = ref([props.meta.min || props.filter?.values?.min, props.meta.max || props.filter?.values?.max])
const value = ref([thisFilter.value?.values?.min || props.meta?.min, thisFilter.value?.values?.max || props.meta?.max])
const timeout = ref(null)
const fixValue = ref(false)
const preventUpdate = ref(false)

// HANDLERS
const changeHandler = (v) => {}

const setHandler = (v) => {
  fixValue.value = true
  clearTimeout(timeout.value)
  
  timeout.value = setTimeout(() => {
    updateRangeValue(v)
  }, 1000)
}

// WATCHERS
watch(value, (v) => {
  if(preventUpdate.value) {
    preventUpdate.value = false
    return
  }

  setHandler(v)
}, {
  deep: true,
})


// This need to reset modelValue when filter is removed from selectedFilters
watch(thisFilter, (v) => {
  if(v === undefined) {
    preventUpdate.value = true
    value.value = [limits.value[0], limits.value[1]]
  }
}, {
  deep: true
})

watch(() => props.meta, (v) => {
  limits.value = [v.min, v.max]
}, {
  deep: true,
})
</script>

<style src="./doubleslider.scss" lang="scss" scoped />
<style src="./style.scss" lang="scss" />
<style src="@vueform/slider/themes/default.css"></style>

<template>
  <div class="slider-wrapper">
    <form-slider-double v-model="value" :min="limits[0]" :max="limits[1]"></form-slider-double>
  </div>
</template>