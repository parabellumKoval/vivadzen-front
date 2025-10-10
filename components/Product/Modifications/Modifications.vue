<script setup>
const {t} = useI18n()
const props = defineProps({
  product: {
    type: Object
  }
})
// COMPUTEDS
const mods = computed(() => {
  let items = [{
    short_name: props.product.short_name,
    slug: props.product.slug,
    inStock: props.product.inStock
  }]

  if(props.product?.modifications?.length) {
    items = [
      ...items,
      ...props.product?.modifications
    ]
  }

  return items
})
// METHODS
// HANDLERS
// WATCHERS
</script>

<style src='./modifications.scss' lang='scss' scoped></style>
<i18n src='./lang.yaml' lang='yaml'></i18n>

<template>
  <div class="mod-wrapper">
    <div class="mod-label">{{ t('select') }}:</div>
    <div class="mod-items">
      <NuxtLink
        v-for="mod in mods"
        :key="mod.id"
        :to="$regionPath('/' + mod.slug)"
        class="mod-item"
        :class="{'not-in-stock': mod.inStock === 0}"
      >
        <IconCSS v-if="mod.inStock === 0" name="solar:forbidden-circle-linear" class="mod-item-icon"></IconCSS>
        <span>{{ mod.short_name || mod.name }}</span>
      </NuxtLink>
    </div>
  </div>
</template>