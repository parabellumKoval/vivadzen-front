
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
      per_page: useScreen().getCatalogPerPage('product'),
      page: Number(route.query.page) || 1,
      ...getQueryParams()
    }
    
    if (queryMode.value === QUERY_MODE.INITIAL) {
      Object.assign(q, {
        with_filter: withFilters.value,
        with_filter_count: withFiltersCount.value,
        with_sorting: true,
        cache: ['with_filter', 'with_filter_count']
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

  const loadMore = async (catalog: Catalog) => {
    const productStore = useProductStore();
    // Увеличиваем страницу
    query.value.page += 1;

    const productsResponse = await productStore.index(getQuery());
    const newProducts = productsResponse.data.value.products.data;

    catalog.products = [...catalog.products, ...newProducts];
    catalog.meta = productsResponse.data.value.products.meta;
    catalog.filtersMeta = productsResponse.data.value.filters;

    return catalog
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

