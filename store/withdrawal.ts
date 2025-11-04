export const useWithdrawalStore = defineStore('withdrawalStore', {
  state: () => ({
  }),
  
  getters: {
  },

  actions: {
    async create(data = null) {
      const runtimeConfig = useRuntimeConfig()
      const url = `${runtimeConfig.public.apiBase}/wallet/withdrawals`

      return await useApiFetch(url, data, 'POST')
        .then(({data, error}) => {
          if(data.value) {
            return data.value
          }

          if(error)
            throw error
        })
    },

  },
})