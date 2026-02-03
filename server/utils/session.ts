import type { H3Event } from 'h3'

/**
 * Create an admin session by setting a JWT cookie
 */
export function createAdminSession(event: H3Event, userId: number, email: string) {
  const token = generateJWT({ userId, email }, '7d')

  setCookie(event, 'admin_token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: '/'
  })

  return token
}

/**
 * Get the current admin session from JWT cookie
 */
export function getAdminSession(event: H3Event): { userId: number; email: string } | null {
  const token = getCookie(event, 'admin_token')
  if (!token) return null

  const payload = verifyJWT(token)
  return payload
}

/**
 * Create a gallery access session
 */
export function createGallerySession(event: H3Event, galleryId: number, slug: string) {
  const token = generateJWT({ galleryId, slug }, '24h')

  setCookie(event, `gallery_${slug}`, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24, // 24 hours
    path: '/'
  })

  return token
}

/**
 * Verify gallery access from session cookie
 */
export function verifyGalleryAccess(event: H3Event, slug: string): { galleryId: number; slug: string } | null {
  const token = getCookie(event, `gallery_${slug}`)
  if (!token) return null

  const payload = verifyJWT(token)
  if (!payload || payload.slug !== slug) return null

  return payload
}

/**
 * Clear admin session cookie
 */
export function clearAdminSession(event: H3Event) {
  deleteCookie(event, 'admin_token', {
    path: '/'
  })
}
