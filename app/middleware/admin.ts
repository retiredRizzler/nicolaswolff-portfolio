export default defineNuxtRouteMiddleware(async (to, from) => {
  const { checkAuth } = useAuth()

  const isAuthenticated = await checkAuth()

  if (!isAuthenticated && to.path !== '/admin/login') {
    return navigateTo('/admin/login')
  }

  if (isAuthenticated && to.path === '/admin/login') {
    return navigateTo('/admin/galleries')
  }
})
