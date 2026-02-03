import { eq, asc } from 'drizzle-orm'
import { galleries, images } from '../../../database/schema'

export default defineEventHandler(async (event) => {
  // Get gallery ID from route params
  const id = getRouterParam(event, 'id')

  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Bad Request',
      message: 'Gallery ID is required'
    })
  }

  const galleryId = parseInt(id)

  if (isNaN(galleryId)) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Bad Request',
      message: 'Invalid gallery ID'
    })
  }

  // Get database instance
  const db = useDB()

  // Fetch gallery
  const [gallery] = await db
    .select()
    .from(galleries)
    .where(eq(galleries.id, galleryId))
    .limit(1)

  if (!gallery) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Not Found',
      message: 'Gallery not found'
    })
  }

  // Fetch all images for this gallery
  const galleryImages = await db
    .select()
    .from(images)
    .where(eq(images.galleryId, galleryId))
    .orderBy(asc(images.displayOrder))

  return {
    success: true,
    gallery: {
      id: gallery.id,
      title: gallery.title,
      clientName: gallery.clientName,
      slug: gallery.slug,
      expiresAt: gallery.expiresAt,
      maxViews: gallery.maxViews,
      viewCount: gallery.viewCount,
      createdAt: gallery.createdAt,
      updatedAt: gallery.updatedAt,
      images: galleryImages
    }
  }
})
