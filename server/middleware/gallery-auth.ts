import type { H3Event } from 'h3'

/**
 * Middleware to protect client gallery API routes
 * Applies to /api/galleries/[slug]/* routes except /api/galleries/[slug]/auth
 */
export default defineEventHandler(async (event: H3Event) => {
  const path = event.path

  // Only apply to /api/galleries/* routes
  if (!path.startsWith('/api/galleries/')) {
    return
  }

  // Skip authentication for auth endpoint
  if (path.includes('/auth')) {
    return
  }

  // Extract slug from path: /api/galleries/[slug]/...
  const pathParts = path.split('/')
  const slug = pathParts[3] // /api/galleries/[slug]/...

  if (!slug) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Bad Request',
      message: 'Gallery slug is required'
    })
  }

  // Verify gallery session
  const session = verifyGalleryAccess(event, slug)

  if (!session) {
    throw createError({
      statusCode: 403,
      statusMessage: 'Forbidden',
      message: 'Gallery access denied. Please authenticate first.'
    })
  }

  // Attach gallery info to event context
  event.context.gallerySlug = slug
  event.context.galleryId = session.galleryId
})
