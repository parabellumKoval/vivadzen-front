<script setup>
const {t} = useI18n()

const props = defineProps({
  data: {
    type: Object,
    default: {}
  },
  sortings: {
    type: Array,
    default: () => []
  },
  updateOrderCallback: {
    default: null
  },
})

const {activeFilters, sorting: initSorting} = useFilter()

const sortSelectedIndex = ref(0)
const isSyncingSelection = ref(false)

const activeFiltersLength = computed(() => {
  return activeFilters.value?.length || null
})

const sortingOptions = computed(() => {
  return (props.sortings || []).map((option) => ({
    ...option,
    caption: option.caption ?? option.name ?? option.id ?? '',
    name: option.name ?? option.caption ?? option.id ?? '',
  }))
})

const setIndexFromActiveSorting = () => {
  const { order_by, order_dir } = initSorting.value
  const index = sortingOptions.value.findIndex((option) => (
    option.by === order_by && option.dir === order_dir
  ))

  sortSelectedIndex.value = index !== -1 ? index : 0
}

watch([
  sortingOptions,
  initSorting,
], () => {
  isSyncingSelection.value = true
  setIndexFromActiveSorting()
  isSyncingSelection.value = false
}, {
  immediate: true
})

const openFiltersHandler = () => {
  const component = defineAsyncComponent(() => import('~/components/Modal/Filters/Filters.vue'))
  useModal().open(component, props.data, null, { closeOnRouteChange: false })
}

watch(sortSelectedIndex, (value) => {
  if (isSyncingSelection.value) return

  const selectedOption = sortingOptions.value[value]

  if (!selectedOption || !props.updateOrderCallback) return

  props.updateOrderCallback({
    order_by: selectedOption.by ?? null,
    order_dir: selectedOption.dir ?? null,
  })
})
</script>

<style src='./buttons.scss' lang='scss' scoped></style>

<template>
  <div class="buttons-fixed">
    <button @click="openFiltersHandler" class="button color-dark lowcase buttons-fixed-btn filter-btn">
      <IconCSS name="iconoir:filter" size="20" class="inline-icon"></IconCSS>
      <span>
        {{ t('button.filters') }} 
        <template v-if="activeFiltersLength !== null">
          ({{ activeFiltersLength }})
        </template>
      </span>
    </button>

    <div class="sorting-wrapper">
      <button class="button secondary lowcase buttons-fixed-btn sorting-btn">
        <IconCSS name="iconoir:filter-list" size="20" class="inline-icon"></IconCSS>
        <span>{{ t('button.sorting') }}</span>
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

  </div>
</template>
