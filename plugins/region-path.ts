


export default defineNuxtPlugin((nuxtApp) => {


  const regionPath = (path: string, opts: { absolute?: boolean } = {}) => {
    const { locale } = useI18n();
    const { region, DEFAULT_LOCALE_BY_REGION } = useRegion();

    console.log(locale.value)
    // Remove leading slash if exists
    const cleanPath = path.replace(/^\//, '');

    // Get default locale for current region
    const defaultLocale = DEFAULT_LOCALE_BY_REGION[region.value];

    // Build the path segments
    const segments = [];
    
    // Add region as first segment
    segments.push(region.value);

    // Add locale as second segment only if it's different from default
    if (locale.value !== defaultLocale) {
      segments.push(locale.value);
    }

    // Add the rest of the path
    if (cleanPath) {
      segments.push(cleanPath);
    }

    // Combine segments and add leading slash
    return '/' + segments.join('/');
  };

  nuxtApp.provide('regionPath', regionPath);
});
