
<script setup lang="ts">
  import { usePacketa } from '#imports'
  const { t } = useI18n()
  const { pickPudo } = usePacketa()
  const point = ref<any>(null)

  async function choose () {
    point.value = await pickPudo()
  }
</script>

<i18n src='./lang.yaml' lang='yaml'></i18n>

<template>
  <div class="space-y-3">
    <button class="px-3 py-2 rounded bg-gray-200" @click="choose">{{ t('choose') }}</button>

    <div v-if="point" class="text-sm">
      <div><strong>{{ point.name }}</strong></div>
      <div>{{ point.street }}, {{ point.city }} {{ point.zip }}</div>
    </div>
  </div>
</template>
