<script setup>
import { useReviewStore } from '~~/store/review';

const { t } = useI18n()
const { user: authUser, displayName, avatar } = useAuth()

const review = ref({
  provider: 'data',
  owner: {
    name: null,
    email: null,
    photo: null
  },
  link: null,
  rating: null,
  flaws: null,
  advantages: null,
  text: null,
  reviewable_id: null,
  reviewable_type: null,
  parent_id: null
})

const errors = ref(null)

const extractValidationErrors = (error) => {
  const payload = error?.data || error

  if (!payload || typeof payload !== 'object') {
    return null
  }

  if (payload.options && typeof payload.options === 'object') {
    return payload.options
  }

  if (payload.errors && typeof payload.errors === 'object') {
    return payload.errors
  }

  return null
}

// COMPUTEDS
const parent = computed(() => {
  return useModal().active.data
})

// HANDLER
const resetReview = () => {
  review.value.text = null
  review.value.parent_id = null
}

const sendHandler = async () => {
  let data = {...review.value}
  await useReviewStore().create(data).then(({data, error}) => {

    if(data.value) {
      resetReview()
      errors.value = null

      useNoty().setNoty({
        title: t('noty.review.success_title'),
        content: t('noty.review.success'),
        type: 'success'
      }, 5000)

      useModal().close()
    }

    if(error.value) 
      throw error.value

  }).catch((e) => {
    useNoty().setNoty({
      title: t('noty.review.fail_title'),
      content: t('noty.review.fail'),
      type: 'error'
    }, 7000)

    errors.value = extractValidationErrors(e)
  })
}

// METHODS
const clearError = (key) => {
  if(errors.value && errors.value[key]) {
    errors.value[key]= null
  }
}

const setParent = () => {
  review.value.parent_id = useModal().active?.data?.id || null
}

const setUserData = () => {
  const current = authUser.value
  if (!current) return
  review.value.owner.name = displayName.value || current.name || review.value.owner.name
  review.value.owner.email = current.email || review.value.owner.email
  review.value.owner.photo = avatar.value || current.photo || current.avatar || review.value.owner.photo
}

// WATCH
setParent()
watch(authUser, () => setUserData(), { immediate: true })
</script>

<style src="./reply.scss" lang="scss" scoped></style>
<i18n src="./lang.yaml" lang="yaml"></i18n>

<template>
  <modal-wrapper :title="t('new_reply')">
    <div class="modal-wrapper">

      <div class="parent">
        <div class="parent-name">{{ parent.owner?.name }}</div>
        <div class="parent-text">{{ parent.text }}</div>
      </div>

      <div class="form-wrapper">

        <div>
          <div class="form-label">{{ t('form.reply') }}</div>
          <form-textarea
            v-model="review.text"
            :error = "errors?.text"
            @input = "clearError('text')"
            :placeholder="t('form.enter.reply')"
          ></form-textarea>
        </div>

        <button @click="sendHandler" class="button primary send-btn">{{ t('button.reply') }}</button>
      </div>

    </div>
  </modal-wrapper>
</template>
