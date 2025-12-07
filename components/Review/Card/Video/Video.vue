<!-- components/YouTubeStory.vue -->
<script setup lang="ts">
import { toRef } from 'vue'

const props = defineProps<{
  videoId: string
  /** Показывать превью до клика (рекомендуется) */
  title?: string
  poster?: string
  lazy?: boolean
  /** Начало воспроизведения (сек) */
  start?: number
}>()

const { iframeSrc, isPlaying, play, posterUrl } = useReviewVideoPlayer({
  videoId: toRef(props, 'videoId'),
  poster: toRef(props, 'poster'),
  start: toRef(props, 'start'),
})
</script>

<style src="./video.scss" scoped lang="scss"></style>

<template>
  <div class="story">
    <!-- Фон-превью до старта -->
    <!-- <div
      v-if="!isPlaying && lazy !== false"
      class="poster"
      :style="{ backgroundImage: `url('${posterUrl}')` }"
    ></div> -->

    <nuxt-img
      v-if="!isPlaying && lazy !== false"
      :src = "posterUrl"
      width="340"
      height="600"
      sizes = "mobile:360px"
      format = "avif"
      quality = "60"
      loading = "lazy"
      fit="outside"
      :placeholder="useImg().noImage"
      class="poster"
    ></nuxt-img>
    

    <!-- iframe: 16:9 растянут под 9:16 контейнер с “cover” -->
    <iframe
      v-if="isPlaying || lazy === false"
      class="frame"
      :src="iframeSrc"
      title="YouTube video player"
      frameborder="0"
      allow="autoplay; encrypted-media; picture-in-picture; clipboard-write"
      allowfullscreen="false"
      referrerpolicy="strict-origin-when-cross-origin"
    ></iframe>

    <div class="footer">
      <div class="title">{{ title }}</div>

      <button
        v-if="!isPlaying"
        type="button"
        class="playBtn"
        aria-label="Play"
        @click="play"
      >
        <span class="triangle" />
      </button>
    </div>
  </div>
</template>
