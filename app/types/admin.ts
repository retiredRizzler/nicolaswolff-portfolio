export interface AdminUser {
  id: number
  email: string
  name: string
}

export interface Gallery {
  id: number
  title: string
  clientName: string
  slug: string
  expiresAt: string | null
  maxViews: number | null
  viewCount: number
  imageCount: number
  createdAt: string
  updatedAt: string
}

export interface GalleryImage {
  id: number
  galleryId: number
  cloudinaryPublicId: string
  url: string
  thumbnailUrl: string
  width: number
  height: number
  caption: string | null
  displayOrder: number
  createdAt: string
}

export interface GalleryDetail extends Gallery {
  images: GalleryImage[]
}

export interface ClientGallery {
  id: number
  title: string
  clientName: string
  slug: string
  expiresAt: string | null
  maxViews: number | null
  viewCount: number
  createdAt: string
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface GalleryCreateData {
  title: string
  clientName: string
  password: string
  expiresAt?: string
  maxViews?: number
}

export interface GalleryUpdateData {
  title?: string
  clientName?: string
  expiresAt?: string
  maxViews?: number
}

export interface ImageUpdateData {
  caption?: string
  displayOrder?: number
}
