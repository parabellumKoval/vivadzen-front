<script setup>
const {activeFilters, updateActiveFilters, resetFilters} = useFilter()
const {removeFilterFromUrl} = useFilterItem()

const props = defineProps({
  filters: {
    type: Array
  }
})

const {t} = useI18n()

const selected = computed(() => {
  const values = []

  // For each selected filter
  for(const index in activeFilters.value) {
    const key = activeFilters.value[index].id
    const value = activeFilters.value[index].values

    // Find this iterration filter by ID
    let filter = props.filters.find((filter) => {
      return filter.id == key
    })

    console.log('props.filters', props.filters, key, value, filter)

    if(!filter)
      continue

    // For lists
    if(filter.type === 'checkbox' || filter.type === 'radio' || filter.type === 'brand') {

      const arrayValues = Array.isArray(value) ? value : Object.values(value)

      // For each values
      arrayValues.forEach((selectedValue) => {
        let filterValue = null

        if (Array.isArray(filter.values)) {
          filterValue = filter.values.find(v => v.id == selectedValue)
        }else {
          filterValue = Object.values(filter.values).find(v => v.id == selectedValue);
        }

        // console.log('filterValue', filterValue)

        if(filterValue === undefined || filterValue === null)
          return
        
        let filterValueName = filterValue?.value || filterValue?.name || null

        values.push({
          filterId: filter.id,
          valueId: filterValue.id,
          name: filter.name + ': ' + filterValueName
        })
      })
    }else if(filter.type === 'number') {
      values.push({
        filterId: filter.id,
        valueId: null,
        name: filter.name + ': ' + value?.min + '-' + value?.max
      })
    }
  }
  
  return values
})


const deleteHandler = (filter) => {
  const modelValueCopy = [...activeFilters.value]
  const filterModel = props.filters.find(item => item.id === filter.filterId)
  const thisModelValueIndex = modelValueCopy.findIndex((item) => {
    if(String(item.id) === String(filter.filterId)) {
      return item
    }
  })

  if(thisModelValueIndex === -1)
    return

  const paramName = modelValueCopy[thisModelValueIndex].id

  // For doubleslider, number - type etc.
  if(filterModel.type === 'number') {
    modelValueCopy.splice(thisModelValueIndex, 1)
    removeFilterFromUrl(filter.valueId, paramName);
  // For lists checkbox, radio
  }else if(filterModel.type === 'checkbox' || filterModel.type === 'radio' || filterModel.type === 'brand') {
    const valueIndex = modelValueCopy[thisModelValueIndex].values.indexOf(String(filter.valueId))

    removeFilterFromUrl(filter.valueId, paramName);
    if(valueIndex !== -1){
      modelValueCopy[thisModelValueIndex].values.splice(valueIndex, 1)

      // if no values remove property at all
      if(!modelValueCopy[thisModelValueIndex].values.length)
        modelValueCopy.splice(thisModelValueIndex, 1)
    }
  }

  updateActiveFilters(modelValueCopy)
}

const removeAllHandler = () => {
  resetFilters()
}

</script>

<style src="./selected.scss" lang="scss" scoped></style>

<template>
  <div class="filter-wrapper">
    <div class="filter-label">{{ t('label.active_filters') }}:</div>
    <div class="filter-list">
      <button @click="removeAllHandler" class="button small light filter-remove-all-btn" button>{{ t('button.reset_all') }}</button>
      <transition-group name="move-x">
        <div v-for="filter in selected" :key="filter.filterId" class="filter-item">
          <span class="filter-name">{{ filter.name }}</span>
          <button @click="deleteHandler(filter)" class="filter-remove-btn">
            <IconCSS name="iconoir:cancel"></IconCSS>
          </button>
        </div>
      </transition-group>
    </div>
  </div>
</template>