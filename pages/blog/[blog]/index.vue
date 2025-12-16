<script setup>
import {useArticleStore} from '~/store/article'

const {t, locale} = useI18n()
const {region} = useRegion()
const route = useRoute()
const { $regionPath } = useNuxtApp()

const html = ref(null)

const tableOfContents = ref([])
const article = ref(null)
const articles = ref([])

const breadcrumbs = ref(null)

const { scrollToAnchor } = useAnchorScroll({
  toAnchor: {
    scrollOptions: {
      behavior: 'smooth',
      offsetTop: -90,
    }
  },
})
const { setHreflangRegions, clearHreflangRegions } = useHreflang()

// COMPUTEDS
const slug = computed(() => {
  return route.params.blog
})

const getBlogRedirectPath = () => (typeof $regionPath === 'function' ? $regionPath('/blog') : '/blog')

const redirectToBlogList = async () => {
  const target = getBlogRedirectPath()
  if (process.server) {
    return await navigateTo(target, { redirectCode: 302 })
  }

  return navigateTo(target, { replace: true })
}

const handleArticleError = async (err) => {
  if (!err) {
    return
  }

  const statusCode = err.statusCode || err.status || err?.response?.status || 404

  if (statusCode === 404) {
    await redirectToBlogList()
    return
  }

  const payload = {
    statusCode,
    statusMessage: err.statusMessage || err.message || 'Article Not Found',
    fatal: true
  }

  if (process.server) {
    throw createError(payload)
  }

  showError(payload)
}

// METHODS
const setCrumbs = () => {
  breadcrumbs.value = [
    {
      name: t('title.home'),
      item: '/'
    },{
      name: t('title.blog'),
      item: '/blog'
    },{
      name: article.value.title,
      item: article.value.slug
    }
  ]
}

const scrollHandler = (item) => {
  nextTick(() => {
    scrollToAnchor(item)
  });
}

const setSeo = () => {
  // useHead({
  //   title: article.value.seo.meta_title || t('seo_title', {title: article.value.title}),
  //   meta: [
  //     {
  //       name: 'description',
  //       content: article.value.seo.meta_description
  //     },
  //   ],
  // })
}

// HANDLERS
// WATCHERS
watch(() => html.value, (v) => {
  const container = v?.$el ?? v

  if(!container || typeof container.querySelectorAll !== 'function') {
    return
  }

  // clear headers
  tableOfContents.value = []
  
  const headers = container.querySelectorAll('h2, h3')
  
  headers.forEach((item, i) => {
    const index = i + 1
    const id = 'header-' + index
    const tagName = item.tagName
    const headerText = item.innerText || item.textContent
    
    if(headerText) {
      tableOfContents.value.push({
        id: id,
        title: headerText,
        tag: tagName
      })
    }

    item.setAttribute("id", id);
  })
}, {
  immediate: true
})

watch(() => article.value?.available_regions, (regions) => {
  if (Array.isArray(regions) && regions.length) {
    setHreflangRegions(regions)
  } else {
    setHreflangRegions(null)
  }
}, {
  immediate: true
})


const {
  data: articleResponse,
  error: articleError
} = await useAsyncData('get-article-' + slug.value + '-' + region.value + '-' + locale.value, () => useArticleStore().show(slug.value))

if (articleResponse.value?.data) {
  article.value = articleResponse.value.data
  setCrumbs()
}

if (!articleResponse.value?.data && !articleError.value) {
  await handleArticleError({ statusCode: 404, statusMessage: 'Article Not Found' })
}

if (articleError.value) {
  await handleArticleError(articleError.value)
}

if (process.client) {
  watch(articleError, async (err) => {
    if (err) {
      await handleArticleError(err)
    }
  })
}

//
setSeo()

onBeforeUnmount(() => {
  clearHreflangRegions()
})
</script>

<style src='./article.scss' lang='scss' scoped></style>
<i18n src='./lang.yaml' lang='yaml'></i18n>

<template>
  <div class="page-base">
    <div v-if="article" class="container">
      <the-breadcrumbs :crumbs="breadcrumbs"></the-breadcrumbs>

      <h1 class="title-common">{{ article.title }}</h1>

      <div class="article-wrapper">
        <div class="article-content">

          <div class="article-meta">
            <div class="article-meta-box">
              <div class="article-time">
                <IconCSS name="iconoir:clock" class="article-comments-icon"></IconCSS>
                <span>{{ parseFloat(article.time).toFixed(0) }} {{ t('label.min_read') }}</span>
              </div>

              <div class="article-comments">
                <IconCSS name="iconoir:message" class="article-comments-icon"></IconCSS>
                <button :class="{active: false}" class="text-link article-comments-text">
                  <span>0 {{ t('comments') }}</span>
                </button>
              </div>
            </div>

            <article-share class="article-share"></article-share>
          </div>

          <div class="article-header">
            
            <nuxt-img
              :src = "article.image?.src"
              :alt = "article.image?.alt || article.name"
              :title = "article.image?.title || article.name"
              width="800"
              height="400"
              sizes = "mobile:100vw tablet:100vw desktop:800px xl:1500px"
              format = "webp"
              quality = "60"
              loading = "lazy"
              fit="outside"
              class="article-image"
            />
          </div>
          <!-- <div class="article-text rich-text" ref="html" v-html="article.content"></div> -->
          <slice-area  :slices="article.content_slices" ref="html"  class="article-text"></slice-area>
        </div>
        
        <div class="article-aside">
          <div class="article-aside-title">{{ t('content') }}</div>
          <ol class="article-aside-list">
            <li
              v-for="item in tableOfContents"
              :key="item.id"
              :class="item.tag"
              class="article-aside-item"
            >
              <button
                @click="scrollHandler(item.id)"
                :class="item.tag"
                class="article-aside-link"
              >{{ item.title }}</button>
            </li>
          </ol>
        </div>
        
      </div>

      <section-article></section-article>
    </div>
  </div>
</template>
