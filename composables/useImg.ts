export const useImg = () => {
  
  const noImage = computed(() => {
    return useRuntimeConfig().public.noimage
  })

  const folderSrc = (src: string, folder: string) => {
    return useRuntimeConfig().public.imagesDir + '/' + folder + '/' + src
  }

  const srcOrPlaceholder = (image: Image | string, folder: string) => {
    if(typeof image === 'string') {
      return folderSrc(image, folder)
    }else {
      return image?.src? folderSrc(image.src, folder): useImage().noImage
    }
  }

  const category = (image: Image | string) => {
    return srcOrPlaceholder(image, 'categories')
  }

  const product = (image: Image | string) => {
    return srcOrPlaceholder(image, 'products')
  }

  const brand = (image: Image | string) => {
    return srcOrPlaceholder(image, 'brands')
  }

  const blog = (image: Image | string) => {
    return srcOrPlaceholder(image, 'blog')
  }

  return {
    noImage: noImage.value,
    folderSrc,
    category,
    product,
    brand,
    blog
  }
}