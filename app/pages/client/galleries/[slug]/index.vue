<template>
  <div class="min-h-screen flex items-center justify-center bg-[#f4f4f4] px-4">
    <div class="w-full max-w-md">
      <div class="text-center mb-8">
        <h1 class="text-3xl font-medium text-[#201d1d] mb-2">Client Gallery</h1>
        <p v-if="gallery" class="text-[#201d1d]/80 text-lg mb-1">{{ gallery.title }}</p>
        <p v-if="gallery" class="text-[#201d1d]/60">for {{ gallery.clientName }}</p>
      </div>

      <UCard v-if="loading" class="text-center py-8">
        <div class="flex justify-center">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-[#201d1d]"></div>
        </div>
        <p class="text-[#201d1d]/60 mt-4">Loading gallery...</p>
      </UCard>

      <UCard v-else>
        <template #header>
          <h2 class="text-lg font-medium text-[#201d1d]">Enter Password</h2>
        </template>

        <UForm :state="formState" :schema="schema" @submit="handleSubmit">
          <div class="space-y-4">
            <UFormField name="password" label="Gallery Password">
              <UInput
                v-model="formState.password"
                type="password"
                placeholder="Enter the password provided by your photographer"
                :disabled="submitting"
                autofocus
              />
            </UFormField>

            <UButton
              type="submit"
              block
              :loading="submitting"
              :disabled="submitting"
            >
              View Gallery
            </UButton>
          </div>
        </UForm>
      </UCard>

      <p class="text-center text-sm text-[#201d1d]/50 mt-6">
        Nicolas Wolff Photography
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { z } from 'zod'
import type { ClientGallery } from '~/types/admin'

definePageMeta({
  layout: false
})

const route = useRoute()
const slug = computed(() => route.params.slug as string)

const schema = z.object({
  password: z.string().min(1, 'Password is required')
})

const formState = reactive({
  password: ''
})

const loading = ref(true)
const submitting = ref(false)
const gallery = ref<ClientGallery | null>(null)

const { authenticateGallery, getGalleryMetadata } = useClientGallery()

const loadGallery = async () => {
  loading.value = true
  try {
    gallery.value = await getGalleryMetadata(slug.value)
  } catch (error) {
    // Error already handled
  } finally {
    loading.value = false
  }
}

const handleSubmit = async () => {
  submitting.value = true
  try {
    const success = await authenticateGallery(slug.value, formState.password)
    if (success) {
      await navigateTo(`/client/galleries/${slug.value}/view`)
    }
  } catch (error) {
    // Error already handled
  } finally {
    submitting.value = false
  }
}

onMounted(() => {
  loadGallery()
})
</script>

<style scoped>
* {
  font-family: 'PP Neue Montreal', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
}
</style>
