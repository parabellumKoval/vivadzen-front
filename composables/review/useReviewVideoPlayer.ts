import { computed, ref, unref, type MaybeRef } from 'vue'

type PosterInput = string | { url?: string | null } | null | undefined

interface ReviewVideoOptions {
  videoId: MaybeRef<string | null | undefined>
  poster?: MaybeRef<PosterInput>
  start?: MaybeRef<number | null | undefined>
}

export const useReviewVideoPlayer = (options: ReviewVideoOptions) => {
  const isPlaying = ref(false)

  const normalizedVideoId = computed(() => unref(options.videoId) || '')

  const baseParams = computed(() => {
    const params = new URLSearchParams({
      controls: '0',
      modestbranding: '1',
      rel: '0',
      fs: '0',
      disablekb: '1',
      iv_load_policy: '3',
      playsinline: '1',
      cc_load_policy: '0',
    })

    const startValue = unref(options.start)
    if (startValue && startValue > 0) {
      params.set('start', String(startValue))
    }

    return params
  })

  const iframeSrc = computed(() => {
    const id = normalizedVideoId.value

    if (!id) {
      return ''
    }

    const params = new URLSearchParams(baseParams.value)
    if (isPlaying.value) {
      params.set('autoplay', '1')
      params.set('mute', '1')
    } else {
      params.set('autoplay', '0')
      params.set('mute', '1')
    }

    return `https://www.youtube.com/embed/${id}?${params.toString()}`
  })

  const posterUrl = computed(() => {
    const poster = unref(options.poster)

    if (typeof poster === 'string') {
      return poster
    }

    if (poster && typeof poster === 'object' && poster.url) {
      return poster.url
    }

    const id = normalizedVideoId.value
    return id ? `https://i.ytimg.com/vi/${id}/hqdefault.jpg` : ''
  })

  const play = () => {
    isPlaying.value = true
  }

  return {
    baseParams,
    iframeSrc,
    isPlaying,
    play,
    posterUrl,
  }
}
