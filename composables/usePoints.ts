export const usePoints = () => {
  const { get } = useSettings()

  const name = computed(() => {
    return get('profile.points.name') || 'Points'
  })

  const resolve = (value: string) => {
    if (['point', 'points'].includes(value?.toLowerCase())) {
      return name.value
    }
    return value
  }

  return {
    name,
    resolve
  }
}
