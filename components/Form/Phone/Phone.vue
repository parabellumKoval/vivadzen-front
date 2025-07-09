<script setup>
const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  },
  placeholder: {
    type: String,
    default: '+38 (0XX) XXX-XX-XX'
  },
  required: {
    type: Boolean,
    default: false
  },
  error: {
    type: [Object, Array, String, Boolean],
    default: false
  },
  isDisabled: {
    type: Boolean,
    default: false
  },
  readonly: {
    type: Boolean,
    default: false
  },
  type: {
    type: String,
    default: 'tel'
  }
});

const emit = defineEmits(['update:modelValue', 'focused', 'blured']);

// const phone = ref('');
const onFocus = ref(false);

// COMPUTED
const placeholderDinamic = computed(() => {
  if(onFocus.value) {
    return '+38 (0XX) XXX-XX-XX';
  }else {
    return props.placeholder;
  }
})
const phone = computed({
  get: () => props.modelValue,
  set: (value) => {
    if (props.isDisabled || props.readonly) return;
    emit('update:modelValue', value);
  }
});

// HANDLERS
const keydownHandler = (event) => {
  console.log('keydownHandler', event);
  const key = event.key
  let originValue = event.target.value
  let value = '';

  const isInitKey = ['+', '3', '8', '0'].includes(key)

  if(key === 'Backspace') {
    value = originValue.slice(0, -1);

    if(originValue.length <= 6) {
      phone.value = '';
      return
    }

    if (originValue.length === 10) {
      phone.value = value.slice(0, -2);
      event.preventDefault()
    }else if (originValue.length === 14 || value.length === 16) {
      phone.value = value.slice(0, -1);
      event.preventDefault()
    }

  }else if(/[\d]/.test(key)) {
    value = originValue + key

    if (originValue.length === 7) {
      phone.value = value  + ') '
      event.preventDefault()
    }else if(originValue.length === 12 || originValue.length === 15) {
      phone.value = value + '-'
      event.preventDefault()
    }
  }else {
    event.preventDefault()
  }

  if(!value.startsWith('+38 (0')) {
    phone.value = '+38 (0';
    if(isInitKey) event.preventDefault()
  }

  if(value.length >= 20) {
    event.preventDefault()
  }
}


const changeHandler = (event) => {
  // if (props.isDisabled || props.readonly) return;
  console.log('changeHandler', event);

  const value = event.target.value;
  phone.value = value;
  // const raw = value.replace(/\D/g, '');
  // // console.log('changeHandler', value, raw);
  // // emit('update:modelValue', value);
};

const focusHandler = () => {
  if (props.isDisabled || props.readonly) return;

  onFocus.value = true;
};

const blurHandler = () => {
  onFocus.value = false;
};

// if (props.modelValue) {
//   phone.value = JSON.parse(JSON.stringify(props.modelValue));
// } else {
//   phone.value = '';
// }
</script>

<style src="./phone.scss" lang="sass" scoped />

<template>
  <form-text
    :model-value="phone"
    @keydown="(event) => keydownHandler(event)"
    @keyup="(event) => changeHandler(event)"
    @focused="focusHandler"
    @blured="blurHandler"
    :placeholder="placeholderDinamic"
    :required="required"
    :error="error"
    :is-disabled="isDisabled"
  ></form-text>
  <!-- <div
    :class="{
      error: error && error.length,
      disabled: isDisabled
    }"
    class="input__wrapper"
  >
    <input
      :value="phone"
      :id="id"
      @keydown="onKeydown"
      @keyup="changeHandler"
      @focus="focusHandler"
      @blur="blurHandler"
      :placeholder="placeholderDinamic"
      :readonly="readonly"
      :type="type"
      class="main-input"
    >

    <div class="right">
      <slot name="right"></slot>
    </div>
    
    <form-error :error="error"></form-error>

  </div> -->
</template>