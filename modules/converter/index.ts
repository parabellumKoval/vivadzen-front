import { addImports, addServerHandler, createResolver, defineNuxtModule } from '@nuxt/kit'

export interface ConverterModuleOptions {
  /**
   * Base URL for the remote rates endpoint. Falls back to runtimeConfig.public.apiBase.
   */
  baseUrl?: string
  /**
   * Path segment appended to the base URL when fetching remote rates.
   * Defaults to `/points/rates`.
   */
  ratesEndpoint?: string
  /**
   * Cache TTL in seconds used by the server-side cache.
   */
  ttlSec?: number
  /**
   * Internal API route exposed by the module to consume cached rates.
   */
  apiRoutePath?: string
  /**
   * Webhook route that forces cache refresh when invoked (POST).
   */
  refreshRoutePath?: string
}

const DEFAULT_OPTIONS: Required<Omit<ConverterModuleOptions, 'baseUrl'>> & {
  baseUrl?: string
} = {
  baseUrl: undefined,
  ratesEndpoint: '/points/rates',
  ttlSec: 300,
  apiRoutePath: '/api/_converter/rates',
  refreshRoutePath: '/api/_converter/refresh',
}

export default defineNuxtModule<ConverterModuleOptions>({
  meta: {
    name: 'converter',
    configKey: 'converterModule',
  },
  defaults: DEFAULT_OPTIONS,
  setup(moduleOptions, nuxt) {
    const resolver = createResolver(import.meta.url)

    const resolvedOptions = {
      ...DEFAULT_OPTIONS,
      ...moduleOptions,
      ...(nuxt.options.runtimeConfig.converterModule || {}),
    }

    nuxt.options.runtimeConfig.converterModule = resolvedOptions

    nuxt.options.runtimeConfig.public = nuxt.options.runtimeConfig.public || {}
    nuxt.options.runtimeConfig.public.converterModule = {
      ...(nuxt.options.runtimeConfig.public.converterModule || {}),
      apiRoutePath: resolvedOptions.apiRoutePath,
      ttlSec: resolvedOptions.ttlSec,
    }

    nuxt.hook('nitro:config', (nitroConfig) => {
      nitroConfig.runtimeConfig = nitroConfig.runtimeConfig || {}
      nitroConfig.runtimeConfig.converterModule = {
        ...resolvedOptions,
        ...(nitroConfig.runtimeConfig.converterModule || {}),
      }
      nitroConfig.runtimeConfig.public = nitroConfig.runtimeConfig.public || {}
      nitroConfig.runtimeConfig.public.converterModule = {
        ...(nitroConfig.runtimeConfig.public.converterModule || {}),
        apiRoutePath: resolvedOptions.apiRoutePath,
        ttlSec: resolvedOptions.ttlSec,
      }
    })

    addServerHandler({
      route: resolvedOptions.apiRoutePath,
      handler: resolver.resolve('./runtime/server/api/rates.get'),
    })

    addServerHandler({
      route: resolvedOptions.refreshRoutePath,
      handler: resolver.resolve('./runtime/server/api/refresh.post'),
    })

    addImports({
      name: 'useConverter',
      from: resolver.resolve('./runtime/composables/useConverter'),
    })
  },
})
