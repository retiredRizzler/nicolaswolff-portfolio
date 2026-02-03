import { z } from 'zod'
import { eq } from 'drizzle-orm'
import { adminUsers } from '../../../database/schema'

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required')
})

export default defineEventHandler(async (event) => {
  try {
    // Parse and validate request body
    const body = await readBody(event)
    const { email, password } = loginSchema.parse(body)

    // Get database instance
    const db = useDB()

    // Find admin user by email
    const [admin] = await db
      .select()
      .from(adminUsers)
      .where(eq(adminUsers.email, email))
      .limit(1)

    if (!admin) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Unauthorized',
        message: 'Invalid email or password'
      })
    }

    // Verify password
    const isValidPassword = await verifyPassword(password, admin.passwordHash)

    if (!isValidPassword) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Unauthorized',
        message: 'Invalid email or password'
      })
    }

    // Create session
    const token = createAdminSession(event, admin.id, admin.email)

    // Return user data (without password hash)
    return {
      success: true,
      user: {
        id: admin.id,
        email: admin.email,
        name: admin.name,
        createdAt: admin.createdAt
      },
      token
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
      message: 'An error occurred during login'
    })
  }
})
