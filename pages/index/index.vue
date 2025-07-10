<script setup>
const {t} = useI18n()

const topQuery = ref({
  per_page: 10,
  selections: ['in_stock'],
  order_by: 'sales',
  cache: ['with_products'],
})

const saleQuery = ref({
  per_page: 10,
  selections: ['with_sales', 'in_stock'],
  cache: ['with_products'],
})

//
const setSeo = () => {
  useHead({
    title: t('seo_title'),
    meta: [
      {
        name: 'description',
        content: t('seo_desc')
      },
    ],
  })
}

setSeo()
</script>

<i18n src="./lang.yaml" lang="yaml"></i18n>

<template>
  <DelayHydration>
    <lazy-section-banner></lazy-section-banner>

    <section-slider-products
      :title="t('top')"
      list-id="top-products"
      :query="topQuery"
      :fetchOptions="{key:'top'}"
      link="/catalog?selections[0]=in_stock&selections[1]=top_sales"
    ></section-slider-products>

    <section-slider-products
      :title="t('sale')"
      list-id="promotional-products"
      :query="saleQuery"
      :fetchOptions="{key:'sale'}"
      link="/catalog?selections[0]=with_sales&selections[1]=in_stock"
    ></section-slider-products>

    <!-- <lazy-section-category></lazy-section-category> -->
    
    <div class="container">
      <lazy-section-review></lazy-section-review>
      <lazy-section-adv></lazy-section-adv>
    </div>
    
    <div class="container">
      <lazy-section-article></lazy-section-article>
    </div>
    
    <!-- <lazy-section-insta></lazy-section-insta> -->

    <div class="container">
      <section-seo></section-seo>
    </div>
  </DelayHydration>
</template>