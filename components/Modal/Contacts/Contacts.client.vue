<script setup>
const {t} = useI18n()

const socials = computed(() => {
  return useSocial().all
})

</script>

<style src="./contacts.scss" lang="scss" scoped />
<!-- <i18n src="./lang.yaml" lang="yaml"></i18n> -->

<template>
  <modal-wrapper :title="t('title.contacts')">
    <div class="contacts">
      <div>
        <div class="phones">
          <a href="/" class="button color-dark contacts-btn">
            <IconCSS name="iconoir:phone" class="icon"></IconCSS>
            <span class="text">{{ useContacts().phone }}</span>
          </a>
          <a href="/" class="button color-dark contacts-btn email-btn">
            <IconCSS name="iconoir:mail-opened" class="icon"></IconCSS>
            <span class="text">{{ useContacts().email }}</span>
          </a>
        </div>
        <div class="social">
          <a v-for="social in socials" :key="social.id" :href="social.link" :class="social.key + '-bg'" class="button social-btn contacts-btn">
            <IconCSS :name="social.icon" class="icon"></IconCSS>
            <span class="text">{{ social.name }}</span>
          </a>
        </div>
      </div>
      <div class="divide"></div>
      <div class="map">
        <div class="map-title">{{ useContacts().address }}</div>
        <div v-html="useContacts().map.value"></div>
      </div>
    </div>
  </modal-wrapper>
</template>