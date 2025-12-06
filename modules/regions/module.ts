import { addImportsDir, addPlugin, addRouteMiddleware, addServerHandler, createResolver, defineNuxtModule } from '@nuxt/kit'
import { registerPagesExtension } from './internal/page-extension'
import { resolveRuntimeConfig } from './internal/runtime-config'
import { DEFAULT_FALLBACK_REGION } from './internal/region-definitions'
import type { RegionsModuleOptions, RegionsRuntimeConfig } from './types'

export default defineNuxtModule<RegionsModuleOptions>({
  meta: {
    name: 'regions-module',
    configKey: 'regionsModule'
  },
  defaults: {
    regions: {},
    fallbackRegion: DEFAULT_FALLBACK_REGION
  },
  setup (options, nuxt) {
    const resolver = createResolver(import.meta.url)
    const runtimeDir = resolver.resolve('runtime')

    const moduleRuntimeConfig: RegionsRuntimeConfig = resolveRuntimeConfig(nuxt, options)

    nuxt.options.runtimeConfig = {
      ...nuxt.options.runtimeConfig,
      regionsModule: {
        ...(nuxt.options.runtimeConfig.regionsModule as Partial<RegionsRuntimeConfig> || {}),
        ...moduleRuntimeConfig
      },
      public: {
        ...nuxt.options.runtimeConfig.public,
        regionsModule: {
          ...(nuxt.options.runtimeConfig.public?.regionsModule as Partial<RegionsRuntimeConfig> || {}),
          ...moduleRuntimeConfig
        }
      }
    }

    nuxt.options.build.transpile = nuxt.options.build.transpile || []
    if (!nuxt.options.build.transpile.includes(runtimeDir)) {
      nuxt.options.build.transpile.push(runtimeDir)
    }

    addImportsDir(resolver.resolve('runtime/composables'))

    addPlugin(resolver.resolve('runtime/plugins/region-path'))
    addPlugin(resolver.resolve('runtime/plugins/hreflang'))
    
    addRouteMiddleware({
      name: 'region',
      path: resolver.resolve('runtime/middleware/region.global'),
      global: true
    })
    addServerHandler({
      handler: resolver.resolve('runtime/server/middleware/region-rewrite'),
      middleware: true
    })
    nuxt.hook('prepare:types', (options) => {
      options.references.push({ path: resolver.resolve('runtime/types/region-path.d.ts') })
    })

    registerPagesExtension(nuxt, moduleRuntimeConfig)
  }
})

export type { RegionsModuleOptions, RegionsRuntimeConfig, RegionMetaWithCode } from './types'
