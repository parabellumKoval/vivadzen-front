<script setup>
const props = defineProps({
  categories: {
    type: Array,
    default: () => [],
  },
  articlesByTag: {
    type: Object,
    default: () => ({}),
  },
  guidebooksLink: {
    type: String,
    required: true,
  },
  activeTag: {
    type: String,
    default: null,
  },
})

const { t } = useI18n()

const categoriesWithTags = computed(() => {
  return (props.categories || [])
    .map((category) => ({
      ...category,
      tag: category?.tags?.[0]?.text || null,
    }))
    .filter((category) => Boolean(category.tag))
})

const firstAvailableTag = computed(() => categoriesWithTags.value[0]?.tag || null)
const internalActiveTag = ref(props.activeTag || firstAvailableTag.value)

watch(
  () => props.activeTag,
  (value) => {
    if (value) {
      internalActiveTag.value = value
    } else if (!internalActiveTag.value) {
      internalActiveTag.value = firstAvailableTag.value
    }
  }
)

watch(
  categoriesWithTags,
  (list) => {
    if (!list.find((category) => category.tag === internalActiveTag.value)) {
      internalActiveTag.value = props.activeTag || firstAvailableTag.value
    } else if (!internalActiveTag.value) {
      internalActiveTag.value = firstAvailableTag.value
    }
  },
  { immediate: true }
)

const activeCategory = computed(() =>
  categoriesWithTags.value.find((category) => category.tag === internalActiveTag.value) ||
  categoriesWithTags.value[0] ||
  null
)

const categoryDescription = computed(() => {
  return activeCategory.value?.name ? `${activeCategory.value.name} guidebooks` : ''
})

const activeArticles = computed(() => {
  if (!internalActiveTag.value) {
    return []
  }
  return props.articlesByTag?.[internalActiveTag.value] || []
})

const handleCategoryClick = (category) => {
  if (!category.tag || category.tag === internalActiveTag.value) {
    return
  }
  internalActiveTag.value = category.tag
}
</script>

<i18n src="./lang.yaml" lang="yaml"></i18n>
<style src="./sidebar.scss" lang="scss" scoped></style>

<template>
  <div class="sidebar">
    <div class="sidebar-title">{{ t('guidebook') }}</div>
    <div v-if="categoriesWithTags.length" class="sidebar-tabs" role="tablist">
      <button
        v-for="category in categoriesWithTags"
        :key="category.id"
        class="sidebar-tab"
        :class="{ 'is-active': category.tag === internalActiveTag }"
        type="button"
        role="tab"
        @click="handleCategoryClick(category)"
      >
        {{ category.name }}
      </button>
    </div>
    <div class="sidebar-content">
      <div class="sidebar-content-label">{{ categoryDescription }}</div>
      <Transition name="fade-in">
        <div v-if="activeArticles.length" class="sidebar-articles-wrapper">
          <TransitionGroup name="fade-in" tag="div" class="sidebar-articles">
            <ArticleCardMini v-for="article in activeArticles" :key="article.id" :item="article" />
          </TransitionGroup>
        </div>
        <div v-else class="no-articles">{{ t('no_articles') }}</div>
      </Transition>
    </div>
    <NuxtLink :to="props.guidebooksLink" class="button primary sidebar-btn">{{ t('all_guidebooks') }}</NuxtLink>
  </div>
</template>
