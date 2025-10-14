<script setup>
const {t} = useI18n()
const route = useRoute()
const payload = computed(() => ({
  token: typeof route.query.token === 'string' ? route.query.token : undefined,
  email: typeof route.query.email === 'string' ? route.query.email : undefined,
}))

if(route.query.error) {
  throw createError({ statusCode: route.query.error_code, message: route.query.error_description })
}

onMounted(() => {
  useModal().open(resolveComponent('ModalAuthPasswordNew'), payload.value, null, {width: {min: 420}})
})
</script>

<template>
  <div>Change password</div>
</template>
