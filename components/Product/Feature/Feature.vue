<script setup>
const {t} = useI18n()

const props = defineProps({
  specs: {
    type: Array
  }
})

// COMPUTEDS
const items = computed(() => {
  let list = []

  if(props.specs?.natural === "1") {
    list.push({
      icon: 'ph:leaf-light',
      text: 'Натуральный продукт',
      type: 'green'
    })
  }

  if(props.specs?.vegetarian === "1") {
    list.push({
      icon: 'ph:plant-light',
      text: 'Подходит для вегетарианцев',
      type: 'green'
    })
  }

  if(props.specs?.lactose === "1") {
    list.push({
      icon: 'healthicons:lactose-free-outline',
      text: 'Без лактозы',
      type: 'red'
    })
  }

  if(props.specs?.gluten === "1") {
    list.push({
      icon: 'healthicons:gluten-free-outline',
      text: 'Без глютена',
      type: 'red'
    })
  }

  if(props.specs?.gmo === "1") {
    list.push({
      icon: 'ph:flask-light',
      text: 'Без ГМО',
      type: 'red'
    })
  }

  if(props.specs?.milk === "1") {
    list.push({
      icon: 'bitcoin-icons:milk-outline',
      text: 'Без молока',
      type: 'red'
    })
  }
  
  return list
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