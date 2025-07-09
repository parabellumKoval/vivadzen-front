interface FilterValue {
  [key: string]: string;
}

interface Filter {
  id: string;
  values: string[] | FilterValue;
}

interface QueryResponse {
  filters?: Array<{
    attr_id: number;
    attr_value_id?: number;
    from?: string;
    to?: string;
  }>;
  brands?: string[];
  selections?: string[];
  price?: FilterValue;
}

interface QueryParamValue {
  min?: string;
  max?: string;
}


export const useFilter = () => {
  const route = useRoute();
  const router = useRouter();

  const modelValue = useState<Filter[]>('activeFilters', () => [])

  const resetUrl = () => {
    router.push({ query: {} })
  }

  const resetFilters = () => {
    modelValue.value = []
    resetUrl()
  }

  const updateModelValue = (newModelValue: Filter[]) => {
    modelValue.value = newModelValue
  }

  const pushToModelValue = (value: Filter) => {
    modelValue.value.push(value)
  }

  // Computeds
  const activeAttrs = computed(() => {
    const excludeKeys = ['order_by', 'order_dir', 'page'];

    return modelValue.value.filter((item) => {
      if(!excludeKeys.includes(item.id)) return true
    })
  })

  const sorting = computed(() => {

    const {orderBy, orderDir} = modelValue.value.reduce((resp, item) => {
      if(item.id === 'order_by' && item.values[0]) {
        resp.orderBy = item.values[0]
      }
      if(item.id === 'order_dir' && item.values[0]) {
        resp.orderDir = item.values[0]
      }

      return resp
    }, {orderBy: 'created_at', orderDir: 'desc'})

    return {
      'order_by': orderBy,
      'order_dir': orderDir,
    }
  })

  //
  const initFiltersFromUrl = () => {
    const params = route.query
    const resultValue: Filter[] = []
    
    console.log('params', params)
    for(const paramName in params) {
      if(Object.values(params).length === 0) {
        return {}
      }

      const paramValue = params[paramName]
      if (!paramValue) continue

      // Handle parameters with square brackets (e.g. field[min], field[max], etc)
      const bracketMatch = paramName.match(/^(.*?)\[(.*?)\]/)
      if (bracketMatch) {
        const [, fieldName, key] = bracketMatch
        const existingFilterIndex = resultValue.findIndex(item => item.id === fieldName)
        
        if (existingFilterIndex === -1) {
          // Create new filter object if it doesn't exist
          resultValue.push({
            id: fieldName,
            values: { [key]: String(paramValue) }
          })
        } else {
          // Add to existing filter object
          const filter = resultValue[existingFilterIndex]
          if (typeof filter.values === 'object' && !Array.isArray(filter.values)) {
            filter.values[key] = String(paramValue)
          } else {
            // Convert to object if it was an array
            filter.values = { [key]: String(paramValue) }
          }
        }
        continue
      }

      // Handle regular parameters
      resultValue.push({
        id: paramName,
        values: Array.isArray(paramValue) 
          ? paramValue.map(String)
          : [String(paramValue)]
      })
    }

    if(resultValue.length) {
      updateModelValue(resultValue)
      return
    }

    // In other cases remove all filters from modelValue
    resetFilters()
    return []
  }


  const handleBracketParams = (paramName: string, paramValue: any) => {
    const bracketMatch = paramName.match(/^(.*?)\[(.*?)\]/)
    if (!bracketMatch) return null

    const [, fieldName, key] = bracketMatch
    return {
      fieldName,
      value: { [key]: String(paramValue) }
    }
  }

  const getQueryParams = () => {
    const queryParams = route.query ?? {}
    if(Object.values(queryParams).length === 0) {
      return {}
    }

    let filters: QueryResponse['filters'] = []
    let brands: string[] | null = null
    let selections: string[] | null = null
    let price: FilterValue | null = null

    // Group bracket parameters by their base name
    const groupedParams: { [key: string]: FilterValue } = {}

    for(let paramName in queryParams) {
      if (!queryParams.hasOwnProperty(paramName)) { 
        continue
      }
      const paramValue = queryParams[paramName]

      if(!paramValue) {
        continue;
      }

      // Handle bracket parameters
      const bracketParam = handleBracketParams(paramName, paramValue)

      if (bracketParam) {
        const { fieldName, value } = bracketParam
        groupedParams[fieldName] = { ...(groupedParams[fieldName] || {}), ...value }
        continue
      }

      // Brand
      if(paramName === 'brand') {
        brands = Array.isArray(paramValue) 
          ? paramValue.map(String)
          : [String(paramValue)]
        continue
      }

      // Selections
      if(paramName === 'selections') {
        selections = Array.isArray(paramValue)
          ? paramValue.map(String)
          : [String(paramValue)]
        continue
      }

      // console.log('paramValue', paramValue);
      // Filters
      if(Array.isArray(paramValue)) {
        for(const v of paramValue) {
          if (v !== null) {
            filters.push({
              attr_id: parseInt(paramName),
              attr_value_id: parseInt(String(v))
            })
          }
        }
      } else if(typeof paramValue === 'object' && paramValue !== null) {
        const rangeValue = paramValue as unknown as QueryParamValue
        filters.push({
          attr_id: parseInt(paramName),
          from: rangeValue?.min ?? '',
          to: rangeValue?.max ?? ''
        })
      }
    }
    
    const response: QueryResponse = {}

    // Add grouped parameters to response
    if (groupedParams.price) {
      response.price = groupedParams.price
    }

    if(filters && filters.length) response.filters = filters
    if(brands) response.brands = brands
    if(selections) response.selections = selections

    return response
  }


  return {
    activeAttrs,
    activeFilters: modelValue,
    pushToActiveFilters: pushToModelValue,
    updateActiveFilters: updateModelValue,
    getQueryParams,
    initFiltersFromUrl,
    resetFilters,
    sorting
  }
}