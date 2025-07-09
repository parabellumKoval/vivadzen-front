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
        console.log('item.values', item.values)
      if(item.id === 'order_by' && item.values) {
        console.log('order_by', item.values)
        resp.orderBy = item.values
      }
      if(item.id === 'order_dir' && item.values) {
        console.log('order_dir', item.values)
        resp.orderDir = item.values
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
            // Add to existing filter object
            // const filter = resultValue[existingFilterIndex]

            resultValue[existingFilterIndex].values.push(String(element.attr_value_id))
            // console.log('existing', resultValue[existingFilterIndex])

            // if (typeof filter.values === 'object' && !Array.isArray(filter.values)) {
            //   filter.values[key] = String(paramValue)
            // } else {
            //   // Convert to object if it was an array
            //   filter.values = { [key]: String(paramValue) }
            // }            
          }
        });
      }else {
        resultValue.push({
          id: paramName,
          values: convertValuesToStrings(paramValue)
        });
      }

      // const [, fieldName, key] = bracketMatch
      // const existingFilterIndex = resultValue.findIndex(item => item.id === fieldName)
      
      // if (existingFilterIndex === -1) {
      //   // Create new filter object if it doesn't exist
      //   resultValue.push({
      //     id: fieldName,
      //     values: { [key]: String(paramValue) }
      //   })
      // } else {
      //   // Add to existing filter object
      //   const filter = resultValue[existingFilterIndex]
      //   if (typeof filter.values === 'object' && !Array.isArray(filter.values)) {
      //     filter.values[key] = String(paramValue)
      //   } else {
      //     // Convert to object if it was an array
      //     filter.values = { [key]: String(paramValue) }
      //   }
      // }




      // console.log('initFiltersFromUrl', resultValue);
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

  // const handleBracketParams = (paramName: string, paramValue: any) => {
  //   const bracketMatch = paramName.match(/^(.*?)\[(.*?)\]/)
  //   if (!bracketMatch) return null

  //   const [, fieldName, key] = bracketMatch
  //   return {
  //     fieldName,
  //     value: { [key]: String(paramValue) }
  //   }
  // }

  const getQueryParams = () => {
    const queryParams = route.query ?? {}
    
    const currentQuery = qs.parse(qs.stringify(queryParams))
    // console.log('currentQuery', currentQuery)

    // if (Object.values(queryParams).length === 0) {
    //   return {}
    // }

    // let attrs: QueryResponse['attrs'] = []
    // let brands: string[] | null = null
    // let selections: string[] | null = null
    // let price: FilterValue | null = null

    // // Для группировки attrs[0][key]=value
    // const attrsGrouped: Record<string, any> = {}

    // for (let paramName in queryParams) {
    //   if (!queryParams.hasOwnProperty(paramName)) continue
    //   const paramValue = queryParams[paramName]
    //   if (!paramValue) continue

    //   // attrs[0][attr_id]=5
    //   const attrsMatch = paramName.match(/^attrs\[(\d+)\]\[(.+)\]$/)
    //   if (attrsMatch) {
    //     const [, idx, key] = attrsMatch
    //     if (!attrsGrouped[idx]) attrsGrouped[idx] = {}
    //     attrsGrouped[idx][key] = paramValue
    //     continue
    //   }

    //   // price[min]=100
    //   const priceMatch = paramName.match(/^price\[(.+)\]$/)
    //   if (priceMatch) {
    //     const [, key] = priceMatch
    //     price = { ...(price || {}), [key]: String(paramValue) }
    //     continue
    //   }

    //   // Brand
    //   if (paramName === 'brand') {
    //     brands = Array.isArray(paramValue)
    //       ? paramValue.map(String)
    //       : [String(paramValue)]
    //     continue
    //   }

    //   // Selections
    //   if (paramName === 'selections') {
    //     selections = Array.isArray(paramValue)
    //       ? paramValue.map(String)
    //       : [String(paramValue)]
    //     continue
    //   }
    // }

    // // Собираем attrs
    // for (const idx in attrsGrouped) {
    //   const filterObj: any = {}
    //   for (const key in attrsGrouped[idx]) {
    //     // Преобразуем числа
    //     if (['attr_id', 'attr_value_id'].includes(key)) {
    //       filterObj[key] = parseInt(attrsGrouped[idx][key])
    //     } else {
    //       filterObj[key] = attrsGrouped[idx][key]
    //     }
    //   }
    //   attrs.push(filterObj)
    // }

    const response: QueryResponse = {}
    if (currentQuery.attrs && currentQuery.attrs.length) response.attrs = currentQuery.attrs
    if (currentQuery.brand) response.brands = currentQuery.brand
    if (currentQuery.selections) response.selections = currentQuery.selections
    if (currentQuery.price) response.price = currentQuery.price

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