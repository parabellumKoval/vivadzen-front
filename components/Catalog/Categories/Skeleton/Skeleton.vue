<script setup>
// No props needed for skeleton
</script>

<style src='./skeleton.scss' lang='scss' scoped></style>

<template>
  <div class="category-wrapper">
    <div v-for="i in 12" :key="i" class="category skeleton">
      <div class="category-image skeleton-box"></div>
      <div class="category-name skeleton-box"></div>
    </div>
  </div>
</template>