import { pgTable, text, serial, timestamp, integer, index } from 'drizzle-orm/pg-core'
import { relations } from 'drizzle-orm'

// Admin Users Table
export const adminUsers = pgTable('admin_users', {
  id: serial('id').primaryKey(),
  email: text('email').notNull().unique(),
  passwordHash: text('password_hash').notNull(),
  name: text('name').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow()
}, (table) => ({
  emailIdx: index('admin_email_idx').on(table.email)
}))

// Galleries Table
export const galleries = pgTable('galleries', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  clientName: text('client_name').notNull(),
  slug: text('slug').notNull().unique(),
  passwordHash: text('password_hash').notNull(),
  expiresAt: timestamp('expires_at'),
  maxViews: integer('max_views'),
  viewCount: integer('view_count').notNull().default(0),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow()
}, (table) => ({
  slugIdx: index('gallery_slug_idx').on(table.slug)
}))

// Images Table
export const images = pgTable('images', {
  id: serial('id').primaryKey(),
  galleryId: integer('gallery_id').notNull().references(() => galleries.id, { onDelete: 'cascade' }),
  cloudinaryPublicId: text('cloudinary_public_id').notNull(),
  url: text('url').notNull(),
  thumbnailUrl: text('thumbnail_url').notNull(),
  width: integer('width').notNull(),
  height: integer('height').notNull(),
  caption: text('caption'),
  displayOrder: integer('display_order').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow()
}, (table) => ({
  galleryIdx: index('image_gallery_idx').on(table.galleryId),
  orderIdx: index('image_order_idx').on(table.galleryId, table.displayOrder)
}))

// Relations
export const galleriesRelations = relations(galleries, ({ many }) => ({
  images: many(images)
}))

export const imagesRelations = relations(images, ({ one }) => ({
  gallery: one(galleries, {
    fields: [images.galleryId],
    references: [galleries.id]
  })
}))
