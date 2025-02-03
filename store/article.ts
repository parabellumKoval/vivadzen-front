export const useArticleStore = defineStore('articleStore', {
  state: () => ({}),
  
  getters: {},

  actions: {
    async indexLazy(params: Object) {
      const url = useRuntimeConfig().public.apiBase + '/articles'
      return await useApiFetch(url, params, 'GET', {lazy: true})
    },

    async index(params: Object) {
      const url = useRuntimeConfig().public.apiBase + '/articles'

      return await useServerApiFetch(url, params).then(({data, error}) => {
        if(data) {
          return data
        }

        if(error)
          throw error
      })
    },

    async show(slug: string) {
      const url = `${useRuntimeConfig().public.apiBase}/articles/${slug}`

      return await useServerApiFetch(url).then(({data, error}) => {
        if(data.data) {
          return data.data
        }

        if(error)
          throw error
      })
    },
  },
})