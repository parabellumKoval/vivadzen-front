<script setup>
const {t} = useI18n()
const isShow = ref(true)

const {get} = useSettings()

const headerString = computed(() => {
  const data = get('site.common.supheader') || null
  return useShortcodes().render(data)
})

const openContactsHandler = (event) => {
  const component = defineAsyncComponent(() => import('~/components/Modal/Contacts/Contacts.client.vue'))
  useModal().open(component, null, null)
}

</script>

<style src="./supheader.scss" lang="scss" scoped />
<i18n src="./lang.yaml" lang="yaml"></i18n>

<template>
  <transition name="fade-in">
    <div v-if="isShow" class="supheader">
      <!-- <div class="container"> -->
        <div class="inner">
          <div class="contacts-block">
            <a :href="'tel:' + useContacts().phone" class="phone-btn supheader-btn supheader-btn-borders">
              <IconCSS name="mynaui:mobile" size="24" class="icon"></IconCSS>
              <span>{{ useContacts().phone }}</span>
            </a>
            <div class="supheader-delim"></div>
            <button @click="openContactsHandler" class="contacts-btn supheader-btn supheader-btn-borders" clickable>
              {{ t('all_contacts') }}
            </button>
          </div>

          <div class="content">
            <div v-if="headerString" v-html="headerString"></div>
          </div>
          

          <the-footer-region v-if="!$device.isMobile" class="supheader-region-block"></the-footer-region>

        </div>
      <!-- </div> -->
    </div>
  </transition> 
</template>