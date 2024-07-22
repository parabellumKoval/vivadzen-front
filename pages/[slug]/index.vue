<script setup>
const route = useRoute()

const product = ref(null)
const category = ref(null)

// COMPUTEDS
const slug = computed(() => {
  return route.params.slug
})
// METHODS
// HANDLERS
// WATCHERS
// await useAsyncData(() => $fetch(`${useRuntimeConfig().public.apiBase}/product_or_category/` + slug.value))
await useAsyncData(() => useServerApiFetch(`${useRuntimeConfig().public.apiBase}/product_or_category/` + slug.value))
.then(({data, error}) => {

  if(data?.value?.data) {

    if(data.value.data.price === undefined){
      product.value = null
      category.value = data.value.data
    }else {
      category.value = null
      product.value = data.value.data
    }
  }else {
    throw createError({ statusCode: 404, message: 'Page Not Found' })
  }
})

</script>

<!-- <style src='' lang='scss' scoped></style> -->
<!-- <i18n src='' lang='yaml'></i18n> -->

<template>
  <div>
    <lazy-page-product v-if="product" :product="product"></lazy-page-product>
    <lazy-page-category v-else-if="category" :category="category"></lazy-page-category>
  </div>
</template>