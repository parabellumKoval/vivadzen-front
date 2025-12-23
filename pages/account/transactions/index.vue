<script setup>
const {t} = useI18n()

definePageMeta({
  crumb: {
    name: 'title.account.transactions',
    item: '/account/transactions'
  },
  tab: 'transactions'
});

const props = defineProps({})

const isLoading = ref(false)
const isInitLoading = ref(false)
const meta = ref(null)

const nextPage = computed(() => {
  return meta.value && meta.value.current_page !== meta.value.last_page
})

const {wallet} = useAuth()

const walletData = await wallet()

const list = computed(() => {
  console.log('walletData', walletData, JSON.stringify(walletData.data));
  return walletData.data || []
})

const loadmoreHandler = () => {}
// COMPUTEDS
// METHODS
// HANDLERS
// WATCHERS
</script>

<style src='./referrals.scss' lang='scss' scoped></style>
<style src='./../account-page.scss' lang='scss' scoped></style>
<!-- <i18n src='' lang='yaml'></i18n> -->

<template>
  <div class="account-page">
    <div class="title-secondary">{{ t('title.account.transactions') }}</div>

    <simple-table v-if="isInitLoading || (list?.length && !isInitLoading)">
      <template v-if="!isInitLoading">
        <wallet-ladger-card
          v-for="(item, index) in list"
          :key="item.id"
          :item="item"
          class="order-card"
        >
        </wallet-ladger-card>
      </template>
      <template v-else>
        <referral-card-skeleton
          v-for="(item, index) in 6"
          :key="item"
        >
        </referral-card-skeleton>
      </template>
    </simple-table>
    <div v-else >{{ t('messages.no_results') }}</div>

    <div
      v-if="nextPage || isLoading"
      class="load-more-wrapper"
    >
      <button
        @click="loadmoreHandler"
        :class="{loading: isLoading}"
        class="button secondary"
        type="button"
      >
        <span>{{ $t('btn.load_more') }}</span>
      </button>
    </div>
  </div>
</template>