import type { RegionsRuntimeConfig } from '../../module'

type RegionPathOptions = { absolute?: boolean }

declare module '#app' {
  interface NuxtApp {
    $regionPath: (path: string, opts?: RegionPathOptions) => string
  }

  interface NuxtRuntimeConfig {
    regionsModule: RegionsRuntimeConfig
  }

  interface NuxtPublicRuntimeConfig {
    regionsModule: RegionsRuntimeConfig
  }
}

declare module 'vue' {
  interface ComponentCustomProperties {
    $regionPath: (path: string, opts?: RegionPathOptions) => string
  }
}

export {}
