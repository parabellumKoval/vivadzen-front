import type { Nuxt, NuxtPage } from 'nuxt/schema'
import type { RegionsRuntimeConfig } from '../types'

const escapeRegExp = (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

const buildRegionPrefixRegExp = (regions: string[]) => {
  if (!regions.length) {
    return /^$/
  }

  const pattern = regions.map(escapeRegExp).join('|')
  return new RegExp(`^/(${pattern})(/|$)`)
}

const trimSlashes = (segment: string) => segment.replace(/^\/+|\/+$/g, '')

const buildPrefixedPath = (originalPath: string, segments: string[]) => {
  const prefix = segments.map(trimSlashes).filter(Boolean).join('/')
  const normalizedOriginal = originalPath === '/' ? '' : originalPath

  if (!prefix) {
    return normalizedOriginal || '/'
  }

  if (!normalizedOriginal) {
    return `/${prefix}`
  }

  if (normalizedOriginal.startsWith('/')) {
    return `/${prefix}${normalizedOriginal}`
  }

  return `/${prefix}/${normalizedOriginal}`
}

const cloneChild = (page: NuxtPage, segments: string[], nameSuffix: string): NuxtPage => {
  const clone = {
    ...page,
    name: page.name ? `${page.name}${nameSuffix}` : page.name
  }

  if (page.path?.startsWith('/')) {
    clone.path = buildPrefixedPath(page.path, segments)
  }

  if (page.alias?.length) {
    clone.alias = page.alias.map((alias) => {
      return alias.startsWith('/') ? buildPrefixedPath(alias, segments) : alias
    })
  }

  if (page.children?.length) {
    clone.children = page.children.map((child) => cloneChild(child, segments, nameSuffix))
  }

  return clone
}

const cloneWithPrefix = (page: NuxtPage, segments: string[], nameSuffix: string): NuxtPage => {
  const clone = {
    ...page,
    name: page.name ? `${page.name}${nameSuffix}` : page.name,
    path: buildPrefixedPath(page.path, segments),
    alias: page.alias?.map((alias) => alias.startsWith('/') ? buildPrefixedPath(alias, segments) : alias)
  }

  if (page.children?.length) {
    clone.children = page.children.map((child) => cloneChild(child, segments, nameSuffix))
  }

  return clone
}

export const registerPagesExtension = (nuxt: Nuxt, runtimeConfig: RegionsRuntimeConfig) => {
  nuxt.hook('pages:extend', (pages) => {
    const clones: NuxtPage[] = []
    const fallbackRegion = runtimeConfig.fallbackRegion
    const regionCodes = Array.from(new Set(
      [fallbackRegion, ...runtimeConfig.regions].filter((code): code is string => Boolean(code))
    ))
    const regionPattern = buildRegionPrefixRegExp(regionCodes)
    const hasLocales = Boolean(runtimeConfig.locales.length)
    const localeDescriptor = hasLocales
      ? `:locale(${runtimeConfig.locales.join('|')})`
      : null

    for (const page of pages) {
      if (page.path.startsWith('/:region')) continue
      if (regionPattern.test(page.path)) continue

      for (const region of runtimeConfig.regions) {
        const baseSegments = [region]
        clones.push(cloneWithPrefix(page, baseSegments, `-region-${region}`))

        if (localeDescriptor) {
          const localeSegments = [region, localeDescriptor]
          clones.push(cloneWithPrefix(page, localeSegments, `-region-${region}-locale`))
        }
      }

      if (fallbackRegion) {
        clones.push(cloneWithPrefix(page, [fallbackRegion], `-region-${fallbackRegion}`))

        if (localeDescriptor) {
          clones.push(
            cloneWithPrefix(page, [fallbackRegion, localeDescriptor], `-region-${fallbackRegion}-locale`)
          )
        }
      }
    }

    pages.push(...clones)
  })
}
