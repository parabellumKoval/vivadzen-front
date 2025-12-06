<script setup lang="ts">
const { t, locale } = useI18n()
const { $regionPath } = useNuxtApp()
const { user, isAuthenticated } = useAuth()
const { get } = useSettings()

const pageData = await queryContent('affiliate').locale(locale.value).findOne()

const breadcrumbs = [
  {
    name: t('title.home'),
    item: '/'
  },
  {
    name: t('title.affiliate_system'),
    item: '/affiliate'
  }
]

const settingsValues = computed(() => ({
  level1: get('profile.referrals.reward.level1', '10%'),
  level2: get('profile.referrals.reward.level2', '5%'),
  level3: get('profile.referrals.reward.level3', '3%'),
  ttl: get('profile.referrals.ttl_days', t('affiliate.defaults.ttl')),
  
  registerLabel: get('profile.auth.cta.register', t('affiliate.cta.register_prompt')),
  registerLink: get('profile.auth.links.register', '/auth/register'),
  accountLabel: get('profile.account.label', t('affiliate.account.label')),
  accountLink: get('profile.account.link', '/account'),

  referralCodePlaceholder: get('profile.referrals.code.placeholder', t('affiliate.form.code_placeholder')),
  withdrawalRulesLabel: get('profile.points.withdrawal.rules_title', t('affiliate.withdrawal.rules_label')),
  withdrawalRulesLink: get('profile.points.withdrawal.rules_link', '/vivapoints'),
  referralProgramLink: get('profile.referrals.rules.link', '/account/network')
}))

const replacements = computed(() => ({
  level1: settingsValues.value.level1,
  level2: settingsValues.value.level2,
  level3: settingsValues.value.level3,
  ttl: settingsValues.value.ttl,
  register: settingsValues.value.registerLabel,
  account: settingsValues.value.accountLabel,
  code: settingsValues.value.referralCodePlaceholder,
  withdraw: settingsValues.value.withdrawalRulesLabel
}))

const formatText = (text?: string) => {
  if (!text) return ''
  return Object.entries(replacements.value).reduce((acc, [key, val]) => {
    return acc.replaceAll(`{${key}}`, String(val))
  }, text)
}

const heroStats = computed(() => {
  if (!pageData?.hero?.stats) return []
  return pageData.hero.stats.map((stat: any) => ({
    ...stat,
    label: formatText(stat.label),
    value: formatText(stat.value)
  }))
})

const heroHighlights = computed(() => pageData?.hero?.highlights || [])

const levelCards = computed(() => {
  if (!pageData?.levels?.cards) return []
  return pageData.levels.cards.map((card: any) => ({
    ...card,
    percent: formatText(card.percent),
    description: formatText(card.description)
  }))
})

const algoCards = computed(() => {
  if (!pageData?.algo?.cards) return []
  return pageData.algo.cards.map((card: any) => ({
    ...card,
    title: formatText(card.title),
    description: formatText(card.description),
    bullets: card.bullets?.map((item: string) => formatText(item)) || []
  }))
})

const linkSteps = computed(() => pageData?.link?.steps?.map((step: string) => formatText(step)) || [])

const referralLinkSample = computed(() => formatText(pageData?.link?.example?.referral || ''))

const ttlBullets = computed(() => pageData?.ttl?.bullets?.map((item: string) => formatText(item)) || [])

const controlCards = computed(() => pageData?.control?.cards?.map((card: any) => ({
  ...card,
  title: formatText(card.title),
  text: formatText(card.text)
})) || [])

const payoutOptions = computed(() => pageData?.payout?.options?.map((option: any) => ({
  ...option,
  title: formatText(option.title),
  text: formatText(option.text)
})) || [])

const ctaBlock = computed(() => {
  if (!pageData?.cta) return null
  return {
    title: formatText(pageData.cta.title),
    text: formatText(pageData.cta.text),
    button: {
      label: formatText(pageData.cta.button?.label)
    }
  }
})

const copyReferralLink = () => {
  if (!process.client) return
  if (!referralLinkSample.value) return
  navigator.clipboard?.writeText(referralLinkSample.value)
}

const handleRegisterClick = () => {
  if (isAuthenticated.value && user.value) {
    navigateTo($regionPath('/account/network/common'))
    return
  }
  const component = defineAsyncComponent(() => import('~/components/Modal/Auth/Social/Social.vue'))
  useModal().open(component, null, null)
}

useSeo().setPageSeo(t('title.affiliate_system'))
</script>

<style src='./affiliate.scss' scoped lang='scss'></style>

<template>
  <div class="affiliate-page">
    <section class="affiliate-hero">
      <div class="container">
        <the-breadcrumbs :crumbs="breadcrumbs" class="affiliate-hero__breadcrumbs" />
        <div class="affiliate-hero__inner">
          <div class="affiliate-hero__content">
            <p class="affiliate-hero__eyebrow">{{ pageData?.hero?.eyebrow }}</p>
            <h1 class="affiliate-hero__title">
              {{ pageData?.hero?.title || t('title.affiliate_system') }}
            </h1>
            <p class="affiliate-hero__description">
              {{ pageData?.hero?.description }}
            </p>
            <div v-if="heroStats.length" class="affiliate-hero__stats">
              <div v-for="stat in heroStats" :key="stat.label" class="affiliate-hero__stat">
                <div class="affiliate-hero__stat-value">{{ stat.value }}</div>
                <div class="affiliate-hero__stat-label">{{ stat.label }}</div>
              </div>
            </div>
            <div v-if="heroHighlights.length" class="affiliate-hero__highlights">
              <div v-for="highlight in heroHighlights" :key="highlight.label" class="affiliate-hero__highlight">
                <IconCSS :name="highlight.icon" class="affiliate-hero__highlight-icon" />
                <span>{{ highlight.label }}</span>
              </div>
            </div>
            <div class="affiliate-hero__actions">
              <NuxtLink :to="settingsValues.referralProgramLink" class="affiliate-hero__btn affiliate-hero__btn--primary">
                <span>{{ pageData?.hero?.cta?.primary?.label || ctaBlock?.button?.label }}</span>
                <IconCSS name="iconoir:arrow-tr" />
              </NuxtLink>
              <NuxtLink :to="settingsValues.withdrawalRulesLink" class="affiliate-hero__btn affiliate-hero__btn--ghost">
                {{ pageData?.hero?.cta?.secondary?.label }}
              </NuxtLink>
            </div>
          </div>
          <div class="affiliate-hero__media">
            <nuxt-img
              v-if="pageData?.hero?.image"
              :src="pageData.hero.image"
              width="640"
              height="929"
              sizes = "mobile:100vw tablet:500px desktop:600px"
              format = "avif"
              quality = "60"
              loading = "lazy"
              fit="outside"
              class="affiliate-hero__media-image"
            ></nuxt-img>
          </div>
        </div>
      </div>
    </section>

    <section v-if="pageData?.levels" class="affiliate-section">
      <div class="container">
        <div class="affiliate-section__head">
          <p class="affiliate-section__eyebrow">{{ pageData.levels.title }}</p>
          <h2 class="affiliate-section__title">{{ pageData.levels.subtitle }}</h2>
        </div>
        <div class="affiliate-levels">
          <article v-for="card in levelCards" :key="card.label" class="affiliate-level">
            <div class="affiliate-level__icon">
              <IconCSS :name="card.icon" />
            </div>
            <div class="affiliate-level__meta">
              <p class="affiliate-level__label">{{ card.label }}</p>
              <p class="affiliate-level__accent">{{ card.accent }}</p>
            </div>
            <div class="affiliate-level__percent">{{ card.percent }}</div>
            <p class="affiliate-level__description">{{ card.description }}</p>
          </article>
        </div>
      </div>
    </section>

    <section v-if="pageData?.algo" class="affiliate-section affiliate-section--muted">
      <div class="container">
        <div class="affiliate-section__head">
          <p class="affiliate-section__eyebrow">{{ pageData.algo.title }}</p>
          <h2 class="affiliate-section__title">{{ pageData.algo.intro }}</h2>
        </div>
        <div class="affiliate-grid">
          <article v-for="card in algoCards" :key="card.title" class="affiliate-card">
            <div class="affiliate-card__icon">
              <span class="affiliate-level__icon">
                <IconCSS :name="card.icon" />
              </span>
            </div>
            <h3 class="affiliate-card__title">{{ card.title }}</h3>
            <p class="affiliate-card__text">{{ card.description }}</p>
            <ul v-if="card.bullets.length" class="affiliate-list">
              <li v-for="bullet in card.bullets" :key="bullet">
                <IconCSS name="iconoir:check-circle" class="affiliate-list__icon" />
                <span>{{ bullet }}</span>
              </li>
            </ul>
          </article>
        </div>
        <blockquote v-if="pageData.algo.quote" class="affiliate-quote">
          <div class="affiliate-quote__icon">
            <IconCSS name="solar:verified-check-linear" />
          </div>
          <div>
            <p class="affiliate-quote__title">{{ pageData.algo.quote.title }}</p>
            <p class="affiliate-quote__text">{{ formatText(pageData.algo.quote.text) }}</p>
          </div>
        </blockquote>
      </div>
    </section>

    <section v-if="pageData?.link" class="affiliate-section affiliate-link">
      <div class="container">
        <div class="affiliate-link__inner">
          <div class="affiliate-link__content">
            <p class="affiliate-section__eyebrow">{{ pageData.link.title }}</p>
            <h2 class="affiliate-section__title">{{ pageData.link.subtitle }}</h2>
            <ol class="affiliate-steps">
              <li v-for="(step, index) in linkSteps" :key="index">{{ step }}</li>
            </ol>
            <div class="affiliate-sample">
              <p class="affiliate-sample__label">{{ t('affiliate.link.regular_label') }}:</p>
              <div class="affiliate-sample__code">
                <code>{{ pageData.link.example?.base }}</code>
              </div>
              <p class="affiliate-sample__label">{{ t('affiliate.link.referral_label') }}:</p>
              <div class="affiliate-sample__code affiliate-sample__code--accent">
                <code>{{ referralLinkSample }}</code>
                <button
                  type="button"
                  class="affiliate-sample__copy"
                  @click="copyReferralLink"
                >
                  <IconCSS name="mynaui:copy" />
                </button>
              </div>
              <p class="affiliate-sample__hint">{{ formatText(pageData.link.example?.hint) }}</p>
            </div>
            <p class="affiliate-link__note">{{ formatText(pageData.link.note) }}</p>
            <div class="affiliate-link__shortcuts">
              <button
                type="button"
                class="affiliate-link__shortcut affiliate-link__shortcut--primary"
                @click="handleRegisterClick"
              >
                <IconCSS name="mynaui:user" />
                <span>{{ t('affiliate.cta.register_button') }}</span>
              </button>
            </div>
          </div>
          <div class="affiliate-link__media">
            <img
              v-if="pageData.link.image"
              :src="pageData.link.image"
              :alt="t('affiliate.media.link_preview_alt')"
              loading="lazy"
            >
          </div>
        </div>
      </div>
    </section>

    <section v-if="pageData?.ttl" class="affiliate-section affiliate-section--muted">
      <div class="container">
        <div class="affiliate-ttl">
          <div class="affiliate-ttl__media">
            <img
              v-if="pageData.ttl.image"
              :src="pageData.ttl.image"
              :alt="t('affiliate.media.ttl_image_alt')"
              loading="lazy"
            >
          </div>
          <div class="affiliate-ttl__content">
            <div class="affiliate-control">
              <p class="affiliate-section__eyebrow">{{ pageData.ttl.title }}</p>
              <h2 class="affiliate-section__title">{{ formatText(pageData.ttl.description) }}</h2>
              <ul class="affiliate-list affiliate-list--column">
                <li v-for="bullet in ttlBullets" :key="bullet">
                  <IconCSS name="iconoir:shield-check" class="affiliate-list__icon" />
                  <span>{{ bullet }}</span>
                </li>
              </ul>
            </div>

            <div v-if="pageData?.control && controlCards.length" class="affiliate-control">
              <p class="affiliate-section__eyebrow">{{ pageData.control.title }}</p>
              <h3 class="affiliate-section__title affiliate-control__title">{{ pageData.control.intro }}</h3>
              <div class="affiliate-control__grid affiliate-grid affiliate-grid--wide">
                <article v-for="card in controlCards" :key="card.title" class="affiliate-card affiliate-card--lined">
                  <div class="affiliate-card__icon">
                    <span class="affiliate-level__icon">
                      <IconCSS :name="card.icon" />
                    </span>
                  </div>
                  <h3 class="affiliate-card__title">{{ card.title }}</h3>
                  <p class="affiliate-card__text">{{ card.text }}</p>
                </article>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section v-if="pageData?.payout" class="affiliate-section affiliate-section--accent">
      <div class="container">
        <div class="affiliate-section__head">
          <p class="affiliate-section__eyebrow">{{ pageData.payout.title }}</p>
          <h2 class="affiliate-section__title">{{ pageData.payout.intro }}</h2>
        </div>
        <div class="affiliate-options">
          <article v-for="option in payoutOptions" :key="option.title" class="affiliate-option">
            <div class="affiliate-option__icon">
              <span class="affiliate-level__icon">
                <IconCSS :name="option.icon" />
              </span>
            </div>
            <div>
              <h3 class="affiliate-option__title">{{ option.title }}</h3>
              <p class="affiliate-option__text">{{ option.text }}</p>
            </div>
          </article>
        </div>
      </div>
    </section>

    <section v-if="ctaBlock" class="affiliate-cta">
      <div class="container">
        <div class="affiliate-cta__card">
          <div>
            <h2 class="affiliate-cta__title">{{ ctaBlock.title }}</h2>
            <p class="affiliate-cta__text">{{ ctaBlock.text }}</p>
          </div>
          <NuxtLink :to="settingsValues.referralProgramLink" class="affiliate-cta__btn">
            {{ ctaBlock.button.label || settingsValues.accountLabel }}
            <IconCSS name="iconoir:arrow-tr" />
          </NuxtLink>
        </div>
      </div>
    </section>
  </div>
</template>
