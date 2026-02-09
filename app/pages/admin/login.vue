<template>
  <div class="min-h-screen flex items-center justify-center bg-muted px-4">
    <div class="w-full max-w-md">
      <div class="text-center mb-8">
        <h1 class="text-3xl font-medium text-highlighted mb-2">Admin Login</h1>
        <p class="text-muted">Sign in to manage client galleries</p>
      </div>

      <UCard>
        <UForm :state="formState" :schema="schema" @submit="handleSubmit">
          <div class="space-y-4">
            <UFormField name="email" label="Email">
              <UInput
                v-model="formState.email"
                type="email"
                placeholder="admin@example.com"
                :disabled="loading"
              />
            </UFormField>

            <UFormField name="password" label="Password">
              <UInput
                v-model="formState.password"
                type="password"
                placeholder="Enter your password"
                :disabled="loading"
              />
            </UFormField>

            <UButton
              type="submit"
              block
              :loading="loading"
              :disabled="loading"
            >
              Sign In
            </UButton>
          </div>
        </UForm>
      </UCard>

      <p class="text-center text-sm text-dimmed mt-6">
        Nicolas Wolff Photography Admin Portal
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { z } from 'zod'
import type { LoginCredentials } from '~/types/admin'

definePageMeta({
  layout: false,
  middleware: 'admin'
})

const schema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required')
})

const formState = reactive<LoginCredentials>({
  email: '',
  password: ''
})

const loading = ref(false)
const { login } = useAdminApi()
const { checkAuth } = useAuth()

const handleSubmit = async () => {
  loading.value = true
  try {
    await login(formState)
    await checkAuth()
    await navigateTo('/admin/galleries')
  } catch (error) {
    // Error already handled by useAdminApi
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
* {
  font-family: 'PP Neue Montreal', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
}
</style>
