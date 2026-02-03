Let's build a password-protected photography gallery website in Nuxt 4. I need to implement the backend first, then the frontend with admin dashboard and client gallery views.
Architecture Overview:

Nuxt 4 with Nuxt UI for components
NuxtHub Database with Neon PostgreSQL (uses Drizzle ORM under the hood)
Cloudinary for image storage and optimization
JWT-based session authentication
Server-side password hashing with @node-rs/argon2

Phase 1: Backend Implementation (Current Focus)
Set up the complete backend infrastructure using NuxtHub's database integration:

Initial Setup:

bash   # Install NuxtHub and database dependencies
   npm install @nuxthub/core
   npm install drizzle-orm drizzle-kit @neondatabase/serverless
   npm install @node-rs/argon2
   npm install cloudinary
nuxt.config.ts:
ts   export default defineNuxtConfig({
     modules: ['@nuxthub/core'],
     hub: {
       db: 'postgresql', // This enables NuxtHub database with PostgreSQL
     }
   })
```

   **Environment variables (.env):**
```
   DATABASE_URL=postgresql://user:password@your-neon-db.neon.tech/dbname
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   JWT_SECRET=your-super-secret-jwt-key-change-this

Database Schema (server/db/schema.ts):
Create comprehensive schema with proper relations:

adminUsers table: id (serial primary), email (unique), passwordHash, name, createdAt, updatedAt
galleries table: id (serial primary), title, clientName, slug (unique), passwordHash, expiresAt (nullable), maxViews (nullable), viewCount (default 0), createdAt, updatedAt
images table: id (serial primary), galleryId (FK to galleries), cloudinaryPublicId, url, thumbnailUrl, width, height, caption (nullable), displayOrder, createdAt

Use proper Drizzle relations, indexes on slug and galleryId, and foreign key constraints with cascading deletes.
Server Utils (server/utils/):
db.ts - Export the db instance:

ts   import { db } from '@nuxthub/db'
   export { db }
auth.ts - Authentication helpers:

hashPassword(password: string) - Hash with argon2
verifyPassword(password: string, hash: string) - Verify password
generateJWT(payload: object) - Create JWT token
verifyJWT(token: string) - Verify and decode JWT

cloudinary.ts - Image management:

uploadImage(file: Buffer, folder: string) - Upload with transformations
deleteImage(publicId: string) - Remove from Cloudinary
Generate thumbnail transformation (300x300, crop, quality auto)

session.ts - Session helpers:

createAdminSession(event, userId) - Set admin JWT cookie
getAdminSession(event) - Get current admin from JWT
createGallerySession(event, galleryId) - Set gallery access cookie
verifyGalleryAccess(event, gallerySlug) - Check gallery session


API Routes (server/api/):
Admin Authentication:

POST /api/admin/auth/login - Validate email/password, return JWT
POST /api/admin/auth/logout - Clear session cookie
GET /api/admin/auth/me - Get current admin user (protected)

Admin Gallery Management (all protected):

GET /api/admin/galleries - List all with image counts and stats
POST /api/admin/galleries - Create new gallery (auto-generate slug from title)
GET /api/admin/galleries/[id] - Get single gallery with all images
PATCH /api/admin/galleries/[id] - Update gallery metadata
DELETE /api/admin/galleries/[id] - Soft delete or hard delete with cascade

Admin Image Management (all protected):

POST /api/admin/galleries/[id]/images - Upload multiple images to Cloudinary, save to DB
PATCH /api/admin/galleries/[id]/images/[imageId] - Update caption/order
DELETE /api/admin/galleries/[id]/images/[imageId] - Delete from Cloudinary and DB
PATCH /api/admin/galleries/[id]/images/reorder - Bulk update displayOrder

Client Gallery Access:

POST /api/galleries/[slug]/auth - Validate password, create session, check expiry/view limits
GET /api/galleries/[slug] - Get gallery metadata (requires valid session)
GET /api/galleries/[slug]/images - Get all images (requires session, increment viewCount)


Server Middleware (server/middleware/):

Create admin-auth.ts to verify admin JWT on /api/admin/* routes
Create gallery-auth.ts to verify gallery session on protected gallery routes
Add proper error responses (401, 403) with meaningful messages


Database Migrations:

After creating schema, run: npx nuxt db generate
Migrations auto-apply on npm run dev and during build
DO NOT manually create SQL files - NuxtHub handles this


Seed Script (server/utils/seed.ts or separate script):

Create initial admin user with hashed password
Optionally create 1-2 sample galleries for testing
Can be run with npx tsx server/utils/seed.ts



Requirements:

Use NuxtHub database (import { db } from '@nuxthub/db') - NOT manual Drizzle setup
Use Nuxt 4 best practices from official docs (leverage the Nuxt MCP tool)
Follow Drizzle ORM PostgreSQL patterns for schema and queries
Implement proper error handling with createError() utility
Use defineCachedEventHandler where appropriate for performance
Hash all passwords with argon2 (never store plaintext)
Add comprehensive input validation (use zod for request body validation)
Use TypeScript strictly throughout
Set up Cloudinary transformations (thumbnail: 300x300 crop, optimized: auto quality/format)
Add database indexes on frequently queried fields
Include JSDoc comments on all utility functions
Proper CORS and security headers on API routes

Deliverables for Phase 1:

Complete working NuxtHub database setup with Neon
All schema tables created with proper relations
All API endpoints implemented and functional
Authentication/authorization working with JWT
Cloudinary integration operational
Seed script to create test admin user
Clear testing instructions for each endpoint

Testing approach:
After implementation, provide curl commands or testing steps for each endpoint so we can verify everything works before moving to Phase 2 (Frontend).
Use the Nuxt MCP tool extensively to ensure NuxtHub database setup follows the latest Nuxt 4 patterns. Start with database schema and core utilities, then systematically build out the API routes.