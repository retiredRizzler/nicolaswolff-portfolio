import { z } from 'zod'
import { eq, and } from 'drizzle-orm'
import { images } from '../../../../../database/schema'

const updateImageSchema = z.object({
  caption: z.string().optional().nullable(),
  displayOrder: z.number().int().positive().optional()
})

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

    // Parse and validate request body
    const body = await readBody(event)
    const data = updateImageSchema.parse(body)

    // Get database instance
    const db = useDB()

    // Check if image exists and belongs to this gallery
    const [existingImage] = await db
      .select()
      .from(images)
      .where(and(eq(images.id, imgId), eq(images.galleryId, galleryId)))
      .limit(1)

    if (!existingImage) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Not Found',
        message: 'Image not found in this gallery'
      })
    }

    // Prepare update data
    const updateData: any = {}
    if (data.caption !== undefined) updateData.caption = data.caption
    if (data.displayOrder !== undefined) updateData.displayOrder = data.displayOrder

    if (Object.keys(updateData).length === 0) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Bad Request',
        message: 'No update data provided'
      })
    }

    // Update image
    const [updatedImage] = await db
      .update(images)
      .set(updateData)
      .where(eq(images.id, imgId))
      .returning()

    return {
      success: true,
      image: updatedImage
    }
  } catch (error: any) {
    if (error.statusCode) {
      throw error
    }

    // Handle validation errors
    if (error.errors) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Validation Error',
        message: error.errors[0].message
      })
    }

    throw createError({
      statusCode: 500,
      statusMessage: 'Internal Server Error',
      message: 'An error occurred while updating the image'
    })
  }
})
