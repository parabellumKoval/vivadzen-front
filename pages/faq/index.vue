<script setup>
const {t, locale} = useI18n({useScope: 'global'})
const {t: tFaqLocal} = useI18n({useScope: 'local'})
const {regionsMeta, region} = useRegion()

const text = await queryContent('faq').locale(locale.value).findOne()
const {deliveryDetails, paymentDetails, guaranteeDetails} = await useSupportContent()

const breadcrumbs = [
  {
    name: t('title.home'),
    item: '/'
  },{
    name: t('title.qa'),
    item: '/faq'
  }
]

const deliveryFaqItems = computed(() => {
  return deliveryDetails.value.map((method) => `<b>${method.title}</b>: ${method.description}`)
})

const paymentFaqItems = computed(() => {
  return paymentDetails.value.map((method) => `<b>${method.title}</b>: ${method.description}`)
})

const guaranteePrimary = computed(() => guaranteeDetails.value?.[0] || '')
const guaranteeExtra = computed(() => {
  if (!guaranteeDetails.value?.length) {
    return []
  }
  return guaranteeDetails.value.slice(1)
})

const regionNameMap = {
  en: {global: 'Europe', ua: 'Ukraine', cz: 'Czechia', de: 'Germany', es: 'Spain'},
  ru: {global: 'Европа', ua: 'Украина', cz: 'Чехия', de: 'Германия', es: 'Испания'},
  uk: {global: 'Європа', ua: 'Україна', cz: 'Чехія', de: 'Німеччина', es: 'Іспанія'},
  cs: {global: 'Evropa', ua: 'Ukrajina', cz: 'Česko', de: 'Německo', es: 'Španělsko'},
  de: {global: 'Europa', ua: 'Ukraine', cz: 'Tschechien', es: 'Spanien', de: 'Deutschland'},
  es: {global: 'Europa', ua: 'Ucrania', cz: 'Chequia', de: 'Alemania', es: 'España'}
}

const shippingCarriers = computed(() => deliveryDetails.value.map((method) => method.title).join(', '))
const regionDisplayName = computed(() => {
  const currentCode = region.value || 'global'
  const code = currentCode === 'zz' ? 'global' : currentCode
  const localeCode = locale.value || 'en'
  const localized = regionNameMap[localeCode]?.[code]
  if (localized) {
    return localized
  }
  return regionsMeta?.[code]?.name || code.toUpperCase()
})

const shippingText = computed(() => {
  if (shippingCarriers.value && regionDisplayName.value) {
    return tFaqLocal('shipping_dynamic', {
      region: regionDisplayName.value,
      carriers: shippingCarriers.value
    })
  }
  return text?.items?.qa9?.a || ''
})

const trackingText = computed(() => {
  if (shippingCarriers.value) {
    return tFaqLocal('tracking_dynamic', {
      carriers: shippingCarriers.value
    })
  }
  return text?.items?.qa11?.a || ''
})

const useGuaranteeFaq = computed(() => region.value === 'ua')

const items = computed(() => {
  if (!text?.items) {
    return []
  }

  return Object.values(text.items).map((item) => {
    const current = {...item}
    switch (item.id) {
      case 4:
        current.a = deliveryFaqItems.value.length ? deliveryFaqItems.value : item.a
        break
      case 6:
        current.a = paymentFaqItems.value.length ? paymentFaqItems.value : item.a
        break
      case 7:
        current.a = (useGuaranteeFaq.value && guaranteePrimary.value) ? guaranteePrimary.value : item.a
        break
      case 8:
        current.a = (useGuaranteeFaq.value && guaranteeExtra.value.length) ? guaranteeExtra.value : item.a
        break
      case 9:
        current.a = shippingText.value || item.a
        break
      case 11:
        current.a = trackingText.value || item.a
        break
      default:
        break
    }
    return current
  })
})

useSeo().setPageSeo(t('title.qa'))
</script>

<style src='~/assets/scss/page.scss' lang='scss' scoped></style>
<i18n lang='yaml'>
en:
  shipping_dynamic: "We deliver orders across {region} via {carriers}."
  tracking_dynamic: "After the parcel is shipped you receive a tracking number from {carriers}. Track it on the carrier's website or in their app."
ru:
  shipping_dynamic: "Мы доставляем заказы по региону {region} через: {carriers}."
  tracking_dynamic: "После отправки вы получаете номер для отслеживания от {carriers}. Статус посылки можно проверить на сайте или в приложении выбранной службы."
uk:
  shipping_dynamic: "Ми доставляємо замовлення по регіону {region} через: {carriers}."
  tracking_dynamic: "Після відправлення ви отримуєте трек-номер від {carriers}. Відстежуйте посилку на сайті або в застосунку перевізника."
cs:
  shipping_dynamic: "Objednávky doručujeme v regionu {region} prostřednictvím: {carriers}."
  tracking_dynamic: "Po odeslání obdržíte sledovací číslo od {carriers}. Stav zásilky sledujte na webu či v aplikaci dopravce."
de:
  shipping_dynamic: "Wir liefern Bestellungen in {region} über: {carriers}."
  tracking_dynamic: "Nach dem Versand erhalten Sie eine Sendungsnummer von {carriers}. Verfolgen Sie das Paket über die Website oder App des Dienstes."
es:
  shipping_dynamic: "Entregamos pedidos en {region} a través de: {carriers}."
  tracking_dynamic: "Tras el envío recibirás un número de seguimiento de {carriers}. Consulta el estado en la web o app del transportista."
</i18n>

<template>
  <div class="page-base">
    <div class="container">
      <the-breadcrumbs :crumbs="breadcrumbs"></the-breadcrumbs>

      <div class="title-common">{{ t('title.qa') }}</div>
      <div class="content-wrapper">
        <section-faq :items="items" class="content"></section-faq>
        <aside class="content-aside">
          <checkout-contacts></checkout-contacts>
        </aside>
      </div>
    </div>
  </div>
</template>
