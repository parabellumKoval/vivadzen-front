<script setup>
const {t} = useI18n()
const route = useRoute()

// COMPUTEDS
const isProductPage = computed(() => route.meta.pageType === 'product')

// METHODS
const openAffiliateModal = () => {
  useModal().open(resolveComponent('ModalAffiliate'), null, null)
}

// HANDLERS
// WATCHERS
</script>

<style src='./link.scss' lang='scss' scoped></style>
<i18n src='./lang.yaml' lang='yaml'></i18n>

<template>
  <div :class="{'up': isProductPage}" class="affiliate">
    <button @click="openAffiliateModal" class="affiliate-button">
        <nuxt-img
          src="/images/ref/img-3.png"
          width="120"
          height="120"
          sizes="mobile:140px"
          format="avif"
          quality="80"
          loading="lazy"
          fit="outside"
          class="affiliate-img"
        />
        <div class="affiliate-text">
          <div class="affiliate-title"><wrapper-html :string="t('title')" :wrappers="['<span class=\'orange bold\'>']" /></div>
          <div class="affiliate-desc">{{ t('desc') }}</div>
        </div>
      </button>
  </div>
</template>
