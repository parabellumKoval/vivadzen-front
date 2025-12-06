<script setup lang="ts">
const { t, locale } = useI18n()
const { get } = useSettings()
const { name: pointsName, resolve: resolvePointLabel } = usePoints()

const pageData = await queryContent('vivapoints').locale(locale.value).findOne()

const breadcrumbs = [
  {
    name: t('title.home'),
    item: '/'
  },
  {
    name: t('title.vivapoints'),
    item: '/vivapoints'
  }
]

const formatNumber = (value: number | string) => {
  const num = Number(value)
  if (Number.isFinite(num)) {
    return new Intl.NumberFormat('ru-RU').format(num)
  }
  return value
}

const settingsValues = computed(() => ({
  registerLabel: get('profile.auth.cta.register', 'зарегистрируйтесь'),
  registerLink: get('profile.auth.links.register', '/auth/register'),
  accountLabel: get('profile.account.label', 'Личный Кабинет'),
  accountLink: get('profile.account.link', '/account'),
  videoReward: Number(get('profile.reviews.reward.video.points', 500)),
  textReward: Number(get('profile.reviews.reward.text.points', 200)),
  referralMaxPercent: get('profile.referrals.reward.max_percent', '10%'),
  referralLevel1: get('profile.referrals.reward.level1', '10%'),
  referralLevel2: get('profile.referrals.reward.level2', '5%'),
  referralLevel3: get('profile.referrals.reward.level3', '3%'),
  referralRulesLink: get('profile.referrals.rules.link', '/account/network'),
  referralRulesLabel: get('profile.referrals.rules.label', pageData?.earn?.methods?.find((m: any) => m.key === 'referral')?.link_label || 'Подробнее о правилах Реферальной программы'),
  moderationHours: get('profile.reviews.moderation.hours', 24),
  conversionRateLabel: get('profile.points.rate.cz_label', '1 CZK (Чешская крона)'),
  maxPaymentPercent: get('profile.points.checkout.max_percent', '100%'),
  minWithdraw: Number(get('profile.points.withdrawal.min', 500)),
  processingDays: get('profile.points.withdrawal.processing_days', 7),
  expirationDays: get('profile.points.expiration_days', 365),
  socialNetworks: [
    get('profile.reviews.socials.instagram', 'Instagram'),
    get('profile.reviews.socials.facebook', 'Facebook'),
    get('profile.reviews.socials.tiktok', 'TikTok'),
    get('profile.reviews.socials.twitter', 'Twitter (X)'),
    get('profile.reviews.socials.telegram', 'Telegram')
  ].filter(Boolean)
}))

const genericReplacements = computed(() => ({
  register: settingsValues.value.registerLabel,
  account: settingsValues.value.accountLabel,
  hours: settingsValues.value.moderationHours,
  rate: settingsValues.value.conversionRateLabel,
  minWithdraw: formatNumber(settingsValues.value.minWithdraw),
  processingDays: settingsValues.value.processingDays,
  expirationDays: settingsValues.value.expirationDays,
  maxPercent: settingsValues.value.maxPaymentPercent,
  level1: settingsValues.value.referralLevel1,
  level2: settingsValues.value.referralLevel2,
  level3: settingsValues.value.referralLevel3
}))

const replaceTokens = (text?: string, extra: Record<string, string | number> = {}) => {
  if (!text) return ''
  return Object.entries({ ...genericReplacements.value, ...extra }).reduce((acc, [key, value]) => {
    return acc.replaceAll(`{${key}}`, String(value))
  }, text)
}

const heroNoteSegments = computed(() => {
  const note = pageData?.hero?.note || ''
  const [beforeRegister, afterRegister = ''] = note.split('{register}')
  const [between, afterAccount = ''] = afterRegister.split('{account}')
  return {
    beforeRegister,
    between,
    afterAccount
  }
})

const heroHighlights = computed(() => pageData?.hero?.highlights || [])

const heroMetrics = computed(() => {
  const pointsLabel = resolvePointLabel('points') || pointsName.value || 'VivaPoints'
  return [
    {
      icon: 'hugeicons:play-circle-02',
      label: 'Видеоотзыв',
      value: `+${formatNumber(settingsValues.value.videoReward)} ${pointsLabel}`
    },
    {
      icon: 'hugeicons:edit-02',
      label: 'Текстовый отзыв',
      value: `+${formatNumber(settingsValues.value.textReward)} ${pointsLabel}`
    },
    {
      icon: 'solar:users-group-two-rounded-linear',
      label: 'Реферальная сеть',
      value: `до ${settingsValues.value.referralMaxPercent}`
    }
  ]
})

const earnMethods = computed(() => {
  if (!pageData?.earn?.methods?.length) return []
  return pageData.earn.methods.map((method: any) => {
    const extra: Record<string, string> = {}
    if (method.key === 'video') {
      extra.amount = formatNumber(settingsValues.value.videoReward)
    }
    if (method.key === 'text') {
      extra.amount = formatNumber(settingsValues.value.textReward)
    }
    if (method.key === 'referral') {
      extra.maxPercent = settingsValues.value.referralMaxPercent
    }
    return {
      ...method,
      title: replaceTokens(method.title, extra),
      description: replaceTokens(method.description, extra),
      steps: method.steps?.map((step: string) => replaceTokens(step, extra)) || [],
      socialsLabel: method.socials_label,
      socials: method.key === 'text' ? method.socials: [],
      levels: method.levels?.map((level: any) => ({
        ...level,
        amount: replaceTokens(level.amount, extra)
      })) || [],
      linkLabel: method.key === 'referral' ? settingsValues.value.referralRulesLabel : method.link_label
    }
  })
})

const moderationItems = computed(() => {
  if (!pageData?.moderation?.items?.length) return []
  return pageData.moderation.items.map((item: any) => ({
    ...item,
    text: replaceTokens(item.text)
  }))
})

const withdrawalOption = computed(() => {
  const option = pageData?.usage?.options?.find((opt: any) => opt.key === 'withdraw')
  if (!option) return null
  return {
    ...option,
    description: replaceTokens(option.description),
    conditions: option.conditions?.map((cond: any) => ({
      ...cond,
      value: replaceTokens(cond.value)
    })) || [],
    process: option.process?.map((step: string) => replaceTokens(step)) || []
  }
})

const payOption = computed(() => {
  const option = pageData?.usage?.options?.find((opt: any) => opt.key === 'pay')
  if (!option) return null
  return {
    ...option,
    description: replaceTokens(option.description),
    note: replaceTokens(option.note)
  }
})

const exchangeBlock = computed(() => ({
  title: pageData?.exchange?.title,
  intro: pageData?.exchange?.intro,
  rateLabel: pageData?.exchange?.rate_label,
  rate: replaceTokens(pageData?.exchange?.rate),
  currenciesLabel: pageData?.exchange?.currencies_label,
  currencies: pageData?.exchange?.currencies || []
}))

const faqItems = computed(() => {
  if (!pageData?.faq?.list?.length) return []
  return pageData.faq.list.map((item: any) => ({
    ...item,
    answer: replaceTokens(item.answer)
  }))
})

const ctaBlock = computed(() => pageData?.cta || pageData?.hero?.cta)

useSeo().setPageSeo(t('title.vivapoints'))
</script>

<style src='./vivapoints.scss' lang='scss' scoped></style>

<template>
  <div class="vivapoints-page">
    <section class="vivapoints-hero">
      <div class="container">
        <!-- <the-breadcrumbs :crumbs="breadcrumbs" class="vivapoints-hero__breadcrumbs" /> -->
        <div class="vivapoints-hero__content">
          <div class="vivapoints-hero__text">
            <p class="vivapoints-hero__eyebrow">{{ pointsName }}</p>
            <h1 class="vivapoints-hero__title">
              <span v-html="pageData?.hero?.title"></span>
              <span v-html="pageData?.hero?.subtitle" class="sub"></span>
            </h1>
            <p class="vivapoints-hero__lead">
              {{ pageData?.hero?.lead }}
            </p>

          
            <div class="vivapoints-hero__panel">
              <div class="vivapoints-hero__metric-wrapper">
                <div v-for="metric in heroMetrics" :key="metric.label" class="vivapoints-hero__metric">
                  <IconCSS :name="metric.icon" class="vivapoints-hero__metric-icon" />
                  <div>
                    <div class="vivapoints-hero__metric-label">{{ metric.label }}</div>
                    <div class="vivapoints-hero__metric-value">{{ metric.value }}</div>
                  </div>
                </div>
              </div>
              <div class="vivapoints-hero__panel-card">
                <div class="vivapoints-hero__panel-title">{{ exchangeBlock.rateLabel }}</div>
                <div class="vivapoints-hero__panel-value">{{ exchangeBlock.rate }}</div>
                <p class="vivapoints-hero__panel-note">{{ pageData?.exchange?.intro }}</p>
              </div>
            </div>

            <NuxtLink :to="pageData?.hero?.cta?.to || settingsValues.accountLink" class="button primary">
              <span>{{ pageData?.hero?.cta?.label || settingsValues.accountLabel }}</span>
              <IconCSS name="iconoir:arrow-tr" class="vivapoints-hero__cta-icon" />
            </NuxtLink>
          </div>

          <div class="hero-image-wrapper">
            <nuxt-img
              src="/images/vivacoin-1.png"
              width="640"
              height="929"
              sizes = "mobile:100vw tablet:500px desktop:600px"
              format = "avif"
              quality = "60"
              loading = "lazy"
              fit="outside"
              class="hero-image"
            ></nuxt-img>
          </div>
        </div>
      </div>
    </section>

    <section>
      <div class="container">
      </div>
    </section>

    <section class="vivapoints-section">
      <div class="container">
        <div class="vivapoints-grid">

          <article class="vivapoints-begin">

            <div class="vivapoints-begin__header">
              <p class="vivapoints-begin__eyebrow">{{ resolvePointLabel('points') }}</p>
              <h2>{{ pageData?.earn?.title }}</h2>
              <p>{{ pageData?.earn?.subtitle }}</p>
            </div>

            <p class="vivapoints-begin__description">
              {{ pageData?.hero?.description }}
            </p>
            <p class="vivapoints-begin__note">
              <span>{{ heroNoteSegments.beforeRegister }}</span>
              <NuxtLink :to="settingsValues.registerLink" class="vivapoints-link">
                {{ settingsValues.registerLabel }}
              </NuxtLink>
              <span>{{ heroNoteSegments.between }}</span>
              <NuxtLink :to="settingsValues.accountLink" class="vivapoints-link">
                {{ settingsValues.accountLabel }}
              </NuxtLink>
              <span>{{ heroNoteSegments.afterAccount }}</span>
            </p>
            <ul class="vivapoints-begin__highlights">
              <li v-for="item in heroHighlights" :key="item" class="vivapoints-begin__highlight">
                <IconCSS :name="item.icon" class="vivapoints-begin__highlight-icon" />
                <span>{{ item.label }}</span>
              </li>
            </ul>
          </article>

          <article
            v-for="method in earnMethods"
            :key="method.key"
            class="vivapoints-card"
          >
          
            <nuxt-img
              :src="method.image"
              width="640"
              height="929"
              sizes = "mobile:100vw tablet:500px desktop:600px"
              format = "avif"
              quality = "60"
              loading = "lazy"
              fit="outside"
              class="vivapoints-card__image"
            ></nuxt-img>

            <div class="vivapoints-card__icon">
              <IconCSS :name="method.icon" />
            </div>
            <div class="vivapoints-card__body">
              <h3 class="vivapoints-card__title" v-html="method.title"></h3>
              <p class="vivapoints-card__description">{{ method.description }}</p>
              <ol class="vivapoints-card__steps">
                <li v-for="(step, index) in method.steps" :key="index">
                  <IconCSS name="iconoir:check-circle" class="vivapoints-list__icon" />
                  <span v-html="step"></span>
                </li>
              </ol>
              <template v-if="method.socials?.length">
                <div class="vivapoints-card__label">{{ method.socialsLabel }}</div>
                <div class="vivapoints-chip-list">
                  <span
                    v-for="social in method.socials"
                    :key="social"
                    class="vivapoints-chip"
                  >
                    <IconCSS :name="social.icon" class="vivapoints-chip__icon" />
                    {{ social.label }}
                  </span>
                </div>
              </template>
              <template v-if="method.levels?.length">
                <div class="vivapoints-card__levels">
                  <div
                    v-for="level in method.levels"
                    :key="level.label"
                    class="vivapoints-card__level"
                  >
                    <span class="vivapoints-card__level-label">{{ level.label }}</span>
                    <span class="vivapoints-card__level-value">{{ level.amount }}</span>
                  </div>
                </div>
                <NuxtLink
                  :to="settingsValues.referralRulesLink"
                  class="vivapoints-link vivapoints-card__link"
                >
                  {{ method.linkLabel }}
                  <IconCSS name="iconoir:arrow-tr" />
                </NuxtLink>
              </template>
            </div>
          </article>
        </div>
      </div>
    </section>

    <section class="vivapoints-section vivapoints-section--split">
      <div class="container">
        <div class="vivapoints-columns">
          <div class="vivapoints-column">
            <h2>{{ pageData?.moderation?.title }}</h2>
            <p>{{ pageData?.moderation?.intro }}</p>
            <div class="vivapoints-timeline">
              <div
                v-for="item in moderationItems"
                :key="item.title"
                class="vivapoints-timeline__item"
              >
                <div class="vivapoints-timeline__dot"></div>
                <div>
                  <div class="vivapoints-timeline__title">{{ item.title }}</div>
                  <p class="vivapoints-timeline__text">{{ item.text }}</p>
                </div>
              </div>
            </div>
          </div>
          <div class="vivapoints-column vivapoints-column--accent">
            <h2>{{ exchangeBlock.title }}</h2>
            <p>{{ exchangeBlock.intro }}</p>
            <div class="vivapoints-rate">
              <div class="vivapoints-rate__label">{{ exchangeBlock.rateLabel }}</div>
              <div class="vivapoints-rate__value">{{ exchangeBlock.rate }}</div>
            </div>
            <p>{{ exchangeBlock.currenciesLabel }}</p>
            <ul class="vivapoints-list">
              <li v-for="currency in exchangeBlock.currencies" :key="currency">
                <Icon :name="currency.icon" class="vivapoints-list__icon-currency" />
                {{ currency.label }}
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>

    <section class="vivapoints-section">
      <div class="container">
        <div class="vivapoints-grid vivapoints-grid--two">
          <article>
            <div  class="vivapoints-begin__header">
              <h2>{{ pageData?.usage?.title }}</h2>
              <p>{{ pageData?.usage?.intro }}</p>
            </div>
          </article>
          <article v-if="payOption" class="vivapoints-card vivapoints-card--outline">
            <div class="vivapoints-card__icon">
              <IconCSS :name="payOption.icon" />
            </div>
            <div class="vivapoints-card__body">
              <h3 class="vivapoints-card__title">{{ payOption.title }}</h3>
              <p>{{ payOption.description }}</p>
              <p class="vivapoints-card__note">{{ payOption.note }}</p>
            </div>
          </article>
          <article v-if="withdrawalOption" class="vivapoints-card vivapoints-card--outline">
            <div class="vivapoints-card__icon">
              <IconCSS :name="withdrawalOption.icon" />
            </div>
            <div class="vivapoints-card__body">
              <h3 class="vivapoints-card__title">{{ withdrawalOption.title }}</h3>
              <p>{{ withdrawalOption.description }}</p>
              <ul class="vivapoints-specs">
                <li v-for="condition in withdrawalOption.conditions" :key="condition.label">
                  <span>{{ condition.label }}</span>
                  <strong>{{ condition.value }}</strong>
                </li>
              </ul>
              <ol class="vivapoints-card__steps">
                <li v-for="(step, index) in withdrawalOption.process" :key="index">
                  <IconCSS name="iconoir:check-circle" class="vivapoints-list__icon" />
                  <span v-html="step"></span>
                </li>
              </ol>
              <p class="vivapoints-card__note">{{ replaceTokens(pageData?.usage?.disclaimer) }}</p>
            </div>
          </article>
        </div>
      </div>
    </section>

    <section class="vivapoints-section vivapoints-section--faq">
      <div class="container">
        <div class="vivapoints-section__header">
          <h2>{{ pageData?.faq?.title }}</h2>
        </div>
        <div class="vivapoints-faq">
          <div v-for="item in faqItems" :key="item.question" class="vivapoints-faq__item">
            <div class="vivapoints-faq__question">
              <IconCSS name="iconoir:info-circle" class="vivapoints-faq__icon" />
              <span>{{ item.question }}</span>
            </div>
            <p class="vivapoints-faq__answer">{{ item.answer }}</p>
          </div>
        </div>
      </div>
    </section>

    <section class="vivapoints-cta">
      <div class="container">
        <div class="vivapoints-cta__content">
          <h2>{{ ctaBlock?.title }}</h2>
          <p>{{ ctaBlock?.text }}</p>
        </div>
        <NuxtLink :to="ctaBlock?.button?.to || settingsValues.accountLink" class="button primary">
          {{ ctaBlock?.button?.label || settingsValues.accountLabel }}
          <IconCSS name="iconoir:arrow-tr" />
        </NuxtLink>
      </div>
    </section>
  </div>
</template>
