// app/middleware/auth.ts
import { useUserSession } from '#imports'

export default defineNuxtRouteMiddleware(() => {
  const { loggedIn } = useUserSession()

  // If the user is NOT logged in, kick them out to the login page URL
  if (!loggedIn.value) {
    return navigateTo('/login')
  }
})