export const useMonoStore = defineStore('monoStore', {
  state: () => ({
  }),
  
  getters: {
  },

  actions: {
    async createPayment(data: Object) {

      const url = `${useRuntimeConfig().public.apiBase}/mono/create`

      return await useApiFetch(url, {...data}, 'POST')
        .then(({data, error}) => {

          console.log('mono', data)

          if(data) {
            return data
          }

          if(error)
            throw error
        })
        .catch((e) => {
          throw e
        })
    },
  },
})