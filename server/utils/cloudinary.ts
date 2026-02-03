import { v2 as cloudinary } from 'cloudinary'
import type { UploadApiResponse } from 'cloudinary'

let _cloudinaryConfigured = false

/**
 * Get configured Cloudinary instance
 */
export function getCloudinaryClient() {
  if (!_cloudinaryConfigured) {
    const config = useRuntimeConfig()
    cloudinary.config({
      cloud_name: config.cloudinary.cloudName,
      api_key: config.cloudinary.apiKey,
      api_secret: config.cloudinary.apiSecret,
      secure: true
    })
    _cloudinaryConfigured = true
  }
  return cloudinary
}

/**
 * Upload an image to Cloudinary
 */
export async function uploadImage(
  fileBuffer: Buffer,
  folder: string
): Promise<UploadApiResponse> {
  const client = getCloudinaryClient()

  return new Promise((resolve, reject) => {
    const uploadStream = client.uploader.upload_stream(
      {
        folder,
        resource_type: 'image',
        quality: 'auto',
        fetch_format: 'auto'
      },
      (error, result) => {
        if (error) reject(error)
        else if (result) resolve(result)
        else reject(new Error('Upload failed'))
      }
    )

    uploadStream.end(fileBuffer)
  })
}

/**
 * Generate a thumbnail URL with transformation
 */
export function getThumbnailUrl(publicId: string): string {
  const client = getCloudinaryClient()
  return client.url(publicId, {
    width: 300,
    height: 300,
    crop: 'fill',
    gravity: 'auto',
    quality: 'auto',
    fetch_format: 'auto'
  })
}

/**
 * Delete an image from Cloudinary
 */
export async function deleteImage(publicId: string): Promise<void> {
  const client = getCloudinaryClient()
  await client.uploader.destroy(publicId)
}
