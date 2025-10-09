export const useRegionStore = defineStore('region', () => {
  const region = ref<'global' | 'ua' | 'cz' | 'de' | 'es'>('global');
  function setRegion(v: typeof region.value) { region.value = v; }
  return { region, setRegion };
});

