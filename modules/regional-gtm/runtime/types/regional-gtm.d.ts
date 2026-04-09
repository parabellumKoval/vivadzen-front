type RegionalGtmApi = {
  region: string
  id: string
  dataLayerName: string
  push: (payload: Record<string, unknown>) => void
}

declare module '#app' {
  interface NuxtApp {
    $regionalGtm: RegionalGtmApi
  }
}

declare module 'vue' {
  interface ComponentCustomProperties {
    $regionalGtm: RegionalGtmApi
  }
}

export {}
