<script setup>
const { t } = useI18n()

const documentsModal = defineAsyncComponent(() =>
  import('~/components/Section/Landing/DocumentsModal/DocumentsModal.client.vue')
)

const certificateDocuments = computed(() => [
  { title: `${t('steps.safety.button')} 1`, src: '/pdf/file1.pdf' },
  { title: `${t('steps.safety.button')} 2`, src: '/pdf/file2.pdf' },
  { title: `${t('steps.safety.button')} 3`, src: '/pdf/file3.pdf' }
])

const openCertificatesModal = () => {
  useModal().open(
    documentsModal,
    {
      title: t('steps.safety.button'),
      documents: certificateDocuments.value
    },
    null,
    {
      width: { min: 320, max: 1100 },
      height: { min: 520, max: 900 }
    }
  )
}
</script>

<style src="./timeline-section.scss" lang="scss" scoped></style>
<i18n src="./lang.yaml" lang="yaml"></i18n>

<template>
  <section class="timeline-section">
    <div class="container">
      <div class="header__container">
        <div class="header">
          <h2 class="header__title">
            <span class="orange">{{ t('header.title_brand') }}</span> — {{ t('header.title_text') }}
          </h2>
          <p class="header__description">
            {{ t('header.description') }}
          </p>
        </div>
      </div>

      <div class="timeline-container">
        <div class="line-segment segment-top">
          <div class="step step-1">
            <span class="step-badge">1</span>
            <div class="circle">
              <nuxt-img
                src="/images/landing/progress/thing-1.png"
                sizes="desktop: 600px"
                class="four-body__img"
                alt=""
              />
            </div>
            <div class="text">
              <h4>{{ t('steps.origin.title') }}</h4>
              <p>{{ t('steps.origin.description') }}</p>
              <div class="props__list">
                <div class="props__item">
                  <img src="./mit-2.svg" class="props__svg-icon" alt="" />
                  <div class="props__title">{{ t('steps.origin.props.mitragynine') }}</div>
                </div>
                <div class="props__item">
                  <img src="./fert.svg" class="props__svg-icon" alt="" />
                  <div class="props__title">{{ t('steps.origin.props.fertilizers') }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="line-segment segment-middle">
          <div class="step step-2">
            <span class="step-badge">2</span>
            <div class="circle">
              <nuxt-img
                src="/images/landing/progress/thing-2.png"
                sizes="desktop: 400px"
                class="four-body__img"
                alt=""
              />
            </div>
            <div class="text">
              <h4>{{ t('steps.safety.title') }}</h4>
              <p>
                {{ t('steps.safety.description_prefix') }}
                <span class="highlight">{{ t('steps.safety.description_highlight') }}</span>
                {{ t('steps.safety.description_suffix') }}
              </p>
              <button class="button props__button" type="button" @click="openCertificatesModal">
                {{ t('steps.safety.button') }}
              </button>
            </div>
          </div>
        </div>

        <div class="line-segment segment-middle-2">
          <div class="step step-3">
            <span class="step-badge">3</span>
            <div class="circle">
              <nuxt-img
                src="/images/landing/bonus/product.png"
                sizes="desktop: 400px"
                class="four-body__img"
                alt=""
              />
            </div>
            <div class="text">
              <h4>{{ t('steps.standards.title') }}</h4>
              <p>
                {{ t('steps.standards.description_prefix') }}
                <span class="highlight">{{ t('steps.standards.highlight_europe') }}</span>
                {{ t('steps.standards.description_middle') }}
                <span class="highlight">{{ t('steps.standards.highlight_packs') }}</span>
                {{ t('steps.standards.description_suffix') }}
              </p>
            </div>
          </div>
        </div>

        <div class="line-segment segment-bottom">
          <div class="step step-4">
            <span class="step-badge">4</span>
            <div class="circle">
              <nuxt-img
                src="/images/landing/progress/thing-4.png"
                sizes="desktop: 400px"
                class="four-body__img"
                alt=""
              />
            </div>
            <div class="text">
              <h4>{{ t('steps.ecosystem.title') }}</h4>
              <p>
                <span class="highlight">{{ t('steps.ecosystem.highlight_brand') }}</span>
                {{ t('steps.ecosystem.description_prefix') }}
                <span class="highlight">{{ t('steps.ecosystem.highlight_czech') }}</span>
                {{ t('steps.ecosystem.description_middle') }}
                <span class="highlight">{{ t('steps.ecosystem.highlight_eu') }}</span>
                {{ t('steps.ecosystem.description_suffix') }}
              </p>
              <div class="props__list">
                <div class="props__item">
                  <img src="./viva.svg" class="props__svg-icon" alt="" />
                  <div class="props__title">{{ t('steps.ecosystem.props.vivapoints') }}</div>
                </div>
                <div class="props__item">
                  <img src="./partner.svg" class="props__svg-icon" alt="" />
                  <div class="props__title">{{ t('steps.ecosystem.props.partner') }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="footer">
      <h3 class="footer__title">{{ t('footer.title') }}</h3>
      <div class="footer__desc">{{ t('footer.description') }}</div>
    </div>

    <div class="flare-base flare-top-left-wrapper">
      <div class="flare-top-left-core"></div>
    </div>

    <div class="flare-base flare-top-right-wrapper">
      <div class="flare-top-right-core"></div>
    </div>

    <div class="flare-base flare-bottom-right-wrapper">
      <div class="flare-bottom-right-core"></div>
    </div>

    <div class="decor__wrapper-1">
      <nuxt-img
        src="/images/landing/progress/lr1-t.png"
        sizes="desktop: 1000px"
        alt=""
        class="decor decor-3"
      />
      <nuxt-img
        src="/images/landing/progress/l2-b2.png"
        sizes="desktop: 1000px"
        alt=""
        class="decor decor-2"
      />
    </div>

    <div class="decor__wrapper-2">
      <nuxt-img
        src="/images/landing/progress/lr3-t.png"
        sizes="desktop: 1000px"
        alt=""
        class="decor decor-6"
      />

      <nuxt-img
        src="/images/landing/progress/lr3-t.png"
        sizes="desktop: 1000px"
        alt=""
        class="decor decor-7"
      />
    </div>


    <div class="decor__wrapper-3">
      <nuxt-img
        src="/images/landing/progress/lr2-t.png"
        sizes="desktop: 1000px"
        alt=""
        class="decor decor-4"
      />
      <nuxt-img
        src="/images/landing/progress/l3-b2.png"
        sizes="desktop: 1000px"
        alt=""
        class="decor decor-5"
      />
    </div>

    <div class="decor__wrapper-4">
      <nuxt-img
        src="/images/landing/progress/l1-b2.png"
        sizes="desktop: 1000px"
        alt=""
        class="decor decor-1"
      />
    </div>
  </section>
</template>
