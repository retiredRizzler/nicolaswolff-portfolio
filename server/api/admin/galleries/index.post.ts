import { z } from 'zod'
import { galleries } from '../../../database/schema'

const createGallerySchema = z.object({
  title: z.string().min(1, 'Title is required'),
  clientName: z.string().min(1, 'Client name is required'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  expiresAt: z.string().datetime().optional().nullable(),
  maxViews: z.number().int().positive().optional().nullable()
})

export default defineEventHandler(async (event) => {
  try {
    // Parse and validate request body
    const body = await readBody(event)
    const data = createGallerySchema.parse(body)

    // Generate unique slug from title + timestamp
    const baseSlug = data.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
    const timestamp = Date.now()
    const slug = `${baseSlug}-${timestamp}`

    // Hash password
    const passwordHash = await hashPassword(data.password)

    // Get database instance
    const db = useDB()

    // Insert new gallery
    const [newGallery] = await db
      .insert(galleries)
      .values({
        title: data.title,
        clientName: data.clientName,
        slug,
        passwordHash,
        expiresAt: data.expiresAt ? new Date(data.expiresAt) : null,
        maxViews: data.maxViews ?? null,
        viewCount: 0
      })
      .returning()

    return {
      success: true,
      gallery: {
        id: newGallery?.id,
        title: newGallery?.title,
        clientName: newGallery?.clientName,
        slug: newGallery?.slug,
        expiresAt: newGallery?.expiresAt,
        maxViews: newGallery?.maxViews,
        viewCount: newGallery?.viewCount,
        createdAt: newGallery?.createdAt,
        updatedAt: newGallery?.updatedAt
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
      message: 'An error occurred while creating the gallery'
    })
  }
})
