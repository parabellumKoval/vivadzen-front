type Review = {
  id: number,
  text: string,
  likes: number,
  dislikes: number,
  owner: object,
  children: object[]
};

export const useReviewStore = defineStore('reviewStore', {
  state: () => ({
    reviewableId: null as Number | null,
    reviewableType: null as String | null,
  }),
  
  getters: {},

  actions: {
    setReviewable(id: Number, type: String) {
      this.reviewableId = id
      this.reviewableType = type
    },

    clearReviewable() {
      this.reviewableId = null
      this.reviewableType = null
    },

    async indexLazy(query: string) {
      const runtimeConfig = useRuntimeConfig()
      const params = query? '?' + new URLSearchParams(query).toString(): '';
      const url = `${runtimeConfig.public.apiBase}/review${params}`

      return useApiFetch(url, null, 'GET', {lazy: true})
    },

    async getAll(query: string) {
      const runtimeConfig = useRuntimeConfig()
      const params = query? '?' + new URLSearchParams(query).toString(): '';
      const url = `${runtimeConfig.public.apiBase}/review${params}`

      return await useApiFetch(url).then(({data}) => {
        return {
          reviews: data?.value?.data || [],
          meta: data?.value?.meta || null
        }
      })
    },

    async create(data: object) {
      const runtimeConfig = useRuntimeConfig()
      const url = `${runtimeConfig.public.apiBase}/review`

      const fullData = {
        ...data,
        // 'reviewable_id': this.reviewableId,
        // 'reviewable_type': this.reviewableType,
      }

      return await useApiFetch(url, fullData, 'POST').then((response) => {
        return {data: response.data, error: response.error}
      })
    },

    async like(id: number, data: object) {
      const runtimeConfig = useRuntimeConfig()
      const url = `${runtimeConfig.public.apiBase}/review/${id}/like`;

      return await useApiFetch(url, data, 'POST').then(({data, error}) => {

        if(data) {
          const likes = data.likes
          const dislikes = data.dislikes

          // this.allState.data.map((item) => {

          //   if(item.id === id){
          //     if(likes !== undefined && likes !== null)
          //       item.likes = likes

          //     if(dislikes !== undefined && dislikes !== null)
          //       item.dislikes = dislikes
          //   }else {
          //     item.children && item.children.map((ch) => {
          //       if(ch.id === id){
          //         if(likes !== undefined && likes !== null)
          //           ch.likes = likes
  
          //         if(dislikes !== undefined && dislikes !== null)
          //           ch.dislikes = dislikes
          //       }
    
          //       return ch
          //     })
          //   }
    
          //   return item
          // })
        }

        if(error) {
          throw error
        }
      })
    }
  },
})