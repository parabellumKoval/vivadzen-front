<script setup>
// import {useSchema} from '~/composables/product/useSchema.ts'
// import {useAuthStore} from '~/store/auth';
import {useReviewStore} from '~/store/review'

const props = defineProps({
  product: {
    type: Object,
    requered: true
  }
})

const {t} = useI18n()
const route = useRoute()

const breadcrumbs = ref(null)
const reviews = ref([])
const reviewsMeta = ref({})
const isReviewsLoading = ref(false)
const tab = ref(0)
const reviewsComponentRef = ref(null)


const {setSchema} = useSchema()
// Content HTML ref
const content = ref(null)

// COMPUTEDS
const category = computed(() => {
  if(props.product?.categories && props.product.categories[0]){
    return props.product.categories[0]
  }else {
    return null
  }
})

const slug = computed(() => {
  return route.params.slug
})


const ratingCount = computed(() => {
  return props.product.reviews_rating_detailes?.rating_count || 0
})

const reviewsCount = computed(() => {
  return props.product.reviews_rating_detailes?.reviews_count || 0
})


const reviewQuery = computed(() => {
  const type = String.raw`Backpack\Store\app\Models\Product`;

  return {
    per_page: 6,
    reviewable_slug: slug.value,
    reviewable_type: type
  }
})

const tabs = computed(() => {
  let list = [
    {
      id: 1,
      name: t('label.all')
    },{
      id: 2,
      name: t('label.desc')
    }
  ]

  if(props.product?.attrs?.length) {
    list.push({
      id: 3,
      name: t('label.props')
    })
  }


  if(reviews?.value?.length) {
    list.push({
      id: 4,
      name: t('title.reviews') + ' ' + (reviewsMeta.value.total? `<span class="budge green">${reviewsMeta.value.total}</span>`: '')
    })
  }
  
  list = [
    ...list,
    {
      id: 5,
      name: t('title.delivery')
    },{
      id: 6,
      name: t('title.payment')
    },{
      id: 7,
      name: t('title.guarantees')
    }
  ]

  // if(!props.product.attrs.length) {
  //   list[2].disabled = true
  // }

  // if(!reviews.value.length) {
  //   list[3].disabled = true
  // }

  return list
})

// HANDLERS
const paramsHandler = () => {
  tab.value = 1
  scrollToContent()
}

const reviewHandler = () => {
  reviewsComponentRef.value.reviewHandler()
}

const loadReviewsHandler = async (page) => {
  const query = {
    ...reviewQuery.value,
    // for loadmore button
    // page: reviewsMeta.value.current_page + 1
    page: page
  }
  await getReviews(query, false).then(() => {
    scrollToContent()
  })
}

const changeTabHandler = (index) => {
  tab.value = index
  scrollToContent()
}

// METHODS
const scrollToContent = () => {
  var headerOffset = 180;
  var elementPosition = content.value.getBoundingClientRect().top;
  var offsetPosition = elementPosition + window.pageYOffset - headerOffset;

  window.scrollTo({
    top: offsetPosition,
    behavior: "smooth"
  })
}

const setSeo = () => {
  useHead({
    title: props.product.seo.meta_title || t('seo_title_template', {product: props.product.name}),
    meta: [
      {
        name: 'description',
        content: props.product.seo.meta_description || t('seo_desc_template', {product: props.product.name})
      },
    ],
  })
}

const setCrumbs = () => {
  breadcrumbs.value = [
    {
      name: t('title.home'),
      item: '/'
    },{
      name: category?.value?.name,
      item: `/${category?.value?.slug}`
    },{
      name: props.product.name,
      item: props.product.slug
    }
  ]
}

const getReviews = async (query, refresh) => {
  isReviewsLoading.value = true
  await useAsyncData('reviews', () => useReviewStore().getAll(query, refresh)).then(({data, error}) => {
    
    if(data?.value?.reviews) {
      reviews.value = data.value.reviews
    }

    if(data?.value?.meta) {
      reviewsMeta.value = data.value.meta
    }
  }).finally(() => {
    isReviewsLoading.value = false
  })
}

// FETCH
await useAsyncData('product_reviews', () => useReviewStore().getAll(reviewQuery.value, true)).then(({data, error}) => {
  if(data?.value?.reviews) {
    reviews.value = data.value.reviews
  }

  if(data?.value?.meta) {
    reviewsMeta.value = data.value.meta
  }
})

// WATCHERS
onServerPrefetch(() => {
  setSchema(props.product, reviews.value)
  setSeo()
})

setCrumbs()

// Set mobile Search
onBeforeMount(() => {
  useTransport().setData({mobileSearch: false})
})

onBeforeUnmount(() => {
  //
  useTransport().setData({mobileSearch: true})
})
</script>

<style src="./product.scss" lang="scss" scoped></style>
<style src="~/assets/scss/_rich-text.scss" lang="scss" scoped></style>
<i18n src="./lang.yaml" lang="yaml"></i18n>

<template>
  <div class="container">
    <the-breadcrumbs :crumbs="breadcrumbs"></the-breadcrumbs>

    <div class="header">
      <span class="name title-common">{{ product.name }}</span>
      
      <span v-if="product.code" class="code">
        <span class="label">{{ t('label.product_code') }}:</span>
        <span class="value">{{ product.code }}</span>
      </span>

      <div class="header-reviews">
        <simple-stars :amount="product.rating|| 0" desktop="large" mobile="large"></simple-stars>
        <div v-if="product.rating" class="rating-label">
          {{ t('messages.rates_reviews', {rates: ratingCount, reviews: reviewsCount }) }}
        </div>
        <simple-button-text
          :text="t('button.leave_review')"
          :callback="reviewHandler"
          :class="{disable: product.rating > 0}"
          class="header-reviews-btn"
        ></simple-button-text>
      </div>

      <div class="right">
        <lazy-product-comparison :product-id="product.id"></lazy-product-comparison>
        <lazy-product-favorite :product-id="product.id"></lazy-product-favorite>
      </div>
    </div>
  </div>

  <lazy-simple-tabs v-model="tab" :values="tabs" value="name" class="tab-wrapper"></lazy-simple-tabs>

  <div class="container">
    <div class="content">
      
      <div class="content-main" ref="content">
        <transition name="fade-in">
          <!-- Common -->
          <template v-if="tab === 0">
            <div class="content-common">
              <lazy-product-gallery-mobile v-if="$device.isMobile" :items="product.images" class="gallery-wrapper"></lazy-product-gallery-mobile>
              <lazy-product-gallery v-else :items="product.images" class="gallery-wrapper"></lazy-product-gallery>
              <div v-if="$device.isDesktop" class="content-html rich-text" v-html="product.content"></div>
            </div>
          </template>

          <!-- Content -->
          <template v-else-if="tab === 1">
            <div class="rich-text" v-html="product.content"></div>
          </template>

          <!-- Properties -->
          <template v-else-if="tab === 2">
            <div class="params-wrapper">
              <div class="tab-title">{{  t('attrs') }}</div>
              <lazy-simple-list-params :items="product.attrs"></lazy-simple-list-params>
            </div>
          </template>

          <!-- Reviews -->
          <template v-else-if="tab === 3">
            <lazy-product-reviews
              :reviews="reviews"
              :meta="reviewsMeta"
              :product="product"
              @update:current="loadReviewsHandler"
              id="reviews"
            ></lazy-product-reviews>
          </template>

          <!-- Delivery -->
          <template v-else-if="tab === 4">
            <div class="">
              <div class="tab-title">{{ t('title.delivery') }}</div>
              <lazy-product-delivery-info></lazy-product-delivery-info>
            </div>
          </template>

          <!-- Payment -->
          <template v-else-if="tab === 5">
            <div class="">
              <div class="tab-title">{{ t('title.payment') }}</div>
              <lazy-product-payment-info></lazy-product-payment-info>
            </div>
          </template>

          <!-- Guarantees -->
          <template v-else-if="tab === 6">
            <div class="">
              <div class="tab-title">{{ t('title.guarantees') }}</div>
              <lazy-product-guarantees-info></lazy-product-guarantees-info>
            </div>
          </template>
        </transition>
      </div>

      <div class="content-sale">
        <lazy-product-guarantee
          v-if="$device.isMobile && tab === 0"
          class="content-guarantee"
          @more="changeTabHandler(6)"
        ></lazy-product-guarantee>

        <lazy-product-sale-block
          v-if="$device.isDesktop || tab === 0"
          :product="product"
          :class="{mini: tab !== 0}"
          class="content-buy"
        ></lazy-product-sale-block>

        <transition name="fade-in">
          <lazy-product-feature v-if="tab === 0" class="content-feature"></lazy-product-feature>
        </transition>

        <transition name="fade-in">
          <lazy-product-delivery-box
            v-if="tab === 0"
            class="content-delivery"
            @more="changeTabHandler(4)"
          ></lazy-product-delivery-box>
        </transition>

        <transition name="fade-in">
          <lazy-product-payment-box
            v-if="tab === 0"
            @more="changeTabHandler(5)"
            class="content-payment"
          ></lazy-product-payment-box>
        </transition>
        
        <transition name="fade-in">
          <lazy-product-params-box
            v-if="tab === 0 && product.attrs && product.attrs.length"
            :items="product.attrs"
            class="content-params"
          ></lazy-product-params-box>
        </transition>
        
        <transition name="fade-in">
          <lazy-product-content-box
            v-if="tab === 0 && $device.isMobile"
            :content="product.content"
            @more="changeTabHandler(1)"
            class="content-html"
          ></lazy-product-content-box>
        </transition>

        <transition name="fade-in">
          <product-reviews-box
            v-if="tab === 0"
            :reviews="reviews"
            :meta="reviewsMeta"
            :product="product"
            :amount="2"
            @loadReviews="loadReviewsHandler"
            @more="changeTabHandler(3)"
            class="content-reviews"
            ref="reviewsComponentRef"
            id="reviews"
          ></product-reviews-box>
        </transition>
      </div>

    </div>
  </div>

  <!-- Sale block mobile   -->
  <lazy-product-sale-fixed v-if="$device.isMobile" :product="product"></lazy-product-sale-fixed>
</template>