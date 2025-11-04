import { ofetch } from 'ofetch'
import { useLazyAsyncData, useNuxtApp, useRuntimeConfig } from '#imports'
import { useRegion } from '#imports'

export interface UseFetcherDataOptions<T> {
  lazy?: boolean
  server?: boolean
  key?: string
  query?: Record<string, any>
  transform?: (data: any, raw: any) => T
  default?: () => T
}

function normalizeLocale(value: any): string | undefined {
  if (!value) return undefined
  if (typeof value === 'string') return value
  if (typeof value === 'object' && typeof value.value === 'string') return value.value
  return undefined
}

export function useFetcherData<T = unknown>(
  endpointKey: string,
  options: UseFetcherDataOptions<T> = {}
) {
  const runtimeConfig = useRuntimeConfig()
  const routes = (runtimeConfig.public?.fetcherModule?.routes || {}) as Record<string, string>
  const routePath = routes[endpointKey]

  if (!routePath) {
    throw new Error(`fetcherModule: endpoint "${endpointKey}" is not exposed on the client`)
  }

  const nuxtApp = useNuxtApp()
  const i18n = (nuxtApp as any)?.$i18n
  const locale = normalizeLocale(i18n?.locale)
  const regionStore = useRegion()
  const region = normalizeLocale(regionStore.regionAlias)

  const headers: Record<string, string> = {
    Accept: 'application/json'
  }
  if (locale) headers['Accept-Language'] = locale
  if (region) headers['X-Region'] = region

  const query = {
    ...options.query
  }

  if (locale && query.locale === undefined) {
    query.locale = locale
  }
  if (region && query.region === undefined) {
    query.region = region
  }

  const asyncKey =
    options.key ??
    `fetcher:${endpointKey}:${locale ?? ''}:${region ?? ''}:${JSON.stringify(query)}`

  // return useAsyncData(
  //   asyncKey,
  //   async () => {
  //     const response = await $fetch(routePath, {
  //       headers,
  //       query,
  //       retry: 0
  //     })

  //     // const data =
  //     //   response && typeof response === 'object' && 'data' in response ? (response as any).data : response

  //     // return options.transform ? options.transform(data, response) : (data as T)
  //     return response
  //   },
  //   {
  //     lazy: options.lazy ?? false,
  //     server: options.server ?? true,
  //     default: options.default
  //   }
  // )

  // try {
  //   const response = await ofetch(routePath, {
  //     headers,
  //     query
  //   })

  //   // const data =
  //   //   response && typeof response === 'object' && 'data' in response ? (response as any).data : response

  //   // return options.transform ? options.transform(data, response) : (data as T)
  //   return response
  // } catch (error) {
  //   throw error
  // }

    const r = $fetch(routePath, {
      headers,
      query
    })

    return r

  //  try {
  //   const response = await $fetch(routePath, {
  //     headers,
  //     query
  //   })

  //   return response
  // } catch (error) {
  //   throw error
  // }
}
