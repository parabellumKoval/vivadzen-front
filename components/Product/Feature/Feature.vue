<script setup>
const {t} = useI18n()
const props = defineProps({})

// COMPUTEDS
const items = computed(() => {
  return [
    {
      icon: 'ph:leaf-light',
      text: 'Натуральный продукт',
      type: 'green'
    },{
      icon: 'ph:plant-light',
      text: 'Подходит для вегетарианцев',
      type: 'green'
    },{
      icon: 'healthicons:lactose-free-outline',
      text: 'Без лактозы',
      type: 'red'
    },{
      icon: 'healthicons:gluten-free-outline',
      text: 'Без глютена',
      type: 'red'
    },{
      icon: 'ph:flask-light',
      text: 'Без ГМО',
      type: 'red'
    }
  ]
})
// METHODS
// HANDLERS
// WATCHERS
</script>

<style src='./feature.scss' lang='scss' scoped></style>
<!-- <i18n src='' lang='yaml'></i18n> -->

<template>
  <div class="feature-items">
    <div v-for="(item, index) in items" :key="index" :class="item.type" class="feature-item">
      <IconCSS :name="item.icon" class="feature-icon"></IconCSS>
      <span class="feature-text">{{ item.text }}</span>
    </div>
  </div>
</template>