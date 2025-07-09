<script setup>
const initialSortSelectedIndex = ref(0)
const sort = ref({order_by: 'created_at', order_dir: 'desc'})
const emit = defineEmits(['update'])
const {options: useSortOptions} = useSort()
const {sorting: initSorting} = useFilter()

const props = defineProps({
  sortings: {
    type: Array,
    default: null
  },
})

const sortingOptions = computed(() => {
  if(props.sortings) {
    return props.sortings
  }else {
    return useSortOptions.value
  }
})

const setInitialState = () => {
  if(initSorting.value) {
    const index = sortingOptions.value.findIndex((srt) => {
      return srt.by === initSorting.value.order_by && srt.dir === initSorting.value.order_dir
    })

    if(index !== -1) {
      initialSortSelectedIndex.value = index
    }
  }
}

setInitialState()

const sortSelectedIndex = ref(initialSortSelectedIndex);

watch(sortSelectedIndex, (v) => {
  if(sortingOptions.value[v]) {
    sort.value = {
      order_by: sortingOptions.value[v].by,
      order_dir: sortingOptions.value[v].dir
    }

    emit('update', sort.value)
  }
}, {
  immediate: false
})
</script>

<style src="./btn.scss" lang="sass" scoped />

<template>
  <div class="sorting-wrapper">
    <button class="button mini light sorting-btn">
      <IconCSS name="iconoir:sort-down" class="inline-icon"></IconCSS>
      <span>{{ sortingOptions[sortSelectedIndex]?.caption }}</span>
    </button>
    <select v-model="sortSelectedIndex" class="sorting-select">
      <option
        v-for="(srt, key) in sortingOptions" 
        :key="key"
        :value="key"
      >
        {{ srt.caption }}
      </option>
    </select>
  </div>
</template>