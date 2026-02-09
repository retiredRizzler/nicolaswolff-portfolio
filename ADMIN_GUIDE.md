# Admin Dashboard & Client Gallery System

This document provides a complete guide to the admin dashboard and client gallery system for Nicolas Wolff Photography.

## Overview

The system consists of two main parts:
1. **Admin Dashboard** - For managing client galleries and uploading images
2. **Client Gallery Viewer** - For clients to view their photography galleries with password protection

## Getting Started

### Default Admin Credentials

After running the database seed, you can login with:

- **Email**: `admin@nicolasWolff.com`
- **Password**: `admin123456`

⚠️ **IMPORTANT**: Change these credentials in production!

### Accessing the Admin Dashboard

1. Navigate to `/admin/login`
2. Enter your admin credentials
3. You'll be redirected to `/admin/galleries`

## Admin Features

### 1. Gallery Management

#### Creating a New Gallery

1. Click "Create New Gallery" button on the galleries page
2. Fill in the form:
   - **Gallery Title**: Descriptive name for the gallery (e.g., "Wedding Photography - Smith Family")
   - **Client Name**: Name of the client (e.g., "John Smith")
   - **Gallery Password**: Password the client will use to access the gallery (minimum 4 characters)
   - **Expiration Date** (Optional): When the gallery should expire
   - **Maximum Views** (Optional): Limit how many times the gallery can be viewed

3. Click "Create Gallery"
4. You'll be redirected to the gallery edit page

#### Editing Gallery Details

On the gallery edit page (`/admin/galleries/{id}`), you can:

- Update gallery title
- Update client name
- Change expiration date
- Modify maximum view limit
- View gallery statistics (view count, image count)
- See the client-facing gallery link

#### Deleting a Gallery

1. Go to the galleries list (`/admin/galleries`)
2. Click the "Delete" button next to the gallery
3. Confirm the deletion
4. All images in the gallery will be permanently deleted from Cloudinary

### 2. Image Management

#### Uploading Images

1. Open a gallery in edit mode (`/admin/galleries/{id}`)
2. Click "Upload Images" button
3. Select one or multiple images from your computer
4. Images will be automatically uploaded to Cloudinary
5. Uploaded images appear in the gallery grid

Supported formats: JPG, PNG, WEBP, and other common image formats

#### Editing Image Details

1. Hover over an image in the gallery grid
2. Click the pencil icon
3. In the modal, you can:
   - **Caption**: Add or edit image caption (shows on hover for clients)
   - **Display Order**: Change the order images appear (lower numbers appear first)
4. Click "Save Changes"

#### Deleting Images

1. Hover over an image in the gallery grid
2. Click the trash icon
3. Confirm deletion
4. Image will be removed from Cloudinary and the database

### 3. Sharing Galleries with Clients

After creating a gallery and uploading images:

1. Find the gallery slug on the edit page (shown as `/client/galleries/{slug}`)
2. Send the client this URL: `https://yourdomain.com/client/galleries/{slug}`
3. Provide the client with the gallery password you set
4. Client can access the gallery using the password

## Client Gallery Features

### For Clients

1. **Access Gallery**:
   - Navigate to the gallery URL provided by the photographer
   - Enter the password
   - View all images

2. **Image Viewing**:
   - Masonry grid layout for browsing
   - Click any image to open full-size lightbox
   - Navigate between images using arrow buttons or keyboard arrows
   - View captions by hovering over images (grid view) or in lightbox
   - Press ESC to close lightbox

3. **Gallery Information**:
   - Gallery title and client name shown in header
   - Image count displayed

### Gallery Restrictions

Galleries can have two types of restrictions:

1. **Expiration Date**: Gallery becomes inaccessible after this date
2. **Maximum Views**: Gallery becomes inaccessible after being viewed this many times

When a gallery is restricted, clients will see an error message and cannot access images.

## Technical Details

### File Structure

```
app/
├── types/
│   └── admin.ts                          # TypeScript interfaces
├── composables/
│   ├── useAdminApi.ts                    # Admin API calls
│   ├── useClientGallery.ts               # Client gallery API calls
│   └── useAuth.ts                        # Auth state management
├── middleware/
│   ├── admin.ts                          # Admin route protection
│   └── client-gallery.ts                 # Client gallery route protection
├── layouts/
│   └── admin.vue                         # Admin layout
├── pages/
│   ├── admin/
│   │   ├── login.vue                     # Admin login
│   │   └── galleries/
│   │       ├── index.vue                 # List all galleries
│   │       ├── new.vue                   # Create gallery
│   │       └── [id].vue                  # Edit gallery + manage images
│   └── client/
│       └── galleries/
│           └── [slug]/
│               ├── index.vue             # Password entry
│               └── view.vue              # View gallery images
```

### API Endpoints Used

**Admin Authentication**:
- `POST /api/admin/auth/login` - Admin login
- `POST /api/admin/auth/logout` - Admin logout
- `GET /api/admin/auth/me` - Get current admin user

**Gallery Management**:
- `GET /api/admin/galleries` - List all galleries
- `POST /api/admin/galleries` - Create new gallery
- `GET /api/admin/galleries/{id}` - Get gallery details
- `PATCH /api/admin/galleries/{id}` - Update gallery
- `DELETE /api/admin/galleries/{id}` - Delete gallery

**Image Management**:
- `POST /api/admin/galleries/{id}/images` - Upload images (multipart/form-data)
- `PATCH /api/admin/galleries/{id}/images/{imageId}` - Update image
- `DELETE /api/admin/galleries/{id}/images/{imageId}` - Delete image

**Client Gallery**:
- `POST /api/galleries/{slug}/auth` - Authenticate with password
- `GET /api/galleries/{slug}` - Get gallery metadata
- `GET /api/galleries/{slug}/images` - Get gallery images

### Authentication Flow

**Admin**:
1. Login creates JWT token stored in httpOnly cookie
2. Middleware checks auth state on all `/admin/*` routes
3. Unauthenticated users redirected to `/admin/login`
4. Auth state managed via `useAuth()` composable

**Client Gallery**:
1. Password submission creates session stored in httpOnly cookie
2. Middleware checks session on `/client/galleries/{slug}/view` route
3. Unauthenticated users redirected to password page
4. View count incremented automatically on first successful auth

## Design System

The admin interface uses:

- **Color Scheme**: Dark text (#201d1d) on light background (#f4f4f4)
- **Font**: PP Neue Montreal (matches the main portfolio site)
- **Components**: Nuxt UI components with `slate` as primary color
- **Responsive**: Mobile-first design, works on all devices

## Best Practices

### For Administrators

1. **Gallery Passwords**: Use strong passwords and communicate them securely to clients
2. **Expiration Dates**: Set reasonable expiration dates for client galleries
3. **Image Organization**: Use display order numbers strategically (0, 10, 20, etc. for easy reordering)
4. **Captions**: Add captions to important images for context
5. **Regular Cleanup**: Delete old galleries to save storage space

### For Developers

1. **Error Handling**: All API errors show toast notifications automatically
2. **Loading States**: Loading indicators on all async operations
3. **Optimistic UI**: Some actions update UI immediately for better UX
4. **Type Safety**: Full TypeScript coverage for all data types
5. **Composables**: Reusable logic extracted to composables

## Troubleshooting

### Common Issues

**Cannot Login**:
- Verify email and password are correct
- Check database connection in `.env`
- Ensure admin user exists in database (run seed script)

**Images Not Uploading**:
- Check Cloudinary credentials in `.env`
- Verify file size is within limits
- Check browser console for errors

**Gallery Link Not Working**:
- Verify slug is correct (shown on edit page)
- Check if gallery has expired
- Check if view limit has been reached

**Client Cannot Access Gallery**:
- Verify password is correct
- Check if gallery has expired
- Check if maximum views has been reached

## Future Enhancements

Potential features to add:

- [ ] Drag-and-drop image reordering
- [ ] Bulk image operations (delete multiple, update multiple)
- [ ] Gallery analytics dashboard (views over time, popular images)
- [ ] Email notifications when gallery is ready
- [ ] Social sharing options for clients
- [ ] ZIP download of all gallery images
- [ ] Client favorites/selection feature
- [ ] Image comments from clients
- [ ] Gallery templates/presets
- [ ] Watermark options

## Security Considerations

1. **Passwords**: Gallery passwords are hashed with Argon2 before storage
2. **Sessions**: JWT tokens stored in httpOnly cookies (prevents XSS attacks)
3. **Authentication**: All admin routes protected by middleware
4. **File Validation**: Only image files accepted for upload
5. **HTTPS Required**: Cookies only work over HTTPS in production

## Support

For issues or questions about the admin system:
1. Check this guide first
2. Review the implementation plan (in project documentation)
3. Check browser console for errors
4. Verify `.env` configuration is correct

---

© 2026 Nicolas Wolff Photography
