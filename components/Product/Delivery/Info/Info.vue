<script setup>
const {locale, t} = useI18n()
const {methods} = useDelivery()
const {pickupLocations} = useContacts()
const { isInternational } = useRegionPurchaseGuard()

const text = await queryContent('delivery').locale(locale.value).findOne()

const escapeHtml = (value) => String(value || '')
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;')
  .replace(/'/g, '&#39;')

const pickupLocationsHtml = computed(() => {
  if (!pickupLocations.value.length) {
    return ''
  }

  const items = pickupLocations.value.map((location) => {
    const schedule = location.schedule ? ` (${escapeHtml(location.schedule)})` : ''

    return `<li><b>${escapeHtml(location.title || location.address)}</b>${location.title ? `: ${escapeHtml(location.address)}` : ''}${schedule}</li>`
  }).join('')

  return `<ul>${items}</ul>`
})

const pageIntro = computed(() => {
  return {
    title: text?.page_intro_title || '',
    description: text?.page_intro_text || '',
  }
})

const messengerSections = computed(() => {
  return [
    {
      title: text?.messenger_age_title || '',
      text: text?.messenger_age_text || '',
    },
    {
      title: text?.messenger_delivery_title || '',
      text: text?.messenger_delivery_text || '',
    }
  ].filter((section) => section.title || section.text)
})

const m = computed(() => {
  return methods.value.map((method) => {
    const isMessenger = method.key === 'messenger_address' || method.key === 'messenger_express'
    const description = text?.[method.key] || (method.key === 'messenger_express' ? text?.messenger_address : '') || ''

    return {
      ...method,
      desc: description + (method.key === 'default_pickup' ? ` ${pickupLocationsHtml.value}` : ''),
      sections: isMessenger ? messengerSections.value : [],
    }
  })
})

</script>

<style src="./info.scss" lang="scss" scoped />

<template>
  <div class="delivery">
    
    <div class="subtitle">
      <div>{{ t('delivery.subtitle') }}</div>
      <checkout-delivery-country class="country" ></checkout-delivery-country>
    </div>

    <template v-if="isInternational">
      <p class="delivery__notice">
        {{ t('messages.select_region_delivery_notice') }}
      </p>
    </template>
    <template v-else>
      <section
        v-if="pageIntro.title || pageIntro.description"
        class="delivery__intro"
      >
        <h2 v-if="pageIntro.title" class="delivery__intro-title">{{ pageIntro.title }}</h2>
        <p v-if="pageIntro.description" class="delivery__intro-text">{{ pageIntro.description }}</p>
      </section>

      <product-methods :items="m" class="deliveries"></product-methods>

      <!-- <ContentQuery path="delivery" :locale="locale" find="one">
        <template #default="{ data }">
          <div v-html="data.info"></div>
        </template>
      </ContentQuery> -->
    </template>
  </div>
</template>
