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
const scriptId = 'adulto-widget-script'
const scriptLoadTimeoutMs = 15000

let adultoScriptPromise: Promise<void> | null = null

const getAdultoApi = () => (window as typeof window & { Adulto?: any }).Adulto
const isAdultoApiReady = () => {
  const adultoApi = getAdultoApi()
  return Boolean(adultoApi && typeof adultoApi.createVerificationWidget === 'function')
}
const getKeyPreview = (key: string) => {
  if (!key) {
    return ''
  }

  if (key.length <= 4) {
    return key
  }

  return `${key.slice(0, 4)}...`
}

const logAdultoDebug = (stage: string, error?: unknown, extra: Record<string, unknown> = {}) => {
  if (!process.client) {
    return
  }

  const script = document.getElementById(scriptId) as HTMLScriptElement | null
  const errorMessage = error instanceof Error ? error.message : String(error || '')
  const key = String(props.publicKey || '').trim()
  const payload = {
    stage,
    error: errorMessage,
    href: window.location.href,
    host: window.location.host,
    isLocalhost: ['localhost', '127.0.0.1'].includes(window.location.hostname),
    publicKeyProvided: key.length > 0,
    publicKeyPreview: getKeyPreview(key),
    scriptSrc: script?.src || null,
    scriptState: script?.dataset?.adultoState || null,
    hasAdultoObject: Boolean(getAdultoApi()),
    adultoApiReady: isAdultoApiReady(),
    ...extra,
  }

  console.error('[ADULTO] Widget debug', payload)
}

const loadScript = async (publicKey: string) => {
  if (!process.client) {
    return
  }

  if (isAdultoApiReady()) {
    return
  }

  if (adultoScriptPromise) {
    return adultoScriptPromise
  }

  adultoScriptPromise = new Promise<void>((resolve, reject) => {
    const existing = document.getElementById(scriptId) as HTMLScriptElement | null
    let settled = false

    const finish = (callback: () => void) => {
      if (settled) {
        return
      }

      settled = true
      callback()
    }

    const resolveWhenReady = () => {
      finish(() => {
        if (isAdultoApiReady()) {
          resolve()
          return
        }

        logAdultoDebug('api_unavailable_after_script_load', 'ADULTO script loaded but API is unavailable.')
        reject(new Error('ADULTO script loaded but API is unavailable.'))
      })
    }

    const rejectWith = (message: string, stage: string, extra: Record<string, unknown> = {}) => {
      logAdultoDebug(stage, message, extra)
      finish(() => reject(new Error(message)))
    }

    const timeoutId = window.setTimeout(() => {
      rejectWith('Timed out while loading ADULTO script.', 'script_timeout', { timeoutMs: scriptLoadTimeoutMs })
    }, scriptLoadTimeoutMs)

    const clearTimeoutIfSettled = () => {
      if (settled) {
        window.clearTimeout(timeoutId)
      }
    }

    if (existing) {
      const existingState = existing.dataset.adultoState

      if (existingState === 'loaded') {
        resolveWhenReady()
        clearTimeoutIfSettled()
        return
      }

      if (existingState === 'error') {
        rejectWith('Failed to load ADULTO script.', 'existing_script_state_error')
        clearTimeoutIfSettled()
        return
      }

      existing.addEventListener(
        'load',
        () => {
          existing.dataset.adultoState = 'loaded'
          resolveWhenReady()
          clearTimeoutIfSettled()
        },
        { once: true }
      )
      existing.addEventListener(
        'error',
        () => {
          existing.dataset.adultoState = 'error'
          rejectWith('Failed to load ADULTO script.', 'existing_script_onerror')
          clearTimeoutIfSettled()
        },
        { once: true }
      )
      return
    }

    const script = document.createElement('script')
    script.id = scriptId
    script.async = true
    script.dataset.adultoState = 'loading'
    script.src = `https://adulto.cz/embed.js?key=${encodeURIComponent(publicKey)}`
    script.onload = () => {
      script.dataset.adultoState = 'loaded'
      resolveWhenReady()
      clearTimeoutIfSettled()
    }
    script.onerror = () => {
      script.dataset.adultoState = 'error'
      rejectWith('Failed to load ADULTO script.', 'script_onerror')
      clearTimeoutIfSettled()
    }

    document.head.appendChild(script)
  }).catch((error) => {
    adultoScriptPromise = null
    throw error
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
        logAdultoDebug('widget_onerror_callback', error)
        emit('error', message + (error ? ` (${String(error)})` : ''))
      },
    })
  } catch (error) {
    widgetError.value = t('widget_load_failed')
    logAdultoDebug('init_widget_failed', error, { containerId })
    const details = error instanceof Error ? error.message : String(error)
    emit('error', `${widgetError.value} (${details})`)
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
