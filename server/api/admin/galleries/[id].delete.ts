import { eq } from 'drizzle-orm'
import { galleries, images } from '../../../database/schema'

export default defineEventHandler(async (event) => {
  try {
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

    // Check if gallery exists
    const [existingGallery] = await db
      .select()
      .from(galleries)
      .where(eq(galleries.id, galleryId))
      .limit(1)

    if (!existingGallery) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Not Found',
        message: 'Gallery not found'
      })
    }

    // Fetch all images to delete from Cloudinary
    const galleryImages = await db
      .select()
      .from(images)
      .where(eq(images.galleryId, galleryId))

    // Delete all images from Cloudinary
    for (const image of galleryImages) {
      try {
        await deleteImage(image.cloudinaryPublicId)
      } catch (error) {
        console.error(`Failed to delete image ${image.cloudinaryPublicId} from Cloudinary:`, error)
        // Continue with other images even if one fails
      }
    }

    // Delete gallery (cascade will delete images from DB)
    await db
      .delete(galleries)
      .where(eq(galleries.id, galleryId))

    return {
      success: true,
      message: 'Gallery deleted successfully',
      deletedImages: galleryImages.length
    }
  } catch (error: any) {
    if (error.statusCode) {
      throw error
    }

    throw createError({
      statusCode: 500,
      statusMessage: 'Internal Server Error',
      message: 'An error occurred while deleting the gallery'
    })
  }
})
