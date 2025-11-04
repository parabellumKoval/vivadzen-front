<script>
export default {
  data() {
    return {
      parts: [
        null,
        null,
        null,
        null
      ]
    }
  },

  props: {
    modelValue: {
      type: String
    },
    placeholder: {
      type: String
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
    }
  },

  computed: {
    isActive() {
      return this.onFocus || this.modelValue?.length
    },
  },

  methods: {
    focusHandler(thisIndex) {
      let index = this.parts.findIndex(item => item === null || item === '')
      const thisLength = this.parts[thisIndex] && this.parts[thisIndex].toString().length
      
      if(index !== -1 && !thisLength)
        this.$refs.input[index].focus()
    },

    validate(key) {
      const thisLength = this.parts[key].toString().length

      if(thisLength > 4){
        this.parts[key] = Math.floor(this.parts[key] / 10)
      }

      if(thisLength == 4) {
        this.$refs.input[key + 1] && this.$refs.input[key + 1].focus()
      }

      if(thisLength == 0) {
        this.$refs.input[key - 1] && this.$refs.input[key - 1].focus()
      }
    }
  },

  watch: {
    modelValue: {
      handler(val) {
        if(val === null)
          return

        val.split(' ').forEach((item, index) => {
          this.parts[index] = item
        })
      },
      immediate: true
    },

    parts: {
      handler(val) {
        this.$emit('update:modelValue', val.join(' '))
      },
      deep: true
    }
  }
}
</script>

<style src="./bank-card.scss" lang="sass" scoped />

<template>
  <div :class="{error: error, disabled: isDisabled}" class="input__wrapper">

    <div class="parts">
      <input
        v-for="(part, index) in parts"
        :key="index"
        v-model="parts[index]"
        @input="validate(index)"
        @click="focusHandler(index)"
        ref="input"
        type="number"
        min="1000"
        max="9999"
        placeholder="XXXX"
        class="part-input"
      />
    </div>

    <form-error :error="error"></form-error>

  </div>
</template>