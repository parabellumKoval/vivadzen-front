<script setup>
const props = defineProps({
  item: {
    type: Object,
    required: true
  },
  label: {
    type: Object,
    default: null
  }
})

const isCampaignLabel = computed(() => {
  return props.label?.class === 'campaign'
})
</script>

<style src="./labels.scss" lang="scss" scoped />

<template>
  <div class="card-labels">
    <ProductCardLabelsCampaign
      v-if="isCampaignLabel"
      :campaign="item?.campaign"
      :fallback-text="label?.text"
    />

    <div v-else-if="label" :class="label.class" class="card-label">
      <span :class="{ marquee: label?.marquee }" class="card-label__text">{{ label.text }}</span>
    </div>

    <div v-else class="card-labels__placeholder"></div>
  </div>
</template>
