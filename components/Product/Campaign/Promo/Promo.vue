<script setup>
const props = defineProps({
  campaign: {
    type: Object,
    default: null
  }
})

const { t } = useI18n()
const { $regionPath } = useNuxtApp()
const { getTimerText } = useCampaignPresentation()

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

const campaignCatalogPath = computed(() => {
  const slug = campaignData.value?.slug ? encodeURIComponent(String(campaignData.value.slug)) : ''
  return slug ? $regionPath(`/catalog?campaign=${slug}`) : $regionPath('/catalog')
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

const timerText = computed(() => {
  return getTimerText(campaignData.value, 'product', new Date(nowTs.value))
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
      title: 'DD',
      value: days > 99 ? String(days) : pad(days)
    },
    {
      key: 'hours',
      title: 'HH',
      value: pad(hours)
    },
    {
      key: 'minutes',
      title: 'MM',
      value: pad(minutes)
    },
    {
      key: 'seconds',
      title: 'SS',
      value: pad(seconds)
    }
  ]
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

<style src="./promo.scss" lang="scss" scoped></style>

<template>
  <article v-if="campaignData" class="campaign-promo">
    <div class="campaign-promo__badge">
      <IconCSS name="streamline:flash-1-remix" class="campaign-promo__badge-icon" />
      <span>{{ t('campaign.campaign_title') }}</span>
    </div>

    <h3 class="campaign-promo__title">{{ campaignData.name || t('campaign.campaign_title') }}</h3>

    <p v-if="campaignData.short_description" class="campaign-promo__description">
      {{ campaignData.short_description }}
    </p>

    <div v-if="countdownSegments.length" class="campaign-promo__timer-wrap">
      <div class="campaign-promo__timer-grid">
        <div v-for="segment in countdownSegments" :key="segment.key" class="campaign-promo__timer-segment">
          <div class="campaign-promo__timer-value">{{ segment.value }}</div>
          <div class="campaign-promo__timer-label">{{ segment.title }}</div>
        </div>
      </div>
      <div v-if="timerText" class="campaign-promo__timer-text">{{ timerText }}</div>
    </div>

    <div class="campaign-promo__actions">
      <NuxtLink :to="campaignCatalogPath" class="button promo campaign-promo__catalog-btn">
        {{ t('campaign.view_all_products') }}
      </NuxtLink>

      <button
        v-if="hasCampaignConditions"
        type="button"
        class="button color-primary campaign-promo__conditions-btn"
        @click="openCampaignConditionsHandler"
      >
        {{ t('campaign.view_conditions') }}
      </button>
    </div>
  </article>
</template>
