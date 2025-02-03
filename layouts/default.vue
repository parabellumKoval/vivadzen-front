<script setup>
import { useCategoryStore } from '~/store/category'
import { useAuthStore } from '~~/store/auth';
import { useAppPersistStore } from '~/store/appPersist';

const {t, locale} = useI18n()
const route = useRoute()

const head = useLocaleHead({
  addDirAttribute: true,
  identifierAttribute: 'id',
  addSeoAttributes: true
})

// COMPUTEDS
const background = computed(() => {
  return route?.meta?.bg || '#fff'
})

const isSearchMobile = computed(() => {
  const mobileSearch = useTransport().getData('mobileSearch')
  const isSearch = mobileSearch !== false

  return useDevice().isMobile && isSearch? true: false
})

// AUTH
const { auth } = useSupabaseClient()

auth.onAuthStateChange((event, session) => {
  // console.log(event, session);
  if(event === 'SIGNED_OUT') {
    useNoty().setNoty({
      content: t('noty.auth.logout')
    })
  }else if(event === 'INITIAL_SESSION'){
    if(session) {
      useAuthStore().setUserFromSession(session.user)
      // useFavoritesStore().getIds({user_id: user?.value?.id})
      
      if(useAppPersistStore().from === 'login') {
        useNoty().setNoty({
          content: t('noty.auth.login.success')
        })
        useAppPersistStore().setFrom(null)
      }
    }else {
      useAuthStore().resetUser()
    }
  }else if(event === 'SIGNED_IN') {
    useAuthStore().setUserFromSession(session.user)
    // useFavoritesStore().getIds({user_id: user?.value?.id})
    // getFavoriteIds()
  }else if(event === 'PASSWORD_RECOVERY') {
  }
})

// HANDLERS
// METHODS

// WATCHERS
watch(locale, (v) => {
  refreshCategories()
})

watch(() => route.fullPath, (v) => {
  useModal().close()
}, {
  immediate: true
})

// HOOKS
const {refresh: refreshCategories} = useAsyncData('all-categories', async () =>  await useCategoryStore().index())

useSchemaOrg([
  defineWebSite({
    url: 'https://djini.com.ua',
    name: 'djini.com.ua',
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
      <Body>
        <!-- <slot /> -->
    
        <!-- <the-supheader></the-supheader> -->

        <lazy-the-header></lazy-the-header>
        
        <the-header-search-sticky v-if="isSearchMobile"></the-header-search-sticky>

        <main class="main" :style="{background: background}">
          <slot />
        </main>

        <lazy-modal-noty></lazy-modal-noty>
      
        <lazy-the-footer></lazy-the-footer>

        <lazy-comparison-btn v-if="!$device.isMobile" class="comp-btn"></lazy-comparison-btn>

        <modal-transition :is-show="useModal().show" mode="out-in">
          <component :is="useModal().active.component"></component>
        </modal-transition>
        
        <lazy-simple-clicker></lazy-simple-clicker>
      </Body>
    </Html>
  </div>
</template>