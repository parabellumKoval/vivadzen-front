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

  const removeQueryParam = (paramToRemove: string | QueryParam, isFireBeforeHook: boolean = true, isResetPage: boolean = true) => {
    const currentQueryParams = { ...route.query }
    let updatedQueryParams = { ...currentQueryParams }

    if (typeof paramToRemove === 'string') {
      // Remove the main parameter and any nested parameters
      const paramPrefix = `${paramToRemove}[`
      Object.keys(updatedQueryParams).forEach(key => {
        if (key === paramToRemove || key.startsWith(paramPrefix)) {
          delete updatedQueryParams[key]
        }
      })
    } else if (typeof paramToRemove === 'object' && paramToRemove !== null) {
      const key = Object.keys(paramToRemove)[0]
      const valueToRemove = paramToRemove[key]

      // If value is null, remove all related parameters
      if (valueToRemove === null) {
        const paramPrefix = `${key}[`
        Object.keys(updatedQueryParams).forEach(paramKey => {
          if (paramKey === key || paramKey.startsWith(paramPrefix)) {
            delete updatedQueryParams[paramKey]
          }
        })
      } else {
        const currentValue = updatedQueryParams[key]

        if (Array.isArray(currentValue)) {
          const stringValueToRemove = String(valueToRemove)
          const filteredArray = currentValue.filter(item => String(item) !== stringValueToRemove)
          if (filteredArray.length === 0) {
            // If array becomes empty, remove all related parameters
            const paramPrefix = `${key}[`
            Object.keys(updatedQueryParams).forEach(paramKey => {
              if (paramKey === key || paramKey.startsWith(paramPrefix)) {
                delete updatedQueryParams[paramKey]
              }
            })
          } else {
            updatedQueryParams[key] = filteredArray
          }
        } else if (String(currentValue) === String(valueToRemove)) {
          // If removing the main value, remove all related parameters
          const paramPrefix = `${key}[`
          Object.keys(updatedQueryParams).forEach(paramKey => {
            if (paramKey === key || paramKey.startsWith(paramPrefix)) {
              delete updatedQueryParams[paramKey]
            }
          })
        }
      }
    }

    if(isResetPage) updatedQueryParams = resetPage(updatedQueryParams)

    if(isFireBeforeHook) beforeRouterUpdate()
      
    router.push({ query: updatedQueryParams })
  }

  const addOrUpdateQueryParams = (newQueryParams: QueryParam, replaceExisting: boolean = false, isFireBeforeHook: boolean = true, isResetPage: boolean = true) => {
    const route = useRoute(); // Get the current route object
    const router = useRouter(); // Get the router instance

    const currentQueryParams = { ...route.query };
    let updatedQueryParams = { ...currentQueryParams };

    for (const key in newQueryParams) {
        if (Object.prototype.hasOwnProperty.call(newQueryParams, key)) {
            const newValue = newQueryParams[key];
            const currentValue = updatedQueryParams[key];

            // Handle nested objects (like price ranges)
            if (typeof newValue === 'object' && !Array.isArray(newValue)) {
                // Create nested query params (e.g., price[min]=90&price[max]=100)
                for (const nestedKey in newValue) {
                    const paramKey = `${key}[${nestedKey}]`;
                    updatedQueryParams[paramKey] = String(newValue[nestedKey]);
                }
                continue; // Move to the next key in newQueryParams
            }

            // Handle array values
            if (Array.isArray(newValue)) {
                let combinedArray: string[] = [];
                if (replaceExisting) {
                    // If replaceExisting is true, just use the new array values
                    combinedArray = [...new Set(newValue.map(String))];
                } else {
                    // Current behavior: combine unique values
                    if (Array.isArray(currentValue)) {
                        combinedArray = [...new Set([...currentValue.map(String), ...newValue.map(String)])];
                    } else if (currentValue !== undefined && currentValue !== null) {
                        combinedArray = [...new Set([String(currentValue), ...newValue.map(String)])];
                    } else {
                        combinedArray = [...new Set(newValue.map(String))];
                    }
                }
                updatedQueryParams[key] = combinedArray;
            } else {
                // Handle non-array values (string, number, boolean)
                if (replaceExisting) {
                    // If replaceExisting is true, replace the existing value
                    updatedQueryParams[key] = String(newValue);
                } else {
                    // Current behavior: add to an array or replace if identical
                    if (Array.isArray(currentValue)) {
                        // If current is an array, add the new value to it
                        const newArray = [...new Set([...currentValue.map(String), String(newValue)])];
                        updatedQueryParams[key] = newArray;
                    } else if (currentValue !== undefined && currentValue !== null) {
                        // If current is a single value, and it's different, make it an array of both
                        if (String(currentValue) !== String(newValue)) {
                            updatedQueryParams[key] = [...new Set([String(currentValue), String(newValue)])];
                        } else {
                            // If values are identical, keep the new value (or current, they are the same)
                            updatedQueryParams[key] = String(newValue);
                        }
                    } else {
                        // No current value, simply set the new value
                        updatedQueryParams[key] = String(newValue);
                    }
                }
            }
        }
    }

    if(isResetPage) updatedQueryParams = resetPage(updatedQueryParams)

    if(isFireBeforeHook) beforeRouterUpdate()

    router.push({ query: updatedQueryParams });
  };

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