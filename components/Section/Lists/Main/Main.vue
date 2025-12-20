<script setup>
const props = defineProps({
  query: {
    type: Object
  },
})

const {t, locale} = useI18n()
const { regionAlias } = useRegion()

const listsState = useState('fetcher-homepage-main-lists', () => null)
const pending = useState('fetcher-homepage-main-lists-pending', () => true)

const fetchLists = async () => {
  pending.value = true
  listsState.value = await useFetcherData('homepage-main-lists')
  pending.value = false
}

if (process.server) {
  await fetchLists()
}

watch([locale, regionAlias], () => {
  if (!process.client) {
    return
  }
  void fetchLists()
})

onMounted(() => {
  if (!process.client || listsState.value) {
    return
  }
  void fetchLists()
})

const lists = computed(() => listsState.value?.data ?? [])


</script>

<style src="~/assets/scss/snap-nav.scss" lang="scss" scoped></style>

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
