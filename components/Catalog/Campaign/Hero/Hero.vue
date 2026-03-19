<script setup>
const props = defineProps({
  campaign: {
    type: Object,
    default: null
  }
})

const { t } = useI18n()

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

const campaignData = computed(() => {
  return props.campaign || null
})

const hasCampaignConditions = computed(() => {
  const html = campaignData.value?.conditions_html
  return typeof html === 'string' && html.trim().length > 0
})

const campaignEndAt = computed(() => {
  const value = campaignData.value?.ends_at

  if (!value) {
    return null
  }

  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? null : date
})

const isCampaignTimerEnabled = computed(() => {
  return Boolean(campaignData.value?.is_timed)
})

const campaignDiffMs = computed(() => {
  if (!campaignEndAt.value) {
    return 0
  }

  return campaignEndAt.value.getTime() - nowTs.value
})

const isCountdownVisible = computed(() => {
  return isCampaignTimerEnabled.value && campaignDiffMs.value > 0
})

const timerStatusText = computed(() => {
  if (!isCountdownVisible.value) {
    return null
  }

  const hourMs = 60 * 60 * 1000
  const dayMs = 24 * hourMs

  if (campaignDiffMs.value < dayMs) {
    const hours = Math.max(1, Math.floor(campaignDiffMs.value / hourMs))
    return t('timer.status_hours', { count: hours })
  }

  const days = Math.max(1, Math.floor(campaignDiffMs.value / dayMs))
  return t('timer.status_days', { count: days })
})

const countdownSegments = computed(() => {
  if (!isCountdownVisible.value) {
    return []
  }

  const totalSeconds = Math.max(0, Math.floor(campaignDiffMs.value / 1000))
  const days = Math.floor(totalSeconds / 86400)
  const hours = Math.floor((totalSeconds % 86400) / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60
  const pad = (value) => String(Math.max(0, value)).padStart(2, '0')

  return [
    {
      key: 'days',
      title: t('timer.days'),
      value: days > 99 ? String(days) : pad(days)
    },
    {
      key: 'hours',
      title: t('timer.hours'),
      value: pad(hours)
    },
    {
      key: 'minutes',
      title: t('timer.minutes'),
      value: pad(minutes)
    },
    {
      key: 'seconds',
      title: t('timer.seconds'),
      value: pad(seconds)
    }
  ]
})

const productsCountText = computed(() => {
  const count = Number(campaignData.value?.products_count || 0)
  return t('products_count', { count })
})

const openCampaignConditionsHandler = () => {
  if (!campaignData.value || !hasCampaignConditions.value) {
    return
  }

  const component = defineAsyncComponent(() => import('~/components/Modal/Campaign/Conditions/Conditions.vue'))

  useModal().open(component, { campaign: campaignData.value }, null, {
    width: {
      min: 320,
      max: 960
    },
    height: {
      max: '88vh'
    }
  })
}
</script>

<style src="./hero.scss" lang="scss" scoped></style>
<i18n src="./lang.yaml" lang="yaml"></i18n>

<template>
  <section v-if="campaignData" class="campaign-catalog-hero">
    <div class="campaign-catalog-hero__shell">
      <div class="campaign-catalog-hero__copy">
        <div class="campaign-catalog-hero__meta">
          <div class="campaign-catalog-hero__badge">
            <IconCSS name="streamline:flash-1-remix" class="campaign-catalog-hero__badge-icon" />
            <span>{{ t('badge') }}</span>
          </div>

          <div v-if="timerStatusText" class="campaign-catalog-hero__deadline">
            <IconCSS name="ph:timer-bold" class="campaign-catalog-hero__deadline-icon" />
            <span>{{ timerStatusText }}</span>
          </div>

          <div class="campaign-catalog-hero__count">
            {{ productsCountText }}
          </div>
        </div>

        <h2 class="campaign-catalog-hero__title">
          {{ campaignData.name }}
        </h2>

        <p v-if="campaignData.short_description" class="campaign-catalog-hero__description">
          {{ campaignData.short_description }}
        </p>

        <div v-if="countdownSegments.length" class="campaign-catalog-hero__timer">
          <div class="campaign-catalog-hero__timer-grid">
            <div v-for="segment in countdownSegments" :key="segment.key" class="campaign-catalog-hero__timer-segment">
              <div class="campaign-catalog-hero__timer-value">{{ segment.value }}</div>
              <div class="campaign-catalog-hero__timer-label">{{ segment.title }}</div>
            </div>
          </div>
        </div>

        <div v-if="hasCampaignConditions" class="campaign-catalog-hero__actions">
          <button
            type="button"
            class="button campaign-catalog-hero__action"
            @click="openCampaignConditionsHandler"
          >
            {{ t('conditions_button') }}
          </button>
        </div>
      </div>

      <div v-if="campaignData.horizontal_banner" class="campaign-catalog-hero__media">
        <nuxt-img
          :src="campaignData.horizontal_banner"
          :alt="campaignData.name || t('badge')"
          provider="bunny"
          loading="lazy"
          width="960"
          height="540"
          quality="80"
          fit="cover"
          class="campaign-catalog-hero__image"
        />
      </div>
    </div>
  </section>
</template>
