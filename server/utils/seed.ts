import { drizzle } from 'drizzle-orm/neon-http'
import { neon } from '@neondatabase/serverless'
import { eq } from 'drizzle-orm'
import { hash } from '@node-rs/argon2'
import { adminUsers } from '../database/schema'

/**
 * Seed the database with an initial admin user
 */
export async function seedDatabase() {
  try {
    // Get database URL from environment
    const databaseUrl = process.env.DATABASE_URL

    if (!databaseUrl) {
      throw new Error('DATABASE_URL environment variable is not set')
    }

    // Create database connection
    const sql = neon(databaseUrl)
    const db = drizzle(sql, { schema: { adminUsers } })

    console.log('🌱 Seeding database...')

    // Check if admin user already exists
    const [existingAdmin] = await db
      .select()
      .from(adminUsers)
      .where(eq(adminUsers.email, 'admin@nicolasWolff.com'))
      .limit(1)

    if (existingAdmin) {
      console.log('✅ Admin user already exists. Skipping seed.')
      return
    }

    // Hash the password
    const passwordHash = await hash('admin123456', {
      memoryCost: 19456,
      timeCost: 2,
      outputLen: 32,
      parallelism: 1
    })

    // Create admin user
    const [newAdmin] = await db
      .insert(adminUsers)
      .values({
        email: 'admin@nicolasWolff.com',
        passwordHash,
        name: 'Admin User'
      })
      .returning()

    console.log('✅ Admin user created successfully!')
    console.log('📧 Email:', newAdmin.email)
    console.log('🔑 Password: admin123456')
    console.log('⚠️  Please change this password in production!')

  } catch (error) {
    console.error('❌ Error seeding database:', error)
    throw error
  }
}

// Run seed if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  seedDatabase()
    .then(() => {
      console.log('✅ Seeding complete!')
      process.exit(0)
    })
    .catch((error) => {
      console.error('❌ Seeding failed:', error)
      process.exit(1)
    })
}
