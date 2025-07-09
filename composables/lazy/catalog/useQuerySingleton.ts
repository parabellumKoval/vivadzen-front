import qs from 'qs'

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


interface QueryParam {
  [key: string]: string | number | Array<string | number> | { [key: string]: string | number };
}

let singletonInstance: ReturnType<typeof createQuery> | null = null
let globalBeforeUpdateCallback: (() => void) | undefined = undefined

function createQuery (options = {}) {
  const route = useRoute();
  const router = useRouter();

  const beforeRouterUpdate = () => {
    if (typeof globalBeforeUpdateCallback === 'function') {
      globalBeforeUpdateCallback()
    }
  }

  const resetPage = (query: any) => {
    if(query.page) delete query.page
    return query
  }

  const removeQueryParam = (paramsToRemove: Record<string, any>, isFireBeforeHook: boolean = true, isResetPage: boolean = true) => {

    const currentQuery = qs.parse(qs.stringify(route.query)) // нормализуем

    let updated = JSON.parse(JSON.stringify(currentQuery)) // глубокая копия

    for (const key in paramsToRemove) {
      const valToRemove = paramsToRemove[key]

      // Если null — удалить полностью
      if (valToRemove === null) {
        delete updated[key]
      }
      // Если простой массив или скаляр — удаляем конкретное значение
      else if (Array.isArray(updated[key]) && (typeof valToRemove === 'string' || typeof valToRemove === 'number')) {
        updated[key] = updated[key].filter((item: any) => item !== valToRemove)
        if (updated[key].length === 0) delete updated[key]
      }

      // Если в updated[key] массив объектов и valToRemove — объект для сравнения
      else if (Array.isArray(updated[key]) && typeof valToRemove === 'object') {
        updated[key] = updated[key].filter((item: any) => {
          // Если valToRemove содержит несколько ключей — ищем полное соответствие подмножества
          for (const innerKey in valToRemove) {
            if (item[innerKey] !== valToRemove[innerKey]) {
              return true // не совпало — оставляем
            }
          }
          return false // совпало — удаляем
        })
        if (updated[key].length === 0) delete updated[key]
      }

      // Если updated[key] — объект, valToRemove — объект => сравнение по ключам
      else if (typeof updated[key] === 'object' && typeof valToRemove === 'object') {
        const keysToRemove = Object.keys(valToRemove)
        for (const subKey of keysToRemove) {
          if (updated[key]?.[subKey] === valToRemove[subKey]) {
            delete updated[key][subKey]
          }
        }
        if (Object.keys(updated[key]).length === 0) delete updated[key]
      }
    }

    if(isResetPage) updated = resetPage(updated)

    // Финально превращаем в плоскую структуру
    const flatQuery = flattenQuery(updated)

    if(isFireBeforeHook) beforeRouterUpdate()
      
    router.push({ query: flatQuery })
  }


  function flattenQuery(obj: any, prefix = ''): Record<string, any> {
    let result: Record<string, any> = {}

    for (const key in obj) {
      const value = obj[key]
      const fullKey = prefix ? `${prefix}[${key}]` : key

      if (value !== null && typeof value === 'object' && !(value instanceof Date)) {
        result = { ...result, ...flattenQuery(value, fullKey) }
      } else {
        result[fullKey] = value
      }
    }

    return result
  }

  function isObject(val: any) {
    return val && typeof val === 'object' && !Array.isArray(val)
  }

  /**
   * Рекурсивное объединение с правильной обработкой массивов
   */
  function deepMerge(target: any, source: any): any {
    if (Array.isArray(target) && Array.isArray(source)) {
      const merged = [...target]
      for (const item of source) {
        // Добавляем только уникальные значения (по JSON.stringify — можно заменить)
        if (!merged.some(existing => JSON.stringify(existing) === JSON.stringify(item))) {
          merged.push(item)
        }
      }
      return merged
    }

    if (isObject(target) && isObject(source)) {
      const result: Record<string, any> = { ...target }
      for (const key in source) {
        if (key in target) {
          result[key] = deepMerge(target[key], source[key])
        } else {
          result[key] = source[key]
        }
      }
      return result
    }

    // Иначе — перезапись
    return source
  }

const addOrUpdateQueryParams = (
    newQueryParams: QueryParam,
    replaceExisting: boolean = false,
    isFireBeforeHook: boolean = true,
    isResetPage: boolean = true
  ) => {
    // 1. Преобразуем текущие query-параметры в нормальный объект
    const currentQuery = qs.parse(qs.stringify(route.query)) // нормализация вложенности

    // 2. Глубокий merge
    let mergedQuery = deepMerge(currentQuery, newQueryParams)

    if (isResetPage) mergedQuery = resetPage(mergedQuery);

    // 3. Преобразуем обратно в плоский объект вида: { 'a[b][c]': 1 }
    const flatQuery = flattenQuery(mergedQuery)

    if (isFireBeforeHook) beforeRouterUpdate();

    router.push({ query: flatQuery })
  };

 
  // function flattenQuery(obj: any, prefix = ''): Record<string, any> {
  //   let result: Record<string, any> = {}

  //   for (const key in obj) {
  //     const value = obj[key]
  //     const fullKey = prefix ? (Array.isArray(obj) ? `${prefix}[${key}]` : `${prefix}[${key}]`) : key

  //     if (value !== null && typeof value === 'object' && !(value instanceof Date)) {
  //       result = { ...result, ...flattenQuery(value, fullKey) }
  //     } else {
  //       result[fullKey] = value
  //     }
  //   }

  //   return result
  // }


  return {
    addOrUpdateQueryParams,
    removeQueryParam,
    setBeforeUpdateCallback: (cb: () => void) => { globalBeforeUpdateCallback = cb }
  }
}


export const useQuerySingleton = (options = {}) => {
  if (!singletonInstance) {
    singletonInstance = createQuery(options)
  }

  if (options?.beforeUpdateCallback) {
    singletonInstance.setBeforeUpdateCallback(options.beforeUpdateCallback)
  }
  return singletonInstance
}