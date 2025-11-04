// app/composables/useShortcodes.ts
type ResolverSync = (key: string) => unknown

const SHORTCODE_RE = /\{\{\s*([a-zA-Z_][\w-]*)::\s*([^\}]+?)\s*\}\}/g

function normalizeKey(raw: string): string {
  const trimmed = (raw ?? '').trim()
  // Починка частых опечаток вида trailing `]`
  return trimmed.replace(/^\[/, '').replace(/\]$/, '')
}

// ====== ВСТАВЬТЕ СВОЮ СИНХРОННУЮ ЛОГИКУ НИЖЕ ======

// TODO: синхронный геттер настроек (например, из уже прогретого кеша/стора)
function settingsGetSync(path: string): unknown {
  
  const p = normalizeKey(path)

  return useSettings().get(p)
}

// TODO: карта base-переменных (значение или функция без async)
const baseMap: Record<string, unknown | (() => unknown)> = {
  // пример:
  currency: () => useRegion().currency.value,
}

// TODO: дополнительные пространства имён (при необходимости)
// Заполняйте объект парами ns -> resolver
const extraResolvers: Record<string, ResolverSync> = {
  // env: (key) => useRuntimeConfig().public[normalizeKey(key)],
}

// ====== КОНЕЦ СЕКЦИИ ДЛЯ ВАШЕЙ ЛОГИКИ ======


function makeRegistry(): Map<string, ResolverSync> {
  const reg = new Map<string, ResolverSync>()

  reg.set('settings', (key: string) => settingsGetSync(key))

  reg.set('base', (key: string) => {
    const k = normalizeKey(key)
    const v = baseMap[k]
    return typeof v === 'function' ? (v as () => unknown)() : v
  })

  for (const [ns, resolver] of Object.entries(extraResolvers)) {
    reg.set(ns, resolver)
  }

  return reg
}

function resolveTokenSync(registry: Map<string, ResolverSync>, ns: string, rawKey: string): string {
  try {
    const resolver = registry.get(ns)
    if (!resolver) return '' // неизвестный namespace → пустая строка
    const val = resolver(rawKey)
    return val == null ? '' : String(val) // null/undefined → пустая строка
  } catch {
    return '' // любые ошибки → пустая строка
  }
}

export function useShortcodes() {
  const registry = useState<Map<string, ResolverSync>>('shortcode-registry-sync', makeRegistry)

  function render(input: string): string {
    if (!input || typeof input !== 'string') return input as string

    // Собираем и дедуплицируем токены
    const matches: Array<{ full: string; ns: string; key: string }> = []
    input.replace(SHORTCODE_RE, (full, ns: string, key: string) => {
      matches.push({ full, ns, key })
      return full
    })
    if (matches.length === 0) return input

    const unique = new Map<string, { ns: string; key: string }>()
    for (const m of matches) if (!unique.has(m.full)) unique.set(m.full, { ns: m.ns, key: m.key })

    const resolved = new Map<string, string>()
    for (const [full, { ns, key }] of unique.entries()) {
      const out = resolveTokenSync(registry.value, ns, key)
      resolved.set(full, out)
    }

    let out = ''
    let last = 0
    input.replace(SHORTCODE_RE, (m, _ns, _key, offset: number) => {
      out += input.slice(last, offset) + (resolved.get(m) ?? '')
      last = offset + m.length
      return m
    })
    out += input.slice(last)
    return out
  }

  // Оставил для удобства, можно удалить.
  function register(namespace: string, resolver: ResolverSync) {
    registry.value.set(namespace, resolver)
  }

  return { render, register }
}
