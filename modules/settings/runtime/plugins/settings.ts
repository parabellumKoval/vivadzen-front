export default defineNuxtPlugin((nuxtApp) => {
  const state = useState<Record<string, any>>('settings', () => ({}))

  if (process.server) {
    const ev = useRequestEvent()
    // @ts-ignore
    state.value = (ev?.context?.settings as Record<string, any>) || {}
  }

  const getSetting = (key: string, def?: any) => {
    const root: any = state.value
    // 1) Плоский ключ целиком
    if (root && Object.prototype.hasOwnProperty.call(root, key)) {
      return root[key]
    }
    // 2) Вложенная навигация по точкам
    const parts = key.split('.')
    let cur: any = root
    for (const p of parts) {
      if (cur && Object.prototype.hasOwnProperty.call(cur, p)) {
        cur = cur[p]
      } else {
        return def
      }
    }
    return cur
  }

  return {
    provide: {
      settings: state,
      getSetting,
    }
  }
})
