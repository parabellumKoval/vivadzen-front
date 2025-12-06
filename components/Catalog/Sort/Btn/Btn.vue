<script setup>
const emit = defineEmits(['update'])
const {sorting: initSorting} = useFilter()

const props = defineProps({
  sortings: {
    type: Array,
    default: () => []
  },
})

const sortingOptions = computed(() => props.sortings ?? [])

const sortSelectedIndex = ref(0)
const isSyncingSelection = ref(false)

const setIndexWithActiveSorting = () => {
  const { order_by, order_dir } = initSorting.value
  const index = sortingOptions.value.findIndex((option) => {
    return option.by === order_by && option.dir === order_dir
  })

  sortSelectedIndex.value = index !== -1 ? index : 0
}

watch([
  sortingOptions,
  initSorting,
], () => {
  isSyncingSelection.value = true
  setIndexWithActiveSorting()
  isSyncingSelection.value = false
}, {
  immediate: true
})

watch(sortSelectedIndex, (value) => {
  if (isSyncingSelection.value) return

  const selectedOption = sortingOptions.value[value]

  if (!selectedOption) return

  emit('update', {
    order_by: selectedOption.by ?? null,
    order_dir: selectedOption.dir ?? null,
  })
})
</script>

<style src="./btn.scss" lang="sass" scoped />

<template>
  <div class="sorting-wrapper">
    <button class="button mini light sorting-btn">
      <IconCSS name="iconoir:sort-down" class="inline-icon"></IconCSS>
      <span>{{ sortingOptions[sortSelectedIndex]?.name }}</span>
    </button>
    <select v-model="sortSelectedIndex" class="sorting-select">
      <option
        v-for="(srt, key) in sortingOptions" 
        :key="key"
        :value="key"
      >
        {{ srt.name }}
      </option>
    </select>
  </div>
</template>
