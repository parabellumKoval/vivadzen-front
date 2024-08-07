<script setup>
const {t} = useI18n()

const props = defineProps({
  items: {
    type: Array
  }
})

const getValue = (value) => {
  if(Array.isArray(value)) {
    return value.map(item => item.value).join(', ')
  }else {
    return value
  }
}
</script>

<style src="./params.scss" lang="scss" scoped></style>

<template>
  <div class="params">
    <ul class="list">
      <li v-for="(item, index) in items" :key="index" class="list-item">
        <span class="list-label">{{ item.name }}{{ item.si? ', ' + item.si: '' }}</span>
        <span class="list-line"></span>
        <NuxtLink v-if="item.link" :to="localePath(item.link)" class="list-value list-value-link">{{ getValue(item.value) }}</NuxtLink>
        <span v-else class="list-value">{{ getValue(item.value) }}</span>
      </li>
    </ul>
  </div>
</template>