import { drizzle } from 'drizzle-orm/neon-http'
import { neon } from '@neondatabase/serverless'
import * as schema from '../database/schema'

let _db: ReturnType<typeof drizzle> | null = null

export const useDB = () => {
  if (!_db) {
    const config = useRuntimeConfig()
    const sql = neon(config.databaseUrl || process.env.DATABASE_URL!)
    _db = drizzle(sql, { schema })
  }
  return _db
}
