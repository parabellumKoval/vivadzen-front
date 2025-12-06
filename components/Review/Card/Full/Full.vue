<script setup>
import {useLikesStore} from '~~/store/likes';

const {t} = useI18n()
const { isAuthenticated } = useAuth()
const {regionsMeta, region} = useRegion()

const props = defineProps({
  item: {
    type: Object
  },
  parentName: {
    type: String
  },
  hideReplies: {
    type: Boolean,
    default: false
  }
})

const likes = ref(0)

// COMPUTED
const isMyLike = computed(() => {
  const likes = useLikesStore().getLikes || []

  if(likes.includes(props.item.id)){
    return true
  }else {
    return false
  }
})

const link = computed(() => props.item?.extras?.link || null)

const videoMeta = computed(() => {
  const video = props.item?.video || null
  if (!video?.url) {
    return null
  }

  const videoId = extractYoutubeId(video.url)
  if (!videoId) {
    return null
  }

  return {
    id: videoId,
    poster: video.poster,
    start: video.start,
    title: video.title,
  }
})

const hasVideo = computed(() => Boolean(videoMeta.value))

const {
  iframeSrc: videoIframeSrc,
  isPlaying: isVideoPlaying,
  play: playVideo,
  posterUrl: videoPosterUrl,
} = useReviewVideoPlayer({
  videoId: computed(() => videoMeta.value?.id || null),
  poster: computed(() => videoMeta.value?.poster),
  start: computed(() => videoMeta.value?.start),
})


// HANDLERS
const replyHandler = () => {
  if(isAuthenticated.value) {
    useModal().open(resolveComponent('ModalReviewReply'), props.item, null, {width: {min: 420, max: 420}})
  }else{
    useNoty().setNoty({
      content: t('noty.review.need_login'),
      type: 'warning'
    }, 7000)
    
    useModal().open(resolveComponent('ModalAuthSocial'), null, null)
  }
}

const toggleLikeHandler = () => {
  if(isMyLike.value) {
    likes.value -= 1
  }else {
    likes.value += 1
  }

  useLikesStore().toggleLike(props.item.id)
}

// METHODS
const setLikes = () => {
  likes.value = props.item.likes
}

const extractYoutubeId = (rawUrl) => {
  if (!rawUrl) {
    return null
  }

  try {
    const url = new URL(rawUrl)
    if (url.hostname.includes('youtu.be')) {
      return url.pathname.replace(/^\/+/, '').split('/')[0] || null
    }

    const embedIndex = url.pathname.indexOf('/embed/')
    if (embedIndex !== -1) {
      return url.pathname.slice(embedIndex + 7).split(/[/?&#]/)[0] || null
    }

    const watchId = url.searchParams.get('v')
    if (watchId) {
      return watchId
    }

    const segments = url.pathname.split('/')
    return segments.pop() || null
  } catch (e) {
    const match = rawUrl.match(/(?:embed\/|v=|youtu\.be\/)([\w-]{11})/)
    return match ? match[1] : null
  }
}

const getFlagIcon = (code) => {
  let codeLower = code ? code.toLowerCase() : null
  codeLower = codeLower === 'zz' ? 'global' : codeLower
  const regionData = regionsMeta[codeLower] || null
  return regionData?.flagClass || null
}

setLikes()
</script>

<style src="./full.scss" lang="scss" scoped></style>
<i18n src="./lang.yaml" lang="yaml"></i18n>

<template>
  <div>
    <div class="full">
      <div class="header">
        <div class="name-block">
          <div class="name">{{ item.owner?.name || 'Incognito' }}</div>
          <review-social
            v-if="link"
            :source="link"
            class="name-social"
          ></review-social>
        </div>
        <div v-if="getFlagIcon(item.country)" class="flag">
          <Icon :name="getFlagIcon(item.country)" class="icon"></Icon>
        </div>
        <div class="date">{{ $d(item.created_at, 'long') }}</div>
      </div>
      <simple-stars v-if="item.rating" :amount="item.rating" mobile="medium" class="stars"></simple-stars>
      <div v-if="item.extras?.verified_purchase === '1'" class="approved">
        <IconCSS name="iconoir:user-cart" class="approved-icon"></IconCSS>
        <span class="approved-text">{{ t('verified_purchase') }}</span>
      </div>
      
      <div v-if="hasVideo" class="full-video">
        <div class="full-video-player">
          <nuxt-img
            v-if="!isVideoPlaying"
            :provider="useImg().provider"
            :src="videoPosterUrl || useImg().noImage"
            width="640"
            height="360"
            sizes="mobile:360px tablet:600px desktop:800px"
            quality="70"
            loading="lazy"
            fit="cover"
            class="full-video-poster"
            :placeholder="useImg().noImage"
          ></nuxt-img>
          <iframe
            v-if="isVideoPlaying && videoIframeSrc"
            class="full-video-frame"
            :src="videoIframeSrc"
            title="YouTube video player"
            frameborder="0"
            allow="autoplay; encrypted-media; picture-in-picture; clipboard-write"
            allowfullscreen="false"
            referrerpolicy="strict-origin-when-cross-origin"
          ></iframe>
          <button
            v-if="!isVideoPlaying"
            type="button"
            class="full-video-play"
            aria-label="Play video review"
            @click="playVideo"
          >
            <span class="full-video-triangle"></span>
          </button>
        </div>
        <div v-if="videoMeta?.title" class="full-video-title">{{ videoMeta.title }}</div>
      </div>

      <div class="content">
        <span v-if="parentName" class="parent">
          <IconCSS name="iconoir:reply" size="14" class="parent-icon"></IconCSS>
          <span class="parent-name">{{ parentName }}</span>
        </span> 
        {{ item.text }}
      </div>
      <div v-if="item.extras?.advantages" class="review-adv">
        <div class="review-label">{{ t('dignity') }}</div>
        <div>{{ item.extras?.advantages }}</div>
      </div>
      <div v-if="item.extras?.flaws" class="review-adv">
        <div class="review-label">{{ t('flaws') }}</div>
        <div>{{ item.extras?.flaws }}</div>
      </div>
      <div class="buttons">

        <button
          @click="toggleLikeHandler"
          :class="[isMyLike ? 'violet' : 'secondary']"
          class="button mini"
        >
          <template v-if="isMyLike">
            <IconCSS name="mynaui:like-solid" class="inline-icon"></IconCSS>
          </template>
          <template v-else>
            <IconCSS name="mynaui:like" class="inline-icon"></IconCSS>
          </template>
          <span v-if="likes">{{ likes }}</span>
        </button>

        <button @click="replyHandler" class="button mini secondary lowcase">
          <IconCSS name="iconoir:reply" class="inline-icon"></IconCSS>
          <span>{{ t('button.reply') }}</span>
        </button>

      </div>

      <div class="sub-items-wrapper" v-if="!hideReplies && item.children?.length">
        <review-card-full
          v-for="ch in item.children"
          :key="ch.id"
          :item="ch"
          :parent-name="item.owner?.name"
          :hide-replies="hideReplies"
          class="deep-child"
        ></review-card-full>
      </div>
    </div>
  </div>
</template>
