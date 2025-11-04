<script setup lang="ts">
type LocaleEntry = {
  code: string
  name: string
  shortName?: string
}

type RegionOption = {
  code: string
  name: string
  isActive: boolean
}

const { locale, locales, t } = useI18n()
const regionStore = useRegion()
const router = useRouter()

const hoveredRegion = ref<string | null>(null)

const currentRegionCode = computed(() => regionStore.region.value)

const languageOptions = computed(() => {
  const entries = Array.isArray(locales.value)
    ? (locales.value as LocaleEntry[])
    : []

  return entries.map((entry) => ({
    ...entry,
    isActive: entry.code === locale.value
  }))
})

const currentLocaleName = computed(() => {
  return languageOptions.value.find((option) => option.isActive)?.name || locale.value
})

// Regions
const availableRegions = computed(() => {
  return regionStore.regionsMetaArray.map((meta) => ({ code: meta.code, name: meta.name, flagClass: meta.flagClass }) )
})

const regionOptions = computed<RegionOption[]>(() => {
  return availableRegions.value.map((region) => ({
    ...region,
    isActive: region.code === currentRegionCode.value,
  }))
})

const currentRegionName = computed(() => {
  return regionOptions.value.find((region) => region.isActive)?.name || currentRegionCode.value
})

const handleRegionHover = (code: string | null) => {
  hoveredRegion.value = code
}


const getRegionLink = (code: string) => regionStore.currentUrl(code)
const getLocaleLink = (code: string) => regionStore.currentUrl(null, code)






// Пример: список стран (обычно прилетит из API)
const countries = [
  { id: 'DE', name: 'Germany' },
  { id: 'FR', name: 'France' },
  { id: 'IT', name: 'Italy' },
  { id: 'ES', name: 'Spain' },
]

const selected = ref<{ id: string | null; name: string | null }>({ id: null, name: null })

// Подсветка из списка (наведение мышью на элемент списка)
// const hoverIds = ref<string|null[]>([hoveredRegion.value])
const hoverIds = computed(() => {
  return[hoveredRegion.value]
})

// Пример «активных» стран (например, выбранные фильтром)
const activeIds = ref<string[]>([regionStore.region.value])  // Германия активна
const activeNames = ref<string[]>([])    // либо по name

function handleCountryClick(payload: { id: string | null; name: string | null }) {
  selected.value = { id: payload.id, name: payload.name }

  console.log('Country clicked:', payload)
}
</script>

<style src="./region.scss" lang="scss" scoped />
<i18n src="./lang.yaml" lang="yaml"></i18n>

<template>
  <modal-wrapper :title="t('title')">
    <div class="regions">

      <div
        class="regions-map"
      >
        <SimpleWorldMap
          :active-ids="activeIds"
          :hover-ids="hoverIds"
          @country-click="handleCountryClick"
          @country-hover="handleCountryClick"
          @country-leave="() => { /* скрыть тултип */ }"
        />
        <p class="regions__hint">{{ t('mapHint') }}</p>
      </div>

      <section class="regions__column regions__column--regions">
        <h3 class="regions__heading">{{ t('regionTitle') }}</h3>
        <p class="regions__current">
          {{ t('regionCurrent') }}
          <span>{{ currentRegionName }}</span>
        </p>
        <ul class="regions-list">
          <li
            v-for="region in regionOptions"
            :key="region.code"
            class="regions__list-item"
            @mouseenter="handleRegionHover(region.code)"
            @mouseleave="handleRegionHover(null)"
          >
            <NuxtLink
              :to="getRegionLink(region.code)"
              class="regions-link"
              :class="{'regions-link--active': region.isActive}"
            >
              <Icon :name="region.flagClass" size="24" class="icon"></Icon>
              {{ region.name }}
            </NuxtLink>
          </li>
        </ul>
      </section>

      <section class="regions__column regions__column--languages">
        <h3 class="regions__heading">{{ t('languageTitle') }}</h3>
        <p class="regions__current">
          {{ t('languageCurrent') }}
          <span>{{ currentLocaleName }}</span>
        </p>
        <ul class="regions-list">
          <li
            v-for="language in languageOptions"
            :key="language.code"
            class="regions__list-item"
          >
            <span
              v-if="language.isActive"
              class="regions-link regions-link--active"
              aria-current="true"
            >
              {{ language.name }}
            </span>
            <NuxtLink
              v-else
              :to="getLocaleLink(language.code)"
              class="regions-link"
            >
              {{ language.name }}
            </NuxtLink>
          </li>
        </ul>
      </section>
    </div>
  </modal-wrapper>
</template>
