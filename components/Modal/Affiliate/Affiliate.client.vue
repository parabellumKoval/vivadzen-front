<script setup>
const { t } = useI18n()
const { user } = useAuth()
const noty = useNoty()

// COMPUTEDS
const affiliateLevels = computed(() => {
  return [
    '🥇' + ' ' + t('level1', {percent: '10'}),
    '🥈' + ' ' + t('level2', {percent: '5'}),
    '🥉' + ' ' + t('level3', {percent: '3'}),
  ]
})

const link = computed(() => {
  // Используем Nuxt composables для получения URL
  const route = useRoute()
  
  // Получаем базовый URL
  let baseUrl = ''
  if (process.client) {
    baseUrl = window.location.origin
  } else {
    // Для SSR используем headers или конфигурацию
    const config = useRuntimeConfig()
    baseUrl = config.public.baseURL || 'https://your-domain.com'
  }
  
  return `${baseUrl}${route.fullPath}?ref=${user.value?.referral_code || 'your_code'}`
})

// METHODS
const copyAffiliateLink = async () => {
  const linkValue = link.value
  if (!linkValue) {
    return
  }

  const writeToClipboard = async () => {
    if (navigator?.clipboard?.writeText) {
      await navigator.clipboard.writeText(linkValue)
      return
    }

    const textarea = document.createElement('textarea')
    textarea.value = linkValue
    textarea.setAttribute('readonly', '')
    textarea.style.position = 'fixed'
    textarea.style.opacity = '0'
    document.body.appendChild(textarea)
    textarea.focus()
    textarea.select()
    document.execCommand('copy')
    document.body.removeChild(textarea)
  }

  try {
    await writeToClipboard()
    noty.setNoty({content: t('copy_noty')})
    useModal().close()
  } catch (error) {
    console.error('Failed to copy affiliate link', error)
  }
}

// WATCHERS
</script>

<style src='./affiliate.scss' lang='scss' scoped></style>
<i18n src='./lang.yaml' lang='yaml'></i18n>

<template>
  <modal-wrapper class="modal-affiliate">
    <div class="modal-header">
      <div class="modal-header-title">{{ t('share_title') }}</div>
      <div class="modal-header-desc">{{ t('share_desc') }}</div>
    </div>
    <div class="modal-content">
      <div class="modal-subtitle">{{ t('earn_subtitle') }}</div>
      <ul class="modal-content-ul">
        <li>{{ t('benefit_1') }}</li>
        <li>{{ t('benefit_2') }}</li>
        <li>{{ t('benefit_3') }}</li>
      </ul>
      <div class="modal-subtitle">{{ t('tier_system_subtitle') }}</div>
      <ul class="modal-content-levels">
        <li v-for="(level, index) in affiliateLevels" :key="index" class="modal-content-levels-li">
          <wrapper-html :string="level" :wrappers="['<b>', '<b class=\'orange\'>']" />
        </li>
      </ul>
    </div>
    <div class="modal-form">
      <div class="modal-subtitle">{{ t('affiliate_link_subtitle') }}</div>
      <form-link
        :model-value="link"
        readonly
      />

      <button
        type="button"
        class="button orange modal-button full"
        @click="copyAffiliateLink"
      >
        {{ t('copy_button') }}
      </button>
    </div>
  </modal-wrapper>
</template>
