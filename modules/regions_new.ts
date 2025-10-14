import { defineNuxtModule } from '@nuxt/kit'

export interface RegionsModuleOptions {
  regions: string[]
  locales?: string[] // опционально: второй сегмент как язык
}

type Page = {
  name?: string
  path: string
  file?: string
  children?: Page[]
  [k: string]: any
}

function deepClone<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj))
}

function prefixNames(route: Page, suffix: string) {
  if (route.name) route.name = `${route.name}${suffix}`
  route.children?.forEach((c) => prefixNames(c, suffix))
}

export default defineNuxtModule<RegionsModuleOptions>({
  meta: { name: 'regions-module' },
  defaults: {
    regions: ['ua','cz','de','es'],
    locales: ['uk','ru','cs','de','en','es']
  },
  setup (opts, nuxt) {
    nuxt.hook('pages:extend', (pages) => {
      // 1) забираем исходное дерево и чистим массив,
      //    чтобы потом вернуть уже обёрнутые версии
      const original: Page[] = deepClone(pages)
      pages.length = 0

      console.log('pages_here')
      // Хелпер: создать виртуальный родитель с children = копия original
      const makeWrapped = (parentPath: string, nameSuffix: string) => {
        const wrappedChildren = deepClone(original)
        // чтобы избежать коллизий имён – добавим суффикс
        wrappedChildren.forEach((r) => prefixNames(r, nameSuffix))
        return <Page>{
          name: `__wrap${nameSuffix}`,
          path: parentPath,
          // у виртуального родителя файла нет
          children: wrappedChildren
        }
      }

      // 2) Вариант “/region/...”
      //    Вместо перечисления регионов в нескольких корнях
      //    используем валидируемый параметр :region(...)
      const regionPattern = opts.regions.join('|')
      pages.push(
        makeWrapped(`/:region(${regionPattern})`, '-r')
      )

      // 3) Опциональный вариант “/region/locale/...”
      if (opts.locales && opts.locales.length) {
        const localePattern = opts.locales.join('|')
        pages.push(
          makeWrapped(`/:region(${regionPattern})/:locale(${localePattern})`, '-rl')
        )
      }

      // 4) ВАЖНО: не трогаем оригинальные корневые маршруты (без префиксов)
      //    чтобы /account и дальше работали как прежде
      //    (если это не нужно — можно НЕ возвращать original)
      pages.push(...original)
    })
  }
})
