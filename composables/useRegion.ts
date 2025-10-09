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

  const DEFAULT_LOCALE_BY_REGION: Record<string, string> = {
  ua: 'uk',
  cz: 'cs',
  de: 'de',
  es: 'es',
  global: 'en',
};

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
        const currentRegion = segments[0]
        const defaultLangForRegion = DEFAULT_LOCALE_BY_REGION[currentRegion]
        
        // If the new language is the default for the region, remove the language segment
        if (newLang === defaultLangForRegion) {
          if (hasValidRegion && hasValidLocale) {
            segments.splice(1, 1)
          }
        } else {
          // Handle non-default language
          if (hasValidRegion && hasValidLocale) {
            segments[1] = newLang
          } else if (hasValidRegion) {
            segments.splice(1, 0, newLang)
          }
        }
      }
    } else if (hasValidRegion && hasValidLocale) {
      // Check if current language is default for region and remove if it is
      const currentRegion = segments[0]
      const currentLang = segments[1]
      const defaultLangForRegion = DEFAULT_LOCALE_BY_REGION[currentRegion]
      
      if (currentLang === defaultLangForRegion) {
        segments.splice(1, 1)
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