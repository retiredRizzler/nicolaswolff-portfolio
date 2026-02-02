## Current to do tasks :

    - update hero title to be more readable (for mobile version too)
    - same for loader, make it smaller for mobile version (but stay careful so the animation is not messed up)

## next steps :

    - gallery page :
        2. Database-Backed with Hashed Passwords (Recommended)

More secure and scalable:
typescript// prisma/schema.prisma (or use Drizzle)
model Gallery {
id String @id @default(cuid())
name String
password String // hashed with bcrypt/argon2
expiresAt DateTime?
maxViews Int?
viewCount Int @default(0)
images Image[]
createdAt DateTime @default(now())
}

model Image {
id String @id @default(cuid())
url String
galleryId String
gallery Gallery @relation(fields: [galleryId], references: [id])
}

// server/api/galleries/[id]/auth.post.ts
import { hash, verify } from '@node-rs/argon2'

export default defineEventHandler(async (event) => {
const galleryId = getRouterParam(event, 'id')
const { password } = await readBody(event)

const gallery = await prisma.gallery.findUnique({
where: { id: galleryId }
})

if (!gallery) throw createError({ statusCode: 404 })

// Check expiration
if (gallery.expiresAt && gallery.expiresAt < new Date()) {
throw createError({ statusCode: 403, message: 'Gallery expired' })
}

const isValid = await verify(gallery.password, password)

if (isValid) {
// Track view count
await prisma.gallery.update({
where: { id: galleryId },
data: { viewCount: { increment: 1 } }
})

    // Create JWT session
    const token = await generateJWT({ galleryId })
    setCookie(event, 'gallery-session', token, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 7
    })

    return { success: true }

}

return { success: false }
})
Stack:

Database: PostgreSQL (Supabase/Neon) or SQLite (Turso)
ORM: Prisma or Drizzle
Storage: Cloudinary, Cloudflare Images, or Supabase Storage

## 4. **Complete Architecture Recommendation**

Here's what I'd build:

```
Tech Stack:
├── Frontend: Nuxt 4 + Nuxt UI
├── Database: Neon PostgreSQL (free tier)
├── ORM: Drizzle ORM
├── Storage: Cloudinary (generous free tier)
├── Auth: Nuxt sessions with JWT
└── Admin: Custom Nuxt page for your friend
```

**Key Features:**

- Password-protected galleries with expiration dates
- View count tracking and limits
- Bulk upload with drag-drop
- Image optimization and lazy loading
- Download options (individual/zip)
- Admin dashboard for photographer

**File Structure:**

```
pages/
├── admin/
│   ├── galleries/
│   │   ├── index.vue (list all)
│   │   ├── create.vue
│   │   └── [id]/edit.vue
├── gallery/
│   ├── [id]/
│   │   ├── index.vue (password form)
│   │   └── view.vue (protected images)
```
