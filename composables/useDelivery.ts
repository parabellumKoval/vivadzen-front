
export const useDelivery = () => {
  const {t} = useI18n()
  const {get, all} = useSettings()
  const {region} = useRegion()

  const {isReady, quote } = usePacketaRates()

  const cartWeight = ref(850) // g — возьми из корзины
  const cartSubtotal = ref(1350) // валюта в рамках конфигурации направления
  const destination = ref('CZ') // ISO2 страны получателя

  const defaultPrice = (method = 'pickup') => {
    if (!isReady.value) return null
    return quote({
      origin: 'CZ',
      destination: destination.value,
      method: method,
      weight_g: cartWeight.value,
      subtotal: cartSubtotal.value,
      cod: false
    })
  }

  const vendors = ref([
    {
      id: 1,
      logo: '/images/logo/np.png',
      title: 'Novaposhta',
      countries: ['ua']
    },{
      id: 2,
      logo: '/images/logo/zasilkovna.png',
      title: 'Zasilkovna',
      countries: ['cz','es','de']
    },{
      id: 3,
      logo: '/images/logo/ceska.png',
      title: 'Ceska posta',
      countries: ['cz','es','de']
    },{
      id: 4,
      logo: '/images/logo/ppl.png',
      title: 'PPL',
      countries: ['cz','es','de']
    },{
      id: 5,
      logo: '/images/logo/dhl.png',
      title: 'DHL',
      countries: ['cz','es','de']
    },{
      id: 6,
      logo: '/images/logo/dpd.png',
      title: 'Dpd',
      countries: ['cz','es','de']
    }
  ])

  const methods = ref([
    {
      key: 'packeta_warehouse',
      title: t('delivery.packeta_warehouse'),
      label: t('delivery.z_warehouse'),
      icon: 'iconoir:delivery-truck',
      image: '/images/logo/zasilkovna.png',
      logo: '/images/logo/z-mini.png',
      price: defaultPrice('pickup'),
      isPriceObject: true
    }, 
    {
      key: 'packeta_address',
      title: t('delivery.packeta_address'),
      label: t('delivery.z_address'),
      icon: 'iconoir:delivery',
      image: '/images/logo/zasilkovna.png',
      logo: '/images/logo/z-mini.png',
      price: defaultPrice('home'),
      isPriceObject: true
    }, 
    {
      key: 'novaposhta_warehouse',
      title: t('delivery.novaposhta_warehouse'),
      label: t('delivery.np_warehouse'),
      icon: 'iconoir:delivery-truck',
      image: '/images/logo/np.png',
      logo: '/images/logo/np-mini.png',
      price: defaultPrice('home'),
      isPriceObject: true
    }, 
    {
      key: 'novaposhta_address',
      title: t('delivery.novaposhta_address'),
      label: t('delivery.np_warehouse'),
      icon: 'iconoir:delivery',
      image: '/images/logo/np.png',
      logo: '/images/logo/np-mini.png',
      price: defaultPrice('home'),
      isPriceObject: true
    }, 
    {
      key: 'default_pickup',
      title: t('delivery.default_pickup'),
      label: t('delivery.pickup'),
      icon: 'iconoir:shop-four-tiles',
      image: '/images/company.png',
      logo: '/images/logo/company-mini.png',
      price: t('delivery.from_shop'),
      isPriceObject: false
    }, 
    {
      key: 'default_address',
      title: t('delivery.default_address'),
      label: t('delivery.address'),
      icon: 'iconoir:shop-four-tiles',
      image: '/images/company.png',
      logo: '/images/logo/company-mini.png',
      price: t('delivery.provider_tariffs'),
      isPriceObject: false
    }
  ])

  const deliveryMethods = computed(() => {
    const methodKeys = get('shipping.methods') || []
    return methods.value.filter(method => methodKeys.includes(method.key))
  })


  const deliveryVendors = computed(() => {
    return vendors.value.filter(vendor => vendor.countries.includes(region.value))
  })

  return {
    vendors: deliveryVendors,
    methods: deliveryMethods,
    defaultPrice
  }
}
