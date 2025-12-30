<script setup>
// import {useFilterItem} from '~/composables/product/useFilterItem.ts'
// import {useCatalog} from '~/composables/product/useCatalog.ts'

const {t} = useI18n()
const route = useRoute()
const router = useRouter()
const {activeFilters, activeAttrs, updateActiveFilters} = useFilter()
const {catalogMeta, pending, setMode} = useCatalog()
const modal = useModal()

// REFS для сохранения состояния фильтров при открытии модала
const savedFiltersState = ref(null)
const savedQueryState = ref(null)
const isApplying = ref(false)

// COMPUTEDS
const data = computed(() => {
  return modal.active.data
})

const productsLength = computed(() => {
  const metaTotal = catalogMeta.value?.total
  if (typeof metaTotal === 'number') {
    return metaTotal
  }

  return data.value?.productsMeta?.total || 0 
})

const filtersLength = computed(() => {
  return activeAttrs?.value?.length
})

const formatProductsLabel = (count) => {
  const resolvedCount = typeof count === 'number' ? count : Number(count) || 0
  const translation = t('label.products', {products: resolvedCount})

  return translation
}

const productsLabel = computed(() => {
  return formatProductsLabel(productsLength.value || 0)
})

// HELPERS
const cloneFiltersState = (filters) => {
  return JSON.parse(JSON.stringify(filters ?? []))
}

const cloneQueryState = (query) => {
  return JSON.parse(JSON.stringify(query || {}))
}

const isSameQuery = (first, second) => {
  return JSON.stringify(first || {}) === JSON.stringify(second || {})
}

// METHODS
const saveFiltersState = () => {
  // Сохраняем текущее состояние фильтров
  savedFiltersState.value = cloneFiltersState(activeFilters.value)
  savedQueryState.value = cloneQueryState(route.query)
}

const restoreFiltersState = () => {
  // Восстанавливаем сохраненное состояние фильтров
  if (savedFiltersState.value !== null) {
    updateActiveFilters(cloneFiltersState(savedFiltersState.value))
  }
}

const restoreQueryState = async () => {
  if (savedQueryState.value === null) {
    return
  }

  const currentQuery = cloneQueryState(route.query)
  if (isSameQuery(currentQuery, savedQueryState.value)) {
    return
  }

  setMode('FILTER')
  await router.replace({
    path: route.path,
    query: {...savedQueryState.value}
  })
}

// HANDLERS
const applyHandler = () => {
  isApplying.value = true
  modal.close()
}

const cancelHandler = async () => {
  restoreFiltersState()
  await restoreQueryState()
  modal.close()
}

// WATCHERS
watch(() => modal.active.show, (isOpen) => {
  if (isOpen) {
    saveFiltersState()
    isApplying.value = false
  }
}, {
  immediate: true
})
</script>

<style src='./filters.scss' lang='scss' scoped></style>
<!-- <i18n src='' lang='yaml'></i18n> -->

<template>
  <modal-wrapper @close="cancelHandler" :title="t('label.filters')" type="full">
    <div class="selected-outer">
      <div v-if="filtersLength" class="selected-wrapper">
        <filter-selected :filters="data.filters" ></filter-selected>
      </div>
      
      <filter-list
        :filters="data.filters"
        :meta="data.meta"
        :class="{pending: pending}"
        class="filters"
      ></filter-list>

      <div class="buttons">
        <div class="label">
          {{ t('label.show') }} {{ productsLabel }}
        </div>
        <button @click="applyHandler" class="button primary small apply-btn">
          {{ t('button.apply') }}
          <template v-if="filtersLength">
            {{ ` (${filtersLength})` }}
          </template>
        </button>
      </div>
    </div>
  </modal-wrapper>
</template>
