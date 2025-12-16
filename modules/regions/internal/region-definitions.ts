import type { RegionAliases, RegionDefinitions, RegionLocales, RegionMeta } from '../types'

export const DEFAULT_FALLBACK_REGION = 'global'

const normalizeLocaleCode = (value: string | undefined | null) => String(value || '').trim().toLowerCase()

export const normalizeRegionDefinitions = (definitions?: RegionDefinitions): RegionDefinitions => {
  if (!definitions) return {}

  return Object.entries(definitions).reduce<RegionDefinitions>((acc, [code, meta]) => {
    if (!code || !meta) return acc

    const normalizedCode = code.trim().toLowerCase()
    if (!normalizedCode) return acc

    const normalizedMeta: RegionMeta = {
      name: String(meta.name || '').trim() || normalizedCode,
      locale: String(meta.locale || '').trim().toLowerCase(),
      currency: String(meta.currency || '').trim().toUpperCase(),
      flagClass: String(meta.flagClass || '').trim()
    }

    if (!normalizedMeta.locale || !normalizedMeta.currency) {
      return acc
    }

    acc[normalizedCode] = normalizedMeta
    return acc
  }, {})
}

export const computeRegionCodes = (definitions: RegionDefinitions, fallbackRegion: string): string[] => {
  return Object.keys(definitions).filter((code) => code !== fallbackRegion)
}

export const collectLocalesFromDefinitions = (definitions: RegionDefinitions): string[] => {
  const set = new Set<string>()
  Object.values(definitions).forEach((meta) => {
    if (meta.locale) {
      set.add(meta.locale)
    }
  })
  return Array.from(set)
}

export const buildLocaleByRegionMap = (definitions: RegionDefinitions): Record<string, string> => {
  return Object.entries(definitions).reduce<Record<string, string>>((acc, [code, meta]) => {
    if (meta.locale) {
      acc[meta.locale] = code
    }
    return acc
  }, {})
}

export const buildCurrencyByLocaleMap = (definitions: RegionDefinitions): Record<string, string> => {
  return Object.entries(definitions).reduce<Record<string, string>>((acc, [, meta]) => {
    if (meta.locale && meta.currency) {
      acc[meta.locale] = meta.currency
    }
    return acc
  }, {})
}

export const normalizeRegionAliases = (
  definitions: RegionDefinitions,
  aliases?: RegionAliases
): RegionAliases => {
  if (!aliases) return {}

  return Object.entries(aliases).reduce<RegionAliases>((acc, [rawRegion, rawAlias]) => {
    const regionCode = String(rawRegion || '').trim().toLowerCase()
    if (!regionCode || !definitions[regionCode]) {
      return acc
    }

    const alias = String(rawAlias || '').trim()
    if (!alias) {
      return acc
    }

    acc[regionCode] = alias
    return acc
  }, {})
}

export const normalizeLocalesByRegion = (
  definitions: RegionDefinitions,
  matrix: RegionLocales | undefined,
  availableLocales: string[]
): RegionLocales => {
  const allowed = new Set(availableLocales.map(normalizeLocaleCode).filter(Boolean))
  const fallbackList = allowed.size ? Array.from(allowed) : []

  return Object.entries(definitions).reduce<RegionLocales>((acc, [rawCode, meta]) => {
    const regionCode = normalizeLocaleCode(rawCode)
    if (!regionCode) return acc

    const configured = Array.isArray(matrix?.[regionCode])
      ? matrix?.[regionCode]
      : []

    const normalizedConfigured = (configured || [])
      .map(normalizeLocaleCode)
      .filter((locale) => locale && (!allowed.size || allowed.has(locale)))

    const baseList = normalizedConfigured.length
      ? normalizedConfigured
      : fallbackList

    const defaultLocale = normalizeLocaleCode(meta.locale)
    const merged = Array.from(new Set([defaultLocale, ...baseList].filter(Boolean)))

    acc[regionCode] = merged.length
      ? merged
      : (defaultLocale ? [defaultLocale] : (fallbackList[0] ? [fallbackList[0]] : ['en']))

    return acc
  }, {})
}
