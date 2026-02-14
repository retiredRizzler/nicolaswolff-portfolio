<template>
  <div>
    <div class="mb-6">
      <UButton
        variant="ghost"
        icon="i-heroicons-arrow-left"
        to="/admin/galleries"
      >
        Back to Galleries
      </UButton>
    </div>

    <div class="max-w-2xl">
      <h1 class="text-3xl font-medium mb-6">Create New Gallery</h1>

      <UCard>
        <UForm :state="formState" :schema="schema" @submit="handleSubmit">
          <div class="space-y-4">
            <UFormField name="title" label="Gallery Title" required>
              <UInput
                v-model="formState.title"
                placeholder="e.g., Wedding Photography - Smith Family"
                :disabled="loading"
              />
            </UFormField>

            <UFormField name="clientName" label="Client Name" required>
              <UInput
                v-model="formState.clientName"
                placeholder="e.g., John Smith"
                :disabled="loading"
              />
            </UFormField>

            <UFormField name="password" label="Gallery Password" required>
              <UInput
                v-model="formState.password"
                type="password"
                placeholder="Set a password for client access"
                :disabled="loading"
              />
              <template #hint>
                <p class="text-xs">
                  This password will be shared with your client to access the gallery
                </p>
              </template>
            </UFormField>

            <UFormField name="expiresAt" label="Expiration Date (Optional)">
              <UInput
                v-model="formState.expiresAt"
                type="datetime-local"
                :disabled="loading"
              />
              <template #hint>
                <p class="text-xs">
                  Leave empty for no expiration
                </p>
              </template>
            </UFormField>

            <UFormField name="maxViews" label="Maximum Views (Optional)">
              <UInput
                v-model.number="formState.maxViews"
                type="number"
                min="1"
                placeholder="e.g., 50"
                :disabled="loading"
              />
              <template #hint>
                <p class="text-xs">
                  Gallery will be disabled after this many views. Leave empty for unlimited.
                </p>
              </template>
            </UFormField>

            <div class="pt-4 flex gap-3">
              <UButton
                type="submit"
                :loading="loading"
                :disabled="loading"
              >
                Create Gallery
              </UButton>
              <UButton
                variant="ghost"
                to="/admin/galleries"
                :disabled="loading"
              >
                Cancel
              </UButton>
            </div>
          </div>
        </UForm>
      </UCard>
    </div>
  </div>
</template>

<script setup lang="ts">
import { z } from 'zod'
import type { GalleryCreateData } from '~/types/admin'

definePageMeta({
  layout: 'admin',
  middleware: 'admin'
})

const schema = z.object({
  title: z.string().min(1, 'Title is required'),
  clientName: z.string().min(1, 'Client name is required'),
  password: z.string().min(4, 'Password must be at least 4 characters'),
  expiresAt: z.string().optional(),
  maxViews: z.number().positive().optional()
})

const formState = reactive<GalleryCreateData>({
  title: '',
  clientName: '',
  password: '',
  expiresAt: undefined,
  maxViews: undefined
})

const loading = ref(false)
const { createGallery } = useAdminApi()

const handleSubmit = async () => {
  loading.value = true
  try {
    // Clean up empty optional fields
    const data: GalleryCreateData = {
      title: formState.title,
      clientName: formState.clientName,
      password: formState.password
    }

    if (formState.expiresAt) {
      data.expiresAt = new Date(formState.expiresAt).toISOString()
      console.log("formattedDate: ",data.expiresAt)
    }

    if (formState.maxViews && formState.maxViews > 0) {
      data.maxViews = formState.maxViews
    }

    const gallery = await createGallery(data)
    console.log('New Gallery successfully created')
    await navigateTo(`/admin/galleries/${gallery.id}`)
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
