# API Testing Guide - Password-Protected Gallery System

This guide provides step-by-step instructions to test all backend API endpoints.

## Prerequisites

1. Start the development server:
   ```bash
   npm run dev
   ```

2. Admin credentials (from seed):
   - Email: `admin@nicolasWolff.com`
   - Password: `admin123456`

## Testing Tools

You can use any of the following:
- **curl** (command line)
- **Postman** (GUI)
- **Insomnia** (GUI)
- **Browser DevTools** (for GET requests)

---

## Phase 1: Admin Authentication

### 1.1 Admin Login (POST)

```bash
curl -X POST http://localhost:3000/api/admin/auth/login \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"admin@nicolasWolff.com\",\"password\":\"admin123456\"}" \
  -c cookies.txt
```

**Expected Response (200):**
```json
{
  "success": true,
  "user": {
    "id": 1,
    "email": "admin@nicolasWolff.com",
    "name": "Admin User",
    "createdAt": "2025-..."
  },
  "token": "eyJhbGc..."
}
```

**Note:** Save the cookies for subsequent requests using `-b cookies.txt`

### 1.2 Get Current Admin (GET)

```bash
curl http://localhost:3000/api/admin/auth/me \
  -b cookies.txt
```

**Expected Response (200):**
```json
{
  "success": true,
  "user": {
    "id": 1,
    "email": "admin@nicolasWolff.com",
    "name": "Admin User",
    "createdAt": "2025-..."
  }
}
```

### 1.3 Admin Logout (POST)

```bash
curl -X POST http://localhost:3000/api/admin/auth/logout \
  -b cookies.txt
```

**Expected Response (200):**
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

---

## Phase 2: Gallery Management (Admin)

**Note:** Login first and use cookies for all admin requests below.

### 2.1 Create Gallery (POST)

```bash
curl -X POST http://localhost:3000/api/admin/galleries \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d "{
    \"title\": \"Wedding Photography 2025\",
    \"clientName\": \"John & Jane Doe\",
    \"password\": \"wedding123\",
    \"expiresAt\": \"2025-12-31T23:59:59.000Z\",
    \"maxViews\": 50
  }"
```

**Expected Response (200):**
```json
{
  "success": true,
  "gallery": {
    "id": 1,
    "title": "Wedding Photography 2025",
    "clientName": "John & Jane Doe",
    "slug": "wedding-photography-2025-1738588800000",
    "expiresAt": "2025-12-31T23:59:59.000Z",
    "maxViews": 50,
    "viewCount": 0,
    "createdAt": "2025-...",
    "updatedAt": "2025-..."
  }
}
```

**Save the slug for later tests!**

### 2.2 List All Galleries (GET)

```bash
curl http://localhost:3000/api/admin/galleries \
  -b cookies.txt
```

**Expected Response (200):**
```json
{
  "success": true,
  "galleries": [
    {
      "id": 1,
      "title": "Wedding Photography 2025",
      "clientName": "John & Jane Doe",
      "slug": "wedding-photography-2025-1738588800000",
      "expiresAt": "2025-12-31T23:59:59.000Z",
      "maxViews": 50,
      "viewCount": 0,
      "createdAt": "2025-...",
      "updatedAt": "2025-...",
      "imageCount": 0
    }
  ]
}
```

### 2.3 Get Single Gallery (GET)

Replace `{id}` with the gallery ID from previous response.

```bash
curl http://localhost:3000/api/admin/galleries/1 \
  -b cookies.txt
```

**Expected Response (200):**
```json
{
  "success": true,
  "gallery": {
    "id": 1,
    "title": "Wedding Photography 2025",
    "clientName": "John & Jane Doe",
    "slug": "wedding-photography-2025-1738588800000",
    "expiresAt": "2025-12-31T23:59:59.000Z",
    "maxViews": 50,
    "viewCount": 0,
    "createdAt": "2025-...",
    "updatedAt": "2025-...",
    "images": []
  }
}
```

### 2.4 Update Gallery (PATCH)

```bash
curl -X PATCH http://localhost:3000/api/admin/galleries/1 \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d "{
    \"title\": \"Wedding Photography 2025 - Updated\",
    \"maxViews\": 100
  }"
```

**Expected Response (200):**
```json
{
  "success": true,
  "gallery": {
    "id": 1,
    "title": "Wedding Photography 2025 - Updated",
    "clientName": "John & Jane Doe",
    "slug": "wedding-photography-2025-1738588800000",
    "expiresAt": "2025-12-31T23:59:59.000Z",
    "maxViews": 100,
    "viewCount": 0,
    "createdAt": "2025-...",
    "updatedAt": "2025-..."
  }
}
```

---

## Phase 3: Image Management (Admin)

### 3.1 Upload Images (POST)

Create a test image file or use an existing one:

```bash
curl -X POST http://localhost:3000/api/admin/galleries/1/images \
  -b cookies.txt \
  -F "file1=@/path/to/image1.jpg" \
  -F "file2=@/path/to/image2.jpg"
```

**Expected Response (200):**
```json
{
  "success": true,
  "images": [
    {
      "id": 1,
      "galleryId": 1,
      "cloudinaryPublicId": "gallery-1/abc123",
      "url": "https://res.cloudinary.com/.../image1.jpg",
      "thumbnailUrl": "https://res.cloudinary.com/.../image1.jpg",
      "width": 1920,
      "height": 1080,
      "caption": null,
      "displayOrder": 1,
      "createdAt": "2025-..."
    },
    {
      "id": 2,
      "galleryId": 1,
      "cloudinaryPublicId": "gallery-1/def456",
      "url": "https://res.cloudinary.com/.../image2.jpg",
      "thumbnailUrl": "https://res.cloudinary.com/.../image2.jpg",
      "width": 1920,
      "height": 1080,
      "caption": null,
      "displayOrder": 2,
      "createdAt": "2025-..."
    }
  ],
  "count": 2
}
```

### 3.2 Update Image (PATCH)

```bash
curl -X PATCH http://localhost:3000/api/admin/galleries/1/images/1 \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d "{
    \"caption\": \"Beautiful ceremony moment\",
    \"displayOrder\": 1
  }"
```

**Expected Response (200):**
```json
{
  "success": true,
  "image": {
    "id": 1,
    "galleryId": 1,
    "cloudinaryPublicId": "gallery-1/abc123",
    "url": "https://res.cloudinary.com/.../image1.jpg",
    "thumbnailUrl": "https://res.cloudinary.com/.../image1.jpg",
    "width": 1920,
    "height": 1080,
    "caption": "Beautiful ceremony moment",
    "displayOrder": 1,
    "createdAt": "2025-..."
  }
}
```

### 3.3 Delete Image (DELETE)

```bash
curl -X DELETE http://localhost:3000/api/admin/galleries/1/images/2 \
  -b cookies.txt
```

**Expected Response (200):**
```json
{
  "success": true,
  "message": "Image deleted successfully"
}
```

---

## Phase 4: Client Gallery Access

### 4.1 Authenticate with Gallery Password (POST)

Use the slug from the gallery creation step.

```bash
curl -X POST http://localhost:3000/api/galleries/wedding-photography-2025-1738588800000/auth \
  -H "Content-Type: application/json" \
  -d "{\"password\":\"wedding123\"}" \
  -c client_cookies.txt
```

**Expected Response (200):**
```json
{
  "success": true,
  "message": "Authentication successful"
}
```

**Test wrong password (401):**
```bash
curl -X POST http://localhost:3000/api/galleries/wedding-photography-2025-1738588800000/auth \
  -H "Content-Type: application/json" \
  -d "{\"password\":\"wrongpassword\"}"
```

**Expected Response (401):**
```json
{
  "statusCode": 401,
  "statusMessage": "Unauthorized",
  "message": "Invalid password"
}
```

### 4.2 Get Gallery Metadata (GET)

```bash
curl http://localhost:3000/api/galleries/wedding-photography-2025-1738588800000 \
  -b client_cookies.txt
```

**Expected Response (200):**
```json
{
  "success": true,
  "gallery": {
    "id": 1,
    "title": "Wedding Photography 2025 - Updated",
    "clientName": "John & Jane Doe",
    "slug": "wedding-photography-2025-1738588800000",
    "imageCount": 1
  }
}
```

**Test without authentication (403):**
```bash
curl http://localhost:3000/api/galleries/wedding-photography-2025-1738588800000
```

**Expected Response (403):**
```json
{
  "statusCode": 403,
  "statusMessage": "Forbidden",
  "message": "Gallery access denied. Please authenticate first."
}
```

### 4.3 Get Gallery Images (GET)

```bash
curl http://localhost:3000/api/galleries/wedding-photography-2025-1738588800000/images \
  -b client_cookies.txt
```

**Expected Response (200):**
```json
{
  "success": true,
  "images": [
    {
      "id": 1,
      "galleryId": 1,
      "cloudinaryPublicId": "gallery-1/abc123",
      "url": "https://res.cloudinary.com/.../image1.jpg",
      "thumbnailUrl": "https://res.cloudinary.com/.../image1.jpg",
      "width": 1920,
      "height": 1080,
      "caption": "Beautiful ceremony moment",
      "displayOrder": 1,
      "createdAt": "2025-..."
    }
  ]
}
```

**Note:** View count increments each time this endpoint is called.

---

## Phase 5: Gallery Expiry & Limits Testing

### 5.1 Test Expired Gallery

Create a gallery with past expiry date:

```bash
curl -X POST http://localhost:3000/api/admin/galleries \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d "{
    \"title\": \"Expired Gallery\",
    \"clientName\": \"Test Client\",
    \"password\": \"test123\",
    \"expiresAt\": \"2020-01-01T00:00:00.000Z\"
  }"
```

Try to authenticate:

```bash
curl -X POST http://localhost:3000/api/galleries/{slug}/auth \
  -H "Content-Type: application/json" \
  -d "{\"password\":\"test123\"}"
```

**Expected Response (403):**
```json
{
  "statusCode": 403,
  "statusMessage": "Forbidden",
  "message": "This gallery has expired"
}
```

### 5.2 Test View Limit

Create a gallery with maxViews=1:

```bash
curl -X POST http://localhost:3000/api/admin/galleries \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d "{
    \"title\": \"Limited Gallery\",
    \"clientName\": \"Test Client\",
    \"password\": \"test123\",
    \"maxViews\": 1
  }"
```

1. Authenticate successfully
2. View images (increments viewCount to 1)
3. Try to authenticate again

**Expected Response (403):**
```json
{
  "statusCode": 403,
  "statusMessage": "Forbidden",
  "message": "This gallery has reached its view limit"
}
```

---

## Phase 6: Delete Gallery Test

### 6.1 Delete Gallery with Images (DELETE)

```bash
curl -X DELETE http://localhost:3000/api/admin/galleries/1 \
  -b cookies.txt
```

**Expected Response (200):**
```json
{
  "success": true,
  "message": "Gallery deleted successfully",
  "deletedImages": 1
}
```

**Verification:**
- Check that gallery is removed from database
- Check Cloudinary dashboard - images should be deleted
- Try to access deleted gallery (should return 404)

---

## Phase 7: Public Portfolio Testing

**Critical: Ensure public routes still work!**

1. Open browser: `http://localhost:3000/`
   - Landing page should load
   - Animations should work
   - No console errors

2. Navigate to: `http://localhost:3000/work/adeux-burger-house`
   - Project detail page should load
   - Images should display

3. Navigate to: `http://localhost:3000/variations`
   - Variations page should load

---

## Phase 8: Error Handling Tests

### 8.1 Unauthorized Access

```bash
# Try admin endpoint without login
curl http://localhost:3000/api/admin/galleries
```

**Expected Response (401):**
```json
{
  "statusCode": 401,
  "statusMessage": "Unauthorized",
  "message": "Admin authentication required"
}
```

### 8.2 Invalid Data

```bash
# Create gallery with invalid data
curl -X POST http://localhost:3000/api/admin/galleries \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d "{\"title\":\"\",\"clientName\":\"Test\"}"
```

**Expected Response (400):**
```json
{
  "statusCode": 400,
  "statusMessage": "Validation Error",
  "message": "..."
}
```

### 8.3 Not Found

```bash
# Get non-existent gallery
curl http://localhost:3000/api/admin/galleries/9999 \
  -b cookies.txt
```

**Expected Response (404):**
```json
{
  "statusCode": 404,
  "statusMessage": "Not Found",
  "message": "Gallery not found"
}
```

---

## Testing Checklist

### Admin Authentication
- [x] Login with valid credentials → 200 + JWT cookie
- [x] Login with invalid credentials → 401
- [x] Get current admin with cookie → 200
- [x] Get current admin without cookie → 401
- [x] Logout → 200 + cookie cleared

### Gallery CRUD
- [x] Create gallery → 200 + gallery object
- [x] List galleries → 200 + galleries array with image counts
- [x] Get single gallery → 200 + gallery with images
- [x] Update gallery → 200 + updated gallery
- [x] Delete gallery → 200 + Cloudinary cleanup
- [x] All endpoints without auth → 401

### Image Management
- [x] Upload images → 200 + Cloudinary URLs
- [x] Update image caption/order → 200
- [x] Delete image → 200 + Cloudinary cleanup

### Client Gallery Access
- [x] Authenticate with correct password → 200 + cookie
- [x] Authenticate with wrong password → 401
- [x] Authenticate with expired gallery → 403
- [x] Authenticate with gallery at view limit → 403
- [x] Get gallery metadata with session → 200
- [x] Get gallery metadata without session → 403
- [x] Get images with session → 200 + increments viewCount
- [x] Get images without session → 403

### Public Portfolio
- [x] Landing page (/) → 200
- [x] Project detail (/work/[slug]) → 200
- [x] Variations page → 200
- [x] No console errors
- [x] Animations working

---

## Success Criteria

The backend is complete when:
- ✅ All 14 API endpoints return correct responses
- ✅ Authentication/authorization works properly
- ✅ Images upload to Cloudinary successfully
- ✅ Seed admin can login and create galleries
- ✅ View counts increment correctly
- ✅ Expiry and view limits are enforced
- ✅ Public portfolio is completely unaffected
- ✅ No TypeScript errors or warnings

---

## Next Steps

Once all tests pass, you can proceed with:
1. Frontend development (admin dashboard UI)
2. Client gallery UI (password prompt + image grid)
3. Production deployment
4. Change default admin password!
