<script setup>
const {t, locale} = useI18n()
const { regionAlias } = useRegion()
const props = defineProps({})
const { isAuthenticated } = useAuth()
const reviewsState = useState('fetcher-homepage-video-reviews', () => null)

const fetchReviews = async () => {
  reviewsState.value = await useFetcherData('homepage-video-reviews')
}

if (process.server) {
  await fetchReviews()
}

watch([locale, regionAlias], () => {
  if (!process.client) {
    return
  }
  void fetchReviews()
})

onMounted(() => {
  if (!process.client || reviewsState.value) {
    return
  }
  void fetchReviews()
})

const reviews = computed(() => reviewsState.value?.data?.data ?? [])
// COMPUTEDS
// METHODS
// HANDLERS
const reviewHandler = () => {
  if(isAuthenticated.value) {
    useModal().open(resolveComponent('ModalReviewCreate'), null, null)
  }else{
    useNoty().setNoty({
      content: t('noty.review.need_login'),
      type: 'warning'
    }, 7000)
    
    useModal().open(resolveComponent('ModalAuthSocial'), null, null)
  }
}

// WATCHERS
</script>

<style src='./video.scss' lang='scss' scoped></style>
<i18n src="./lang.yaml" lang="yaml"></i18n>
<!-- <i18n src='' lang='yaml'></i18n> -->

<template>
  <section class="video-wrapper">
    <div class="video-info">
      <div class="video-info-title font-alegreya">{{ t('title') }}<div class="orange">{{ t('no_filters') }}</div></div>
      <div class="video-info-desc">{{ t('description') }}</div>
      <review-reward class="video-info-reward" />
      
      <div class="video-info-buttons">
        <NuxtLink :to="$regionPath('/reviews/shop')" class="button secondary">{{ t('reviews') }}</NuxtLink>
        <button @click="reviewHandler" class="button primary">{{ t('button.leave_review') }}</button>
      </div>
    </div>
    <div class="video-items">
      <div v-for="item in reviews" class="video-item">
          <review-card-video v-if="item.video" :video-id="item.video.url.split('embed/')[1]" :title="item.video.title" :poster="item.video.poster" :lazy="true" class="video-item-media"/>
          <product-card-micro :item="item.product"  class="video-item-product"></product-card-micro>
      </div>
    </div>
  </section>
</template>
