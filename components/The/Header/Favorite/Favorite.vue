<script setup>
import {useFavoritesStore} from '~/store/favorites.ts'

const { t } = useI18n()
const productsCount = computed(() => {
  return useFavoritesStore().ids?.length
})

</script>

<style src="./favorite.scss" lang="scss" scoped />

<template>
  <NuxtLink :to="$regionPath('/account/favorite')" class="fav-btn" type="button" clickable>
    <IconCSS name="mynaui:heart" size="30px" class="icon"></IconCSS>
    <transition name="zoom">
      <div v-if="productsCount" class="budge">{{ productsCount }}</div>
    </transition>
  </NuxtLink>
</template>