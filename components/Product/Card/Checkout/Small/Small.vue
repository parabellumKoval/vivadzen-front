<script setup>
const props = defineProps({
  item: {
    type: Object,
    required: true
  },
  index: {
    type: Number,
    default: null
  }
})

const { t } = useI18n()
const {$regionPath} = useNuxtApp();

const {photos, stock, label} = useCard(props.item)
const {toCartHandler} = useCart(props.item)
const {ensureRegionSelected} = useRegionPurchaseGuard()


// COMPUTEDS
const loading = computed(() => {
  if(props.index === null || props.index !== 0)
    return 'lazy'
  else {
    return null
  }
})

const hasModifications = computed(() => {
  return props.item?.modifications && props.item.modifications.length > 1
})

const reviewsCount = computed(() => {
  return props.item?.reviews || 0
})

// METHODS
// HANDLERS

const openChoseModificationModalHandler = (event) => {
  ensureRegionSelected(() => {
    const component = defineAsyncComponent(() => import('~/components/Modal/Modification/Modification.vue'))
    useModal().open(component, props.item, null)
  })
}

const addToCartHandler = () => {
  ensureRegionSelected(() => {
    toCartHandler(1)
  })
}
</script>

<style src="./small.scss" lang="scss" scoped />

<template>
  <div v-if="item" :class="stock" class="card">

    <NuxtLink
      :to="$regionPath('/' + item.slug)"
      :aria-label="item.name"
      :prefetch="false"
      @click="setGoogleEventHandler"
      clickable
      class="image-wrapper"
    >
      <nuxt-img
        v-for="(photo, index) in photos"
        :key = "index"
        :src = "photo?.src"
        :alt = "photo?.alt"
        :title = "photo?.title"
        width="290"
        height="260"
        sizes = "mobile:180px tablet:230px desktop:300px"
        format = "webp"
        provider = "bunny"
        quality = "50"
        :loading = "index > 0? 'lazy': loading"
        fit="outside"
        :placeholder="useImg().noImage"
        class="image"
      ></nuxt-img>
    </NuxtLink>
    
    <div class="content">

      <div class="reviews">
        <lazy-simple-stars :amount="item.rating" class="rating"></lazy-simple-stars>
      </div>

      <div class="name-wrapper">
        <NuxtLink
          :to="$regionPath(`/${item.slug}`)"
          class="name"
          clickable
          :prefetch="false"
          @click="setGoogleEventHandler"
        >
          {{ item.name }}
        </NuxtLink>
      </div>

      <div class="sale">
        <lazy-product-price :price="item.price" :old-price="item.oldPrice" :currency-code="item.currency"></lazy-product-price>
      </div>

    </div>

  </div>
</template>
