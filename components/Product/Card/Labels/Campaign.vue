<script setup>
const props = defineProps({
  campaign: {
    type: Object,
    default: null
  },
  fallbackText: {
    type: String,
    default: ''
  }
})

const dayMs = 24 * 60 * 60 * 1000

const nowTs = ref(Date.now())
let timerId = null

onMounted(() => {
  nowTs.value = Date.now()

  timerId = setInterval(() => {
    nowTs.value = Date.now()
  }, 1000)
})

onBeforeUnmount(() => {
  if (timerId) {
    clearInterval(timerId)
    timerId = null
  }
})

const campaignEndAt = computed(() => {
  const value = props.campaign?.ends_at
  if (!value) {
    return null
  }

  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? null : date
})

const isCampaignTimerEnabled = computed(() => {
  const campaign = props.campaign
  return Boolean(campaign?.is_timed && campaign?.show_timer_card)
})

const campaignDiffMs = computed(() => {
  if (!campaignEndAt.value) {
    return 0
  }

  return campaignEndAt.value.getTime() - nowTs.value
})

const countdownText = computed(() => {
  if (!isCampaignTimerEnabled.value || campaignDiffMs.value <= 0) {
    return null
  }

  if (campaignDiffMs.value >= dayMs) {
    const days = Math.max(1, Math.floor(campaignDiffMs.value / dayMs))
    return `Осталось ${days}дн`
  }

  const totalSeconds = Math.max(0, Math.floor(campaignDiffMs.value / 1000))
  const hours = Math.floor(totalSeconds / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60
  const pad = (value) => String(value).padStart(2, '0')

  return `Осталось ${hours}ч ${pad(minutes)}:${pad(seconds)}`
})

const labelText = computed(() => {
  return countdownText.value || props.fallbackText
})

const isUrgent = computed(() => {
  return campaignDiffMs.value > 0 && campaignDiffMs.value < dayMs
})

const isMarquee = computed(() => {
  return !countdownText.value && labelText.value.length > 18
})
</script>

<template>
  <div v-if="labelText" class="card-label campaign">
    <span :class="{ marquee: isMarquee, countdown: isUrgent }" class="card-label__text">{{ labelText }}</span>
  </div>
</template>
