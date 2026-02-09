import type {
  AdminUser,
  LoginCredentials,
  Gallery,
  GalleryDetail,
  GalleryCreateData,
  GalleryUpdateData,
  GalleryImage,
  ImageUpdateData
} from '~/types/admin'

export const useAdminApi = () => {
  const toast = useToast()

  // Auth endpoints
  const login = async (credentials: LoginCredentials): Promise<AdminUser> => {
    try {
      const data = await $fetch<{ user: AdminUser }>('/api/admin/auth/login', {
        method: 'POST',
        body: credentials
      })
      toast.add({
        title: 'Success',
        description: 'Logged in successfully',
        color: 'green'
      })
      return data.user
    } catch (error: any) {
      const message = error.data?.message || 'Login failed'
      toast.add({
        title: 'Error',
        description: message,
        color: 'red'
      })
      throw error
    }
  }

  const logout = async (): Promise<void> => {
    try {
      await $fetch('/api/admin/auth/logout', {
        method: 'POST'
      })
      toast.add({
        title: 'Success',
        description: 'Logged out successfully',
        color: 'green'
      })
    } catch (error: any) {
      toast.add({
        title: 'Error',
        description: 'Logout failed',
        color: 'red'
      })
      throw error
    }
  }

  const getCurrentUser = async (): Promise<AdminUser> => {
    try {
      const data = await $fetch<{ user: AdminUser }>('/api/admin/auth/me', {
        method: 'GET'
      })
      return data.user
    } catch (error: any) {
      throw error
    }
  }

  // Gallery endpoints
  const getGalleries = async (): Promise<Gallery[]> => {
    try {
      const data = await $fetch<{ galleries: Gallery[] }>('/api/admin/galleries', {
        method: 'GET'
      })
      return data.galleries
    } catch (error: any) {
      toast.add({
        title: 'Error',
        description: 'Failed to load galleries',
        color: 'red'
      })
      throw error
    }
  }

  const getGallery = async (id: number): Promise<GalleryDetail> => {
    try {
      const data = await $fetch<{ gallery: GalleryDetail }>(`/api/admin/galleries/${id}`, {
        method: 'GET'
      })
      return data.gallery
    } catch (error: any) {
      toast.add({
        title: 'Error',
        description: 'Failed to load gallery',
        color: 'red'
      })
      throw error
    }
  }

  const createGallery = async (galleryData: GalleryCreateData): Promise<Gallery> => {
    try {
      const data = await $fetch<{ gallery: Gallery }>('/api/admin/galleries', {
        method: 'POST',
        body: galleryData
      })
      toast.add({
        title: 'Success',
        description: 'Gallery created successfully',
        color: 'green'
      })
      return data.gallery
    } catch (error: any) {
      const message = error.data?.message || 'Failed to create gallery'
      toast.add({
        title: 'Error',
        description: message,
        color: 'red'
      })
      throw error
    }
  }

  const updateGallery = async (id: number, galleryData: GalleryUpdateData): Promise<Gallery> => {
    try {
      const data = await $fetch<{ gallery: Gallery }>(`/api/admin/galleries/${id}`, {
        method: 'PATCH',
        body: galleryData
      })
      toast.add({
        title: 'Success',
        description: 'Gallery updated successfully',
        color: 'green'
      })
      return data.gallery
    } catch (error: any) {
      const message = error.data?.message || 'Failed to update gallery'
      toast.add({
        title: 'Error',
        description: message,
        color: 'red'
      })
      throw error
    }
  }

  const deleteGallery = async (id: number): Promise<void> => {
    try {
      await $fetch(`/api/admin/galleries/${id}`, {
        method: 'DELETE'
      })
      toast.add({
        title: 'Success',
        description: 'Gallery deleted successfully',
        color: 'green'
      })
    } catch (error: any) {
      const message = error.data?.message || 'Failed to delete gallery'
      toast.add({
        title: 'Error',
        description: message,
        color: 'red'
      })
      throw error
    }
  }

  // Image endpoints
  const uploadImages = async (galleryId: number, files: File[]): Promise<GalleryImage[]> => {
    try {
      const formData = new FormData()
      files.forEach(file => {
        formData.append('images', file)
      })

      const data = await $fetch<{ images: GalleryImage[] }>(
        `/api/admin/galleries/${galleryId}/images`,
        {
          method: 'POST',
          body: formData
        }
      )
      toast.add({
        title: 'Success',
        description: `${files.length} image(s) uploaded successfully`,
        color: 'green'
      })
      return data.images
    } catch (error: any) {
      const message = error.data?.message || 'Failed to upload images'
      toast.add({
        title: 'Error',
        description: message,
        color: 'red'
      })
      throw error
    }
  }

  const updateImage = async (
    galleryId: number,
    imageId: number,
    imageData: ImageUpdateData
  ): Promise<GalleryImage> => {
    try {
      const data = await $fetch<{ image: GalleryImage }>(
        `/api/admin/galleries/${galleryId}/images/${imageId}`,
        {
          method: 'PATCH',
          body: imageData
        }
      )
      toast.add({
        title: 'Success',
        description: 'Image updated successfully',
        color: 'green'
      })
      return data.image
    } catch (error: any) {
      const message = error.data?.message || 'Failed to update image'
      toast.add({
        title: 'Error',
        description: message,
        color: 'red'
      })
      throw error
    }
  }

  const deleteImage = async (galleryId: number, imageId: number): Promise<void> => {
    try {
      await $fetch(`/api/admin/galleries/${galleryId}/images/${imageId}`, {
        method: 'DELETE'
      })
      toast.add({
        title: 'Success',
        description: 'Image deleted successfully',
        color: 'green'
      })
    } catch (error: any) {
      const message = error.data?.message || 'Failed to delete image'
      toast.add({
        title: 'Error',
        description: message,
        color: 'red'
      })
      throw error
    }
  }

  return {
    // Auth
    login,
    logout,
    getCurrentUser,
    // Galleries
    getGalleries,
    getGallery,
    createGallery,
    updateGallery,
    deleteGallery,
    // Images
    uploadImages,
    updateImage,
    deleteImage
  }
}
