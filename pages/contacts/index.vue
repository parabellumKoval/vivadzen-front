<script setup>
import { useFeedbackStore } from '~~/store/feedback';

const {t} = useI18n()

const breadcrumbs = [
  {
    name: t('title.home'),
    item: '/'
  },{
    name: t('title.contacts'),
    item: '/contacts'
  }
]

const feedback = ref({
  type: 'contact_page',
  name: null,
  phone: null,
  email: null,
  text: null
})

const errors = ref(null)
const { messengers, networks } = useSocial()

// METHODS
const resetFeedback = () => {
  feedback.value.name = null
  feedback.value.phone = null
  feedback.value.email = null
  feedback.value.text = null
}

const resetErrors = () => {
  errors.value = null
}

const createFeedbackHandler = () => {
  useFeedbackStore().create(feedback.value).then(({data, error}) => {

    if(data) {
      useNoty().setNoty({
        content: t('noty.feedback.sent'),
        type: 'success'
      }, 5000)

      resetFeedback()
      resetErrors()
    }

    if(error) {
      throw error
    }

  }).catch((e) => {

    useNoty().setNoty({
      title: t('noty.feedback.fail'),
      content: t('error.check_fields'),
      type: 'error'
    }, 5000)

    errors.value = e
  })
}
// HANDLERS
// WATCHERS

//
useSeo().setPageSeo(t('title.contacts'))
</script>

<style src='./contacts.scss' lang='scss' scoped></style>
<i18n src='./lang.yaml' lang='yaml'></i18n>

<template>
  <div class="page-base">
    <div class="container">
      <the-breadcrumbs :crumbs="breadcrumbs"></the-breadcrumbs>

      <div class="title-common">{{ t('title.contacts') }}</div>

      <div class="contacts">
        <div class="contacts-wrapper">

          <div class="contacts-block">
            <div class="contacts-label">{{ t('phones') }}</div>
            <div class="phone">
              <a
                :href="useContacts().phone"
                class="phone-item contacts-value"
              >{{ useContacts().phone }}</a>
              <a
                :href="useContacts().phone2"
                class="phone-item contacts-value"
              >{{ useContacts().phone2 }}</a>
            </div>
          </div>

          <div class="contacts-block">
            <div class="contacts-label">{{ t('email') }}</div>
            <div class="phone">
              <a
                :href="useContacts().email"
                class="phone-item contacts-value"
              >{{ useContacts().email }}</a>
            </div>
          </div>

          <div class="contacts-block">
            <div class="contacts-label">{{ t('label.our_address') }}</div>
            <div class="phone">
              <a
                :href="useContacts().phone"
                class="phone-item contacts-value"
              >{{ useContacts().address }}</a>
            </div>
          </div>

          <div class="contacts-block">
            <!-- <div class="contacts-label">{{ t('label.our_socials') }}</div> -->

            <div class="social-groups">
              <div v-if="messengers.length" class="social-group">
                <div class="contacts-label social-group-label">{{ t('label.messengers') }}</div>
                <div class="contacts-label social-group-hint">{{ t('label.messengers_consultation_hint') }}</div>
                <div class="social">
                  <a v-for="messenger in messengers" :key="messenger.id" :href="messenger.link" :class="messenger.key + '-bg'" class="social-item">
                    <IconCSS :name="messenger.icon" class="social-icon"></IconCSS>
                    <span class="social-text">{{ messenger.name }}</span>
                  </a>
                </div>
              </div>
              <div v-if="networks.length" class="social-group">
                <div class="contacts-label social-group-label">{{ t('label.social_networks') }}</div>
                <div class="social">
                  <a v-for="network in networks" :key="network.id" :href="network.link" :class="network.key + '-bg'" class="social-item">
                    <IconCSS :name="network.icon" class="social-icon"></IconCSS>
                    <span class="social-text">{{ network.name }}</span>
                  </a>
                </div>
              </div>
            </div>
          </div>

        </div>
        
        <div class="map-wrapper" v-html="useContacts().map.value"></div>

        <div class="form-wrapper">
          <div class="form-label">👩‍💻 {{ t('questions') }}</div>
          
          <form-text
            v-model="feedback.name"
            :placeholder="t('form.enter.name')"
            :error="errors?.name"
            @input="() => errors.name = null"
          ></form-text>
          
          <form-text
            v-model="feedback.email"
            :placeholder="t('form.enter.email')"
            :error="errors?.email"
            @input="() => errors.email = null"
          ></form-text>
          
          <form-text
            v-model="feedback.phone"
            :placeholder="t('form.enter.phone')"
            :error="errors?.phone"
            @input="() => errors.phone = null"
          ></form-text>
          
          <form-textarea
            v-model="feedback.text"
            :placeholder="t('form.enter.message')"
            :error="errors?.text"
            @input="() => errors.text = null"
            :min-height="120"
          ></form-textarea>

          <button @click="createFeedbackHandler" class="button primary form-button">{{ t('send') }}</button>
        </div>

      </div>
    </div>
  </div>
</template>
