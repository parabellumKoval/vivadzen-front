<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useNotificationsStore } from '~/store/notifications'
// import { useRelativeTime } from '~/composables/useRelativeTime'

const { t, d } = useI18n()
const store = useNotificationsStore()
const { isAuthenticated } = useAuth()
const { formatRelativeTime } = useRelativeTime()

type NotificationDateFields = {
  published_at?: string | null
  created_at?: string | null
}

const formatNotificationRelative = (item?: NotificationDateFields | null) => {
  const value = item?.published_at || item?.created_at
  return formatRelativeTime(value, {
    fallback: (rawValue) => (rawValue ? d(rawValue, 'notification') : ''),
  })
}

const activeTab = ref<'active' | 'archived'>('active')
const isArchivedTab = computed(() => activeTab.value === 'archived')
const activeNotifications = computed(() => store.activeList)
const archivedNotifications = computed(() => store.archivedList)
const notifications = computed(() =>
  isArchivedTab.value ? archivedNotifications.value : activeNotifications.value,
)
const selected = computed(() => store.selected)
const currentEmptyMessage = computed(() =>
  isArchivedTab.value ? t('emptyArchived') : t('emptyActive'),
)
const currentHasMore = computed(() =>
  isArchivedTab.value ? store.archivedHasMore : store.activeHasMore,
)
const currentLoading = computed(() =>
  isArchivedTab.value ? store.archivedLoading : store.loading,
)

const canOpenDetails = (item) => {
  if (!item) return false
  if (item.has_details !== undefined && item.has_details !== null) {
    return Boolean(item.has_details)
  }
  return Boolean(item.body)
}

type NotificationAction = {
  action_url?: string | null
  action_label?: string | null
  [key: string]: any
}

const toActions = (meta: unknown): NotificationAction[] => {
  if (!meta) return []

  if (Array.isArray(meta)) {
    return meta.filter((entry): entry is NotificationAction => !!entry && typeof entry === 'object')
  }

  if (typeof meta === 'object') {
    const record = meta as Record<string, any>

    if (Array.isArray(record.actions)) {
      return record.actions.filter(
        (entry): entry is NotificationAction => !!entry && typeof entry === 'object',
      )
    }

    return [record as NotificationAction]
  }

  return []
}

const selectedActions = computed(() =>
  toActions(selected.value?.meta).filter((action) => Boolean(action.action_url)),
)


const isRead = (item) => {
  if (item.read_at) return true
  return store.guestReadIds?.includes?.(item.id)
}

const handleItemClick = (item) => {
  if (canOpenDetails(item)) {
    store.setSelection(item.id)
  } else if (selected.value) {
    store.setSelection(null)
  }

  store.markAsRead(item.id)
}

const loadMore = () => {
  if (isArchivedTab.value) {
    store.loadMoreArchived().catch(() => {})
  } else {
    store.loadMoreActive().catch(() => {})
  }
}

const handleArchiveToggle = (item) => {
  if (!isAuthenticated.value) {
    return
  }

  store.toggleArchive(item.id, !item.is_archived).catch(() => {})
}

const handleMarkAsUnread = (item) => {
  store.markAsUnread(item.id).catch(() => {})
}

watch(
  () => activeTab.value,
  (tab) => {
    if (tab === 'archived' && !store.archivedItems.length) {
      store.fetchArchived().catch(() => {})
    }
  },
)

const resetSelection = () => {
  store.setSelection(null)
}

const markAll = async () => {
  await store.markAllAsRead()
}

const variantIcon = (variant?: string | null) => {
  switch (variant) {
    case 'success':
      return 'ph:check-circle'
    case 'warning':
      return 'ph:warning-circle'
    case 'error':
      return 'ph:x-circle'
    default:
      return 'ph:info'
  }
}

onMounted(() => {
  if (!store.items.length) {
    store.fetch().catch(() => {})
  }
})
</script>

<style src="./notification-center.scss" lang="scss" scoped />
<i18n src="./lang.yaml" lang="yaml"></i18n>

<template>
  <modal-wrapper
    type="full"
    :can-close="true"
    :no-padding="true"
    class="notification-modal"
  >
    <div class="notification-shell" :class="{ 'show-details': selected }">

      <!-- HEADER STICKY -->
      <div class="notification-list__header">
        
        <div class="heading">
          <h3>{{ t('eyebrow') }}</h3>
        </div>

        <div v-if="!selected" class="notification-list__header-top">

          <div class="notification-list__tabs">
            <button
              type="button"
              class="notification-list__tab"
              :class="{ active: !isArchivedTab }"
              @click="activeTab = 'active'"
            >
              {{ t('tabsActive') }}
            </button>
            <button
              type="button"
              class="notification-list__tab"
              :class="{ active: isArchivedTab }"
              @click="activeTab = 'archived'"
            >
              {{ t('tabsArchived') }}
            </button>
          </div>

          <div class="actions">
            <button @click="markAll" type="button" class="button secondary small markAll-btn">
              <IconCSS name="ph:checks" class="inline-icon"></IconCSS>
              <span>{{ t('markAll') }}</span>
            </button>
          </div>

        </div>
        <div v-else class="notification-details__header">
          <button @click="resetSelection" type="button" class="text-link back">
            <IconCSS name="ph:arrow-left" class="icon-inline"></IconCSS>
            <span>{{ t('back') }}</span>
          </button>
        </div>
      </div>

      <!-- NOTIFICATION LIST -->
      <transition name="fade-in">
        <section v-if="!selected" class="notification-list">

          <div v-if="!notifications.length" class="notification-list__empty">
            <IconCSS name="ph:bell-simple" size="28" class="icon"></IconCSS>
            <p>{{ currentEmptyMessage }}</p>
          </div>

          <div v-else class="notification-list__items">
            <button
              v-for="item in notifications"
              :key="item.id"
              :class="{ 'is-unread': !isRead(item), 'is-active': selected?.id === item.id }"
              class="notification-list__item"
              type="button"
              @click="handleItemClick(item)"
            >
              <span :class="{ 'emoji': item.icon }" class="notification-icon" :data-variant="item.variant">
                <span v-if="item.icon" class="emoji">{{ item.icon }}</span>
                <IconCSS v-else :name="variantIcon(item.variant)" size="24" class="icon"></IconCSS>
              </span>

              <div class="notification-list__content">
                <div class="notification-list__meta">
                  <span v-if="item.is_pinned" class="chip">
                    <IconCSS name="mage:pin" class="icon"></IconCSS>
                    {{ t('pinned') }}
                  </span>
                </div>
                <p class="notification-list__title">
                  {{ item.title || t('untitled') }}
                </p>
                <p class="notification-list__excerpt">
                  {{ item.excerpt || item.body || t('noExcerpt') }}
                
                  <div v-if="canOpenDetails(item)" class="more text-link">
                    <span>еще</span>
                    <IconCSS
                    name="ph:caret-right"
                    class="arrow"
                  ></IconCSS>
                  </div>
                </p>
                <div class="notification-list__date muted">{{ formatNotificationRelative(item) }}</div>
              </div>

              <div class="notification-actions">
                <button
                  v-if="isRead(item)"
                  type="button"
                  class="notification-action-btn"
                  :title="t('markUnread')"
                  @click.stop="handleMarkAsUnread(item)"
                >
                  <IconCSS
                    name="ph:eye"
                    size="18"
                    class="icon"
                  ></IconCSS>
                </button>
                <button
                  v-if="isAuthenticated"
                  type="button"
                  class="notification-action-btn"
                  :title="isArchivedTab ? t('unarchive') : t('archive')"
                  @click.stop="handleArchiveToggle(item)"
                >
                  <IconCSS
                    :name="isArchivedTab ? 'ph:arrow-counter-clockwise' : 'ph:archive-box'"
                    size="18"
                    class="icon"
                  ></IconCSS>
                </button>
              </div>
            </button>
          </div>

          <div v-if="notifications.length && currentHasMore" class="notification-list__load-more">
            <button
              type="button"
              class="button secondary small"
              :disabled="currentLoading"
              @click="loadMore"
            >
              <span v-if="currentLoading">{{ t('loading') }}</span>
              <span v-else>{{ t('loadMore') }}</span>
            </button>
          </div>
        </section>
        <section v-else :class="{ 'is-visible': selected }" class="notification-details">
          <div class="notification-details__inner">
            <div class="notification-details__body">
              <div class="meta">
                <h3>{{ selected?.title }}</h3>
                <p class="muted">{{ d((selected.published_at || selected.created_at), 'notification') }}</p>
              </div>

              <div v-if="selected.excerpt" class="lead">
                {{ selected.excerpt }}
              </div>

              <div v-if="selected.body" v-html="selected.body" class="content"></div>

              <div v-else class="content muted">
                {{ t('noDetails') }}
              </div>
              
              <div v-if="selectedActions.length" class="cta">
                <NuxtLink
                  v-for="(action, index) in selectedActions"
                  :key="index"
                  :to="$regionPath(action.action_url)"
                  class="button small primary cta-link"
                >
                  {{ action.action_label || t('open') }}
                  <IconCSS name="ph:arrow-up-right" class="icon-inline"></IconCSS>
                </NuxtLink>
              </div>
            </div>
          </div>
        </section>
      </transition>
    </div>
  </modal-wrapper>
</template>
