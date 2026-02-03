import { z } from 'zod'
import { eq } from 'drizzle-orm'
import { galleries } from '../../../database/schema'

const authSchema = z.object({
  password: z.string().min(1, 'Password is required')
})

export default defineEventHandler(async (event) => {
  try {
    // Get slug from route params
    const slug = getRouterParam(event, 'slug')

    if (!slug) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Bad Request',
        message: 'Gallery slug is required'
      })
    }

    // Parse and validate request body
    const body = await readBody(event)
    const { password } = authSchema.parse(body)

    // Get database instance
    const db = useDB()

    // Find gallery by slug
    const [gallery] = await db
      .select()
      .from(galleries)
      .where(eq(galleries.slug, slug))
      .limit(1)

    if (!gallery) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Not Found',
        message: 'Gallery not found'
      })
    }

    // Check if gallery has expired
    if (gallery.expiresAt && new Date(gallery.expiresAt) < new Date()) {
      throw createError({
        statusCode: 403,
        statusMessage: 'Forbidden',
        message: 'This gallery has expired'
      })
    }

    // Check if view limit has been reached
    if (gallery.maxViews && gallery.viewCount >= gallery.maxViews) {
      throw createError({
        statusCode: 403,
        statusMessage: 'Forbidden',
        message: 'This gallery has reached its view limit'
      })
    }

    // Verify password
    const isValidPassword = await verifyPassword(password, gallery.passwordHash)

    if (!isValidPassword) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Unauthorized',
        message: 'Invalid password'
      })
    }

    // Create gallery session
    createGallerySession(event, gallery.id, gallery.slug)

    return {
      success: true,
      message: 'Authentication successful'
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
      message: 'An error occurred during authentication'
    })
  }
})
