<script setup>
const {t} = useI18n()
const props = defineProps({})
const { isAuthenticated } = useAuth()
const reviews = ref([])
// COMPUTEDS
// const reviews = computed(() => {
//   return [
//     {
//       id: 1,
//       videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
//       title: 'Суперфуди: мікро — але потужно!',
//       product: {
//         id: 123,
//         name: 'Superfood Mix',
//         image: '/images/products/superfood-mix.png',
//         price: '29.99',
//         currency: 'USD'
//       }
//     },
//     {
//       id: 2,
//       videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
//       title: 'Відкрив для себе кратом вперше!',
//       product: {
//         id: 124,
//         name: 'Green Superfood',
//         image: '/images/products/green-superfood.png',
//         price: '34.99',
//         currency: 'USD'
//       }
//     },
//     {
//       id: 3,
//       videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
//       title: 'Ентеогени: шлях до себе',
//       product: {
//         id: 124,
//         name: 'Green Superfood',
//         image: '/images/products/green-superfood.png',
//         price: '34.99',
//         currency: 'USD'
//       }
//     },
//     {
//       id: 4,
//       videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
//       title: 'Суперфуди: мікро — але потужно!',
//       product: {
//         id: 124,
//         name: 'Green Superfood',
//         image: '/images/products/green-superfood.png',
//         price: '34.99',
//         currency: 'USD'
//       }
//     }
//   ]
// })
// METHODS
// HANDLERS
const reviewHandler = () => {
  if(isAuthenticated.value) {
    useModal().open(resolveComponent('ModalReviewCreate'), null, null, {width: {min: 420, max: 420}})
  }else{
    useNoty().setNoty({
      content: t('noty.review.need_login'),
      type: 'warning'
    }, 7000)
    
    useModal().open(resolveComponent('ModalAuthSocial'), null, null, {width: {min: 420, max: 420}})
  }
}
// WATCHERS


const {data: reviewsData} = await useAsyncData('homepage-video-reviews', () => useFetcherData('homepage-video-reviews'))

watch(reviewsData, (value) => {
  if(value.data?.data) {
    reviews.value = value.data.data ?? []
  }
  console.log('reviews', value);
}, { immediate: true })
</script>

<style src='./video.scss' lang='scss' scoped></style>
<i18n src="./lang.yaml" lang="yaml"></i18n>
<!-- <i18n src='' lang='yaml'></i18n> -->

<template>
  <section class="video-wrapper">
    <div class="video-info">
      <div class="video-info-title font-alegreya">Helpful people. Reference report.<div class="orange">No filters.</div></div>
      <div class="video-info-desc">Craft detailed, engaging reviews and earn 200 Viva. Your insights help the community make smarter purchases, boost product visibility, and unlock exclusive bonuses for top reviewers — all while growing your passive income!</div>
      
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