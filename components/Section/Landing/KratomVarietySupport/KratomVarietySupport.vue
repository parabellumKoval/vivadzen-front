<script setup>
const contactsModal = defineAsyncComponent(() =>
  import('~/components/Modal/Contacts/Contacts.client.vue')
)

const openContactsModal = () => {
  useModal().open(contactsModal, null, null, {
    width: { min: 320, max: 900 }
  })
}
</script>

<template>
  <div class="support">
    <nuxt-img
      src="/images/landing/support-man.png"
      alt="Vivadzen Kratom Pack"
      width="1024"
      height="1024"
      quality="90"
      fit="cover"
      sizes="mobile: 100vw tablet: 550px desktop: 550px"
      class="support__img"
    />
    <div class="support__content">
      <h3 class="support__title">Нужна помощь с выбором?</h3>
      <p class="support__desc">
        Наши эксперты всегда готовы помочь вам подобрать идеальный сорт и цвет кратома,
        соответствующий вашим потребностям и предпочтениям.
      </p>
      <button type="button" class="button orange support__link" @click="openContactsModal">
        Связаться с нами
      </button>
    </div>
  </div>
</template>

<style src="./support.scss" lang="scss" scoped></style>
