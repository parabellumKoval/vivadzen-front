<script setup>
import SectionBannerItemsItem1 from '~/components/Section/Banner/Items/Item1/Item1.vue'
// import SectionBannerItemsItem2 from '~/components/Section/Banner/Items/Item2/Item2.vue'
// import SectionBannerItemsItem3 from '~/components/Section/Banner/Items/Item3/Item3.vue'
const { region } = useRegion()
const { locale, t } = useI18n()
const { $regionPath } = useNuxtApp()
const { list: loadCampaigns } = useCampaignApi()

const { data: homeCampaignsData } = await useAsyncData(
  'home-campaigns-' + region.value + '-' + locale.value,
  async () => await loadCampaigns('home'),
  {
    server: true,
    lazy: !process.server,
    default: () => []
  }
)

const campaignSlides = computed(() => {
  const campaigns = Array.isArray(homeCampaignsData.value) ? homeCampaignsData.value : []

  return campaigns.filter((campaign) => {
    return Boolean(
      campaign?.add_to_main_banner
      && campaign?.horizontal_banner
      && campaign?.slug
    )
  })
})

const fallbackSlides = [
  // SectionBannerItemsItem3,
  { type: 'component', component: SectionBannerItemsItem1 },
  // { type: 'component', component: SectionBannerItemsItem2 }
]

const slides = computed(() => {
  const campaignItems = campaignSlides.value.map((campaign) => ({
    type: 'campaign',
    campaign
  }))

  return [...campaignItems, ...fallbackSlides]
})

const hasMultipleSlides = computed(() => slides.value.length > 1)

const toCampaignCatalogPath = (campaign) => {
  const slug = campaign?.slug ? encodeURIComponent(String(campaign.slug)) : ''
  return slug ? `/catalog?campaign=${slug}` : '/catalog'
}
</script>

<style src="./banner.scss" lang="scss" scoped></style>
<style src="~/assets/scss/snap-nav.scss" lang="scss" scoped></style>

<template>
  <div class="con">
    <section class="banners-wrapper">
      <SnapCarousel
        class="banner-carousel"
        :items="slides"
        :items-per-page="{ xs: 1 }"
        :gap="30"
        :loop="hasMultipleSlides"
        :show-arrows="hasMultipleSlides"
        :show-dots="hasMultipleSlides"
        aria-label="Homepage banners"
      >
        <template #item="{ item }">
          <component v-if="item?.type === 'component'" :is="item.component" />

          <NuxtLink
            v-else
            :to="$regionPath(toCampaignCatalogPath(item.campaign))"
            class="campaign-slide slide"
          >
            <nuxt-img
              :src="item.campaign.horizontal_banner"
              :alt="item.campaign.name || t('campaign.campaign_title')"
              provider="bunny"
              loading="lazy"
              width="1920"
              height="900"
              quality="70"
              fit="cover"
              class="campaign-slide-image"
            />

            <div class="campaign-slide-content">
              <div class="campaign-slide-title">{{ item.campaign.name }}</div>
              <div v-if="item.campaign.short_description" class="campaign-slide-description">
                {{ item.campaign.short_description }}
              </div>
              <div class="campaign-slide-cta">{{ t('campaign.in_catalog') }}</div>
            </div>
          </NuxtLink>
        </template>
        <template #prev>
          <IconCSS name="mynaui:chevron-left" size="24"></IconCSS>
        </template>
        <template #next>
          <IconCSS name="mynaui:chevron-right" size="24"></IconCSS>
        </template>
      </SnapCarousel>
    </section>
  </div>
</template>
