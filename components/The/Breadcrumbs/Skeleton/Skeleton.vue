<script setup>
defineProps({
  count: {
    type: Number,
    default: 3
  }
})
</script>

<style src="./sceleton.scss" lang="sass" scoped />

<template>
  <section class="breadcrumbs">
    <ul class="list" scrollable>
      <li
        v-for="n in count"
        :key="n"
        class="item"
        scrollable
      >
        <span class="breadcrumbs__link"></span>
      </li>
    </ul>
  </section>
</template>