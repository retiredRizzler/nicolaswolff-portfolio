import { eq } from 'drizzle-orm'
import { adminUsers } from '../../../database/schema'

export default defineEventHandler(async (event) => {
  // Admin session is verified by middleware, get from context
  const session = event.context.admin

  if (!session) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized',
      message: 'No active session'
    })
  }

  // Get database instance
  const db = useDB()

  // Fetch current admin user
  const [admin] = await db
    .select({
      id: adminUsers.id,
      email: adminUsers.email,
      name: adminUsers.name,
      createdAt: adminUsers.createdAt
    })
    .from(adminUsers)
    .where(eq(adminUsers.id, session.userId))
    .limit(1)

  if (!admin) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Not Found',
      message: 'Admin user not found'
    })
  }

  return {
    success: true,
    user: admin
  }
})
