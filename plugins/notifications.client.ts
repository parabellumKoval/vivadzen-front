import Echo from 'laravel-echo'
import Pusher from 'pusher-js'
import { useNotificationsStore } from '~/store/notifications'

export default defineNuxtPlugin(() => {
  const store = useNotificationsStore()
  const { isAuthenticated, user, token } = useAuth()
  const runtime = useRuntimeConfig()
  const notificationsCfg = runtime.public.notifications || {}
  const driver = String(notificationsCfg?.driver || 'pusher').toLowerCase()
  const pollingInterval = notificationsCfg?.pollingIntervalMs ?? 5000
  const isDisabled = ['disabled', 'off', 'none', 'false', '0'].includes(driver)

  let echo: Echo | null = null

  const handleIncoming = (payload: any) => {
    if (!payload || typeof payload !== 'object' || !payload.id) {
      return
    }

    store.upsert(payload)
    store.notify(payload)
  }

  const disconnect = () => {
    if (echo) {
      echo.disconnect()
      echo = null
    }
  }

  const subscribe = () => {
    if (!echo) return

    echo.channel('notifications.public').listen('.notification.created', handleIncoming)

    if (isAuthenticated.value && user.value?.id) {
      echo.private('notifications.auth').listen('.notification.created', handleIncoming)
      echo.private(`notifications.user.${user.value.id}`).listen('.notification.created', handleIncoming)
    }
  }

  const connect = () => {
    if (isDisabled) {
      return
    }

    const pusherKey = notificationsCfg?.pusher?.key

    if (driver === 'polling' || !pusherKey) {
      store.startPolling(pollingInterval)
      return
    }

    const scheme = (notificationsCfg?.pusher?.scheme || 'https').toLowerCase()
    const wsHost = notificationsCfg?.pusher?.host || window.location.hostname
    const wsPort = notificationsCfg?.pusher?.port
      ? Number(notificationsCfg.pusher.port)
      : scheme === 'https'
        ? 443
        : 6001

    const headers: Record<string, string> = {
      Accept: 'application/json',
    }

    if (token.value) {
      headers.Authorization = `Bearer ${token.value}`
    }

    ;(window as any).Pusher = Pusher

    echo = new Echo({
      broadcaster: 'pusher',
      key: pusherKey,
      cluster: notificationsCfg?.pusher?.cluster,
      wsHost,
      wsPort,
      wssPort: wsPort,
      forceTLS: scheme === 'https',
      disableStats: true,
      enabledTransports: ['ws', 'wss'],
      authEndpoint: `${runtime.public.serverBase}/broadcasting/auth`,
      auth: {
        headers,
      },
    })

    subscribe()

    store.startPolling(pollingInterval)
  }

  watch(
    () => [isAuthenticated.value, user.value?.id],
    () => {
      disconnect()
      store.fetch().catch(() => {})
      connect()
    },
    { immediate: true }
  )
})
