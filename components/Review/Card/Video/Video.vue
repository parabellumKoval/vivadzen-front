<!-- components/YouTubeStory.vue -->
<script setup lang="ts">
import { computed, ref } from 'vue'

const props = defineProps<{
  videoId: string
  /** Показывать превью до клика (рекомендуется) */
  title?: string
  poster?: string
  lazy?: boolean
  /** Начало воспроизведения (сек) */
  start?: number
}>()

const isPlaying = ref(false)

const baseParams = computed(() => {
  const params = new URLSearchParams({
    // визуальные/поведенческие настройки
    controls: '0',
    modestbranding: '1',
    rel: '0',
    fs: '0',
    disablekb: '1',
    iv_load_policy: '3',
    // чтобы не выкидывало в полноэкран на iOS
    playsinline: '1',
    // субтитры выключены
    cc_load_policy: '0',
  })
  if (props.start && props.start > 0) params.set('start', String(props.start))
  return params
})

/** src до клика — без автоплея (или вовсе без iframe, если lazy=true) */
const iframeSrc = computed(() => {
  const p = new URLSearchParams(baseParams.value)
  // Автоплей и mute включаем только когда пользователь кликнул
  if (isPlaying.value) {
    p.set('autoplay', '1')
    p.set('mute', '1')
  } else {
    p.set('autoplay', '0')
    p.set('mute', '1') // чтобы мгновенно не было громко, если YouTube сам стартанет
  }
  return `https://www.youtube.com/embed/${props.videoId}?${p.toString()}`
})

/** Постер превью от YouTube */
const posterUrl = computed(
  () => props.poster?.url || `https://i.ytimg.com/vi/${props.videoId}/hqdefault.jpg`
)

function play() {
  isPlaying.value = true
}
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
      format = "webp"
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
