export const useCatalogStore = defineStore('catalogStore', {
  state: () => ({}),
  
  getters: {},

  actions: {
    async index(query: Object) {
      const url = useRuntimeConfig().public.apiBase + '/catalog_data'
      return await useServerApiFetch(url, query)
    },
  },
})