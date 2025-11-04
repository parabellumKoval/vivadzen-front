
import {useProductStore} from '~/store/product'

interface Query {
  per_page: number
  page: number
  selections?: any
  order?: any
  brands?: any
  filters?: any
  price?: any
}

interface Catalog {
  products: {
    data: [],
    meta: any
  },
  filters: {
    data: [],
    count: any
  },
}

interface Filter {
  brands: any,
  attributes: any,
}

export const useCatalog = () => {
  const {getQueryParams} = useFilter()

  const route = useRoute()


  // Типы режимов запроса
  const QUERY_MODE = {
    INITIAL: 'initial',
    PAGINATION: 'pagination',
    FILTER: 'filter'
  }

  const WITH_FILTERS = ['selections', 'brands', 'price'];
  const WITH_FILTERS_COUNT = ['selections', 'brands', 'price'];

  // Текущее состояние запроса
  // const queryMode = ref(QUERY_MODE.INITIAL)
  const queryMode = useState<string>('queryModeState', () => QUERY_MODE.INITIAL)
  const withFilters = useState<Array<string>>('withFiltersState', () => WITH_FILTERS)
  const withFiltersCount = useState<Array<string>>('withFiltersCountState', () => WITH_FILTERS_COUNT)

  const setMode = (mode: string) => {
    queryMode.value = QUERY_MODE[mode]
  }

  const setFilters = (values: Array<string>) => {
    withFilters.value = values
  }

  const setFiltersCount = (values: Array<string>) => {
    withFiltersCount.value = values
  }

  const setFiltersAndCount = (values: Array<string>) => {
    withFiltersCount.value = values
    withFilters.value = values
  }

  const query = computed(() => {
    let q = {
      with_products: true,
      per_page: useScreen().getCatalogPerPage('product'),
      page: Number(route.query.page) || 1,
      ...getQueryParams()
    }
    
    if (queryMode.value === QUERY_MODE.INITIAL) {
      Object.assign(q, {
        with_filter: withFilters.value,
        with_filter_count: withFiltersCount.value,
        with_sorting: true,
        // cache: ['with_filter', 'with_filter_count'],
        cache: true
      })
    }
    if (queryMode.value === QUERY_MODE.PAGINATION) {
      Object.assign(q, {})
    }
    if (queryMode.value === QUERY_MODE.FILTER) {
      Object.assign(q, {
        with_filter_count: withFiltersCount.value
      })
    }

    return Object.fromEntries(
      Object.entries(q).filter(([_, value]) => 
        value !== null && (!Array.isArray(value) || value.length > 0)
      )
    );
  })

  const loadCatalog  = async (queryToUse: Object = {}): Promise<Catalog> => {
    const productStore = useProductStore();
    const response = await productStore.catalog({...query.value, ...queryToUse})

    return response.data.value
  }

  const loadMore = async (
    catalog: Catalog,
    nextPage?: number,
    extraQuery: Record<string, any> = {}
  ) => {
    const productStore = useProductStore();
    const currentMeta = catalog?.products?.meta;

    if (!currentMeta) {
      return catalog;
    }

    const pageToLoad = nextPage ?? (Number(currentMeta.current_page) || 1) + 1;

    if (currentMeta.last_page && pageToLoad > currentMeta.last_page) {
      return catalog;
    }

    const requestQuery = {
      ...query.value,
      ...extraQuery,
      page: pageToLoad,
    };

    const productsResponse = await productStore.catalog(requestQuery);
    const response = productsResponse.data.value;

    const newProducts = response?.products?.data || [];
    const mergedCatalog: Catalog = {
      ...catalog,
      products: {
        data: [
          ...(catalog.products?.data || []),
          ...newProducts,
        ],
        meta: response?.products?.meta || currentMeta,
      },
      filters: response?.filters || catalog.filters,
    };

    return mergedCatalog;
  };

  return {
    // getProducts,
    // catalogMeta,
    // pending,
    setMode,
    setFiltersAndCount,
    loadCatalog,
    loadMore,
    catalogQuery: query,
  }
}
