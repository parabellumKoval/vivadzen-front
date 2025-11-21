<script setup>
import { useProductStore } from '~/store/product'

const props = defineProps({
  page: {
    type: String
  },
  query: {
    type: Object
  },
})

const {t} = useI18n()

const dataSource = await useLazyAsyncData(
      `products-${props.page}`,
      async () => {
        const response = await useProductStore().lists(props.query, props.page)
        return response.data.value
      },
      { default: () => [] }
    )

const lists = computed(() => dataSource.data.value ?? [])
const pending = computed(() => dataSource.pending.value)

</script>

<style src="~/assets/scss/snap-nav.scss" lang="scss" scoped></style>

<template>
  <div v-if="!pending && lists?.length" class="container">
    <section v-for="list in lists" class="main-section">
      <template v-if="list.items?.length">
        <div class="section-title">{{ list.title }}</div>
        <SnapCarousel
          mode = 'page'
          :items="list.items"
          :loop="true"
          :show-arrows="true"
          :show-dots="true"
        >
          <template #item="{ item }">
            <ProductCard :item="item" />
          </template>
          <template #prev>
            <IconCSS name="mynaui:chevron-left" size="24"></IconCSS>
          </template>
          <template #next>
            <IconCSS name="mynaui:chevron-right" size="24"></IconCSS>
          </template>
        </SnapCarousel>
      </template>
    </section>
  </div>
</template>
