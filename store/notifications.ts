type NotificationPayload = {
  id: number
  event_key?: string | null
  kind?: string | null
  target_type?: string
  audience?: string
  variant?: string
  icon?: string | null
  is_pinned?: boolean
  title?: string | null
  title_translations?: Record<string, string>
  excerpt?: string | null
  excerpt_translations?: Record<string, string>
  body?: string | null
  body_translations?: Record<string, string>
  meta?: Record<string, any> | Record<string, any>[] | null
  has_details?: boolean
  read_at?: string | null
  published_at?: string | null
  created_at?: string | null
}

type NotyVariant = 'primary' | 'error' | 'warning' | 'success' | null

let audioContext: AudioContext | null = null

const playBeep = () => {
  if (!process.client) {
    return
  }

  const AudioCtor = window.AudioContext || (window as any).webkitAudioContext
  if (!AudioCtor) {
    return
  }

  if (!audioContext) {
    audioContext = new AudioCtor()
  }

  const context = audioContext

  if (context.state === 'suspended') {
    context.resume().catch(() => {})
  }

  const oscillator = context.createOscillator()
  const gain = context.createGain()

  oscillator.type = 'sine'
  oscillator.frequency.value = 880
  gain.gain.value = 0.04

  oscillator.connect(gain)
  gain.connect(context.destination)
  oscillator.start()
  oscillator.stop(context.currentTime + 0.08)
}

const sortNotifications = (items: NotificationPayload[]) => {
  return [...items].sort((a, b) => {
    const pinnedA = a.is_pinned ? 1 : 0
    const pinnedB = b.is_pinned ? 1 : 0

    if (pinnedA !== pinnedB) {
      return pinnedB - pinnedA
    }

    const dateA = new Date(a.published_at || a.created_at || 0).getTime()
    const dateB = new Date(b.published_at || b.created_at || 0).getTime()

    return dateB - dateA
  })
}

export const useNotificationsStore = defineStore('notifications', {
  persist: {
    key: 'notifications',
    paths: ['guestReadIds'],
  },
  state: () => ({
    items: [] as NotificationPayload[],
    archivedItems: [] as NotificationPayload[],
    selectedId: null as number | null,
    loading: false,
    archivedLoading: false,
    lastFetchedAt: null as string | null,
    archivedLastFetchedAt: null as string | null,
    activePage: 0,
    archivedPage: 0,
    activeHasMore: true,
    archivedHasMore: true,
    perPage: 20,
    guestReadIds: [] as number[],
    pollingTimer: null as ReturnType<typeof setInterval> | null,
  }),
  getters: {
    list: (state) => sortNotifications(state.items),
    activeList: (state) => sortNotifications(state.items),
    archivedList: (state) => sortNotifications(state.archivedItems),
    selected: (state) =>
      [...state.items, ...state.archivedItems].find((item) => item.id === state.selectedId) || null,
    activeHasMore: (state) => state.activeHasMore,
    archivedHasMore: (state) => state.archivedHasMore,
    unreadCount: (state) => {
      return state.items.filter((item) => {
        const alreadyRead = !!item.read_at || state.guestReadIds.includes(item.id)
        return !alreadyRead
      }).length
    },
  },
  actions: {
    normalize(payload: NotificationPayload): NotificationPayload {
      return {
        ...payload,
        meta: payload.meta ?? null,
        is_pinned: Boolean(payload.is_pinned),
        is_archived: Boolean(payload.is_archived),
        has_details: payload.has_details ?? !!payload.body,
        read_at: payload.read_at || null,
      }
    },

    notify(notification: NotificationPayload) {
      if (!process.client) {
        return
      }

      if (notification.read_at) {
        return
      }

      const title = notification.title || ''
      const content = notification.excerpt || notification.body || ''

      if (!title && !content) {
        return
      }

      const variant = notification.variant || 'info'
      const map: Record<string, NotyVariant> = {
        success: 'success',
        error: 'error',
        warning: 'warning',
        info: 'primary',
      }

      useNoty().setNoty({
        title,
        content,
        type: map[variant] || 'primary',
      })

      playBeep()
    },

    setSelection(id: number | null) {
      this.selectedId = id
    },

    mergeNotifications(targetKey: 'items' | 'archivedItems', notifications: NotificationPayload[]) {
      const map = new Map<number, NotificationPayload>()

      this[targetKey].forEach((item) => map.set(item.id, item))
      notifications.forEach((item) => {
        const normalized = this.normalize(item)
        const current = map.get(normalized.id) || {}
        map.set(normalized.id, { ...current, ...normalized })
      })

      this[targetKey] = sortNotifications(Array.from(map.values()))
    },

    removeNotificationFromList(targetKey: 'items' | 'archivedItems', id: number) {
      const index = this[targetKey].findIndex((item) => item.id === id)
      if (index !== -1) {
        this[targetKey].splice(index, 1)
      }
    },

    updateNotificationInList(
      targetKey: 'items' | 'archivedItems',
      id: number,
      patch: Partial<NotificationPayload>,
    ): boolean {
      const index = this[targetKey].findIndex((item) => item.id === id)
      if (index === -1) {
        return false
      }

      this[targetKey][index] = { ...this[targetKey][index], ...patch }
      return true
    },

    storeNotification(notification: NotificationPayload) {
      if (notification.is_archived) {
        this.removeNotificationFromList('items', notification.id)
        this.mergeNotifications('archivedItems', [notification])
      } else {
        this.removeNotificationFromList('archivedItems', notification.id)
        this.mergeNotifications('items', [notification])
      }
    },

    upsert(notification: NotificationPayload) {
      const normalized = this.normalize(notification)
      this.storeNotification(normalized)
    },

    setMany(notifications: NotificationPayload[]) {
      this.mergeNotifications('items', notifications)
    },

    setArchivedMany(notifications: NotificationPayload[]) {
      this.mergeNotifications('archivedItems', notifications)
    },

    async fetch(params: Record<string, any> = {}, options: { notifyNew?: boolean } = {}) {
      return this.fetchTab('active', { params, options })
    },

    async fetchArchived(params: Record<string, any> = {}, options: Record<string, any> = {}) {
      return this.fetchTab('archived', { params, options })
    },

    async fetchTab(
      tab: 'active' | 'archived',
      {
        params = {},
        options = {},
        append = false,
      }: {
        params?: Record<string, any>
        options?: { notifyNew?: boolean }
        append?: boolean
      } = {},
    ) {
      const isArchivedTab = tab === 'archived'
      const loadingKey = isArchivedTab ? 'archivedLoading' : 'loading'
      const pageKey = isArchivedTab ? 'archivedPage' : 'activePage'
      const hasMoreKey = isArchivedTab ? 'archivedHasMore' : 'activeHasMore'
      const lastFetchedKey = isArchivedTab ? 'archivedLastFetchedAt' : 'lastFetchedAt'
      const currentPage = append ? this[pageKey] + 1 : 1
      const perPage = params.per_page ?? this.perPage
      const existingIds = new Set(
        (isArchivedTab ? this.archivedItems : this.items).map((item) => item.id),
      )

      this[loadingKey] = true
      const { $api } = useNuxtApp()

      try {
        const response = await $api('/notifications', {
          query: {
            per_page: perPage,
            page: currentPage,
            archived: isArchivedTab,
            ...params,
          },
        })

        const list = Array.isArray(response?.data) ? response.data : response

        if (Array.isArray(list)) {
          if (isArchivedTab) {
            this.setArchivedMany(list as NotificationPayload[])
          } else {
            this.setMany(list as NotificationPayload[])
          }
          this[lastFetchedKey] = new Date().toISOString()

          if (!isArchivedTab && options.notifyNew) {
            const fresh = (list as NotificationPayload[]).filter(
              (item) => !existingIds.has(item.id),
            )
            fresh.forEach((item) => this.notify(item))
          }
        }

        const meta = response?.meta
        const metaCurrentPage = meta?.current_page ?? currentPage
        const metaLastPage = meta?.last_page
        const resultLength = Array.isArray(list) ? list.length : 0
        const hasMore =
          typeof metaLastPage === 'number'
            ? metaCurrentPage < metaLastPage
            : resultLength >= perPage

        this[hasMoreKey] = hasMore
        this[pageKey] = currentPage
      } catch (error) {
        // Ignore server/network errors to keep UI stable.
      } finally {
        this[loadingKey] = false
      }
    },

    async loadMoreActive() {
      if (this.loading || !this.activeHasMore) {
        return
      }

      await this.fetchTab('active', { append: true }).catch(() => {})
    },

    async loadMoreArchived() {
      if (this.archivedLoading || !this.archivedHasMore) {
        return
      }

      await this.fetchTab('archived', { append: true }).catch(() => {})
    },

    async toggleArchive(id: number, archived: boolean) {
      const { isAuthenticated } = useAuth()
      if (!isAuthenticated.value) {
        return
      }

      const { $api } = useNuxtApp()

      try {
        const response = await $api(`/notifications/${id}/archive`, {
          method: 'POST',
          body: {
            archived,
          },
        })

        const payload = response?.data ?? response
        if (payload) {
          this.storeNotification(payload as NotificationPayload)
        }
      } catch (error) {
        // ignore for now
      }
    },

    async markAsRead(id: number) {
      const { isAuthenticated } = useAuth()
      const { $api } = useNuxtApp()

      if (isAuthenticated.value) {
        try {
          await $api(`/notifications/${id}/read`, { method: 'POST' })
        } catch (error) {
          // silently ignore network issues, UI will retry on next fetch
        }
      } else if (!this.guestReadIds.includes(id)) {
        this.guestReadIds.push(id)
      }

      const now = new Date().toISOString()
      if (!this.updateNotificationInList('items', id, { read_at: now })) {
        this.updateNotificationInList('archivedItems', id, { read_at: now })
      }
    },

    async markAsUnread(id: number) {
      const { isAuthenticated } = useAuth()
      const { $api } = useNuxtApp()

      if (isAuthenticated.value) {
        try {
          await $api(`/notifications/${id}/unread`, { method: 'POST' })
        } catch (error) {
          // silently ignore network issues, UI will retry on next fetch
        }
      }

      // Remove from guest read list
      const index = this.guestReadIds.indexOf(id)
      if (index !== -1) {
        this.guestReadIds.splice(index, 1)
      }

      // Mark as unread by setting read_at to null
      if (!this.updateNotificationInList('items', id, { read_at: null })) {
        this.updateNotificationInList('archivedItems', id, { read_at: null })
      }
    },

    async markAllAsRead() {
      const { isAuthenticated } = useAuth()
      const { $api } = useNuxtApp()

      if (isAuthenticated.value) {
        try {
          await $api('/notifications/mark-all/read', { method: 'POST' })
        } catch (error) {
          // ignore errors, keep state as-is
        }
      }

      const now = new Date().toISOString()
      this.items = this.items.map((item) => ({ ...item, read_at: now }))
      this.archivedItems = this.archivedItems.map((item) => ({ ...item, read_at: now }))
      this.guestReadIds = [
        ...new Set([
          ...this.guestReadIds,
          ...this.items.map((item) => item.id),
          ...this.archivedItems.map((item) => item.id),
        ]),
      ]
    },

    startPolling(intervalMs = 60000) {
      if (!process.client || this.pollingTimer || intervalMs <= 0) {
        return
      }

      this.fetch({}, { notifyNew: false }).catch(() => {})

      this.pollingTimer = setInterval(() => {
        this.fetch({ unread: true }, { notifyNew: true }).catch(() => {})
      }, intervalMs)
    },

    stopPolling() {
      if (this.pollingTimer) {
        clearInterval(this.pollingTimer)
        this.pollingTimer = null
      }
    },
  },
})
