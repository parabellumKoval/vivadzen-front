<script setup>
const props = defineProps({
  title: {
    type: String,
  },
  description: {
    type: String,
  },
  canClose: {
    type: Boolean,
    default: true
  },
  showContent: {
    type: Boolean,
    default: false
  },
  type: {
    type: String,
    default: 'default' // default and full
  },
  noPadding: {
    type: Boolean,
    default: false
  }
})

const margin = 25

// COMPUTEDS
const activeModalOptions = computed(() => {
  return useModal().active?.options
})

const minHeight = computed(() => {
  if(activeModalOptions.value?.height.min !== 'initial')
    return getPxValue(activeModalOptions.value?.height.min - margin)
  else
    return 'initial'
})

const maxHeight = computed(() => {
  if(activeModalOptions.value?.height.max !== 'initial')
    return getPxValue(activeModalOptions.value?.height.max - margin)
  else
    return 'calc(100vh - 70px)'
})

const minWidth = computed(() => {
  return getPxValue(activeModalOptions.value?.width.min)
})

const maxWidth = computed(() => {
  return getPxValue(activeModalOptions.value?.width.max)
})

// METHODS
const getPxValue = (v) => {
  if(v === undefined)
    return 'initial'
  
  if(typeof v === 'string'){
    return v
  } else {
    return v + 'px'
  }
}

// HANDLERS
const closeHandler = () => {
  if(props.canClose)
    useModal().close()
}
// Хранилище для сохранения текущей позиции прокрутки
let scrollPosition = 0;

const disableScroll = () => {
  if (process.client) {
    // 1. Сохраняем текущую позицию прокрутки
    scrollPosition = window.pageYOffset;
    
    // 2. Добавляем класс, который "фиксирует" body
    document.body.classList.add('modal-open-ios');
    
    // 3. Смещаем body вверх на сохраненную позицию, чтобы избежать "прыжка"
    document.body.style.top = `-${scrollPosition}px`;
  }
};

const enableScroll = () => {
  if (process.client) {
    // 1. Убираем фиксирующие стили
    document.body.classList.remove('modal-open-ios');
    document.body.style.top = '';
    
    // 2. Восстанавливаем сохраненную позицию прокрутки
    window.scrollTo(0, scrollPosition);
  }
};

disableScroll();

onUnmounted(() => {
  // На случай, если компонент будет удален, когда модалка открыта
  enableScroll();
});
</script>

<style src="./wrapper.scss" lang="sass" scoped />

<style lang="scss" scoped>
// @use '/assets/scss/mixins' as *;
:deep(.modal-inner) {
  @include desktop {
    max-height: v-bind(maxHeight);
    min-height: v-bind(minHeight);
    min-width: v-bind(minWidth);
    max-width: v-bind(maxWidth);
  }
}
</style> 

<template>
  <div :class="type" clickable class="wrapper">
    <div class="modal-container">
      <button @click="closeHandler" class="close-btn">
        <span class="close-btn-inner">
          <IconCSS name="ph:x" size="20" class="icon"></IconCSS>
        </span>
      </button>
      <div class="modal-inner" scrollable>
        <div v-if="title" class="title">
          {{ title }}
        </div>
        <div v-if="description" class="description">
          {{ description }}
        </div>
        <div class="modal-slot">
          <slot/>
        </div>
      </div>
    </div>
  </div>
</template>