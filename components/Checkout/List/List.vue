<script setup>
import {useCartStore} from '~/store/cart'
import { useProductStore } from '~/store/product'

const props = defineProps({
  page: {
    type: String,
    default: 'checkout'
  },
  query: {
    type: Object
  },
  itemsPerPage: {
    type: Object,
    default: {mobile: 3, tablet: 6, desktop: 8, ld: 10, xld: 12}
  }
})

const emits = defineEmits(['isActive'])

const {t} = useI18n()

const cartStore = useCartStore()
const productIds = computed(() => cartStore.productIds)

const query  = computed(() => {
  return props.query || {
    per_page: 10,
    anchors: {
      model: 'product',
      ids: productIds.value
    }
  }
})

const fetchKey = computed(() => {
  return `products-${props.page}-${productIds.value.join('-')}`
})

const dataSource = await useLazyAsyncData(
      fetchKey.value,
      async () => {
        const response = await useProductStore().lists(query.value, props.page)
        emits('isActive', response.data.value && response.data.value.length > 0 && response.data.value.some(item => item.items?.length > 0))
        return response.data.value
      },
      { 
        default: () => [],
        watch: [productIds]
      }
    )

const lists = computed(() => dataSource.data.value ?? [])
const pending = computed(() => dataSource.pending.value)

</script>

<style src="~/assets/scss/snap-nav.scss" lang="scss" scoped></style>
<style lang="scss" scoped>
  .list-wrapper {
      background-color: $color-bg-3;
  }
  .title-secondary {
    font-size: 20px;
    font-weight: 400;
    margin-bottom: 15px;
  }
  :deep(.snap-carousel__controls) {
    grid-template-columns: 1fr;
    margin-top: 15px;
  }
  :deep(.snap-carousel__arrow) {
    display: none;
  }
</style>

<template>
  <div v-if="!pending && lists?.length" class="list-wrapper">
    <div v-for="list in lists">
      <template v-if="list.items?.length">
        <div class="title-secondary">{{ list.title }}</div>
        <SnapCarousel
          mode = 'page'
          :items="list.items"
          :loop="true"
          :show-arrows="true"
          :show-dots="true"
          :items-per-page="itemsPerPage"
        >
          <template #item="{ item }">
            <ProductCardCheckoutSmall :item="item" />
          </template>
          <template #prev>
            <IconCSS name="mynaui:chevron-left" size="24"></IconCSS>
          </template>
          <template #next>
            <IconCSS name="mynaui:chevron-right" size="24"></IconCSS>
          </template>
        </SnapCarousel>
      </template>
    </div>
  </div>
</template>
