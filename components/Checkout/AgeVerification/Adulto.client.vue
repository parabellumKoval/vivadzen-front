<script setup lang="ts">
const props = defineProps<{
  modelValue: string | null
  required: boolean
  publicKey: string
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: string | null): void
  (e: 'error', value: string): void
}>()

const { t } = useI18n()

const containerId = `adulto-verification-${Math.random().toString(36).slice(2, 10)}`
const isLoading = ref(false)
const widgetError = ref<string | null>(null)

let adultoScriptPromise: Promise<void> | null = null

const getAdultoApi = () => (window as typeof window & { Adulto?: any }).Adulto

const loadScript = async (publicKey: string) => {
  if (!process.client) {
    return
  }

  if (getAdultoApi()) {
    return
  }

  if (adultoScriptPromise) {
    return adultoScriptPromise
  }

  adultoScriptPromise = new Promise<void>((resolve, reject) => {
    const scriptId = 'adulto-widget-script'
    const existing = document.getElementById(scriptId) as HTMLScriptElement | null

    if (existing) {
      existing.addEventListener('load', () => resolve(), { once: true })
      existing.addEventListener('error', () => reject(new Error('Failed to load ADULTO script.')), { once: true })
      return
    }

    const script = document.createElement('script')
    script.id = scriptId
    script.async = true
    script.src = `https://adulto.cz/embed.js?key=${encodeURIComponent(publicKey)}`
    script.onload = () => resolve()
    script.onerror = () => reject(new Error('Failed to load ADULTO script.'))

    document.head.appendChild(script)
  })

  return adultoScriptPromise
}

const initWidget = async () => {
  widgetError.value = null

  if (!process.client || !props.required) {
    return
  }

  const publicKey = String(props.publicKey || '').trim()
  if (!publicKey) {
    widgetError.value = t('unavailable')
    return
  }

  isLoading.value = true

  try {
    await loadScript(publicKey)

    await nextTick()

    const adultoApi = getAdultoApi()
    if (!adultoApi || typeof adultoApi.createVerificationWidget !== 'function') {
      throw new Error('ADULTO API is unavailable.')
    }

    const targetElement = document.getElementById(containerId)
    if (targetElement) {
      targetElement.innerHTML = ''
    }

    adultoApi.createVerificationWidget({
      elementId: containerId,
      onSuccess: (uid: string) => {
        emit('update:modelValue', uid)
        widgetError.value = null
      },
      onError: (error: unknown) => {
        const message = t('verification_failed')
        widgetError.value = message
        emit('error', message + (error ? ` (${String(error)})` : ''))
      },
    })
  } catch (error) {
    widgetError.value = t('widget_load_failed')
    emit('error', widgetError.value)
  } finally {
    isLoading.value = false
  }
}

watch(
  () => [props.required, props.publicKey],
  () => {
    if (!props.required) {
      widgetError.value = null
      return
    }

    initWidget()
  },
  { immediate: true }
)
</script>

<style scoped lang="scss">
.adulto-verification {
  display: grid;
  gap: 10px;
}

.adulto-verification__title {
  font-size: 15px;
  font-weight: 600;
}

.adulto-verification__description {
  font-size: 13px;
  color: $color-3;
}

.adulto-verification__status {
  font-size: 13px;
}

.adulto-verification__status--success {
  color: #278248;
}

.adulto-verification__status--error {
  color: #b53c3c;
}
</style>

<i18n lang="yaml">
uk:
  title: "Підтвердження віку 18+"
  description: "Для оформлення цієї корзини в регіоні CZ потрібно пройти перевірку віку через ADULTO.cz."
  verified: "Вік підтверджено."
  loading: "Завантаження віджета..."
  unavailable: "Публічний ключ ADULTO не налаштований."
  verification_failed: "Перевірка віку не пройдена."
  widget_load_failed: "Не вдалося завантажити віджет ADULTO."
ru:
  title: "Подтверждение возраста 18+"
  description: "Для оформления этой корзины в регионе CZ нужно пройти проверку возраста через ADULTO.cz."
  verified: "Возраст подтверждён."
  loading: "Загрузка виджета..."
  unavailable: "Публичный ключ ADULTO не настроен."
  verification_failed: "Проверка возраста не пройдена."
  widget_load_failed: "Не удалось загрузить виджет ADULTO."
cs:
  title: "Ověření věku 18+"
  description: "Pro dokončení tohoto košíku v regionu CZ je nutné ověření věku přes ADULTO.cz."
  verified: "Věk byl ověřen."
  loading: "Načítání widgetu..."
  unavailable: "Veřejný klíč ADULTO není nastaven."
  verification_failed: "Ověření věku se nezdařilo."
  widget_load_failed: "Nepodařilo se načíst widget ADULTO."
en:
  title: "Age Verification 18+"
  description: "To place this order in the CZ region, complete age verification via ADULTO.cz."
  verified: "Age verified."
  loading: "Loading widget..."
  unavailable: "ADULTO public key is not configured."
  verification_failed: "Age verification failed."
  widget_load_failed: "Failed to load ADULTO widget."
</i18n>

<template>
  <div class="adulto-verification">
    <div class="adulto-verification__title">{{ t('title') }}</div>
    <p class="adulto-verification__description">{{ t('description') }}</p>

    <div :id="containerId"></div>

    <div v-if="isLoading" class="adulto-verification__status">
      {{ t('loading') }}
    </div>

    <div v-if="modelValue" class="adulto-verification__status adulto-verification__status--success">
      {{ t('verified') }}
    </div>

    <div v-if="widgetError" class="adulto-verification__status adulto-verification__status--error">
      {{ widgetError }}
    </div>
  </div>
</template>
