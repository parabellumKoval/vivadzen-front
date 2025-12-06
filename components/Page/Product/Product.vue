<script setup>
// import {useSchema} from '~/composables/product/useSchema.ts'
// import {useAuthStore} from '~/store/auth';
import {useReviewStore} from '~/store/review'

const props = defineProps({
  product: {
    type: Object,
    requered: true
  },
  pending: {
    type: Boolean,
    default: false
  }
})

const {t} = useI18n()
const route = useRoute()
route.meta.pageType = 'product'

const breadcrumbs = ref([])
const reviews = ref([])
const reviewsMeta = ref({})
const isReviewsLoading = ref(false)
const tab = ref(1)
const reviewsComponentRef = ref(null)

console.log('product', props.product)

const {setSchema} = useSchema()
// Content HTML ref
const content = ref(null)


// COMPUTEDS
const category = computed(() => {
  const categories = props.product?.categories

  if(Array.isArray(categories) && categories.length) {
    return categories[categories.length - 1]
  }

  return null
})

const simularQuery = computed(() => {
  return {
    per_page: 10,
    anchors: {
      model: 'product',
      ids: [props.product.id]
    }
  }
})

const slug = computed(() => {
  return route.params.slug
})

const isSpecsIsset = computed(() => {
  if(!props.product.specs)
    return false

  return Object.values(props.product.specs).indexOf('1') !== -1
})

const allAttrs = computed(() => {

  let attrs = props.product?.attrs?.length? [...props.product.attrs]: []

  if(props.product.code) {
    attrs.unshift({
      id: 999999,
      name: t('label.articul'),
      type: 'string',
      value: props.product.code
    })
  }

  if(props.product.brand) {
    attrs.unshift({
      id: 9999998,
      name: t('label.brand'),
      link: '/brands/' + props.product.brand.slug,
      type: 'string',
      value: props.product?.brand?.name
    })
  }

  return attrs
})

const reviewQuery = computed(() => {
  const type = String.raw`Backpack\Store\app\Models\Catalog`;

  return {
    per_page: 6,
    reviewable_slug: slug.value,
    reviewable_type: type
  }
})

const tabsBackLink = computed(() => {
  const crumbList = breadcrumbs.value || []
  if (!Array.isArray(crumbList) || crumbList.length < 2) {
    return '/catalog'
  }

  const clickable = crumbList
    .slice(0, -1)
    .filter((crumb) => typeof crumb?.item === 'string' && crumb.item.length)

  if (clickable.length) {
    return clickable[clickable.length - 1].item
  }

  return '/catalog'
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

  if(allAttrs.value?.length) {
    list.push({
      id: 3,
      name: t('label.props')
    })
  }
  
  list = [
    ...list,
    {
      id: 4,
      name: t('title.reviews') + ' ' + (reviewsMeta.value.total? `<span class="budge orange">${reviewsMeta.value.total}</span>`: '')
    },{
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

const changeTabHandler = (id) => {
  tab.value = id
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
    title: props.product?.seo?.meta_title || t('seo_title_template', {product: props.product?.name}),
    meta: [
      {
        name: 'description',
        content: props.product?.seo?.meta_description || t('seo_desc_template', {product: props.product?.name})
      },
    ],
  })
}

const setCrumbs = () => {
  const categoryTrail = []
  let cat = category.value

  // categories tree
  while (cat) {
    categoryTrail.unshift({
      name: cat?.name,
      item: `/${cat?.slug}`
    })

    cat = cat.parent
  }

  breadcrumbs.value = [
    {
      name: t('title.home'),
      item: '/'
    },
    {
      name: t('title.catalog'),
      item: '/catalog'
    },
    ...categoryTrail,
    {
      name: props.product?.name,
      item: props.product?.slug
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
await useAsyncData('product-reviews-'+slug.value, () => useReviewStore().getAll(reviewQuery.value, true)).then(({data, error}) => {
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
})

setSeo()
setCrumbs()
useGoogleEvent().setEvent('ViewItem', props.product)

// Set mobile Search
onBeforeMount(() => {
  useTransport().setData({mobileSearch: false})
})

onBeforeUnmount(() => {
  ////
  useTransport().setData({mobileSearch: true})
})
</script>

<style src="./product.scss" lang="scss" scoped></style>
<style src="~/assets/scss/_rich-text.scss" lang="scss" scoped></style>
<i18n src="./lang.yaml" lang="yaml"></i18n>

<template>
  <!-- <div  style="opacity: 0.3; position:relative; left: 50%; transform: translateX(-50%);"> -->
  <div v-if="product && !pending">
  

  <div class="container">
    <div class="content">
      <div  v-if="tab === 1" class="content-header">
        <the-breadcrumbs :crumbs="breadcrumbs" class="content-header-breadcrumbs"></the-breadcrumbs>

        <div class="header">
          <h1 class="name title-common">{{ product.name }}</h1>
          
          <span v-if="product.code" class="code">
            <span class="label">{{ t('label.product_code') }}:</span>
            <span class="value">{{ product.code }}</span>
          </span>

          <div class="header-reviews">
            <simple-stars :amount="product.rating|| 0" desktop="large" mobile="large"></simple-stars>
            <div v-if="product.rating" class="rating-label">
              {{ t('messages.rates_reviews', {rates: product.ratings, reviews: product.reviews }) }}
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
      
      <div class="tab-row">
        <div v-if="$device.isMobile" class="tab-back-slot">
          <LazyProductTabBackButton :fallback="tabsBackLink"></LazyProductTabBackButton>
        </div>
        <lazy-simple-tabs
          v-model="tab"
          :values="tabs"
          value="name"
          value-key="id"
          class="tab-wrapper"
        ></lazy-simple-tabs>
      </div>

      <!-- LEFT SIDE -->
      <div class="content-main" ref="content">
        <transition name="fade-in">
          <!-- Common -->
          <template v-if="tab === 1">
            <div class="content-common">
              <Transition name="block-from-top" appear>
                <lazy-product-gallery-mobile v-if="$device.isMobile" :items="product.images" class="gallery-wrapper"></lazy-product-gallery-mobile>
                <lazy-product-gallery v-else :items="product.images" class="gallery-wrapper"></lazy-product-gallery>
              </Transition>
              <div v-if="$device.isDesktop" class="content-html rich-text" v-html="product.content"></div>
            </div>
          </template>

          <!-- Content -->
          <template v-else-if="tab === 2">
            <div class="full-content">
              <div class="tab-title">{{ t('label.desc') }}</div>
              <div class="rich-text" v-html="product.content"></div>
            </div>
          </template>

          <!-- Properties -->
          <template v-else-if="tab === 3">
            <div class="params-wrapper">
              <div class="tab-title">{{  t('attrs') }}</div>
              <lazy-simple-list-params :items="allAttrs"></lazy-simple-list-params>
            </div>
          </template>

          <!-- Reviews -->
          <template v-else-if="tab === 4">
            <lazy-product-reviews
              :reviews="reviews"
              :meta="reviewsMeta"
              :product="product"
              @update:current="loadReviewsHandler"
              id="reviews"
            ></lazy-product-reviews>
          </template>

          <!-- Delivery -->
          <template v-else-if="tab === 5">
            <div class="">
              <div class="tab-title">{{ t('title.delivery') }}</div>
              <lazy-product-delivery-info></lazy-product-delivery-info>
            </div>
          </template>

          <!-- Payment -->
          <template v-else-if="tab === 6">
            <div class="">
              <div class="tab-title">{{ t('title.payment') }}</div>
              <lazy-product-payment-info></lazy-product-payment-info>
            </div>
          </template>

          <!-- Guarantees -->
          <template v-else-if="tab === 7">
            <div class="">
              <div class="tab-title">{{ t('title.guarantees') }}</div>
              <lazy-product-guarantees-info></lazy-product-guarantees-info>
            </div>
          </template>
        </transition>
      </div>

      <!-- RIGHT SIDE -->
      <div class="content-sale">
        <!-- <lazy-product-guarantee
          v-if="$device.isMobile && tab === 1"
          class="content-guarantee"
          @more="changeTabHandler(7)"
        ></lazy-product-guarantee> -->

        <lazy-product-modifications
          v-if="($device.isDesktop || tab === 1) && product?.modifications?.length > 1"
          :product="product"
          :class="{mini: tab !== 1}"
          class="content-modifications"
        >
        </lazy-product-modifications>

        <lazy-product-sale-block
          v-if="$device.isDesktop || tab === 1"
          :product="product"
          :class="{mini: tab !== 1}"
          class="content-buy"
        ></lazy-product-sale-block>

        <transition name="fade-in">
          <lazy-product-feature v-if="tab === 1 && isSpecsIsset" :specs="product.specs" class="content-feature"></lazy-product-feature>
        </transition>

        <transition name="fade-in">
          <lazy-product-delivery-box
            v-if="tab === 1"
            class="content-delivery"
            @more="changeTabHandler(5)"
          ></lazy-product-delivery-box>
        </transition>

        <transition name="fade-in">
          <lazy-product-payment-box
            v-if="tab === 1"
            @more="changeTabHandler(6)"
            class="content-payment"
          ></lazy-product-payment-box>
        </transition>
        
        <transition name="fade-in">
          <lazy-product-params-box
            v-if="tab === 1 && product.attrs && product.attrs.length"
            :items="allAttrs.slice(0,3)"
            @more="changeTabHandler(3)"
            class="content-params"
          ></lazy-product-params-box>
        </transition>
        
        <transition name="fade-in">
          <lazy-product-content-box
            v-if="tab === 1 && $device.isMobile"
            :content="product.content"
            @more="changeTabHandler(2)"
            class="content-html"
          ></lazy-product-content-box>
        </transition>

        <transition name="fade-in">
          <product-reviews-box
            v-if="tab === 1"
            :reviews="reviews"
            :meta="reviewsMeta"
            :product="product"
            :amount="2"
            @loadReviews="loadReviewsHandler"
            @more="changeTabHandler(4)"
            class="content-reviews"
            ref="reviewsComponentRef"
            id="reviews"
          ></product-reviews-box>
        </transition>
      </div>

    </div>
  </div>

  
  <div class="content-box">
    <lazy-section-lists :query="simularQuery" page="product"></lazy-section-lists>
  </div>

  <!-- Sale block mobile   -->
  <lazy-product-sale-fixed v-if="$device.isMobile" :product="product"></lazy-product-sale-fixed>
  </div>
</template>
