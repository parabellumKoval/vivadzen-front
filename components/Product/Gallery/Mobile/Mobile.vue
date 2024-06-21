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
const getImage = (src) => {
  if(src)
    return '/server/images/products/' + src
  else
    return null
}

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
          v-if="item.src"
          :src = "getImage(item.src)"
          :alt = "item.alt"
          :title = "item.title"
          :class="item.size"
          width="85"
          height="85"
          sizes = "mobile:50vw tablet:85px desktop:85px"
          format = "avif"
          quality = "35"
          placeholder="/images/noimage.png"
          fit="outside"
          class="thumbnail-image"
        >
        </nuxt-img> 
      </button>
    </div>
    <div ref="mainRef" :class="{full: images?.length <= 1}" class="main">
      <div v-for="(image, index) in images" :key="index" :ref="setImageRef">
        <nuxt-img
          :src = "getImage(image.src)"
          :alt = "image.alt"
          :title = "image.title"
          :class="image.size"
          sizes = "mobile:100vw tablet:600px desktop:600px"
          format = "avif"
          quality = "60"
          fit="outside"
          class="main-image"
          placeholder="/images/noimage.png"
        />
      </div>
    </div>
  </div>
</template>