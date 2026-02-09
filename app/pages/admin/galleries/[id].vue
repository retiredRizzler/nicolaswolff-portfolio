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

    <div v-if="loading" class="text-center py-12">
      <div class="flex justify-center">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2"></div>
      </div>
      <p class="mt-4">Loading gallery...</p>
    </div>

    <div v-else-if="gallery" class="space-y-8">
      <!-- Gallery Details Section -->
      <div class="max-w-2xl">
        <h1 class="text-3xl font-medium mb-6">Edit Gallery</h1>

        <UCard>
          <template #header>
            <h2 class="text-lg font-medium text-white">Gallery Details</h2>
          </template>

          <UForm :state="formState" :schema="schema" @submit="handleUpdateGallery">
            <div class="space-y-4">
              <UFormField name="title" label="Gallery Title">
                <UInput
                  v-model="formState.title"
                  :disabled="updating"
                />
              </UFormField>

              <UFormField name="clientName" label="Client Name">
                <UInput
                  v-model="formState.clientName"
                  :disabled="updating"
                />
              </UFormField>

              <UFormField name="expiresAt" label="Expiration Date">
                <UInput
                  v-model="formState.expiresAt"
                  type="datetime-local"
                  :disabled="updating"
                />
              </UFormField>

              <UFormField name="maxViews" label="Maximum Views">
                <UInput
                  v-model.number="formState.maxViews"
                  type="number"
                  min="1"
                  :disabled="updating"
                />
              </UFormField>

              <div class="pt-4">
                <UButton
                  type="submit"
                  :loading="updating"
                  :disabled="updating"
                >
                  Save Changes
                </UButton>
              </div>
            </div>
          </UForm>
        </UCard>

        <!-- Gallery Info -->
        <div class="mt-4 grid grid-cols-2 gap-4">
          <UCard>
            <div class="text-sm">
              <p class="mb-1">Gallery Link</p>
              <code class="text-xs px-2 py-1 rounded block">
                /client/galleries/{{ gallery.slug }}
              </code>
            </div>
          </UCard>
          <UCard>
            <div class="text-sm">
              <p class="mb-1">View Count</p>
              <p class="text-lg font-medium">{{ gallery.viewCount }}</p>
            </div>
          </UCard>
        </div>
      </div>

      <!-- Image Management Section -->
      <div>
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-2xl font-medium">Images ({{ gallery.images.length }})</h2>
          <UButton
            icon="i-heroicons-photo"
            @click="triggerFileInput"
            :loading="uploading"
            :disabled="uploading"
          >
            Upload Images
          </UButton>
        </div>

        <input
          ref="fileInput"
          type="file"
          multiple
          accept="image/*"
          class="hidden"
          @change="handleFileSelect"
        />

        <!-- Empty State -->
        <UCard v-if="gallery.images.length === 0" class="text-center py-12">
          <div class="mb-4">
            <svg class="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <p class="mb-4">No images uploaded yet</p>
          <UButton variant="soft" @click="triggerFileInput">
            Upload Your First Images
          </UButton>
        </UCard>

        <!-- Image Grid -->
        <div v-else class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          <div
            v-for="image in sortedImages"
            :key="image.id"
            class="relative group"
          >
            <div class="aspect-square rounded-lg overflow-hidden">
              <img
                :src="image.thumbnailUrl"
                :alt="image.caption || 'Gallery image'"
                class="w-full h-full object-cover"
              />
            </div>

            <!-- Image Actions Overlay -->
            <div class="absolute inset-0  opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center gap-2">
              <UButton
                size="sm"
                variant="solid"
                icon="i-heroicons-pencil"
                @click="editImage(image)"
              />
              <UButton
                size="sm"
                variant="solid"
                color="error"
                icon="i-heroicons-trash"
                @click="confirmDeleteImage(image)"
              />
            </div>

            <!-- Caption -->
            <p v-if="image.caption" class="text-xs  mt-1 truncate">
              {{ image.caption }}
            </p>
            <p class="text-xs mt-1">
              Order: {{ image.displayOrder }}
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Edit Image Modal -->
    <UModal
      v-model:open="editModal.open"
      title="Edit Image"
      description="Update the caption and display order for this image."
    >
      <template #body>
        <div class="space-y-4">
          <div class="aspect-video rounded-lg overflow-hidden">
            <img
              :src="editModal.image?.url"
              :alt="editModal.image?.caption || 'Gallery image'"
              class="w-full h-full object-contain"
            />
          </div>

          <UFormField label="Caption">
            <UInput
              v-model="editModal.caption"
              placeholder="Add a caption..."
              :disabled="editModal.loading"
            />
          </UFormField>

          <UFormField label="Display Order">
            <UInput
              v-model.number="editModal.displayOrder"
              type="number"
              min="0"
              :disabled="editModal.loading"
            />
          </UFormField>
        </div>
      </template>

      <template #footer>
        <div class="flex justify-end gap-2">
          <UButton variant="ghost" @click="editModal.open = false">
            Cancel
          </UButton>
          <UButton
            :loading="editModal.loading"
            @click="handleUpdateImage"
          >
            Save Changes
          </UButton>
        </div>
      </template>
    </UModal>

    <!-- Delete Image Modal -->
    <UModal
      v-model:open="deleteImageModal.open"
      title="Delete Image"
      description="This action cannot be undone."
    >
      <template #body>
        <p>
          Are you sure you want to delete this image? This action cannot be undone.
        </p>
      </template>

      <template #footer>
        <div class="flex justify-end gap-2">
          <UButton variant="ghost" @click="deleteImageModal.open = false">
            Cancel
          </UButton>
          <UButton
            color="error"
            :loading="deleteImageModal.loading"
            @click="handleDeleteImage"
          >
            Delete Image
          </UButton>
        </div>
      </template>
    </UModal>
  </div>
</template>

<script setup lang="ts">
import { z } from 'zod'
import type { GalleryDetail, GalleryImage, GalleryUpdateData } from '~/types/admin'

definePageMeta({
  layout: 'admin',
  middleware: 'admin'
})

const route = useRoute()
const galleryId = computed(() => parseInt(route.params.id as string))

const { getGallery, updateGallery, uploadImages, updateImage, deleteImage } = useAdminApi()

const gallery = ref<GalleryDetail | null>(null)
const loading = ref(true)
const updating = ref(false)
const uploading = ref(false)

const schema = z.object({
  title: z.string().min(1, 'Title is required'),
  clientName: z.string().min(1, 'Client name is required'),
  expiresAt: z.string().optional(),
  maxViews: z.number().positive().optional()
})

const formState = reactive<GalleryUpdateData>({
  title: '',
  clientName: '',
  expiresAt: undefined,
  maxViews: undefined
})

const fileInput = ref<HTMLInputElement | null>(null)

const editModal = reactive({
  open: false,
  image: null as GalleryImage | null,
  caption: '',
  displayOrder: 0,
  loading: false
})

const deleteImageModal = reactive({
  open: false,
  image: null as GalleryImage | null,
  loading: false
})

const sortedImages = computed(() => {
  if (!gallery.value) return []
  return [...gallery.value.images].sort((a, b) => a.displayOrder - b.displayOrder)
})

const loadGallery = async () => {
  loading.value = true
  try {
    gallery.value = await getGallery(galleryId.value)

    // Populate form
    formState.title = gallery.value.title
    formState.clientName = gallery.value.clientName
    formState.expiresAt = gallery.value.expiresAt
      ? new Date(gallery.value.expiresAt).toISOString().slice(0, 16)
      : undefined
    formState.maxViews = gallery.value.maxViews || undefined
  } catch (error) {
    // Error already handled
  } finally {
    loading.value = false
  }
}

const handleUpdateGallery = async () => {
  updating.value = true
  try {
    const data: GalleryUpdateData = {}

    if (formState.title !== gallery.value?.title) {
      data.title = formState.title
    }
    if (formState.clientName !== gallery.value?.clientName) {
      data.clientName = formState.clientName
    }
    if (formState.expiresAt) {
      data.expiresAt = formState.expiresAt
    }
    if (formState.maxViews) {
      data.maxViews = formState.maxViews
    }

    const updatedGallery = await updateGallery(galleryId.value, data)

    // Update local state
    if (gallery.value) {
      gallery.value.title = updatedGallery.title
      gallery.value.clientName = updatedGallery.clientName
      gallery.value.expiresAt = updatedGallery.expiresAt
      gallery.value.maxViews = updatedGallery.maxViews
    }
  } catch (error) {
    // Error already handled
  } finally {
    updating.value = false
  }
}

const triggerFileInput = () => {
  fileInput.value?.click()
}

const handleFileSelect = async (event: Event) => {
  const target = event.target as HTMLInputElement
  const files = Array.from(target.files || [])

  if (files.length === 0) return

  uploading.value = true
  try {
    const newImages = await uploadImages(galleryId.value, files)

    // Add new images to gallery
    if (gallery.value) {
      gallery.value.images.push(...newImages)
      gallery.value.imageCount = gallery.value.images.length
    }

    // Reset input
    target.value = ''
  } catch (error) {
    // Error already handled
  } finally {
    uploading.value = false
  }
}

const editImage = (image: GalleryImage) => {
  editModal.image = image
  editModal.caption = image.caption || ''
  editModal.displayOrder = image.displayOrder
  editModal.open = true
}

const handleUpdateImage = async () => {
  if (!editModal.image) return

  editModal.loading = true
  try {
    const updatedImage = await updateImage(
      galleryId.value,
      editModal.image.id,
      {
        caption: editModal.caption || undefined,
        displayOrder: editModal.displayOrder
      }
    )

    // Update local state
    if (gallery.value) {
      const index = gallery.value.images.findIndex(img => img.id === updatedImage.id)
      if (index !== -1) {
        gallery.value.images[index] = updatedImage
      }
    }

    editModal.open = false
  } catch (error) {
    // Error already handled
  } finally {
    editModal.loading = false
  }
}

const confirmDeleteImage = (image: GalleryImage) => {
  deleteImageModal.image = image
  deleteImageModal.open = true
}

const handleDeleteImage = async () => {
  if (!deleteImageModal.image) return

  deleteImageModal.loading = true
  try {
    await deleteImage(galleryId.value, deleteImageModal.image.id)

    // Remove from local state
    if (gallery.value) {
      gallery.value.images = gallery.value.images.filter(
        img => img.id !== deleteImageModal.image!.id
      )
      gallery.value.imageCount = gallery.value.images.length
    }

    deleteImageModal.open = false
  } catch (error) {
    // Error already handled
  } finally {
    deleteImageModal.loading = false
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
