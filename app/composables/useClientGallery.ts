import type { ClientGallery, GalleryImage } from '~/types/admin'

export const useClientGallery = () => {
  const toast = useToast()

  const authenticateGallery = async (slug: string, password: string): Promise<boolean> => {
    try {
      await $fetch(`/api/galleries/${slug}/auth`, {
        method: 'POST',
        body: { password }
      })
      toast.add({
        title: 'Success',
        description: 'Gallery unlocked',
        color: 'success'
      })
      return true
    } catch (error: any) {
      const message = error.data?.message || 'Invalid password'
      toast.add({
        title: 'Error',
        description: message,
        color: 'error'
      })
      return false
    }
  }

  const getGalleryMetadata = async (slug: string): Promise<ClientGallery> => {
    try {
      const data = await $fetch<{ gallery: ClientGallery }>(`/api/galleries/${slug}`, {
        method: 'GET'
      })
      return data.gallery
    } catch (error: any) {
      const message = error.data?.message || 'Failed to load gallery'
      toast.add({
        title: 'Error',
        description: message,
        color: 'error'
      })
      throw error
    }
  }

  const getGalleryImages = async (slug: string): Promise<GalleryImage[]> => {
    try {
      const data = await $fetch<{ images: GalleryImage[] }>(`/api/galleries/${slug}/images`, {
        method: 'GET'
      })
      return data.images
    } catch (error: any) {
      const message = error.data?.message || 'Failed to load images'
      toast.add({
        title: 'Error',
        description: message,
        color: 'error'
      })
      throw error
    }
  }

  return {
    authenticateGallery,
    getGalleryMetadata,
    getGalleryImages
  }
}
