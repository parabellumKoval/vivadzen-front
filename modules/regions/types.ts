export interface RegionMeta {
  name: string
  locale: string
  currency: string
  flagClass: string
}

export type RegionDefinitions = Record<string, RegionMeta>
export type RegionAliases = Record<string, string>

export interface RegionsModuleOptions {
  regions?: RegionDefinitions
  regionAliases?: RegionAliases
  fallbackRegion?: string
  fallbackCurrency?: string
}

export interface RegionMetaWithCode extends RegionMeta {
  code: string
}

export interface RegionsRuntimeConfig {
  regions: string[]
  regionAliases: RegionAliases
  locales: string[]
  fallbackRegion: string
  fallbackCurrency: string
  regionsMeta: Record<string, RegionMeta>
  regionsMetaArray: RegionMetaWithCode[]
  localeByRegion: Record<string, string>
  currencyByRegion: Record<string, string>
}
