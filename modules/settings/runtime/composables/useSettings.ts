export function useSettings() {
  const { $getSetting, $settings } = useNuxtApp() as any
  return {
    all: $settings as Ref<Record<string, any>>,
    get: $getSetting as (key: string, def?: any) => any,
  }
}
