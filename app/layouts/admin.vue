<template>
  <div class="min-h-screen bg-muted">
    <header class="bg-default shadow-sm border-b border-muted">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <div>
            <NuxtLink to="/admin/galleries" class="text-xl font-medium text-highlighted">
              Nicolas Wolff Admin
            </NuxtLink>
          </div>
          <div class="flex items-center gap-4">
            <span class="text-sm text-muted">{{ adminUser?.email }}</span>

            <!-- Color Mode Toggle -->
            <ClientOnly>
              <UButton
                :icon="isDark ? 'i-heroicons-moon' : 'i-heroicons-sun'"
                color="neutral"
                variant="ghost"
                :aria-label="`Switch to ${isDark ? 'light' : 'dark'} mode`"
                @click="isDark = !isDark"
              />
              <template #fallback>
                <div class="size-8" />
              </template>
            </ClientOnly>

            <UButton
              variant="ghost"
              @click="handleLogout"
              :loading="loggingOut"
            >
              Logout
            </UButton>
          </div>
        </div>
      </div>
    </header>

    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <slot />
    </main>

    <footer class="border-t border-default mt-auto">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <p class="text-center text-sm text-dimmed">
          © {{ new Date().getFullYear() }} Nicolas Wolff Photography
        </p>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
const { adminUser, logout } = useAuth()
const loggingOut = ref(false)
const colorMode = useColorMode()

// Dark mode toggle
const isDark = computed({
  get() {
    return colorMode.value === 'dark'
  },
  set(_isDark) {
    colorMode.preference = _isDark ? 'dark' : 'light'
  }
})

const handleLogout = async () => {
  loggingOut.value = true
  try {
    await logout()
    await navigateTo('/admin/login')
  } catch (error) {
    // Error already handled
  } finally {
    loggingOut.value = false
  }
}
</script>
