import type { H3Event } from 'h3'

/**
 * Middleware to protect admin API routes
 * Applies to all /api/admin/* routes except /api/admin/auth/login
 */
export default defineEventHandler(async (event: H3Event) => {
  const path = event.path

  // Only apply to /api/admin/* routes
  if (!path.startsWith('/api/admin')) {
    return
  }

  // Skip authentication for login endpoint
  if (path === '/api/admin/auth/login') {
    return
  }

  // Verify admin session
  const session = getAdminSession(event)

  if (!session) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized',
      message: 'Admin authentication required'
    })
  }

  // Attach admin info to event context
  event.context.admin = session
})
