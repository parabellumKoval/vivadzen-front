export default defineNuxtPlugin((nuxtApp) => {
  // 1) Берём глобальный i18n (vue-i18n v9)
  //    В nuxt i18n он доступен как nuxtApp.$i18n
  const i18n = (nuxtApp as any).$i18n;
  // 2) Берём Pinia store/композабл ОДИН РАЗ в плагине
  const regionStore = useRegion(); // или useRegionStore(), если это Pinia store

  const regionPath = (path: string, opts: { absolute?: boolean } = {}) => {
    // НЕ вызываем useI18n()/useRegion() тут!
    const locale = i18n?.locale?.value; // текущая локаль
    const region = regionStore.region.value;    // текущий регион
    const DEFAULT_LOCALE_BY_REGION = regionStore.DEFAULT_LOCALE_BY_REGION;

    const cleanPath = path.replace(/^\//, '');
    const defaultLocale = DEFAULT_LOCALE_BY_REGION[region];

    // console.log(defaultLocale, locale, i18n.locale.value)

    const segments: string[] = [];
    segments.push(region); // /{region}

    if (locale && locale !== defaultLocale) {
      segments.push(locale); // /{region}/{locale} если не дефолт
    }

    if (cleanPath) segments.push(cleanPath);

    const localized = '/' + segments.join('/');

    if (opts.absolute) {
      const baseUrl = useRuntimeConfig().public.baseUrl || '';
      return baseUrl + localized;
    }
    return localized;
  };

  nuxtApp.provide('regionPath', regionPath);
});
