import { useLoginMock } from '~/composables/mockups/useLoginMock';

export const useAuthStore = defineStore('authStore', () => {
  const client = shallowRef(null)
  const user = ref(null as Object | null)

  const loginForm =  ref({...useLoginMock()} as LoginForm)
  const userState = ref(null as Object | null)
  const authState = ref(false)
  const redirectToState = ref('/account/order-history')

  const resetUser = () => {
    authState.value = false
    userState.value = null
  }

  const setUserFromSession = (supauser) => {
    if(!supauser)
      return
    
    authState.value = true

    userState.value = {
      id: supauser.id,
      email: supauser.email,
      fullname: supauser.user_metadata.full_name,
      photo: supauser.user_metadata.avatar_url,
      phone: supauser.user_metadata.phone,
      firstname: supauser.user_metadata.firstname,
      lastname: supauser.user_metadata.lastname
    }
  }
    
  const resetLoginForm = () => {
    loginForm.value = {...useLoginMock()}
  }

  const setProfileData = (data: Profile) => {
    Object.keys(data).forEach((k) => data[k] == null && delete data[k]);

    user.value = {
      ...user.value,
      ...data
    }
  }

  const init = async () => {
    if (client.value) return

    const config = useRuntimeConfig()
    const { createClient } = await import('@supabase/supabase-js') // 👈 ленивый импорт
    const supabase = createClient(config.public.supabaseUrl, config.public.supabaseKey)
    client.value = supabase

    const { data, error } = await supabase.auth.getUser()
    if (!error) user.value = data.user
  }
  

  const getClient = async () => {
    if (!client.value) await init()
    return client.value
  }


  const oAuth = async (provider: 'google' | 'facebook', redirectTo: String = '/') => {
    const runtimeConfig = useRuntimeConfig()
    const supabase = await getClient()

    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: provider,
      options: {
        redirectTo: `${runtimeConfig.public.frontendUrl}${redirectTo}`
      }
    })
  }


  const logout = async () =>  {
    const supabase = await getClient()

    return await supabase.auth.signOut().then(() => {
      resetUser()
    })
  }



  const login = async (data: Object) => {
    const supabase = await getClient()
    
    return await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    })
  }

  const register = async(data: Object) => {
    const runtimeConfig = useRuntimeConfig()
    const supabase = await getClient()
    
    return await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        emailRedirectTo: `${runtimeConfig.public.frontendUrl}/auth/email/confirmed`
      }
    })
  }

  const update = async (newData: Object, redirect: String = '/') => {
    const supabase = await getClient()

    return await supabase.auth.updateUser({
      ...newData
    }, {
      redirectTo: redirect
    })
  }

  const sendPasswordResetLink = async (email: string, redirect: String = '/auth/password/change') => {
    const supabase = await getClient()

    return await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${useRuntimeConfig().public.frontendUrl}${redirect}`,
    })
  }

  return {
    oAuth,
    logout,
    login,
    register,
    update,
    sendPasswordResetLink,
    setProfileData,
    resetLoginForm,
    setUserFromSession,
    resetUser
  }
})