
<script setup lang="ts">
  import { usePacketa } from '#imports'
  const { t } = useI18n()
  const { pickPudo } = usePacketa()
  const point = ref<any>(null)

  async function choose () {
    try {
      point.value = await pickPudo()
    } catch (error) {
      console.error('Failed to open Packeta widget', error)
    }
  }
</script>

<i18n src='./lang.yaml' lang='yaml'></i18n>

<template>
  <div class="space-y-3">
    <button class="px-3 py-2 rounded bg-gray-200" type="button" @click="choose">{{ t('choose') }}</button>

    <div v-if="point" class="text-sm">
      <div><strong>{{ point.name }}</strong></div>
      <div>{{ point.street }}, {{ point.city }} {{ point.zip }}</div>
    </div>
  </div>
</template>
