<script setup>
import { useCategoryStore } from '~/store/category'
const {t} = useI18n()

const selectedIndex = ref(null)

// COMPUTEDS
const categories = computed(() => {
  return useCategoryStore().list
})

const selectedCategory = computed(() => {
  if(selectedIndex.value === null)
    return null
  else
    return categories.value[selectedIndex.value]
})

const sub = computed(() => {
  if(selectedIndex.value === null)
    return []
  else 
    return [
      {
        id: selectedCategory.value.id,
        name: t('label.all_products'),
        slug: selectedCategory.value.slug
      },
      ...selectedCategory.value.children
    ]
})


// HANDLERS
const selectMainHandler = (index) => {
  selectedIndex.value = index
}

const closeModalHandler = () => {
  useModal().close()
}

const backHandler = () => {
  selectedIndex.value = null
}

if(useDevice().isDesktop) {
  selectedIndex.value = 0
}
</script>

<style src="./catalog.scss" lang="scss" scoped />

<template>
  <modal-wrapper class="m-wrapper">
    <div class="catalog">
      <the-menu-catalog-main @changeSelected="selectMainHandler"></the-menu-catalog-main>
      <the-menu-catalog-sub :items="sub"></the-menu-catalog-sub>
    </div>
  </modal-wrapper>
</template>