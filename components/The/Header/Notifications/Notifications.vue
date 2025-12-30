<script setup>
import { useNotificationsStore } from '~/store/notifications'

const { t } = useI18n()
const store = useNotificationsStore()

const unread = computed(() => store.unreadCount)

const openNotifications = async (event) => {
  if (!store.items.length) {
    await store.fetch().catch(() => {})
  }

  const component = defineAsyncComponent(() => import('~/components/Modal/Notifications/NotificationCenter.client.vue'))

  // event.target.closest('[modalable]')
  useModal().open(component, null, event.target.closest('[modalable]'), {
    x: { right: 10 },
    align: { y: 'top'},
    margin: { y: 60 },
    width: { min: 550, max: 550 },
    // height: { min: 'calc(100vh - 120px)', max: 'calc(100vh - 120px)' },
    height: {max: 'min-content', max: 'min-content'},
    closeOnBackdrop: true,
  })
}

</script>

<style src="./notifications.scss" lang="scss" scoped />
<!-- <i18n src="./lang.yaml" lang="yaml"></i18n> -->

<template>
  <button @click="openNotifications" class="header-btn notifications-btn" type="button" modalable clickable>
    <div class="notifications-inner">
      <IconCSS name="ci:bell" class="icon"></IconCSS>
      <span v-if="unread" class="badge">
        {{ unread > 99 ? '99+' : unread }}
      </span>
    </div>
  </button>
</template>
