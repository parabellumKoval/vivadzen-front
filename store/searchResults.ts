import { defineStore } from 'pinia'

/**
 * Stage 1: isOpen = true, showResults = false
 *   - показывается фон (background)
 *   - input поля для поиска видны
 *   - результаты скрыты
 * 
 * Stage 2: isOpen = true, showResults = true
 *   - показывается фон (background)
 *   - input поле видно
 *   - показываются результаты поиска
 */
export const useSearchResultsStore = defineStore('searchResults', {
  state: () => ({
    isOpen: false,
    showResults: false,
    searchQuery: '',
  }),

  getters: {
    getIsOpen: (state) => state.isOpen,
    getSearchQuery: (state) => state.searchQuery,
    getShowResults: (state) => state.showResults,
  },

  actions: {
    setIsOpen(value: boolean) {
      this.isOpen = value
    },

    setShowResults(value: boolean) {
      this.showResults = value
    },

    setSearchQuery(query: string) {
      this.searchQuery = query
    },

    // Stage 1: открыть модальное окно (показать фон)
    openStage1() {
      this.isOpen = true
      this.showResults = false
      this.searchQuery = ''
    },

    // Stage 2: показать результаты поиска
    openStage2(query: string) {
      this.isOpen = true
      this.showResults = true
      this.searchQuery = query
    },

    // Старый метод для совместимости
    open(query: string) {
      this.openStage2(query)
    },

    close() {
      this.searchQuery = ''
      this.isOpen = false
      this.showResults = false
    },
  }
})
