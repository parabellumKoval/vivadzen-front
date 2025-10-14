import { defineNuxtModule } from '@nuxt/kit'
import type { NuxtPage } from 'nuxt/schema'

export interface RegionsModuleOptions {
  regions: string[]
  locales?: string[] // опционально: второй сегмент как язык
}

export default defineNuxtModule<RegionsModuleOptions>({
  meta: { name: 'regions-module' },
  defaults: {
    regions: ['ua', 'cz', 'de', 'es'],
    locales: ['uk','ru','cs','de','en','es'] // напр. ['uk','ru','cs','de','en','es'] если нужен второй сегмент
  },
  setup (opts, nuxt) {
    const regionPattern = buildRegionPrefixRegExp(opts.regions)
    const hasLocales = Boolean(opts.locales && opts.locales.length)
    const localeDescriptor = hasLocales ? `:locale(${opts.locales!.join('|')})` : null

    nuxt.hook('pages:extend', (pages) => {
      const clones: NuxtPage[] = []

      for (const page of pages) {
        // пропускаем уже сгенерённые/префиксные
        if (page.path.startsWith('/:region')) continue
        if (regionPattern.test(page.path)) continue

        for (const region of opts.regions) {
          const baseSegments = [region]
          clones.push(cloneWithPrefix(page, baseSegments, `-region-${region}`))

          if (localeDescriptor) {
            const localeSegments = [region, localeDescriptor]
            clones.push(cloneWithPrefix(page, localeSegments, `-region-${region}-locale`))
          }
        }
      }

      pages.push(...clones)
    })
  }
})

const escapeRegExp = (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

const buildRegionPrefixRegExp = (regions: string[]) => {
  if (!regions.length) {
    return /^$/ // заглушка, всё равно не совпадёт
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

const cloneWithPrefix = (page: NuxtPage, segments: string[], nameSuffix: string): NuxtPage => {
  const clone: NuxtPage = {
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

const cloneChild = (page: NuxtPage, segments: string[], nameSuffix: string): NuxtPage => {
  const clone: NuxtPage = {
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
