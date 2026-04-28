<script setup lang="ts">
const { t } = useI18n()
const contactInfo = useContacts()
const mapLocations = computed(() => contactInfo.mapLocations.value)

const contacts = computed(() => {
  return [
    {
      icon: 'iconoir:map',
      colorClass: 'contact-item--address',
      label: t('label.address'),
      value: contactInfo.addressSummary.value,
      lines: contactInfo.addressLines.value
    },
    {
      icon: 'iconoir:phone',
      colorClass: 'contact-item--phone',
      label: t('label.phone'),
      value: contactInfo.phone.value
    },
    {
      icon: 'iconoir:mail',
      colorClass: 'contact-item--email',
      label: t('label.email'),
      value: contactInfo.email.value
    },
    {
      icon: 'iconoir:clock',
      colorClass: 'contact-item--schedule',
      label: t('label.schedule'),
      value: contactInfo.scheduleSummary.value,
      lines: contactInfo.scheduleLines.value
    }
  ].filter((item) => item.value)
})
</script>

<style src="./contacts.scss" lang="scss" scoped></style>
<i18n src="./lang.yaml" lang="yaml"></i18n>

<template>
  <section class="contacts-section">
    <div class="container">
      <div class="contacts-section__header">
        <h2 class="contacts-section__title">
          {{ t('title.open') }}
        </h2>
        <p class="contacts-section__description">
          {{ t('description') }}
        </p>
      </div>

      <div>
        <div class="contacts-info-card__list">
          <div
            v-for="contact in contacts"
            :key="contact.label"
            class="contact-item"
            :class="contact.colorClass"
          >
            <div class="contact-item__icon">
              <IconCSS :name="contact.icon" />
            </div>
            <div class="contact-item__content">
              <p class="contact-item__label">{{ contact.label }}</p>
              <p class="contact-item__value">
                <template v-if="contact.lines?.length">
                  <template v-for="(line, index) in contact.lines" :key="`${contact.label}-${index}`">
                    <template v-if="index"><br></template>{{ line }}
                  </template>
                </template>
                <template v-else>
                  {{ contact.value }}
                </template>
              </p>
            </div>
          </div>
        </div>
      </div>

      <div class="photo__wrapper">
        <nuxt-img
          src="/images/landing/shop/3.jpg"
          sizes="desktop: 1000px"
          class="photo__item photo__item--1"
          alt=""
        />
        <nuxt-img
          src="/images/landing/shop/1.jpg"
          sizes="desktop: 1000px"
          class="photo__item photo__item--2"
          alt=""
        />
        <nuxt-img
          src="/images/landing/shop/2.jpg"
          sizes="desktop: 1000px"
          class="photo__item photo__item--3"
          alt=""
        />
      </div>

      <div v-if="mapLocations.length" class="map-list">
        <div
          v-for="location in mapLocations"
          :key="location.id"
          class="map-card"
        >
          <p class="map-card__title">{{ location.title || location.address }}</p>
          <p v-if="location.title" class="map-card__subtitle">{{ location.address }}</p>
          <p v-if="location.schedule" class="map-card__schedule">{{ location.schedule }}</p>
          <div class="map-wrapper">
            <iframe
              :src="location.mapSrc"
              class="map"
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </div>
      </div>
      
    </div>
  </section>
</template>
