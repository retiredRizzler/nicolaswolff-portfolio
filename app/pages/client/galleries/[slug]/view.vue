<template>
  <div class="min-h-screen bg-[#f4f4f4]">
    <header class="bg-white border-b border-[#201d1d]/10 sticky top-0 z-10">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <div>
            <h1 class="text-xl font-medium text-[#201d1d]">{{ gallery?.title }}</h1>
            <p class="text-sm text-[#201d1d]/60">{{ gallery?.clientName }}</p>
          </div>
          <div class="text-sm text-[#201d1d]/60">
            {{ images.length }} {{ images.length === 1 ? 'image' : 'images' }}
          </div>
        </div>
      </div>
    </header>

    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div v-if="loading" class="text-center py-12">
        <div class="flex justify-center">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-[#201d1d]"></div>
        </div>
        <p class="text-[#201d1d]/60 mt-4">Loading images...</p>
      </div>

      <div v-else-if="images.length === 0" class="text-center py-12">
        <p class="text-[#201d1d]/60">No images in this gallery yet</p>
      </div>

      <div v-else class="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4">
        <div
          v-for="image in images"
          :key="image.id"
          class="break-inside-avoid group cursor-pointer"
          @click="openLightbox(image)"
        >
          <div class="relative overflow-hidden rounded-lg bg-[#201d1d]/5">
            <img
              :src="image.url"
              :alt="image.caption || 'Gallery image'"
              class="w-full h-auto transition-transform duration-300 group-hover:scale-105"
              loading="lazy"
            />
            <div
              v-if="image.caption"
              class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <p class="text-white text-sm">{{ image.caption }}</p>
            </div>
          </div>
        </div>
      </div>
    </main>

    <footer class="border-t border-[#201d1d]/10 mt-12">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <p class="text-center text-sm text-[#201d1d]/50">
          © {{ new Date().getFullYear() }} Nicolas Wolff Photography
        </p>
      </div>
    </footer>

    <!-- Lightbox Modal -->
    <UModal
      v-model:open="lightbox.open"
      :title="lightbox.image?.caption || 'Gallery Image'"
      :description="`Image ${lightbox.currentIndex + 1} of ${images.length}`"
      :ui="{ content: 'max-w-7xl' }"
      :close="false"
    >
      <template #content>
        <div class="bg-black p-4">
          <div class="relative">
            <button
              @click="lightbox.open = false"
              class="absolute top-4 right-4 z-10 text-white/80 hover:text-white"
              aria-label="Close lightbox"
            >
              <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <div v-if="lightbox.image" class="flex flex-col items-center">
              <img
                :src="lightbox.image.url"
                :alt="lightbox.image.caption || 'Gallery image'"
                class="max-h-[80vh] w-auto"
              />
              <p v-if="lightbox.image.caption" class="text-white mt-4 text-center">
                {{ lightbox.image.caption }}
              </p>
            </div>

            <!-- Navigation Arrows -->
            <button
              v-if="lightbox.currentIndex > 0"
              @click.stop="previousImage"
              class="absolute left-4 top-1/2 -translate-y-1/2 text-white/80 hover:text-white"
              aria-label="Previous image"
            >
              <svg class="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            <button
              v-if="lightbox.currentIndex < images.length - 1"
              @click.stop="nextImage"
              class="absolute right-4 top-1/2 -translate-y-1/2 text-white/80 hover:text-white"
              aria-label="Next image"
            >
              <svg class="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          <div class="text-center text-white/60 text-sm mt-2">
            {{ lightbox.currentIndex + 1 }} / {{ images.length }}
          </div>
        </div>
      </template>
    </UModal>
  </div>
</template>

<script setup lang="ts">
import type { ClientGallery, GalleryImage } from '~/types/admin'

definePageMeta({
  layout: false,
  middleware: 'client-gallery'
})

const route = useRoute()
const slug = computed(() => route.params.slug as string)

const { getGalleryMetadata, getGalleryImages } = useClientGallery()

const gallery = ref<ClientGallery | null>(null)
const images = ref<GalleryImage[]>([])
const loading = ref(true)

const lightbox = reactive({
  open: false,
  image: null as GalleryImage | null,
  currentIndex: 0
})

const loadGallery = async () => {
  loading.value = true
  try {
    const [galleryData, imagesData] = await Promise.all([
      getGalleryMetadata(slug.value),
      getGalleryImages(slug.value)
    ])

    gallery.value = galleryData
    images.value = imagesData.sort((a, b) => a.displayOrder - b.displayOrder)
  } catch (error) {
    // If unauthorized, middleware will redirect
    // Other errors are handled by composable
  } finally {
    loading.value = false
  }
}

const openLightbox = (image: GalleryImage) => {
  const index = images.value.findIndex(img => img.id === image.id)
  lightbox.currentIndex = index
  lightbox.image = image
  lightbox.open = true
}

const previousImage = () => {
  if (lightbox.currentIndex > 0) {
    lightbox.currentIndex--
    lightbox.image = images.value[lightbox.currentIndex]
  }
}

const nextImage = () => {
  if (lightbox.currentIndex < images.value.length - 1) {
    lightbox.currentIndex++
    lightbox.image = images.value[lightbox.currentIndex]
  }
}

// Keyboard navigation
const handleKeydown = (event: KeyboardEvent) => {
  if (!lightbox.open) return

  if (event.key === 'ArrowLeft') {
    previousImage()
  } else if (event.key === 'ArrowRight') {
    nextImage()
  } else if (event.key === 'Escape') {
    lightbox.open = false
  }
}

onMounted(() => {
  loadGallery()
  window.addEventListener('keydown', handleKeydown)
})

onBeforeUnmount(() => {
  window.removeEventListener('keydown', handleKeydown)
})
</script>

<style scoped>
* {
  font-family: 'PP Neue Montreal', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
}
</style>
