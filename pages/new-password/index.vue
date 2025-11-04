<script setup>
const route = useRoute()
const modal = useModal()
const modalComponent = resolveComponent('ModalAuthPasswordNew')

const payload = computed(() => {
  const query = route.query

  const token =
    typeof query.t === 'string'
      ? query.t
      : typeof query.token === 'string'
        ? query.token
        : undefined

  return {
    token,
    email: typeof query.email === 'string' ? query.email : undefined,
  }
})

if (route.query.error) {
  const parsedStatus =
    typeof route.query.error_code === 'string'
      ? Number.parseInt(route.query.error_code, 10)
      : 400
  const statusCode = Number.isNaN(parsedStatus) ? 400 : parsedStatus
  const message =
    typeof route.query.error_description === 'string'
      ? route.query.error_description
      : 'Unable to reset password'

  throw createError({ statusCode, message })
}

const openModal = () => {
  modal.open(modalComponent, payload.value, null, { width: { min: 420 } })
}

if (import.meta.client) {
  onMounted(() => {
    openModal()
  })

  watch(payload, () => {
    openModal()
  })
}
</script>

<template>
  <div class="new-password-page" style="min-height:100vh"></div>
</template>
