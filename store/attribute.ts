import { defineStore } from "pinia";

type Attribute = {
  id: number,
  name: string,
  slug: string,
  type: string,
  defaultValue: string,
  si: string,
  content: string,
  values: object[]
};

export const useAttributeStore = defineStore('attributeStore', {
  state: () => ({}),
  
  getters: {},

  actions: {

    indexLazy(query: Object) {
      const url = useRuntimeConfig().public.apiBase + '/attribute'
      return useApiFetch(url, query, 'GET', {lazy: true})
    },

    async getAll(query: Object) {
      const url = useRuntimeConfig().public.apiBase + '/attribute'
      return await useServerApiFetch(url, query)
    },

    async index(query: Object, refresh: boolean = true) {
      return await this.getAll(query).then(({ data }) => {
        if(!data)
          return

        return data
      })
    },

  },
})