<script setup lang="ts">
const props = withDefaults(defineProps<{
  mobile?: boolean
}>(), {
  mobile: false
})

const { t, locale } = useI18n()
const { region } = useRegion()

const isCzechRegion = computed(() => String(region.value || '').toLowerCase() === 'cz')
const targetHref = computed(() => {
  const currentLocale = String(locale.value || '').toLowerCase()
  const localeSegment = currentLocale && currentLocale !== 'cs' ? `/${currentLocale}` : ''

  return `https://vivadzen.com${localeSegment}`
})
</script>

<style src="./czech-store-link.scss" lang="scss" scoped />

<template>
  <NuxtLink
    v-if="isCzechRegion"
    :to="targetHref"
    external
    class="czech-store-link"
    :class="{
      'czech-store-link--desktop': !props.mobile,
      'czech-store-link--mobile': props.mobile
    }"
  >
    <span class="czech-store-link__content">
      <IconCSS name="fluent:flash-24-regular" class="czech-store-link__icon" />
      <span class="czech-store-link__label">{{ t('title.czech-republic-kratom') }}</span>
    </span>
  </NuxtLink>
</template>
