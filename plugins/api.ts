// plugins/api.ts
export default defineNuxtPlugin((nuxtApp) => {
  const config = useRuntimeConfig()
  const token = useCookie<string | null>('auth_token', {
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
  })

  const i18n = (nuxtApp as any).$i18n;
  const regionStore = useRegion();

  const locale = i18n?.locale;
  const region = regionStore.region;  


  const $api = $fetch.create({
    baseURL: config.public.apiBase,
    credentials: 'include',
    onRequest({ options }) {
      // базовые заголовки
      const headers: Record<string, string> = {
        Accept: 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
        ...(locale?.value ? { 'Accept-Language': locale.value } : {}),
        ...(region?.value ? { 'X-Region': region.value } : {}),
      }
      if (token.value) headers.Authorization = `Bearer ${token.value}`
      const xsrf = useCookie('XSRF-TOKEN').value
      if (xsrf) headers['X-XSRF-TOKEN'] = xsrf
      options.headers = { ...(options.headers as any), ...headers }

      // ⚠️ НЕ пересобираем query — только ДОБАВИМ country, если его нет
      const method = (options.method || 'GET').toUpperCase()
      if (region?.value) {
        if (method === 'GET') {
          if (options.query instanceof URLSearchParams) {
            if (!options.query.has('country')) {
              options.query = new URLSearchParams(options.query)
              options.query.append('country', region.value)
            }
          } else if (options.query && typeof options.query === 'object') {
            if ((options.query as any).country == null) {
              (options.query as any).country = region.value
            }
          } else {
            // если query ещё не задан — заведём объект
            options.query = { country: region.value }
          }
        } else {
          // POST/PUT/PATCH: аккуратно дополним body, но не трогаем FormData
          const b = options.body as any
          const isForm = (typeof FormData !== 'undefined') && b instanceof FormData
          if (!isForm) {
            const next = (b && typeof b === 'object') ? { ...b } : {}
            if (next.country == null) next.country = region.value
            options.body = next
          }
        }
      }
    },
    onResponseError({ response }) {
      if (response.status === 401) {
        const { logout } = useAuth()
        logout() // централизованный выход
      }
    },
  })

  return { provide: { api: $api } }
})
