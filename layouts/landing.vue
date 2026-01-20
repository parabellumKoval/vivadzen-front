<script setup>
const {t} = useI18n()
const props = defineProps({})
const title = 'Vivadzen.com'

const head = useLocaleHead({
  addDirAttribute: true,
  identifierAttribute: 'id',
  addSeoAttributes: true
})

// COMPUTEDS
const background = computed(() => {
  return '#FFF7EC'
})
// COMPUTEDS
// METHODS
// HANDLERS
// WATCHERS
</script>

<!-- <style src='' lang='scss' scoped></style> -->
<!-- <i18n src='' lang='yaml'></i18n> -->

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
        <main class="main" :style="{background: background}">
          <slot />
        </main>

        <modal-transition :is-show="useModal().show" mode="out-in">
          <component :is="useModal().active.component"></component>
        </modal-transition>
      </Body>
    </Html>
  </div>
</template>
