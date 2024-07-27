<script setup>
// import {useFetchReview} from '~/composables/review/useFetchReview.ts'
// import {useFilter} from '~/composables/product/useFilter.ts'
// import {useFilterItem} from '~/composables/product/useFilterItem.ts'

const props = defineProps({
  category: {
    type: Object,
    required: true
  }
})

const {t} = useI18n()
const route = useRoute()

const {getFilters} = useFilter()
const {setFilters} = useFilterItem()

// Attributes
const attributes = ref([])

const breadcrumbs = ref([])

// COMPUTED
const slug = computed(() => {
  return route.path.substring(route.path.lastIndexOf('/') + 1) || null 
})

const setCrumbs = () => {
  let cat = props.category

  // categories tree
  while(cat) {
    breadcrumbs.value.unshift({
      name: cat?.name,
      item: `/${cat?.slug}`     
    })

    cat = cat.parent
  }

  breadcrumbs.value.unshift({
    name: t('title.home'),
    item: '/'
  })
    
}

const categories = computed(() => {
  return props.category.children
})

// METHODS
const getQuery = () => {
  let query = {
    per_page: 20,
    page: route.query.page || 1
  }

  if(slug.value)
    query.category_slug = slug.value

  // Set filters from URL
  if(route.query) {
    const selections = setFilters(route.query)
    
    if(selections?.length) {
      query.selections = selections
    }
  }

  return query
}

const setSeo = () => {
  useHead({
    title: props.category.seo.meta_title,
    meta: [
      {
        name: 'description',
        content: props.category.seo.meta_description
      },
    ],
  })
}

// HOOKS
// onServerPrefetch(() => {
//   setSchema(props.product, reviews.value)
// })
setSeo()

setCrumbs()

// const {data: filtersData} = await getFilters(getQuery())
getFilters(getQuery()).then(({data}) => {
  if(data.value) {
    attributes.value = data.value
  }
})

// watch(filtersData, (v) => {
//   if(v) {
//     attributes.value = v
//   }
// }, {
//   immediate: true
// })
</script>

<style src="./category.scss" lang="scss" scoped></style>

<template>
  <NuxtLayout
    name="category"
    :slug="slug"
    :breadcrumbs="breadcrumbs"
    :attributes="attributes"
    :initQuery="getQuery()"
  >
    <template #title>
      {{ category.name }}
    </template>

    <template #header>
      <lazy-catalog-categories v-if="categories?.length" :categories="categories"></lazy-catalog-categories>
    </template>
    
    <template #footer>
      <lazy-catalog-reviews :slug="slug" :category="category" class="review-wrapper"></lazy-catalog-reviews>

      <lazy-catalog-text v-if="category.content" :content="category.content" class="seo-text"></lazy-catalog-text>

      <lazy-section-faq-catalog :category="category" class="faq-section"></lazy-section-faq-catalog>
    </template>
  </NuxtLayout>
</template>