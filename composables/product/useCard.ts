export const useCard = (product: Product) => {

  const { t } = useI18n({useScope: 'global'})

  const photos = computed(() => {
    if(product.images?.length) {
      return product.images.filter((item) => {
        return item.src
      }).map((item) => {
        return {
          alt: item?.alt || product.name,
          title: item?.title || product.name,
          // src: useImg().folderSrc(item.src, 'products')
          src: item.src
        }
      })
    }else {
      return [{
        alt: product.name,
        title: product.name,
        src: useImg().noImage
      }]
    }
  })

  const photoAlt = computed(() => {
    return product.image?.alt || product.name
  })

  const photoTitle = computed(() => {
    return product.image?.title || product.name
  })

  const photoSize = computed(() => {
    return product.image?.size || ''
  })

  const photo = computed(() => {
    return useImg().product(product.image)
  })

  const stock = computed(() => {
    return product.inStock > 0? 'in-stock': 'not-in-stock'
  })

  const salePercent = computed(() => {
    if(!product.oldPrice)
      return null

    return  Math.ceil(100 - (product.price * 100 / product.oldPrice))
  })

  const label = computed(() => {
    if(!product.oldPrice || product.oldPrice <= product.price)
      return null


    if(product.isTop){
      return {
        class: 'violet',
        text: t('label.product.top')
      }
    }else if(product.oldPrice - product.price >= product.price / 10){
      return {
        class: 'orange',
        text: t('label.product.price')
      }
    }else if(product.oldPrice > product.price) {
      return {
        class: 'red',
        text: t('label.product.sale') + ' -' + salePercent.value + '%'
      }
    }else {
      return null
    }
  })

  return {
    photos,
    photoAlt,
    photoTitle,
    photoSize,
    photo,
    stock,
    label
  }
}