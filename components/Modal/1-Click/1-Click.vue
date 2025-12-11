<script setup>
import { useFeedbackStore } from '~~/store/feedback';
const { t } = useI18n()

const form = ref({
  type: '1_click_buy',
  phone: null,
  text: null
})

const initialErrorsState = () => ({
  phone: null,
  text: null
})

const errors = ref(initialErrorsState())

const normalizeFieldErrors = (value) => {
  if (Array.isArray(value)) {
    return value.length ? value : null
  }

  if (typeof value === 'string' && value.length) {
    return value
  }

  return null
}

const extractValidationBag = (error) => {
  if (!error || typeof error !== 'object') return null
  if (error.errors && typeof error.errors === 'object') return error.errors
  if (error.options && typeof error.options === 'object') return error.options
  return error
}

const applyErrors = (error) => {
  const bag = extractValidationBag(error)
  const next = initialErrorsState()

  if (bag) {
    next.phone = normalizeFieldErrors(bag.phone)
    next.text = normalizeFieldErrors(bag.text)
  }

  errors.value = next
}

// COMPUTEDS
const product = computed(() => {
  return useModal().active.data
})

// METHODS
const resetForm = () => {
  form.value.phone = null
  form.value.text = null
}

const resetErrors = () => {
  errors.value = initialErrorsState()
}

const getFormData = () => {
  let formData = {...form.value}
  formData.text = 'Товар: ' + product.value.name + '. Комментарий: ' + form.value.text

  return formData
}

// HANDLERS
const buyHandler = () => {
  let formData = getFormData()

  useFeedbackStore().create(formData).then(({data, error}) => {

    if(data.value) {
      useNoty().setNoty({
        title: t('noty.1_click.title'),
        content: t('noty.1_click.sent'),
        type: 'success'
      }, 5000)

      resetForm()
      resetErrors()
      useModal().close()
    }

    if(error.value) {
      throw error.value
    }

  }).catch((e) => {

    useNoty().setNoty({
      title: t('noty.1_click.fail'),
      content: t('error.check_fields'),
      type: 'error'
    }, 5000)

    applyErrors(e?.data || e)
  })

}
</script>

<style src="./1-click.scss" lang="scss" scoped></style>
<i18n src="./lang.yaml" lang="yaml"></i18n>

<template>
  <modal-wrapper :title="t('button.1_click_buy')" class="modal-wrapper-auth">
    <div>
      <product-card-small :item="product"></product-card-small>

      <div class="form-wrapper">
        <div>
          {{ t('w') }}
        </div>
        
        <div>
          <div class="form-label">{{ t('form.phone') }}</div>
          <form-text
            v-model="form.phone"
            :error="errors?.phone"
            @input="() => errors.phone = null"
            :placeholder="t('form.enter.phone')"
          ></form-text>
        </div>

        <div>
          <div class="form-label">{{ t('form.comment') }}</div>
          <form-textarea
            v-model="form.text"
            :error="errors?.text"
            @input="() => errors.text = null"
            :placeholder="t('form.enter.comment')"
          ></form-textarea>
        </div>

        <button @click="buyHandler" class="button primary send-btn">{{ t('button.send') }}</button>
      </div>
    </div>
  </modal-wrapper>
</template>
