<script setup>

import {useProductStore} from '~/store/product'

import PageProduct from '~/components/Page/Product/Product.vue'
import PageProductSkeleton from '~/components/Page/Product/Skeleton/Skeleton.vue'

// import PageCategory from '~/components/Page/Category/Category.vue'
// import PageCategorySkeleton from '~/components/Page/Category/Skeleton/Skeleton.vue'

import { getCategorySlugs } from '~/server/utils/categoryCache';

const route = useRoute()

const isServer = process.server
const slug = route.params.slug
const categories = await getCategorySlugs();
const isCategory = categories.has(slug)

// Product loader
const {
  data: product,
  pending: productPending,
  error: productError
} = await useAsyncData(
  'product-' + slug,
  async () => {
    if (isCategory) return null
    const response = await useProductStore().show(slug)
    const data = response.data.value

    if (data) {
      return data
    } else {
      throw createError({ statusCode: 404, message: 'Product Not Found' })
    }
  },
  {
    lazy: !isServer,
    server: true,
  }
)

// Category loader
// const {
//   data: category,
//   pending: categoryPending,
//   error: categoryError
// } = await useAsyncData(
//   'category-' + slug,
//   async () => {
//     if (!isCategory) return null
//     const response = await useCategoryStore().showCached(slug)
//     const data = response.data
//     console.log('Category data:', data, response)
//     if (data) {
//       return data
//     } else {
//       throw createError({ statusCode: 404, message: 'Category Not Found' })
//     }
//   },
//   {
//     lazy: !isServer,
//     server: true,
//   }
// )


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