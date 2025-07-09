// Кэшируем результат импорта useQuerySingleton
import { useLazyComposable } from '~/composables/useLazyComposable';

export const useFilterItem = (filterId: string) => {

  const {activeFilters, pushToActiveFilters} = useFilter()

  const {removeQueryParam, addOrUpdateQueryParams } = useLazyComposable(
    'useQuerySingleton',
    ['removeQueryParam', 'addOrUpdateQueryParams']
  );


  // const { useQuerySingleton } = await import('~/composables/lazy/catalog/useQuerySingleton.ts');
  // COMPUTEDS
  const thisFilter = computed(() => {
    return activeFilters.value.find((item) => {
      return String(item.id) === String(filterId)
    })
  })

  const isUpdateMetaBlocked = computed(() => {
    // cant be blocked if no selected filters at all
    if(!activeFilters.value)
      return false 

    // find index of this filter in selected array
    const index = activeFilters.value.findIndex((item) => {
      return item.id === filterId 
    })

    // Blocked if it was last added filter in selected array
    if(index !== -1 && (index + 1) === activeFilters.value.length){
      return true
    }else {
      return false
    }
  })
  

  // METHODS
  const isValueChecked = (valueId: string | number, classV = null) => {
    if(!thisFilter.value?.values || !Array.isArray(thisFilter.value.values))
      return false

    const isSet = thisFilter.value.values.indexOf(String(valueId)) !== -1
    return isSet
  }

  const updateRangeValue = (data: [number, number]) => {
    const filter = thisFilter.value
    const paramValue = {
      min: String(data[0]), 
      max: String(data[1])
    }

    if(!filter) {
      pushToActiveFilters({
        id: filterId,
        values: paramValue
      })
    } else {
      filter.values = paramValue
    }
    
    addFilterToUrl(paramValue)

    return activeFilters.value
  }

  const updateCheckboxValue = (data: string | number) => {
    const filter = thisFilter.value
    const stringData = String(data)

    // if this filter not exists inside selected yet
    if(!filter) {
      pushToActiveFilters({
        id: filterId,
        values: [stringData]
      })

      addFilterToUrl(stringData)
    // if filter already exists
    } else if (Array.isArray(filter.values)) {
      const findIndex = filter.values.indexOf(stringData)

      // Add
      if(findIndex === -1) {
        filter.values.push(stringData)
        addFilterToUrl(stringData)
      // Remove
      } else {
        filter.values.splice(findIndex, 1)
        removeFilterFromUrl(stringData)
      } 
    }
  }

  const removeFilterFromUrl = (data: any, id: string | null = null) => {
    const key = id ?? filterId
    let query = null

    if(!Number.isNaN(Number(key))) {
      let attrs = {attr_id: key}

      if(data) {
        attrs['attr_value_id'] = String(data)
      }

      query = {
        attrs
      }
    }else {
      query = {
        [key]: String(data)
      }
    }

    removeQueryParam.value(query)
  }

  const addFilterToUrl = (data: any) => {
    let query = null
    if(Number.isInteger(filterId)) {

      let attr = {attr_id: filterId}

      if(data.min && data.max) {
        attr['from'] = data.min
        attr['to'] = data.max
      }else {
        attr['attr_value_id'] = data
      }
      
      query = {
        attrs: [attr]
      }
    }else {
      query = {
        [filterId]: filterId === 'price'? data: [data]
      }
    }

    
    addOrUpdateQueryParams.value(query)
  }

  return {
    thisFilter,
    isValueChecked,
    updateRangeValue,
    updateCheckboxValue,
    removeFilterFromUrl
  }
}