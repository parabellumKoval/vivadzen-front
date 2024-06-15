<script setup>
const route = useRoute()
const productOrCategoryData = ref(null)

// COMPUTEDS
const slug = computed(() => {
  return route.params.slug
})
// METHODS
// HANDLERS
// WATCHERS
//
// await useLazyAsyncData('page_or_category', () => $fetch(`${useRuntimeConfig().public.apiBase}/product_or_category/` + slug.value))
// .then(({data, error}) => {
//   if(data.value) {
//     productOrCategoryData.value = data.value
//   }else {
//     throw createError({ statusCode: 404, message: 'Page Not Found' })
//   }

//   if(error.value) {
//     throw createError({ statusCode: 404, message: 'Page Not Found' })
//   }
// })

const {pending, data: pageData} = await useLazyAsyncData('page_or_category', () => $fetch(`${useRuntimeConfig().public.apiBase}/product_or_category/` + slug.value))

watch(pageData, (v) => {
  if(v) {
    productOrCategoryData.value = v
  }else {
    throw createError({ statusCode: 404, message: 'Page Not Found' })
  }
}, {
  immediate: true
})
</script>

<!-- <style src='' lang='scss' scoped></style> -->
<!-- <i18n src='' lang='yaml'></i18n> -->

<template>
  <template v-if="productOrCategoryData">
    <PageProduct v-if="productOrCategoryData.price !== undefined" :product="productOrCategoryData"></PageProduct>
    <PageCategory v-else :category="productOrCategoryData"></PageCategory>
  </template>
</template>