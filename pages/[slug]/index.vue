<script setup>

import {useProductStore} from '~/store/product'

import PageProduct from '~/components/Page/Product/Product.vue'
import PageProductSkeleton from '~/components/Page/Product/Skeleton/Skeleton.vue'

// import PageCategory from '~/components/Page/Category/Category.vue'
// import PageCategorySkeleton from '~/components/Page/Category/Skeleton/Skeleton.vue'

const route = useRoute()
const runtimeConfig = useRuntimeConfig()
const {locale} = useI18n()
const {region} = useRegion()

const isServer = process.server
const slugParam = route.params.slug
const slug = Array.isArray(slugParam) ? slugParam[0] : (slugParam || '')

const slugsRoutePath =
  runtimeConfig.public.categoryModule?.slugsRoutePath || '/api/_categories/slugs'

const {
  data: categorySlugs
} = await useAsyncData(
  'category-slugs-all',
  async () => {
    const response = await $fetch(slugsRoutePath)
    return Array.isArray(response?.slugs) ? response.slugs : []
  },
  {
    server: true,
    default: () => []
  }
)

const isCategory = computed(() => {
  if (!slug || typeof slug !== 'string') return false
  return (categorySlugs.value || []).includes(slug)
})

// Product loader
const {
  data: product,
  pending: productPending,
  error: productError
} = await useAsyncData(
  'product-' + slug + '-' + region.value + '-' + locale.value,
  async () => {
    // Ваша логика получения данных
    if (isCategory.value) return null
    
    // Пример упрощенной логики
    const response = await useProductStore().show(slug)
    const data = response.data.value
    
    // Если данных нет или ошибка - просто кидаем throw
    // useAsyncData поймает это и положит в productError
    if (response.error.value || !data) {
      throw createError({ statusCode: 404, message: 'Product Not Found' })
    }

    return data
  },
  {
    lazy: !isServer,
    server: true
  }
)

// 1. Обработка для СЕРВЕРА (ssr)
if (productError.value) {
  throw createError({ ...productError.value, fatal: true })
}

// 2. Обработка для КЛИЕНТА (lazy loading)
// Т.к. при lazy код идет дальше не дожидаясь ответа, нужно следить за ошибкой
if (process.client) {
  watch(productError, (err) => {
    if (err) {
      showError({ 
        statusCode: err.statusCode || 404, 
        statusMessage: 'Product Not Found', 
        fatal: true 
      })
    }
  })
}
</script>

<!-- <style src='' lang='scss' scoped></style> -->
<!-- <i18n src='' lang='yaml'></i18n> -->

<template>
  <div>
    <template v-if="!isCategory">
      <transition name="fade" mode="in-out">
        <component :is="productPending ? PageProductSkeleton : PageProduct" :product="product" />
        <!-- <page-product-skeleton></page-product-skeleton>
         <page-product v-if="!productPending" :product="product"></page-product> -->
      </transition>
    </template>
    <template v-else>
      <lazy-page-category></lazy-page-category>
      <!-- <transition name="fade" mode="in-out">
        <component :is="categoryPending ? PageCategorySkeleton : PageCategory" :categoryData="category" />
         <page-category-skeleton></page-category-skeleton>
         <page-category v-if="!categoryPending" :categoryData="category"></page-category>
      </transition> -->
    </template>
  </div>
</template>
