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

  return {
    list
  }
}
