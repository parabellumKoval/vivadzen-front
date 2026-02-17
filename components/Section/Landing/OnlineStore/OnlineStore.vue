<script setup>
import { useCategoryStore } from '~/store/category'

const { t, locale } = useI18n()
const { region } = useRegion()
const { get } = useSettings()
const { $regionPath } = useNuxtApp()
const runtimeConfig = useRuntimeConfig()
const categoryStore = useCategoryStore()

useAsyncData(`landing-online-store-categories-${locale.value}-${region.value}`, () =>
  categoryStore.listMainCached()
)

const categories = computed(() => categoryStore.mainList || [])

console.log('Online Store Categories:', categories.value)

const brandDescription = computed(() => get('site.common.description') || t('description_fallback'))

const mainSiteBaseUrl = computed(() => {
  const raw =
    runtimeConfig.public?.site?.url ||
    runtimeConfig.public?.siteUrl ||
    'https://vivadzen.com'

  return String(raw || 'https://vivadzen.com').replace(/\/+$/, '')
})

const isAbsoluteUrl = (value) => /^https?:\/\//i.test(String(value || ''))

const toAbsoluteMainUrl = (path = '/') => {
  if (isAbsoluteUrl(path)) {
    return String(path)
  }

  const normalizedPath = `/${String(path || '/').replace(/^\/+/, '')}`
  return normalizedPath === '/'
    ? `${mainSiteBaseUrl.value}/`
    : `${mainSiteBaseUrl.value}${normalizedPath}`
}

const homeUrl = computed(() => toAbsoluteMainUrl('/'))

const categoryUrl = (slug) => {
  const relativePath =
    typeof $regionPath === 'function'
      ? $regionPath(`/${slug}`)
      : `/${slug}`

  return toAbsoluteMainUrl(relativePath)
}
</script>

<style src="./online-store.scss" lang="scss" scoped></style>
<i18n src="./lang.yaml" lang="yaml"></i18n>

<template>
  <section v-if="categories?.length" class="online-store">
    <div class="container">
      <div class="online-store__intro">
        <h2 class="online-store__title">{{ t('title') }}</h2>
        <div class="online-store__desc rich-text" v-html="brandDescription"></div>
        <a :href="homeUrl" class="button orange online-store__cta">
          {{ t('button') }}
        </a>
      </div>

      <div class="online-store__grid">
        <a
          v-for="category in categories"
          :key="category.id"
          :href="categoryUrl(category.slug)"
          :aria-label="category.name"
          class="online-store__card"
        >
          <div class="online-store__image-wrap">
            <nuxt-img
              v-if="category?.image?.src"
              :src="category.image.src"
              :alt="category.image.alt || category.name"
              :title="category.image.title || category.name"
              :class="category.image.size"
              :style="category?.extras?.image_size ? { width: category.extras.image_size + '%' } : {}"
              width="200"
              height="200"
              sizes="mobile:160px tablet:220px desktop:260px"
              format="webp"
              quality="60"
              loading="lazy"
              fit="outside"
              :placeholder="useImg().noImageTransparent"
              class="online-store__image"
              provider="bunny"
            />
          </div>

          <div class="online-store__content">
            <h3 class="online-store__name">{{ category.name }}</h3>
            <p class="online-store__category-desc">
              {{ category?.extras_trans?.short_description || t('category_description_fallback') }}
            </p>
          </div>
        </a>
      </div>
    </div>
  </section>
</template>
