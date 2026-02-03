import { desc, sql } from 'drizzle-orm'
import { galleries, images } from '../../../database/schema'

export default defineEventHandler(async (event) => {
  // Get database instance
  const db = useDB()

  // Fetch all galleries with image counts
  const galleriesList = await db
    .select({
      id: galleries.id,
      title: galleries.title,
      clientName: galleries.clientName,
      slug: galleries.slug,
      expiresAt: galleries.expiresAt,
      maxViews: galleries.maxViews,
      viewCount: galleries.viewCount,
      createdAt: galleries.createdAt,
      updatedAt: galleries.updatedAt,
      imageCount: sql<number>`cast(count(${images.id}) as integer)`
    })
    .from(galleries)
    .leftJoin(images, sql`${images.galleryId} = ${galleries.id}`)
    .groupBy(galleries.id)
    .orderBy(desc(galleries.createdAt))

  return {
    success: true,
    galleries: galleriesList
  }
})
