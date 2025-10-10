<script setup>
const props = defineProps({
  items: {
    type: Number
  }
})
// COMPUTEDS
// METHODS

// HANDLERS
</script>

<style src="./sub.scss" lang="scss" scoped />

<template>
  <div :class="{'mobile-active': items && items.length}" class="sub-wrapper">
    <div class="sub-inner">
      <template v-for="category in items" :key="category?.id">
        <NuxtLink
          :to="$regionPath('/' + category.slug)"
          :aria-label="category.name"
          clickable
          class="sub-item link"
        >
          <div class="sub-name">{{ category.name }}</div>
        </NuxtLink>
        <ul v-if="category.children?.length" class="last">
          <li v-for="child in category.children" :key="child?.id" class="last-item">
            <NuxtLink :to="$regionPath('/' + child.slug)" class="last-link link">
              {{ child.name }}
            </NuxtLink>
          </li>
        </ul>
      </template>
    </div>
  </div>
</template>