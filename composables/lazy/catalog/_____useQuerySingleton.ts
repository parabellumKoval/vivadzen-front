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

const addOrUpdateQueryParams = (
    newQueryParams: QueryParam,
    replaceExisting: boolean = false,
    isFireBeforeHook: boolean = true,
    isResetPage: boolean = true
  ) => {
    const route = useRoute();
    const router = useRouter();

    const currentQueryParams = { ...route.query };
    let updatedQueryParams: Record<string, any> = { ...currentQueryParams };

    // Helper: extract existing attrs pairs and indices
    const extractExistingAttrs = () => {
      const pairs = new Set<string>();
      const indices = new Set<number>();
      const attrIdRegex = /^attrs\[(\d+)\]\[attr_id\]$/;

      Object.entries(updatedQueryParams).forEach(([key, value]) => {
        const match = key.match(attrIdRegex);
        if (match) {
          const idx = Number(match[1]);
          indices.add(idx);
          const id = String(value);
          const valKey = `attrs[${idx}][attr_value_id]`;
          const val = String(updatedQueryParams[valKey] ?? '');
          if (val) pairs.add(`${id}-${val}`);
        }
      });

      return { pairs, indices };
    };

    for (const key in newQueryParams) {
      if (!Object.prototype.hasOwnProperty.call(newQueryParams, key)) continue;
      const newValue = newQueryParams[key];

      // Special case: attrs array of objects
      if (
        key === 'attrs' &&
        Array.isArray(newValue) &&
        newValue.every(
          (item: any) =>
            item &&
            typeof item === 'object' &&
            'attr_id' in item &&
            'attr_value_id' in item
        )
      ) {
        const { pairs, indices } = extractExistingAttrs();
        const nextIndex = indices.size ? Math.max(...indices) + 1 : 0;
        let currentIndex = nextIndex;

        newValue.forEach((item: any) => {
          const id = String(item.attr_id);
          const val = String(item.attr_value_id);
          const keyPair = `${id}-${val}`;
          if (pairs.has(keyPair)) {
            // skip duplicate combination
            return;
          }
          // assign new params
          updatedQueryParams[`attrs[${currentIndex}][attr_id]`] = id;
          updatedQueryParams[`attrs[${currentIndex}][attr_value_id]`] = val;
          pairs.add(keyPair);
          currentIndex++;
        });
        continue;
      }

      // Handle nested objects (like price ranges)
      if (typeof newValue === 'object' && !Array.isArray(newValue)) {
        for (const nestedKey in newValue) {
          const paramKey = `${key}[${nestedKey}]`;
          updatedQueryParams[paramKey] = String(newValue[nestedKey]);
        }
        continue;
      }

      // Handle array values
      if (Array.isArray(newValue)) {
        let combinedArray: string[] = [];
        if (replaceExisting) {
          combinedArray = [...new Set(newValue.map(String))];
        } else {
          const currentValue = updatedQueryParams[key];
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
        const currentValue = updatedQueryParams[key];
        if (replaceExisting) {
          updatedQueryParams[key] = String(newValue);
        } else {
          if (Array.isArray(currentValue)) {
            updatedQueryParams[key] = [...new Set([...currentValue.map(String), String(newValue)])];
          } else if (currentValue !== undefined && currentValue !== null) {
            if (String(currentValue) !== String(newValue)) {
              updatedQueryParams[key] = [...new Set([String(currentValue), String(newValue)])];
            } else {
              updatedQueryParams[key] = String(newValue);
            }
          } else {
            updatedQueryParams[key] = String(newValue);
          }
        }
      }
    }

    if (isResetPage) updatedQueryParams = resetPage(updatedQueryParams);
    if (isFireBeforeHook) beforeRouterUpdate();

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