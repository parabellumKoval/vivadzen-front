export const useRegion = () => {
  const {t} = useI18n({useScope: 'global'})

  const REGION_CODES = ['ua', 'cz', 'de', 'es']
  const LOCALE_CODES = ['uk', 'ru', 'cs', 'de', 'en', 'es']
  const REGION_CURRENCY_CODES = {
    zz: 'USD',
    es: 'EUR', 
    de: 'EUR', 
    ua: 'UAH', 
    cz: 'CZK'
  }

  const changeLanguage = (lang: String) => {
  }
  const changeUrlRegion = (url: String, loc: String) => {

  }

  const currentUrl = (region: String|null, lang: String|null) => {
    const currentPath = window.location.pathname
    const segments = currentPath.split('/').filter(Boolean)
    
    let newUrl = ''
    
    // Check if first segment is a valid region
    const hasValidRegion = segments[0] && REGION_CODES.includes(segments[0].toLowerCase())
    // Check if second segment is a valid locale
    const hasValidLocale = segments[1] && LOCALE_CODES.includes(segments[1].toLowerCase())
    
    if (region) {
      const newRegion = region.toLowerCase()
      if (REGION_CODES.includes(newRegion)) {
        // If URL already has a valid region, replace it
        if (hasValidRegion) {
          segments[0] = newRegion
        } else {
          segments.unshift(newRegion)
        }
      }
    }
    
    if (lang) {
      const newLang = lang.toLowerCase()
      if (LOCALE_CODES.includes(newLang)) {
        // If URL has a valid region and valid locale
        if (hasValidRegion && hasValidLocale) {
          segments[1] = newLang
        } 
        // If URL has valid region but no valid locale
        else if (hasValidRegion) {
          segments.splice(1, 0, newLang)
        }
      }
    }
    
    newUrl = '/' + segments.join('/')
    return newUrl
  }


  return {
    changeLanguage,
    changeUrlRegion,
    currentUrl
  }
}