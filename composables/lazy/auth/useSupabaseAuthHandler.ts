
import { useAuthStore } from '~~/store/auth';
import { useAppPersistStore } from '~/store/appPersist';

export default async () => {
  // const { t } = useI18n({useScope: 'global'})
  const { useSupabaseClientLazy } = await import('./useSupabase')
  const supabase = useSupabaseClientLazy()
  const { auth } = supabase

  console.log('Supabase base')
  auth.onAuthStateChange((event, session) => {
    const authStore = useAuthStore()
    const noty = useNoty()
    const persist = useAppPersistStore()

    console.log('Supabase', event, session)
    if (event === 'SIGNED_OUT') {
      // noty.setNoty({ content: t('noty.auth.logout') })
      authStore.user = null
    } else if (event === 'SIGNED_IN' || event === 'INITIAL_SESSION') {
      if (session?.user) {
        authStore.user = session.user
        if (persist.from === 'login') {
          // noty.setNoty({ content: t('noty.auth.login.success') })
          persist.setFrom(null)
        }
      }
    }
  })
}