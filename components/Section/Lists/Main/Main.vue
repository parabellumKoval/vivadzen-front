<script setup>
const props = defineProps({
  query: {
    type: Object
  },
})

const {t} = useI18n()

const {data} = await useAsyncData('homepage-main-lists', () => useFetcherData('homepage-main-lists'))

const lists = ref([])
const pending = ref(true)

watch(data, (value) => {
  if (value?.data) {
    lists.value = value.data ?? []
    pending.value = false
  }
}, { immediate: true })


</script>

<style src="./../lists.scss" lang="scss" scoped></style>

<template>
  <div v-if="!pending && lists?.length" class="container">
    <section v-for="list in lists" class="main-section">
      <template v-if="list.items?.length">
        <h3 class="main-section-title">{{ list.title }}</h3>
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
