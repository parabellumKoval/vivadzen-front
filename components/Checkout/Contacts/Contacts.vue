<script setup>
const {t} = useI18n()
const props = defineProps({})
const { region } = useRegion()
const { get } = useSettings()
// COMPUTEDS
const telegramLink = computed(() => {
  return String(get('site.contacts.social.telegram') || '').trim()
})

const showTelegramButton = computed(() => {
  return String(region.value || '').toLowerCase() === 'ua' && !!telegramLink.value
})
// METHODS
// HANDLERS
const contactsHandler = () => {
  useModal().open(resolveComponent('ModalContacts'), null)
}
// WATCHERS
</script>

<style src='./contacts.scss' lang='scss' scoped></style>
<i18n src='./lang.yaml' lang='yaml'></i18n>

<template>
  <div class="contacts-box">
    <div class="title-secondary">{{ t('have_q') }}</div>
    <div class="contacts-desc">{{ t('we_help') }} 👩‍💻</div>
    <div class="contacts">
      <a
        v-if="showTelegramButton"
        :href="telegramLink"
        class="button contacts-button"
        target="_blank"
        rel="noopener noreferrer"
      >
        <IconCSS name="ph:telegram-logo" class="inline-icon"></IconCSS>
        <span>Telegram</span>
      </a>
      <button v-else class="button contacts-button">
        <IconCSS name="iconoir:phone" class="inline-icon"></IconCSS>
        <span>{{ useContacts().phone }}</span>
      </button>
      <button @click="contactsHandler" class="button lowcase contacts-button-secondary">
        <span>{{ t('more') }}</span>
      </button>
    </div>
  </div>
</template>
