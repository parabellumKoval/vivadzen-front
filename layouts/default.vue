<script setup>
const route = useRoute()
const ageGateComponent = defineAsyncComponent(() => import('~/components/Modal/AgeGate/AgeGate.client.vue'))
const {isConfirmed: isAgeConfirmed, readFromStorage: readAgeConfirmation} = useAgeGate()
const title = 'Vivadzen.com'

const head = useLocaleHead({
  addDirAttribute: true,
  identifierAttribute: 'id',
  addSeoAttributes: true
})

// COMPUTEDS
const background = computed(() => {
  return route?.meta?.bg || '#FFF7EC'
})

// HANDLERS
// METHODS

// WATCHERS
watch(() => route.fullPath, (v) => {
  if(useModal().active?.options?.closeOnRouteChange === false)
    return

  useModal().close()
}, {
  immediate: true
})

// HOOKS
useSchemaOrg([
  defineWebSite({
    url: 'https://vivadzen.com',
    name: 'vivadzen.com',
  }),
  defineWebPage(),
])

const openAgeGate = () => {
  if(!process.client)
    return

  const alreadyConfirmed = isAgeConfirmed.value || readAgeConfirmation()

  if(alreadyConfirmed)
    return

  useModal().open(ageGateComponent, null, null, {
    y: {
      top: 'initial',
      bottom: 30
    },
    x: {
      right: '50%',
      left: 'initial'
    },
    transform: 'translateX(50%) translateY(0)',
    width: {
      min: 'initial',
      max: 620
    },
    closeOnBackdrop: false,
    closeOnRouteChange: false
  })
}

onMounted(() => {
  openAgeGate()
})

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
        <lazy-the-supheader></lazy-the-supheader>

        <the-header v-if="!$device.isMobile"></the-header>
        <the-header-mobile v-else></the-header-mobile>
        
        <!-- <lazy-the-header-search-sticky v-if="isSearchMobile"></lazy-the-header-search-sticky> -->

        <main class="main" :style="{background: background}">
          <slot />
        </main>

        <lazy-modal-noty></lazy-modal-noty>
      
        <lazy-the-footer></lazy-the-footer>

        <lazy-comparison-btn v-if="!$device.isMobile" class="comp-btn"></lazy-comparison-btn>

        <modal-transition :is-show="useModal().show" mode="out-in">
          <component :is="useModal().active.component"></component>
        </modal-transition>

        <lazy-modal-search-results></lazy-modal-search-results>
        
        <lazy-affiliate-link v-if="!$device.isMobile"></lazy-affiliate-link>

        <lazy-simple-clicker></lazy-simple-clicker>
        
        <lazy-the-navbar v-if="$device.isMobile"></lazy-the-navbar>
      </Body>
    </Html>
  </div>
</template>
