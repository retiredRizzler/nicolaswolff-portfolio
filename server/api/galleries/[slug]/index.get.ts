import { eq, sql } from 'drizzle-orm'
import { galleries, images } from '../../../database/schema'

export default defineEventHandler(async (event) => {
  // Gallery access is verified by middleware
  const slug = event.context.gallerySlug

  if (!slug) {
    throw createError({
      statusCode: 403,
      statusMessage: 'Forbidden',
      message: 'Gallery access denied'
    })
  }

  // Get database instance
  const db = useDB()

  // Fetch gallery with image count
  const [gallery] = await db
    .select({
      id: galleries.id,
      title: galleries.title,
      clientName: galleries.clientName,
      slug: galleries.slug,
      imageCount: sql<number>`cast(count(${images.id}) as integer)`
    })
    .from(galleries)
    .leftJoin(images, sql`${images.galleryId} = ${galleries.id}`)
    .where(eq(galleries.slug, slug))
    .groupBy(galleries.id)
    .limit(1)

  if (!gallery) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Not Found',
      message: 'Gallery not found'
    })
  }

  return {
    success: true,
    gallery
  }
})
