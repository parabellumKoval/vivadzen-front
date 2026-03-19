type CampaignApiItem = Record<string, any>

export const useCampaignApi = () => {
  const runtimeConfig = useRuntimeConfig()

  const list = async (placement: 'home' | 'catalog' | null = null): Promise<CampaignApiItem[]> => {
    const query = placement ? { placement } : {}
    const { data, error } = await useApiFetch(`${runtimeConfig.public.apiBase}/campaign`, query, 'GET', { lazy: false })

    if (error?.value) {
      return []
    }

    const payload = data?.value
    return Array.isArray(payload?.data) ? payload.data : []
  }

  const show = async (slug: string): Promise<CampaignApiItem | null> => {
    if (!slug) {
      return null
    }

    const { data, error } = await useApiFetch(`${runtimeConfig.public.apiBase}/campaign/${encodeURIComponent(slug)}`, null, 'GET', { lazy: false })

    if (error?.value) {
      return null
    }

    return data?.value || null
  }

  return {
    list,
    show
  }
}
