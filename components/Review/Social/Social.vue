<script setup>
const {t} = useI18n()
const props = defineProps({
  source: {
    type: String,
    default: null
  },
  name: {
    type: String
  }
})
// COMPUTEDS

const PROVIDERS = [
  {
    type: 'facebook',
    pattern: /facebook\.com/i,
    label: 'Facebook',
    icon: 'basil:facebook-outline'
  },
  {
    type: 'instagram',
    pattern: /instagram\.com/i,
    label: 'Instagram',
    icon: 'basil:instagram-outline'
  },
  {
    type: 'tiktok',
    pattern: /tiktok\.com/i,
    label: 'TikTok',
    icon: 'mingcute:tiktok-line'
  },
  {
    type: 'twitter',
    pattern: /(twitter\.com|x\.com)/i,
    label: 'Twitter (X)',
    icon: 'ri:twitter-x-line'
  }
]

const resolvedLink = computed(() => {
  const rawHref = props.source?.trim()

  if(!rawHref) {
    return {
      href: null,
      type: null,
      icon: 'basil:link-outline',
      label: null,
      className: null
    }
  }

  let url = null
  try {
    url = new URL(rawHref)
  } catch (e) {
    try {
      url = new URL(`https://${rawHref}`)
    } catch (error) {
      url = null
    }
  }

  const host = url?.hostname?.toLowerCase() || ''
  const provider = host ? PROVIDERS.find(({pattern}) => pattern.test(host)) : null
  const fallback = host.replace(/^www\./, '') || rawHref

  const finalHref = url?.href || rawHref

  return {
    href: finalHref,
    type: provider?.type || null,
    icon: provider?.icon || 'basil:link-outline',
    label: provider?.label || fallback,
    className: provider?.type ? `${provider.type}-bg` : null
  }
})

const socialName = computed(() => resolvedLink.value.label || '')
// METHODS
// HANDLERS
// WATCHERS
</script>

<style src='./social.scss' lang='scss' scoped></style>
<i18n src='./lang.yaml' lang='yaml'></i18n>

<template>
  <div v-if="resolvedLink.href">
    <a
      v-if="!name"
      :href="resolvedLink.href"
      :class="['social-link', resolvedLink.className]"
      target="_blank"
      rel="nofollow"
    >
      <IconCSS :name="resolvedLink.icon" class="social-link-icon"></IconCSS>
      <!-- <span class="social-link-text">{{ socialName }} {{ t('author') }}</span> -->
    </a>
    <a v-else
      :href="resolvedLink.href"
      target="_blank"
      rel="nofollow"
      :class="['name-link', resolvedLink.className]"
    >
      <IconCSS :name="resolvedLink.icon" class="name-link-icon"></IconCSS>
      <span class="name-link-text">{{ name }}</span>
    </a>
  </div>
</template>
