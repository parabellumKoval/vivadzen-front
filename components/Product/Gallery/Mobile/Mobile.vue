<script setup>
const props = defineProps({
  items: {
    type: Array
  }
})

const activeIndex = ref(0)
const imagesRef = ref([])
const mainRef = ref(null)

// COMPUTEDS

const image = computed(() => {
  return props.items?.length? props.items[activeIndex.value]: {
    src: './images/noimage.png',
    alt: null,
    title: null
  }
})

const images = computed(() => {
  return props.items
})

// METHODS
const setImageRef = (r) => {
  if (r) {
    imagesRef.value.push(r)
  }
}

// HANDLERS
const scrollToHandler = (index) => {
  const itemElement = imagesRef.value[index]
  mainRef.value.scrollLeft = itemElement.offsetLeft - 15
}

</script>

<style src="./mobile.scss" lang="scss" scoped></style>

<template>
  <div class="gallery">
    <div v-if="images?.length > 1" class="thumbnail">
      <button
        v-for="(item, index) in images"
        :key="index"
        :class="{active: activeIndex === index}"
        @click="scrollToHandler(index)"
        class="thumbnail-btn"
      >
        <nuxt-img
          :src = "item.src"
          :alt = "item.alt"
          :title = "item.title"
          sizes = "400px"
          quality = "40"
          fit="outside"
          :placeholder="useImg().noImage"
          loading="lazy"
          class="thumbnail-image"
          provider="bunny"
          format = "webp"
        >
        </nuxt-img> 
      </button>
    </div>
    <div ref="mainRef" :class="{full: images?.length <= 1}" class="main">
      <div v-for="(image, index) in images" :key="index" :ref="setImageRef">
        <nuxt-img
          :src = "image.src"
          :alt = "image.alt"
          :title = "image.title"
          sizes = "400px"
          quality = "40"
          fit="outside"
          :placeholder="useImg().noImage"
          :loading="index === 0? null: 'lazy'"
          class="main-image"
          provider="bunny"
          format = "webp"
          preload
        />
      </div>
    </div>
  </div>
</template>