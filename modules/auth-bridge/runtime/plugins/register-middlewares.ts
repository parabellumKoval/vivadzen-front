import { defineNuxtPlugin } from '#app'
import { addRouteMiddleware, navigateTo } from '#app'

export default defineNuxtPlugin(() => {
  // защищённые страницы
  addRouteMiddleware('auth-bridge-auth', async (to) => {
    const { init, isAuthenticated } = useAuth()
    await init()
    if (!isAuthenticated.value) {
      return navigateTo({ path: '/auth/login', query: { redirect: to.fullPath } })
    }
  })

  // гостевые страницы (login/register)
  addRouteMiddleware('auth-bridge-guest', async () => {
    const { init, isAuthenticated } = useAuth()
    await init()
    if (isAuthenticated.value) return navigateTo('/')
  })
})
