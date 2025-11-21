<script setup>
import { useCategoryStore } from '~/store/category'
// import { useSchemaOrg, defineWebSite, defineWebPage } from '#imports'
import { useAppPersistStore } from '~/store/appPersist'

const {t, locale} = useI18n()
const region = useRegion()
const route = useRoute()
const title = 'Vivadzen.com'

const categoryStore = useCategoryStore()

const head = useLocaleHead({
  addDirAttribute: true,
  identifierAttribute: 'id',
  addSeoAttributes: true
})

// COMPUTEDS
const background = computed(() => {
  return route?.meta?.bg || '#FFF7EC'
})

const isSearchMobile = computed(() => {
  const mobileSearch = useTransport().getData('mobileSearch')
  const isSearch = mobileSearch !== false

  return useDevice().isMobile && isSearch? true: false
})

// HANDLERS
// METHODS

// WATCHERS
watch(() => [locale, region.region.value], (v) => {
  refreshCategories()
})

watch(() => route.fullPath, (v) => {
  useModal().close()
}, {
  immediate: true
})

// HOOKS
const { refresh: refreshCategories } = useAsyncData('all-categories', () => categoryStore.listCached(null, true))

useSchemaOrg([
  defineWebSite({
    url: 'https://vivadzen.com',
    name: 'vivadzen.com',
  }),
  defineWebPage(),
])

</script>

<style src="~/assets/scss/layout-default.scss" lang="scss" scoped />


<template>
  <div> 
    <Html :lang="head?.htmlAttrs?.lang" :dir="head?.htmlAttrs?.dir">
      <Head>
        <Title>{{ title }}</Title>
        <template v-for="link in head.link" :key="link.id">
          <Link :id="link.id" :rel="link.rel" :href="link.href" :hreflang="link.hreflang" />
        </template>
        <template v-for="meta in head.meta" :key="meta.id">
          <Meta :id="meta.id" :property="meta.property" :content="meta.content" />
        </template>
      </Head>
      <Body :style="{background: background}">
        <!-- <slot /> -->
    
        <lazy-the-supheader></lazy-the-supheader>

        <the-header></the-header>
        
        <lazy-the-header-search-sticky v-if="isSearchMobile"></lazy-the-header-search-sticky>

        <main class="main" :style="{background: background}">
          <slot />
        </main>

        <lazy-modal-noty></lazy-modal-noty>
      
        <lazy-the-footer></lazy-the-footer>

        <lazy-comparison-btn v-if="!$device.isMobile" class="comp-btn"></lazy-comparison-btn>

        <modal-transition :is-show="useModal().show" mode="out-in">
          <component :is="useModal().active.component"></component>
        </modal-transition>
        
        <lazy-affiliate-link></lazy-affiliate-link>

        <lazy-simple-clicker></lazy-simple-clicker>
      </Body>
    </Html>
  </div>
</template>
