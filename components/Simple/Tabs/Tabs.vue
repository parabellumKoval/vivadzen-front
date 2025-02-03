<script setup>
const props = defineProps({
  modelValue: {
    type: [String, Number]
  },

  values: {
    type: Array
  },

  valueKey: {
    type: String,
    default: null
  },

  value: {
    type: String,
    default: null
  }
})

const emit = defineEmits([
  'update:modelValue'
])

const activeIndex = ref(0)

const selectHandler = (index) => {
  if(props.valueKey)
    emit('update:modelValue', props.values[index][props.valueKey])
  else
    emit('update:modelValue', index) 
}

const isTabActive = (tab, index) => {
  if(props.valueKey) {
    return tab[props.valueKey] === activeIndex.value
  }else {
    return index == activeIndex.value
  }
}

watch(() => props.modelValue, (v) => {
  activeIndex.value = v
}, {
  immediate: true
})
</script>

<style src="./tabs.scss" lang="sass" scoped />

<template>
  <div class="tabs" scrollable>
    <div class="tabs-container">
      <ul class="list" scrollable>
        <li
          v-for="(tab, index) in values"
          :key="index"
          @click="selectHandler(index)"
          :class="[{active: isTabActive(tab, index)}, {disabled: tab.disabled}]"
          class="item"
          clickable
          scrollable
          v-html="tab[value] || tab "
        >
        </li>
      </ul>
    </div>
  </div>
</template>