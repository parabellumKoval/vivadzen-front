<script setup lang="ts">
type RegionOption = {
  code: string
  name: string
  isActive: boolean
  flagClass?: string
}

const { t } = useI18n()
const regionStore = useRegion()

const currentRegionCode = computed(() => regionStore.region.value)
const isInternational = computed(() => {
  const current = String(currentRegionCode.value || '').toLowerCase()
  const fallback = String(regionStore.fallbackRegion || '').toLowerCase()
  return fallback && current === fallback
})

const availableRegions = computed(() => {
  return regionStore.regionsMetaArray
    .filter((meta) => meta.code !== regionStore.fallbackRegion)
    .map((meta) => ({
      code: meta.code,
      name: meta.name,
      flagClass: meta.flagClass
    }))
})

const regionOptions = computed<RegionOption[]>(() => {
  return availableRegions.value.map((region) => ({
    ...region,
    isActive: region.code === currentRegionCode.value
  }))
})

const currentRegionName = computed(() => {
  return regionOptions.value.find((region) => region.isActive)?.name || currentRegionCode.value
})

const getRegionLink = (code: string) => regionStore.currentUrl(code)
</script>

<style src="../region.scss" lang="scss" scoped />
<i18n src="./lang.yaml" lang="yaml"></i18n>

<template>
  <modal-wrapper :title="t('title')">
    <div class="regions regions--compact">
      <p v-if="isInternational" class="regions__notice">
        {{ t('notice') }}
      </p>
      <section class="regions__column regions__column--regions regions__column--full">
        <h3 class="regions__heading">{{ t('regionTitle') }}</h3>
        <p class="regions__current">
          {{ t('regionCurrent') }}
          <span>{{ t(currentRegionName) }}</span>
        </p>
        <ul class="regions-list">
          <li
            v-for="region in regionOptions"
            :key="region.code"
            class="regions__list-item"
          >
            <NuxtLink
              :to="getRegionLink(region.code)"
              class="regions-link"
              :class="{'regions-link--active': region.isActive}"
            >
              <Icon :name="region.flagClass" size="24" class="icon"></Icon>
              {{ t(region.name) }}
            </NuxtLink>
          </li>
        </ul>
      </section>
    </div>
  </modal-wrapper>
</template>
