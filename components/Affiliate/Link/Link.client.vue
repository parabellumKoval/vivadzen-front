<script setup>
const {t} = useI18n()
const {user} = useAuth()
const isModalActive = ref(false)
// COMPUTEDS
const affiliateLevels = computed(() => {
  return [
    '🥇' + ' ' + t('level1', {percent: '10'}),
    '🥈' + ' ' + t('level2', {percent: '5'}),
    '🥉' + ' ' + t('level3', {percent: '3'}),
  ]
})
// METHODS
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
const toggleModal = () => {
  isModalActive.value = !isModalActive.value
}
// HANDLERS
// WATCHERS
</script>

<style src='./link.scss' lang='scss' scoped></style>
<i18n src='./lang.yaml' lang='yaml'></i18n>

<template>
  <div>
    <Transition name="move-y">
      <div v-if="isModalActive" class="modal-backdrop" @click.self="toggleModal">
        <div class="modal">
          <div class="modal-header">
            <div class="modal-header-title">Share a link to this page</div>
            <div class="modal-header-desc">to receive awards</div>
          </div>
          <div class="modal-content">
            <div class="modal-subtitle">Earn money from every purchase in your affiliate network forever</div>
            <ul class="modal-content-ul">
              <li>💰 Get paid for every sale made through your link</li>
              <li>📈 Track your earnings in real-time</li>
              <li>💳 Receive monthly payouts directly to your account</li>
            </ul>
            <div class="modal-subtitle">Create a three-tier system</div>
            <ul class="modal-content-levels">
              <li v-for="(level, index) in affiliateLevels" :key="index" class="modal-content-levels-li">
                <wrapper-html :string="level" :wrappers="['<b>', '<b class=\'orange\'>']" />
              </li>
            </ul>
          </div>
          <div class="modal-form">
            
            <div class="modal-subtitle">Affiliate link to this page</div>
            <form-link
              :model-value="link"
              readonly
            />

            <button class="button orange modal-button full">Copy your referral link</button>
          </div>
        </div>
      </div>
      <div v-else  class="affiliate">

      <button  @click="toggleModal" class="affiliate-button">
          <!-- <nuxt-img
            src="/images/ref/viva-coin.png"
            width="60"
            height="60"
            sizes="mobile:70px"
            format="avif"
            quality="80"
            loading="lazy"
            fit="outside"
            class="affiliate-img"
          /> -->
          <nuxt-img
            src="/images/ref/img-3.png"
            width="120"
            height="120"
            sizes="mobile:140px"
            format="avif"
            quality="80"
            loading="lazy"
            fit="outside"
            class="affiliate-img"
          />
          <!-- <div class="affiliate-icon">
            <IconCSS name="mynaui:link-solid"></IconCSS>
          </div> -->
          <div class="affiliate-text">
            <div class="affiliate-title"><wrapper-html :string="t('title')" :wrappers="['<span class=\'orange bold\'>']" /></div>
            <div class="affiliate-desc">{{ t('desc') }}</div>
          </div>
      </button>
      </div>
    </Transition>
  </div>
</template>