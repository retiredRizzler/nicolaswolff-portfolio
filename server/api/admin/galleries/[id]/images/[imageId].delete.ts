import { eq, and } from 'drizzle-orm'
import { images } from '../../../../../database/schema'

export default defineEventHandler(async (event) => {
  try {
    // Get gallery ID and image ID from route params
    const id = getRouterParam(event, 'id')
    const imageId = getRouterParam(event, 'imageId')

    if (!id || !imageId) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Bad Request',
        message: 'Gallery ID and Image ID are required'
      })
    }

    const galleryId = parseInt(id)
    const imgId = parseInt(imageId)

    if (isNaN(galleryId) || isNaN(imgId)) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Bad Request',
        message: 'Invalid gallery ID or image ID'
      })
    }

    // Get database instance
    const db = useDB()

    // Fetch image to get Cloudinary public ID
    const [image] = await db
      .select()
      .from(images)
      .where(and(eq(images.id, imgId), eq(images.galleryId, galleryId)))
      .limit(1)

    if (!image) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Not Found',
        message: 'Image not found in this gallery'
      })
    }

    // Delete from Cloudinary
    try {
      await deleteImage(image.cloudinaryPublicId)
    } catch (error) {
      console.error(`Failed to delete image ${image.cloudinaryPublicId} from Cloudinary:`, error)
      // Continue with database deletion even if Cloudinary deletion fails
    }

    // Delete from database
    await db
      .delete(images)
      .where(eq(images.id, imgId))

    return {
      success: true,
      message: 'Image deleted successfully'
    }
  } catch (error: any) {
    if (error.statusCode) {
      throw error
    }

    throw createError({
      statusCode: 500,
      statusMessage: 'Internal Server Error',
      message: 'An error occurred while deleting the image'
    })
  }
})
