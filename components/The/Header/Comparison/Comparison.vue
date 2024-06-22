<script setup>
import {useComparisonStore} from '~/store/comparison.ts'

const { t } = useI18n()

const productsCount = computed(() => {
  return useComparisonStore().ids?.length
})

</script>

<style src="./comparison.scss" lang="scss" scoped />

<template>
  <NuxtLink :to="localePath('/comparison')" class="header-btn comp-btn" type="button" clickable>
    <IconCSS name="ph:scales-light" size="30px" class="icon"></IconCSS>
    <transition name="zoom">
      <div v-if="productsCount" class="budge">{{ productsCount }}</div>
    </transition>
  </NuxtLink>
</template>