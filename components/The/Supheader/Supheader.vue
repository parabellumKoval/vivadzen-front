<script setup>
  const {t, locale} = useI18n()
  const isShow = ref(true)

  const {regionsMeta, region} = useRegion()
  const {get} = useSettings()

  const close = () => {
    isShow.value = false
  }

  const headerString = computed(() => {
    const data = get('site.common.supheader') || null
    return useShortcodes().render(data)
  })

  const regionMeta = computed(() => {
    return regionsMeta[region.value]
  })

  const openContactsHandler = (event) => {
    const component = defineAsyncComponent(() => import('~/components/Modal/Contacts/Contacts.vue'))
    useModal().open(component, null, null)
  }

  const openModalHandler = (event) => {
    const component = defineAsyncComponent(() => import('~/components/Modal/Region/Region.vue'))
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
          <a :href="'tel:' + useContacts().phone" class="phone-btn supheader-btn supheader-btn-borders">
            <IconCSS name="mynaui:mobile" size="24" class="icon"></IconCSS>
            <span>{{ useContacts().phone }}</span>
          </a>

          <button @click="openContactsHandler" class="contacts-btn supheader-btn supheader-btn-borders" clickable>
            {{ t('all_contacts') }}
          </button>

          <div class="content">
            <div v-if="headerString" v-html="headerString"></div>
          </div>
          
          <button @click="openModalHandler" class="region-btn" clickable>
            <div class="supheader-btn region-label">
              <IconCSS name="mynaui:location" size="24" class="icon"></IconCSS>
              <span>{{ t('delivery_country') }}:</span>
            </div>

            <div class="supheader-btn region-unit">
              <Icon :name="regionMeta.flagClass" size="24" class="icon"></Icon>
              <span>{{ regionMeta.name }}</span>
            </div>

            <div class="region-btn-locale supheader-btn supheader-btn-borders">
              {{ locale }}
            </div>
          </button>


          <!-- <button @click="close" class="close-btn btn">
            <IconCSS name="iconoir:cancel" size="24" class="icon"></IconCSS>
          </button> -->
        </div>
      <!-- </div> -->
    </div>
  </transition> 
</template>