import { z } from 'zod'
import { eq } from 'drizzle-orm'
import { galleries } from '../../../database/schema'

const updateGallerySchema = z.object({
  title: z.string().min(1).optional(),
  clientName: z.string().min(1).optional(),
  password: z.string().min(6).optional(),
  expiresAt: z.string().datetime().optional().nullable(),
  maxViews: z.number().int().positive().optional().nullable()
})

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

    // Parse and validate request body
    const body = await readBody(event)
    const data = updateGallerySchema.parse(body)

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

    // Prepare update data
    const updateData: any = {
      updatedAt: new Date()
    }

    if (data.title !== undefined) updateData.title = data.title
    if (data.clientName !== undefined) updateData.clientName = data.clientName
    if (data.expiresAt !== undefined) {
      updateData.expiresAt = data.expiresAt ? new Date(data.expiresAt) : null
    }
    if (data.maxViews !== undefined) updateData.maxViews = data.maxViews

    // Hash password if provided
    if (data.password) {
      updateData.passwordHash = await hashPassword(data.password)
    }

    // Update gallery
    const [updatedGallery] = await db
      .update(galleries)
      .set(updateData)
      .where(eq(galleries.id, galleryId))
      .returning()

    return {
      success: true,
      gallery: {
        id: updatedGallery.id,
        title: updatedGallery.title,
        clientName: updatedGallery.clientName,
        slug: updatedGallery.slug,
        expiresAt: updatedGallery.expiresAt,
        maxViews: updatedGallery.maxViews,
        viewCount: updatedGallery.viewCount,
        createdAt: updatedGallery.createdAt,
        updatedAt: updatedGallery.updatedAt
      }
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
      message: 'An error occurred while updating the gallery'
    })
  }
})
