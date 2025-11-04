<script>
export default {
  props: {
    modelValue: { type: Number, default: 1 },
    min: { type: Number, default: 1 },
    max: { type: Number, default: 999999 },
    size: { type: String, default: 'medium' }
  },
  data() {
    return {
      localValue: this.modelValue
    }
  },
  watch: {
    modelValue(val) {
      this.localValue = val
    },
    localValue(val) {
      this.$emit('update:modelValue', val)
    }
  },
  methods: {
    minusHandler() {
      if (this.localValue > this.min) this.localValue--
    },
    plusHandler() {
      if (this.localValue < this.max) this.localValue++
    },
    updateHandler(e) {
      let val = parseInt(e.target.value, 10)
      if (isNaN(val) || val < this.min) val = this.min
      if (val > this.max) val = this.max
      this.localValue = val
    }
  }
}
</script>

<template>
  <div :class="['amount', size]">
    <button @click="minusHandler" :class="{disabled: localValue <= min}" type="button" class="btn">
      <IconCSS name="fluent:subtract-20-regular" class="icon" />
    </button>
    <input
      :value="localValue"
      @input="updateHandler"
      type="number"
      :min="min"
      :max="max"
      step="1"
      class="calc-input"
    />
    <button @click="plusHandler" :class="{disabled: localValue >= max}" type="button" class="btn">
      <IconCSS name="fluent:add-20-regular" class="icon" />
    </button>
  </div>
</template>

<style src="./amount.scss" lang="postcss" scoped />