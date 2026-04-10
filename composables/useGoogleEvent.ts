type ProductCategory = {
  name?: string | null
}

type ProductPayload = {
  id?: number | string | null
  code?: string | null
  name?: string | null
  price?: number | string | null
  currency?: string | null
  brand?: {
    name?: string | null
  } | null
  categories?: ProductCategory[] | null
  category?: ProductCategory | null
  amount?: number | null
  short_name?: string | null
  shortName?: string | null
  item_list_name?: string | null
  item_list_id?: string | null
  index?: number | null
}

type CheckoutPayload = {
  products: ProductPayload[]
  total?: number | string | null
  code?: string | null
  shipping?: string | null
  payment?: string | null
  currency?: string | null
  coupon?: string | null
  shippingAmount?: number | string | null
  discount?: number | string | null
}

type ListPayload = {
  products: ProductPayload[]
  id: string
  name: string
}

type SelectItemPayload = {
  product: ProductPayload
  id: string
  name: string
}

type SearchPayload = {
  searchTerm: string
  resultsCount?: number | null
}

type CheckoutErrorPayload = {
  step: string
  products?: ProductPayload[]
  total?: number | string | null
  shipping?: string | null
  payment?: string | null
  sections?: string[]
}

type ProductEcommerce = {
  item_id: string
  item_name: string
  price: number
  quantity?: number
  item_brand?: string
  item_category?: string
  item_category2?: string
  item_category3?: string
  item_category4?: string
  item_category5?: string
  item_list_name?: string
  item_list_id?: string
  item_variant?: string
  index?: number
}

type GoogleEventPayload = {
  event: string
  ecommerce?: Record<string, unknown>
  [key: string]: unknown
}

type EventPayloadMap = {
  AddShippingInfo: CheckoutPayload
  AddPaymentInfo: CheckoutPayload
  ViewItemList: ListPayload
  SelectItem: SelectItemPayload
  AddToCart: ProductPayload
  RemoveFromCart: ProductPayload
  ViewItem: ProductPayload
  ViewCart: CheckoutPayload
  BeginCheckout: CheckoutPayload
  Purchase: CheckoutPayload
  Search: SearchPayload
  CheckoutError: CheckoutErrorPayload
}

type EventName = keyof EventPayloadMap

type EventHandlers = {
  [E in EventName as `get${E}Data`]: (data: EventPayloadMap[E]) => GoogleEventPayload
}

const PURCHASE_STORAGE_PREFIX = 'ga4:purchase:'

export const useGoogleEvent = () => {
  const { currency } = useRegion()
  const nuxtApp = useNuxtApp()

  const formatPrice = (value: number | string | null | undefined): number => {
    const normalized = Number.parseFloat(String(value ?? 0).replace(',', '.'))
    if (!Number.isFinite(normalized)) {
      return 0
    }

    return Number(normalized.toFixed(2))
  }

  const normalizeString = (value: unknown): string | undefined => {
    if (value === null || value === undefined) {
      return undefined
    }

    const normalized = String(value).trim()
    return normalized || undefined
  }

  const resolveCurrency = (payload?: { currency?: string | null; products?: ProductPayload[] }): string => {
    const direct = normalizeString(payload?.currency)
    if (direct) {
      return direct
    }

    const productCurrency = payload?.products
      ?.map((product) => normalizeString(product?.currency))
      .find(Boolean)

    if (productCurrency) {
      return productCurrency
    }

    return normalizeString(currency.value) || 'USD'
  }

  const getCategories = (product: ProductPayload): ProductCategory[] => {
    if (Array.isArray(product?.categories) && product.categories.length) {
      return product.categories.filter((category) => normalizeString(category?.name))
    }

    if (product?.category?.name) {
      return [product.category]
    }

    return []
  }

  const getProductUnitData = (
    product: ProductPayload,
    listContext?: {
      id?: string | null
      name?: string | null
    },
    fallbackIndex?: number
  ): ProductEcommerce => {
    const categories = getCategories(product)
    const amount = Number(product?.amount || 0)
    const variant = normalizeString(product?.short_name || product?.shortName)
    const itemListName = normalizeString(product?.item_list_name || listContext?.name)
    const itemListId = normalizeString(product?.item_list_id || listContext?.id)
    const explicitIndex = product?.index
    const resolvedIndex = explicitIndex !== null
      && explicitIndex !== undefined
      && Number.isFinite(Number(explicitIndex))
      ? Number(explicitIndex)
      : fallbackIndex

    const data: ProductEcommerce = {
      item_id: normalizeString(product?.code || product?.id) || 'unknown',
      item_name: normalizeString(product?.name) || 'unknown',
      price: formatPrice(product?.price),
    }

    if (amount > 0) {
      data.quantity = amount
    }

    const brand = normalizeString(product?.brand?.name)
    if (brand) {
      data.item_brand = brand
    }

    categories.slice(0, 5).forEach((category, index) => {
      const categoryName = normalizeString(category?.name)
      if (!categoryName) {
        return
      }

      const key = index === 0 ? 'item_category' : `item_category${index + 1}`
      ;(data as Record<string, unknown>)[key] = categoryName
    })

    if (variant) {
      data.item_variant = variant
    }

    if (typeof resolvedIndex === 'number' && Number.isFinite(resolvedIndex)) {
      data.index = resolvedIndex
    }

    if (itemListName) {
      data.item_list_name = itemListName
    }

    if (itemListId) {
      data.item_list_id = itemListId
    }

    return data
  }

  const getItems = (
    products: ProductPayload[] = [],
    listContext?: {
      id?: string | null
      name?: string | null
    }
  ) => {
    return products
      .filter(Boolean)
      .map((product, index) => getProductUnitData(product, listContext, index))
  }

  const buildCheckoutEcommerce = (data: CheckoutPayload) => {
    return {
      currency: resolveCurrency(data),
      value: formatPrice(data.total),
      items: getItems(data.products),
    }
  }

  const getStorageKey = (transactionId: string) => `${PURCHASE_STORAGE_PREFIX}${transactionId}`

  const isPurchaseDuplicate = (transactionId: string | undefined) => {
    if (!process.client || !transactionId) {
      return false
    }

    try {
      return window.sessionStorage.getItem(getStorageKey(transactionId)) === '1'
    } catch {
      return false
    }
  }

  const markPurchaseSent = (transactionId: string | undefined) => {
    if (!process.client || !transactionId) {
      return
    }

    try {
      window.sessionStorage.setItem(getStorageKey(transactionId), '1')
    } catch {
      // ignore storage failures
    }
  }

  const pushToDataLayer = (payload: Record<string, unknown>) => {
    const regionalGtm = nuxtApp.$regionalGtm
    if (regionalGtm?.push) {
      regionalGtm.push(payload)
      return
    }

    const dataLayerName = regionalGtm?.dataLayerName || 'dataLayer'
    const win = window as unknown as Record<string, unknown>
    const current = win[dataLayerName]
    const dataLayer = Array.isArray(current) ? current : []
    if (!Array.isArray(current)) {
      win[dataLayerName] = dataLayer
    }

    dataLayer.push(payload)
  }

  const eventHandlers: EventHandlers = {
    getViewItemListData: (data) => {
      const items = getItems(data.products, {
        id: data.id,
        name: data.name,
      })

      return {
        event: 'view_item_list',
        ecommerce: {
          item_list_name: data.name,
          item_list_id: data.id,
          items,
        },
      }
    },
    getSelectItemData: (data) => {
      return {
        event: 'select_item',
        ecommerce: {
          item_list_name: data.name,
          item_list_id: data.id,
          items: [getProductUnitData(data.product, {
            id: data.id,
            name: data.name,
          })],
        },
      }
    },
    getViewItemData: (product) => {
      return {
        event: 'view_item',
        ecommerce: {
          currency: resolveCurrency({ products: [product] }),
          value: formatPrice(product?.price),
          items: [getProductUnitData(product)],
        },
      }
    },
    getAddToCartData: (product) => {
      return {
        event: 'add_to_cart',
        ecommerce: {
          currency: resolveCurrency({ products: [product] }),
          value: formatPrice(product?.price) * Math.max(1, Number(product?.amount || 1)),
          items: [getProductUnitData(product)],
        },
      }
    },
    getRemoveFromCartData: (product) => {
      return {
        event: 'remove_from_cart',
        ecommerce: {
          currency: resolveCurrency({ products: [product] }),
          value: formatPrice(product?.price) * Math.max(1, Number(product?.amount || 1)),
          items: [getProductUnitData(product)],
        },
      }
    },
    getViewCartData: (data) => {
      return {
        event: 'view_cart',
        ecommerce: buildCheckoutEcommerce(data),
      }
    },
    getBeginCheckoutData: (data) => {
      return {
        event: 'begin_checkout',
        ecommerce: buildCheckoutEcommerce(data),
      }
    },
    getPurchaseData: (data) => {
      const transactionId = normalizeString(data.code)
      const coupon = normalizeString(data.coupon)
      const payment = normalizeString(data.payment)
      const shippingTier = normalizeString(data.shipping)
      const shippingAmount = formatPrice(data.shippingAmount)
      const discount = formatPrice(data.discount)

      return {
        event: 'purchase',
        ecommerce: {
          transaction_id: transactionId,
          value: formatPrice(data.total),
          currency: resolveCurrency(data),
          shipping: shippingAmount,
          items: getItems(data.products),
          ...(coupon ? { coupon } : {}),
          ...(payment ? { payment_type: payment } : {}),
          ...(shippingTier ? { shipping_tier: shippingTier } : {}),
          ...(discount > 0 ? { discount } : {}),
        },
      }
    },
    getAddShippingInfoData: (data) => {
      return {
        event: 'add_shipping_info',
        ecommerce: {
          ...buildCheckoutEcommerce(data),
          ...(normalizeString(data.shipping) ? { shipping_tier: normalizeString(data.shipping) } : {}),
        },
      }
    },
    getAddPaymentInfoData: (data) => {
      return {
        event: 'add_payment_info',
        ecommerce: {
          ...buildCheckoutEcommerce(data),
          ...(normalizeString(data.payment) ? { payment_type: normalizeString(data.payment) } : {}),
        },
      }
    },
    getSearchData: (data) => {
      return {
        event: 'search',
        search_term: data.searchTerm,
        results_count: Number(data.resultsCount || 0),
      }
    },
    getCheckoutErrorData: (data) => {
      return {
        event: 'checkout_error',
        checkout_step: data.step,
        shipping_method: normalizeString(data.shipping),
        payment_method: normalizeString(data.payment),
        item_count: Array.isArray(data.products) ? data.products.length : 0,
        value: formatPrice(data.total),
        error_sections: Array.isArray(data.sections) ? data.sections.join(',') : '',
      }
    },
  }

  const setEvent = <E extends EventName>(eventName: E, data: EventPayloadMap[E]) => {
    if (!process.client) {
      return
    }

    const handlerName = `get${eventName}Data` as keyof EventHandlers
    const handler = eventHandlers[handlerName] as (payload: EventPayloadMap[E]) => GoogleEventPayload
    if (typeof handler !== 'function') {
      return
    }

    const payload = handler(data)
    if (!payload?.event) {
      return
    }

    const transactionId = normalizeString(
      payload?.ecommerce && typeof payload.ecommerce === 'object'
        ? (payload.ecommerce as Record<string, unknown>).transaction_id
        : undefined
    )

    if (payload.event === 'purchase' && isPurchaseDuplicate(transactionId)) {
      return
    }

    if (Object.prototype.hasOwnProperty.call(payload, 'ecommerce')) {
      pushToDataLayer({ ecommerce: null })
    }

    pushToDataLayer(payload)

    if (payload.event === 'purchase') {
      markPurchaseSent(transactionId)
    }
  }

  return {
    setEvent,
  }
}
