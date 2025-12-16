import { useState } from '#imports'

const normalizeRegionCode = (value: string | null | undefined) => String(value || '').trim().toLowerCase()

export const useHreflang = () => {
  const allowedRegions = useState<string[] | null>('hreflang-allowed-regions', () => null)

  const setHreflangRegions = (regions?: string[] | null) => {
    if (!regions || !Array.isArray(regions) || !regions.length) {
      allowedRegions.value = null
      return
    }

    const normalized = Array.from(new Set(
      regions
        .map((value) => normalizeRegionCode(value))
        .filter(Boolean)
    ))

    allowedRegions.value = normalized.length ? normalized : null
  }

  const clearHreflangRegions = () => {
    allowedRegions.value = null
  }

  return {
    allowedRegions,
    setHreflangRegions,
    clearHreflangRegions
  }
}
