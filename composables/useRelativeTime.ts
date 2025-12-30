import { computed } from 'vue'

type RelativeTimeInput = string | number | Date | null | undefined

type UseRelativeTimeOptions = {
  fallback?: (value: RelativeTimeInput, parsedTimestamp: number | null) => string
}

const relativeTimeUnits: { unit: Intl.RelativeTimeFormatUnit; ms: number }[] = [
  { unit: 'year', ms: 1000 * 60 * 60 * 24 * 365 },
  { unit: 'month', ms: 1000 * 60 * 60 * 24 * 30 },
  { unit: 'week', ms: 1000 * 60 * 60 * 24 * 7 },
  { unit: 'day', ms: 1000 * 60 * 60 * 24 },
  { unit: 'hour', ms: 1000 * 60 * 60 },
  { unit: 'minute', ms: 1000 * 60 },
  { unit: 'second', ms: 1000 },
]

const parseTimestamp = (value: RelativeTimeInput): number | null => {
  if (value == null || value === '') {
    return null
  }

  if (typeof value === 'number') {
    return value
  }

  if (value instanceof Date) {
    return value.getTime()
  }

  const parsed = Date.parse(value)
  if (Number.isNaN(parsed)) {
    return null
  }

  return parsed
}

export const useRelativeTime = () => {
  const { locale } = useI18n()

  const relativeFormatter = computed(() => {
    const currentLocale = locale.value || 'ru'
    if (typeof Intl === 'undefined' || typeof Intl.RelativeTimeFormat !== 'function') {
      return null
    }

    try {
      return new Intl.RelativeTimeFormat(currentLocale, {
        numeric: 'always',
        style: 'long',
      })
    } catch {
      return new Intl.RelativeTimeFormat('ru', {
        numeric: 'always',
        style: 'long',
      })
    }
  })

  const formatRelativeTime = (value: RelativeTimeInput, options: UseRelativeTimeOptions = {}) => {
    const parsed = parseTimestamp(value)
    if (parsed === null) {
      return options.fallback?.(value, null) ?? ''
    }

    const formatter = relativeFormatter.value
    if (!formatter) {
      return options.fallback?.(value, parsed) ?? ''
    }

    const diffMs = parsed - Date.now()
    const absDiff = Math.abs(diffMs)
    const unitEntry =
      relativeTimeUnits.find((entry) => absDiff >= entry.ms) ??
      relativeTimeUnits[relativeTimeUnits.length - 1]

    let relativeValue = Math.trunc(diffMs / unitEntry.ms)
    if (relativeValue === 0) {
      relativeValue = diffMs < 0 ? -1 : 1
    }

    return formatter.format(relativeValue, unitEntry.unit)
  }

  return {
    formatRelativeTime,
  }
}
