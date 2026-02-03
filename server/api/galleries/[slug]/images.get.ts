import { eq, asc, sql } from 'drizzle-orm'
import { galleries, images } from '../../../database/schema'

export default defineEventHandler(async (event) => {
  // Gallery access is verified by middleware
  const slug = event.context.gallerySlug
  const galleryId = event.context.galleryId

  if (!slug || !galleryId) {
    throw createError({
      statusCode: 403,
      statusMessage: 'Forbidden',
      message: 'Gallery access denied'
    })
  }

  // Get database instance
  const db = useDB()

  // Increment view count
  await db
    .update(galleries)
    .set({
      viewCount: sql`${galleries.viewCount} + 1`
    })
    .where(eq(galleries.id, galleryId))

  // Fetch all images for this gallery
  const galleryImages = await db
    .select()
    .from(images)
    .where(eq(images.galleryId, galleryId))
    .orderBy(asc(images.displayOrder))

  return {
    success: true,
    images: galleryImages
  }
})
