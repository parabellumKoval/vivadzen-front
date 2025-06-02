
type Product = {
  id: number,
  name: string,
  price: number,
  brand: Brand,
  categories: Category[],
  amount?: number,
  code: string,
}

interface ItemData {
  item_id: string,
  item_name: string,
  item_brand: string,
  price: number,
  quantity?: number,
  [key: string]: string | number | undefined,
}

// Общий интерфейс для всего объекта data
interface EcommerceData {
  currency: string;
  value: number;
  items: ItemData[];
}

// type EventName = 'AddToCart' | 'ViewItem' | 'RemoveFromCart' | 'BeginCheckout' | 'Purchase' | 'Refund'

type EventHandlers = {
  // [E in EventName as `get${E}Data`]: (product: EventPayloadMap[E]) => any;
  [E in EventName as `get${E}Data`]: (data: EventPayloadMap[E]) => {
    event: string;
    ecommerce: object;
  };
};

type EventName = keyof EventPayloadMap;

interface EventPayloadMap {
  AddToCart: Product;
  RemoveFromCart: Product;
  ViewItem: Product;
  BeginCheckout: Checkout;
  Purchase: Checkout;
  Refund: Product;
}

type Checkout = {
  products: Product[],
  total: number,
  code?: string
}

export const useGoogleEvent = () => {
  const getProductData = (product: Product) => {
    let data: EcommerceData = {
        currency: "UAH",
        value: product.price,
        items: [
          {
            item_id: product?.code,
            item_name: product?.name,
            item_brand: product?.brand?.name || '',
            price: product?.price,
            quantity: product.amount
          }
        ]
    }

    if(product?.categories) {
      product.categories.forEach((cat, index) => {
        data.items[0]['item_category' + (index + 1)] = cat.name
      })
    }

    return data
  }

  const eventHandlers: EventHandlers = {
    getAddToCartData: (product) => {
      return {
        event: "add_to_cart",
        ecommerce: {
          currency: "UAH",
          value: product.price,
          items: [getProductData(product)]
        }
      }
    },
    getViewItemData: (product) => {
      return {
        event: "view_item",
        ecommerce: {
          currency: "UAH",
          value: product.price,
          items: [getProductData(product)]
        }
      }
    },
    getRemoveFromCartData: (product) => {
      return {
        event: "remove_from_cart",
        ecommerce: {
          currency: "UAH",
          value: product.price,
          items: [getProductData(product)]
        }
      }
    },
    getBeginCheckoutData: (data) => {
      let items = data.products.map((item) => {
        return getProductData(item)
      })

      return {
        event: "begin_checkout",
        ecommerce: {
          currency: "UAH",
          value: data.total,
          items: items
        }
      }
    },
    getPurchaseData: (data) => {
      let items = data.products.map((item) => {
        return getProductData(item)
      })

      return {
        event: "purchase",
        ecommerce: {
          transaction_id: data.code,
          value: data.total,
          currency: "UAH",
          items: items
        }
      }
    },
    getRefundData: (product) => {
      return {
        event: "refund",
        ecommerce: {
          currency: "UAH",
          value: product.price,
          items: [getProductData(product)]
        }
      }
    },
  }

  const setEvent = <E extends EventName>(eventName: E, data: EventPayloadMap[E]) => {
    const functionName = `get${eventName}Data` as keyof EventHandlers
    const handler = eventHandlers[functionName as keyof EventHandlers];

    if (process.client && window.dataLayer && handler) {
      window.dataLayer.push({ecommerce: null});
      window.dataLayer.push(handler(data));
    }else {
        console.warn(`Обработчик для события "${eventName}" с именем "${functionName}" не найден.`);
    }
  }

  return {
    setEvent
  }
}