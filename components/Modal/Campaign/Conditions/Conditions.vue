<script setup>
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

const campaign = computed(() => {
  return useModal().active?.data?.campaign || {}
})

const campaignCatalogPath = computed(() => {
  const slug = campaign.value?.slug ? encodeURIComponent(String(campaign.value.slug)) : ''
  return slug ? $regionPath(`/catalog?campaign=${slug}`) : $regionPath('/catalog')
})

const campaignEndAt = computed(() => {
  const value = campaign.value?.ends_at

  if (!value) {
    return null
  }

  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? null : date
})

const isCampaignTimerEnabled = computed(() => {
  return Boolean(campaign.value?.is_timed)
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
  return getTimerText(campaign.value, 'product', new Date(nowTs.value))
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

const closeModal = () => {
  useModal().close()
}
</script>

<style src="./conditions.scss" lang="scss" scoped />
<style src="~/assets/scss/_rich-text.scss" lang="scss" scoped />

<template>
  <modal-wrapper no-padding>
    <div class="campaign-modal">
      <section class="campaign-modal-hero">
        <nuxt-img
          v-if="campaign?.horizontal_banner"
          :src="campaign.horizontal_banner"
          :alt="campaign?.name || t('campaign.conditions_title')"
          provider="bunny"
          loading="lazy"
          width="1200"
          height="380"
          quality="75"
          fit="cover"
          class="campaign-modal-hero-image"
        />

        <div class="campaign-modal-hero-overlay"></div>

        <div class="campaign-modal-hero-content">
          <div class="campaign-modal-badge">
            <IconCSS name="streamline:flash-1-remix" class="campaign-modal-badge-icon" />
            <span>{{ t('campaign.campaign_title') }}</span>
          </div>

          <h2 class="campaign-modal-title">{{ campaign?.name || t('campaign.conditions_title') }}</h2>

          <p v-if="campaign?.short_description" class="campaign-modal-description">
            {{ campaign.short_description }}
          </p>

          <div v-if="countdownSegments.length" class="campaign-modal-timer-wrap">
            <div class="campaign-modal-timer-grid">
              <div v-for="segment in countdownSegments" :key="segment.key" class="campaign-modal-timer-segment">
                <div class="campaign-modal-timer-value">{{ segment.value }}</div>
                <div class="campaign-modal-timer-label">{{ segment.title }}</div>
              </div>
            </div>
            <div v-if="timerText" class="campaign-modal-timer-text">{{ timerText }}</div>
          </div>

          <NuxtLink
            :to="campaignCatalogPath"
            class="button promo campaign-modal-catalog-btn"
            @click="closeModal"
          >
            {{ t('campaign.view_all_products') }}
          </NuxtLink>
        </div>
      </section>

      <section class="campaign-modal-content">
        <div class="campaign-modal-content-title">{{ t('campaign.conditions_title') }}</div>
        <div class="rich-text" v-html="campaign?.conditions_html || ''"></div>
      </section>
    </div>
  </modal-wrapper>
</template>
