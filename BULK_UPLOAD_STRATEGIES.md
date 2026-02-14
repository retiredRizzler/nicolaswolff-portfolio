# Bulk Photo Upload Strategies for Client Galleries

This guide outlines different strategies for efficiently uploading large amounts of photos to Cloudinary, based on your client gallery system requirements.

## Current Implementation

Your current implementation uses the basic `upload` method in `server/api/admin/galleries/[id]/images.post.ts`:

```typescript
// Current: Sequential upload with basic method
for (const file of files) {
  const result = await uploadToCloudinary(file)
  // Process each file one by one
}
```

**Limitations:**
- Uploads files sequentially (slow for bulk uploads)
- Loads entire file into memory
- Limited to 100 MB per file
- No progress tracking
- No resume capability if network fails

---

## Recommended Strategies

### 1. **Parallel Uploads (Recommended for Most Cases)**

Upload multiple files simultaneously to dramatically reduce total upload time.

**Best for:**
- 5-50 photos per gallery
- Photos under 100 MB each
- Standard photography files (5-20 MB JPEGs)

**Implementation:**

```typescript
// Process multiple files in parallel with concurrency limit
async function uploadMultipleFiles(files: File[], concurrencyLimit = 5) {
  const results = []

  // Split files into batches to avoid overwhelming the server
  for (let i = 0; i < files.length; i += concurrencyLimit) {
    const batch = files.slice(i, i + concurrencyLimit)

    const batchResults = await Promise.all(
      batch.map(file => uploadToCloudinary(file))
    )

    results.push(...batchResults)
  }

  return results
}
```

**Pros:**
- 3-5x faster than sequential uploads
- Simple to implement
- Works with existing code

**Cons:**
- Can strain server memory with too many concurrent uploads
- No resume capability

---

### 2. **Stream-Based Uploads (For Memory Efficiency)**

Use `upload_stream` to upload files without loading them entirely into memory.

**Best for:**
- Large photo files (50-100 MB RAW files)
- Server with limited memory
- Handling user-uploaded files directly

**Implementation:**

```typescript
import { Readable } from 'stream'

async function uploadViaStream(fileBuffer: Buffer, options: any) {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.v2.uploader.upload_stream(
      options,
      (error, result) => {
        if (error) reject(error)
        else resolve(result)
      }
    )

    // Create readable stream from buffer
    const readable = Readable.from(fileBuffer)
    readable.pipe(uploadStream)
  })
}

// Use with parallel processing
async function uploadMultipleStreams(files: File[], concurrencyLimit = 3) {
  const results = []

  for (let i = 0; i < files.length; i += concurrencyLimit) {
    const batch = files.slice(i, i + concurrencyLimit)

    const batchResults = await Promise.all(
      batch.map(file => {
        const buffer = file.arrayBuffer()
        return uploadViaStream(Buffer.from(buffer), {
          folder: 'galleries',
          resource_type: 'image'
        })
      })
    )

    results.push(...batchResults)
  }

  return results
}
```

**Pros:**
- Lower memory footprint
- Can handle larger files
- Better for server stability

**Cons:**
- Slightly more complex code
- Still limited to 100 MB per file

---

### 3. **Chunked Uploads (For Very Large Files)**

Use `upload_chunked` for files over 100 MB or with unreliable networks.

**Best for:**
- RAW photo files (100+ MB)
- Slow/unreliable client connections
- Need resume capability

**Implementation:**

```typescript
async function uploadChunked(filePath: string, options: any) {
  return new Promise((resolve, reject) => {
    cloudinary.v2.uploader.upload_chunked(
      filePath,
      {
        chunk_size: 6000000, // 6 MB chunks
        ...options
      },
      (error, result) => {
        if (error) reject(error)
        else resolve(result)
      }
    )
  })
}
```

**Pros:**
- Network fault tolerance
- Can upload files > 100 MB
- Progress tracking per chunk

**Cons:**
- Slower than basic upload for small files
- More complex to implement

---

### 4. **Hybrid Approach (Production Recommended)**

Combine strategies based on file size and quantity.

**Implementation:**

```typescript
interface UploadStrategy {
  files: File[]
  concurrencyLimit: number
  useChunking: boolean
}

async function intelligentBulkUpload(files: File[]) {
  // Categorize files by size
  const smallFiles = files.filter(f => f.size < 20_000_000) // < 20 MB
  const mediumFiles = files.filter(f => f.size >= 20_000_000 && f.size < 100_000_000)
  const largeFiles = files.filter(f => f.size >= 100_000_000) // > 100 MB

  const results = []

  // Upload small files in parallel (high concurrency)
  if (smallFiles.length > 0) {
    const smallResults = await uploadParallel(smallFiles, 8)
    results.push(...smallResults)
  }

  // Upload medium files with streams (moderate concurrency)
  if (mediumFiles.length > 0) {
    const mediumResults = await uploadStreams(mediumFiles, 4)
    results.push(...mediumResults)
  }

  // Upload large files with chunking (low concurrency)
  if (largeFiles.length > 0) {
    const largeResults = await uploadChunked(largeFiles, 2)
    results.push(...largeResults)
  }

  return results
}
```

**Pros:**
- Optimized for all scenarios
- Best performance-to-reliability ratio
- Production-ready

**Cons:**
- More code complexity
- Requires testing different file sizes

---

## Additional Optimizations

### A. Progress Tracking

Add real-time progress updates for better UX:

```typescript
interface UploadProgress {
  totalFiles: number
  uploadedFiles: number
  failedFiles: number
  currentFile: string
  percentage: number
}

async function uploadWithProgress(
  files: File[],
  onProgress: (progress: UploadProgress) => void
) {
  const progress: UploadProgress = {
    totalFiles: files.length,
    uploadedFiles: 0,
    failedFiles: 0,
    currentFile: '',
    percentage: 0
  }

  const results = []

  for (const file of files) {
    progress.currentFile = file.name

    try {
      const result = await uploadToCloudinary(file)
      results.push(result)
      progress.uploadedFiles++
    } catch (error) {
      progress.failedFiles++
    }

    progress.percentage = Math.round(
      (progress.uploadedFiles + progress.failedFiles) / progress.totalFiles * 100
    )

    onProgress({ ...progress })
  }

  return results
}
```

### B. Retry Logic

Handle network failures gracefully:

```typescript
async function uploadWithRetry(
  file: File,
  maxRetries = 3,
  retryDelay = 1000
) {
  let lastError

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await uploadToCloudinary(file)
    } catch (error) {
      lastError = error

      if (attempt < maxRetries) {
        await new Promise(resolve =>
          setTimeout(resolve, retryDelay * attempt)
        )
      }
    }
  }

  throw lastError
}
```

### C. Image Optimization Before Upload

Resize/compress on server before uploading:

```typescript
import sharp from 'sharp'

async function optimizeAndUpload(file: File, maxWidth = 4000) {
  const buffer = await file.arrayBuffer()

  // Resize if too large, maintain aspect ratio
  const optimized = await sharp(Buffer.from(buffer))
    .resize(maxWidth, null, {
      withoutEnlargement: true,
      fit: 'inside'
    })
    .jpeg({ quality: 90 })
    .toBuffer()

  // Upload optimized version
  return uploadToCloudinary(optimized)
}
```

---

## Recommended Implementation for Your Gallery System

Based on your use case (photographers uploading client galleries):

```typescript
// server/api/admin/galleries/[id]/images.post.ts

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  const formData = await readFormData(event)
  const files = formData.getAll('images') as File[]

  // Validate file count
  if (files.length > 100) {
    throw createError({
      statusCode: 400,
      message: 'Maximum 100 files per upload'
    })
  }

  const uploadedImages = []
  const errors = []

  // Upload in batches of 5 with retry logic
  const BATCH_SIZE = 5

  for (let i = 0; i < files.length; i += BATCH_SIZE) {
    const batch = files.slice(i, i + BATCH_SIZE)

    const batchResults = await Promise.allSettled(
      batch.map(async (file, index) => {
        const displayOrder = i + index

        // Retry up to 3 times
        for (let attempt = 1; attempt <= 3; attempt++) {
          try {
            // Upload to Cloudinary
            const result = await uploadToCloudinary(
              await file.arrayBuffer(),
              {
                folder: `galleries/${id}`,
                resource_type: 'image'
              }
            )

            // Save to database
            const [image] = await db.insert(images).values({
              galleryId: Number(id),
              cloudinaryPublicId: result.public_id,
              url: result.secure_url,
              thumbnailUrl: result.eager?.[0]?.secure_url || result.secure_url,
              width: result.width,
              height: result.height,
              displayOrder
            }).returning()

            return image
          } catch (error) {
            if (attempt === 3) throw error
            await new Promise(r => setTimeout(r, 1000 * attempt))
          }
        }
      })
    )

    // Collect results
    batchResults.forEach((result, index) => {
      if (result.status === 'fulfilled') {
        uploadedImages.push(result.value)
      } else {
        errors.push({
          file: batch[index].name,
          error: result.reason.message
        })
      }
    })
  }

  return {
    success: true,
    uploaded: uploadedImages.length,
    failed: errors.length,
    images: uploadedImages,
    errors: errors.length > 0 ? errors : undefined
  }
})
```

---

## Summary Table

| Strategy | Files | File Size | Speed | Memory | Complexity |
|----------|-------|-----------|-------|--------|------------|
| **Sequential** | Any | < 100 MB | ⭐ | ⭐⭐⭐ | ⭐ |
| **Parallel (5)** | 5-50 | < 100 MB | ⭐⭐⭐⭐ | ⭐⭐ | ⭐⭐ |
| **Stream** | Any | < 100 MB | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ |
| **Chunked** | Any | > 100 MB | ⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐ |
| **Hybrid** | Many | All sizes | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ |

---

## Next Steps

1. **Immediate**: Implement parallel uploads with batching (5-10x faster)
2. **Short-term**: Add progress tracking and retry logic
3. **Long-term**: Implement hybrid strategy for production

**Estimated improvements:**
- 50 photos @ 10 MB each
  - Current: ~5-10 minutes
  - Parallel (batch of 5): ~1-2 minutes
  - Hybrid approach: ~45-90 seconds
