import qs from 'qs'

interface FilterValue {
  [key: string]: string;
}

interface Filter {
  id: string;
  values: string[] | FilterValue;
}

interface QueryResponse {
  attrs?: Array<{
    attr_id: number;
    attr_value_id?: number;
    from?: string;
    to?: string;
  }>;
  brands?: string[];
  selections?: string[];
  price?: FilterValue;
  order_by?: string | null;
  order_dir?: string | null;
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
      if(item.id === 'order_by' && item.values) {
        resp.orderBy = item.values
      }
      if(item.id === 'order_dir' && item.values) {
        resp.orderDir = item.values
      }

      return resp
    }, {orderBy: null, orderDir: null})

    return {
      'order_by': orderBy,
      'order_dir': orderDir,
    }
  })

  //
  const initFiltersFromUrl = () => {
    const resultValue: Filter[] = []

    const currentQuery = qs.parse(qs.stringify(route.query))

    for(const paramName in currentQuery) {
      if(Object.values(currentQuery).length === 0) {
        return {}
      }

      const paramValue = currentQuery[paramName]
      if (!paramValue) continue


      if(paramName === 'attrs') {

        paramValue.forEach(element => {
          const existingFilterIndex = resultValue.findIndex(item => item.id === element.attr_id)

          if (existingFilterIndex === -1) {
            resultValue.push({
              id: String(element.attr_id),
              values: element.attr_value_id? [String(element.attr_value_id)]: (element.from && element.to)? {min: element.from, max: element.to}: []
            });
          }else {
            resultValue[existingFilterIndex].values.push(String(element.attr_value_id))           
          }
        });
      }else {
        resultValue.push({
          id: paramName,
          values: convertValuesToStrings(paramValue)
        });
      }

    }

    if(resultValue.length) {
      updateModelValue(resultValue)
      return
    }

    // In other cases remove all filters from modelValue
    resetFilters()
    return []
  }

  function convertValuesToStrings(value) {
    if (value === null || typeof value !== 'object') {
      return String(value);
    }

    if (Array.isArray(value)) {
      return value.map(item => convertValuesToStrings(item));
    }

    const newObject = {};
    for (const key in value) {
      if (Object.prototype.hasOwnProperty.call(value, key)) {
        newObject[key] = convertValuesToStrings(value[key]);
      }
    }
    return newObject;
  }


  const getQueryParams = () => {
    const queryParams = route.query ?? {}
    
    const currentQuery = qs.parse(qs.stringify(queryParams))

    const response: QueryResponse = {}
    if (currentQuery.attrs && currentQuery.attrs.length) response.attrs = currentQuery.attrs
    if (currentQuery.brand) response.brands = currentQuery.brand
    if (currentQuery.selections) response.selections = currentQuery.selections
    if (currentQuery.price) response.price = currentQuery.price
    if (typeof currentQuery.order_by !== 'undefined') {
      response.order_by = Array.isArray(currentQuery.order_by)
        ? currentQuery.order_by[0]
        : currentQuery.order_by
    }
    if (typeof currentQuery.order_dir !== 'undefined') {
      response.order_dir = Array.isArray(currentQuery.order_dir)
        ? currentQuery.order_dir[0]
        : currentQuery.order_dir
    }

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
