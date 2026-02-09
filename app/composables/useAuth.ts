import type { AdminUser } from '~/types/admin'

export const useAuth = () => {
  const adminUser = useState<AdminUser | null>('adminUser', () => null)

  const isAuthenticated = computed(() => adminUser.value !== null)

  const checkAuth = async (): Promise<boolean> => {
    try {
      const data = await $fetch<{ user: AdminUser }>('/api/admin/auth/me', {
        method: 'GET'
      })
      adminUser.value = data.user
      return true
    } catch (error) {
      adminUser.value = null
      return false
    }
  }

  const logout = async (): Promise<void> => {
    try {
      await $fetch('/api/admin/auth/logout', {
        method: 'POST'
      })
    } catch (error) {
      // Ignore errors during logout
    } finally {
      adminUser.value = null
    }
  }

  return {
    adminUser: readonly(adminUser),
    isAuthenticated,
    checkAuth,
    logout
  }
}
