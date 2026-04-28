export default defineNuxtPlugin(() => {
let loadPromise: Promise<void> | null = null

const PACKETA_WIDGET_SOURCES = [
  'https://widget.packeta.com/v6/www/js/library.js',
  'https://backup.widget.packeta.com/v6/www/js/library.js',
  'https://widget.packeta.com/www/js/library.js',
]

const PACKETA_LOAD_TIMEOUT_MS = 10000

function loadScript(src: string): Promise<void> {
  const w = window as any

  if (w.Packeta?.Widget) {
    return Promise.resolve()
  }

  const existing = document.querySelector<HTMLScriptElement>(`script[src="${src}"]`)

  return new Promise((resolve, reject) => {
    const script = existing || document.createElement('script')
    const managed = !existing
    let settled = false

    const cleanup = () => {
      script.removeEventListener('load', onLoad)
      script.removeEventListener('error', onError)
      window.clearTimeout(timeoutId)
    }

    const fail = (message: string) => {
      if (settled) return
      settled = true
      cleanup()
      script.dataset.packetaStatus = 'error'

      if (managed) {
        script.remove()
      }

      reject(new Error(message))
    }

    const onLoad = () => {
      if (settled) return

      if (!w.Packeta?.Widget) {
        fail(`Packeta widget loaded without Packeta.Widget: ${src}`)
        return
      }

      settled = true
      cleanup()
      script.dataset.packetaStatus = 'loaded'
      resolve()
    }

    const onError = () => {
      fail(`Failed to load Packeta Widget from ${src}`)
    }

    const timeoutId = window.setTimeout(() => {
      fail(`Timed out while loading Packeta Widget from ${src}`)
    }, PACKETA_LOAD_TIMEOUT_MS)

    if (script.dataset.packetaStatus === 'loaded') {
      window.clearTimeout(timeoutId)
      resolve()
      return
    }

    if (script.dataset.packetaStatus === 'error') {
      window.clearTimeout(timeoutId)
      reject(new Error(`Failed to load Packeta Widget from ${src}`))
      return
    }

    script.addEventListener('load', onLoad, { once: true })
    script.addEventListener('error', onError, { once: true })

    if (managed) {
      script.src = src
      script.async = true
      script.crossOrigin = 'anonymous'
      script.dataset.packetaStatus = 'loading'
      document.head.appendChild(script)
    }
  })
}


function loadPacketaWidget(): Promise<void> {
  if (typeof window === 'undefined') return Promise.resolve()
  const w = window as any

  if (w.Packeta?.Widget) return Promise.resolve()
  if (loadPromise) return loadPromise

  loadPromise = (async () => {
    const errors: string[] = []

    for (const src of PACKETA_WIDGET_SOURCES) {
      try {
        await loadScript(src)

        if (w.Packeta?.Widget) {
          return
        }

        errors.push(`Packeta.Widget missing after loading ${src}`)
      } catch (error) {
        errors.push(error instanceof Error ? error.message : String(error))
      }
    }

    throw new Error(`Failed to load Packeta Widget. ${errors.join(' | ')}`)
  })().catch((error) => {
    loadPromise = null
    throw error
  })

  return loadPromise
}


return {
  provide: {
    packetaLoad: loadPacketaWidget
  }
}
})
