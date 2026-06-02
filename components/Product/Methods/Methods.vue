<script setup>
const props = defineProps({
  items: {
    type: Array
  }
})

const hasMeta = (item) => {
  const meta = item?.meta
  return meta !== undefined && meta !== null && meta !== ''
}

const isMetaPriceObject = (item) => {
  const meta = item?.meta
  return Boolean(item?.isMetaPriceObject && meta && typeof meta === 'object' && meta.amount !== undefined)
}
</script>

<style src="./methods.scss" lang="scss" scoped />

<template>
  <div>
    <div class="items">
      <div
        v-for="item in items"
        :key="item.id || item.key || item.title"
        class="item"
      >
        <div class="header">
          <IconCSS :name="item.icon" size="24" class="icon"></IconCSS>
          <span class="title">{{ item.title }}</span>
          <div v-if="hasMeta(item)" class="meta">
            <simple-price
              v-if="isMetaPriceObject(item)"
              :value="item.meta.amount"
              :currency-code="item.meta.currency"
            />
            <template v-else>
              {{ item.meta }}
            </template>
          </div>
          <span class="line"></span>
          <span class="logo">
            <nuxt-img
              :src = "item.image"
              :alt = "item.title"
              :title = "item.title"
              :provider = "useImg().provider"
              sizes = "mobile:155px tablet:155px desktop:155px"
              width = "auto"
              height = "60"
              fit = "inside"
              quality = "70"
              loading = "lazy"
              class="image"
            />
          </span>
        </div>

        <div class="content" v-html="item.desc"></div>
        <div v-if="item.sections?.length" class="sections">
          <div
            v-for="(section, index) in item.sections"
            :key="`${item.id || item.key || item.title}-${index}`"
            class="section"
          >
            <div v-if="section.title" class="section-title">{{ section.title }}</div>
            <p v-if="section.text" class="section-text">{{ section.text }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
