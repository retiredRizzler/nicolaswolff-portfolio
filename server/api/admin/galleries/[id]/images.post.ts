import { eq, max } from 'drizzle-orm'
import { galleries, images } from '../../../../database/schema'

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

    // Parse multipart form data
    const formData = await readMultipartFormData(event)

    if (!formData || formData.length === 0) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Bad Request',
        message: 'No files uploaded'
      })
    }

    // Get the current max display order
    const [maxOrderResult] = await db
      .select({ maxOrder: max(images.displayOrder) })
      .from(images)
      .where(eq(images.galleryId, galleryId))

    let displayOrder = (maxOrderResult?.maxOrder ?? 0) + 1

    // Upload images and create records
    const uploadedImages = []

    for (const file of formData) {
      if (file.type && file.type.startsWith('image/')) {
        // Upload to Cloudinary
        const uploadResult = await uploadImage(
          file.data,
          `gallery-${galleryId}`
        )

        // Generate thumbnail URL
        const thumbnailUrl = getThumbnailUrl(uploadResult.public_id)

        // Insert image record
        const [newImage] = await db
          .insert(images)
          .values({
            galleryId,
            cloudinaryPublicId: uploadResult.public_id,
            url: uploadResult.secure_url,
            thumbnailUrl,
            width: uploadResult.width,
            height: uploadResult.height,
            displayOrder
          })
          .returning()

        uploadedImages.push(newImage)
        displayOrder++
      }
    }

    if (uploadedImages.length === 0) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Bad Request',
        message: 'No valid image files uploaded'
      })
    }

    return {
      success: true,
      images: uploadedImages,
      count: uploadedImages.length
    }
  } catch (error: any) {
    if (error.statusCode) {
      throw error
    }

    console.error('Image upload error:', error)

    throw createError({
      statusCode: 500,
      statusMessage: 'Internal Server Error',
      message: 'An error occurred while uploading images'
    })
  }
})
