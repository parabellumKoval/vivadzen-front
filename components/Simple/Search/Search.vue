<script setup>
const {t} = useI18n()
const props = defineProps({
  modelValue: {
    type: String
  },
  btnLabel: {
    default: null
  },
  isCloseBtn: {
    default: true
  }
})

const emit = defineEmits([
  'update:modelValue',
  'input:focus',
  'input:blur',
  'close',
  'btn:click'
])

const inputField = ref(null)
const inFocus = ref(false)

// COMPUTEDS
// METHODS
// HANDLERS
const updateHandler = ($event) => {
  emit('update:modelValue', $event.target.value)
}
const focusHandler = () => {
  inFocus.value = true
  emit('input:focus')
}

const blurHandler = () => {
  setTimeout(() => {
    inFocus.value = false
    emit('input:blur')
  }, 50)
}
const closeHandler = () => {
  emit('close')  
  inFocus.value = false
}
const goToSearchPage = () => {
  emit('btn:click')
  inFocus.value = false
}

// WATCHERS
watch(inputField, (val) => {
  if(val && !useDevice().isMobile) {
    val.focus()
  }
})

const setFocus = () => {
  inputField.value?.focus()
}

//
defineExpose({blurHandler, setFocus})
</script>

<style src='./search.scss' lang='scss' scoped></style>
<i18n src='./lang.yaml' lang='yaml'></i18n>

<template>
  <div :class="{active: inFocus, 'no-close-btn': !isCloseBtn}" class="search">
    <div class="search-inner" type="button" clickable>
      <div class="search-input-wrapper">
        <IconCSS name="iconoir:search" size="20px" class="search-input-icon"></IconCSS>
        <input
          ref="inputField"
          :value="props.modelValue"
          @input="updateHandler"
          @focus="focusHandler"
          @blur="blurHandler"
          @keyup.enter="goToSearchPage"
          :placeholder="t('title.search')"
          class="search-input"
        />
      
        <div class="right-slot">
          <slot name="right"></slot>
        </div>
      </div>

      <button @click="closeHandler" v-if="$device.isMobile && isCloseBtn" class="search-close">
        <IconCSS name="iconoir:cancel"  class="search-close-icon"></IconCSS>
      </button>
      <button @click="goToSearchPage" class="search-action">
        <IconCSS v-if="$device.isMobile" name="iconoir:search" class="search-action-icon"></IconCSS>
        <span v-else-if="!$device.isMobile" class="search-action-text">{{ btnLabel || t('find') }}</span>
      </button>
    </div>
  </div>
</template>