import { addPlugin, createResolver, defineNuxtModule } from '@nuxt/kit'

type QueryParamValue = string | number | boolean | null | undefined

export type RegionalGtmContainer = string | {
  id?: string
  queryParams?: Record<string, QueryParamValue>
}

export interface RegionalGtmModuleOptions {
  enabled?: boolean
  containers?: Record<string, RegionalGtmContainer | null | undefined>
  defaultContainer?: RegionalGtmContainer | null
  fallbackRegion?: string
  regionAliases?: Record<string, string>
  dataLayerName?: string
  source?: string
  defer?: boolean
  compatibility?: boolean
  debug?: boolean
  reloadOnRegionChange?: boolean
  initialDataLayer?: Record<string, unknown>
}

const DEFAULT_OPTIONS: RegionalGtmModuleOptions = {
  enabled: true,
  containers: {},
  fallbackRegion: 'global',
  regionAliases: {},
  dataLayerName: 'dataLayer',
  source: 'https://www.googletagmanager.com/gtm.js',
  defer: false,
  compatibility: false,
  debug: false,
  reloadOnRegionChange: true,
  initialDataLayer: {},
}

export default defineNuxtModule<RegionalGtmModuleOptions>({
  meta: {
    name: 'regional-gtm',
    configKey: 'regionalGtm',
  },
  defaults: DEFAULT_OPTIONS,
  setup(options, nuxt) {
    const resolver = createResolver(import.meta.url)
    const runtimeDir = resolver.resolve('runtime')

    const resolvedOptions: RegionalGtmModuleOptions = {
      ...DEFAULT_OPTIONS,
      ...options,
      containers: {
        ...(DEFAULT_OPTIONS.containers || {}),
        ...(options.containers || {}),
      },
      regionAliases: {
        ...(DEFAULT_OPTIONS.regionAliases || {}),
        ...(options.regionAliases || {}),
      },
      initialDataLayer: {
        ...(DEFAULT_OPTIONS.initialDataLayer || {}),
        ...(options.initialDataLayer || {}),
      },
    }

    nuxt.options.runtimeConfig.public = nuxt.options.runtimeConfig.public || {}
    nuxt.options.runtimeConfig.public.regionalGtm = {
      ...((nuxt.options.runtimeConfig.public as any).regionalGtm || {}),
      ...resolvedOptions,
    }

    nuxt.options.build.transpile = nuxt.options.build.transpile || []
    if (!nuxt.options.build.transpile.includes(runtimeDir)) {
      nuxt.options.build.transpile.push(runtimeDir)
    }

    addPlugin({
      src: resolver.resolve('runtime/plugins/regional-gtm.client'),
      mode: 'client',
    })

    nuxt.hook('prepare:types', (options) => {
      options.references.push({ path: resolver.resolve('runtime/types/regional-gtm.d.ts') })
    })
  },
})
