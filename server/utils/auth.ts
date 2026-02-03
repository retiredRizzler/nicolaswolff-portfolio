import { hash, verify } from '@node-rs/argon2'
import jwt from 'jsonwebtoken'

/**
 * Hash a password using Argon2
 */
export async function hashPassword(password: string): Promise<string> {
  return await hash(password, {
    memoryCost: 19456,
    timeCost: 2,
    outputLen: 32,
    parallelism: 1
  })
}

/**
 * Verify a password against a hash
 */
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  try {
    return await verify(hash, password)
  } catch (error) {
    return false
  }
}

/**
 * Generate a JWT token
 */
export function generateJWT(payload: any, expiresIn: string = '7d'): string {
  const config = useRuntimeConfig()
  return jwt.sign(payload, config.jwtSecret, { expiresIn })
}

/**
 * Verify and decode a JWT token
 */
export function verifyJWT(token: string): any {
  try {
    const config = useRuntimeConfig()
    return jwt.verify(token, config.jwtSecret)
  } catch (error) {
    return null
  }
}
