import { defineNuxtModule } from '@nuxt/kit'

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
    nuxt.hook('pages:extend', (pages) => {
      const clones = []

      for (const page of pages) {
        // пропускаем уже сгенерённые/префиксные
        if (page.path.startsWith('/:region') || page.path.match(/^\/(ua|cz|de|es)(\/|$)/)) continue

        for (const r of opts.regions) {
          // 1) /{region}{original}
          clones.push({
            ...page,
            name: `${page.name}-region-${r}`,
            path: `/${r}${page.path === '/' ? '' : page.path}`,
            file: page.file
          })

          // 2) опционально /{region}/{locale}{original}
          if (opts.locales && opts.locales.length) {
            clones.push({
              ...page,
              name: `${page.name}-region-${r}-locale`,
              // Напр. /ua/(uk|ru)/about
              path: `/${r}/:locale(${opts.locales.join('|')})${page.path === '/' ? '' : page.path}`,
              file: page.file
            })
          }
        }
      }

      // console.log('all_pages', clones)
      pages.push(...clones)
    })
  }
})
