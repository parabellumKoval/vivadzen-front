export const useScreen = () => {
  const sizes = {
    0: 'mobile',
    768: 'tablet',
    1024: 'desktop',
    1441: 'ld',
    1920: 'xld',
  } 

  const getSize = () => {
    if (typeof window === 'undefined' || process.server) return

    const width = window.innerWidth
    const breakpoints = Object.keys(sizes).map(Number).sort((a, b) => a - b)

    let result = sizes[0] // default value

    for (const bp of breakpoints) {
      if (width >= bp) {
        result = sizes[bp]
      } else {
        break
      }
    }

    return result
  }

  const getCatalogPerPage = (type = 'product'): number => {
    if(type === 'product') {
      let screenSize = getSize()
      if (screenSize === 'ld') return 22
      if (screenSize === 'xld') return 24
      return 20
    }else {
      return 20
    }
  }

  return {
    getSize,
    getCatalogPerPage
  }
}