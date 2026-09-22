export type CloudinaryFolder = 'uploads' | 'images' | 'documents' | 'avatars' | 'videos';

export interface CloudinaryUploadResponse {
  secure_url: string;
  public_id: string;
  asset_id: string;
  width?: number;
  height?: number;
  format: string;
  resource_type?: string;
}

export const MAX_IMAGE_SIZE_BYTES = 10 * 1024 * 1024; // 10MB limit for images
export const MAX_IMAGE_SIZE_MB = 10;
export const MAX_VIDEO_SIZE_BYTES = 100 * 1024 * 1024; // 100MB limit for videos
export const MAX_VIDEO_SIZE_MB = 100;

// Backward-compatible alias for existing imports
export const MAX_FILE_SIZE_BYTES = MAX_IMAGE_SIZE_BYTES;
export const MAX_FILE_SIZE_MB = MAX_IMAGE_SIZE_MB;

/**
 * Uploads a file (image or video) directly to Cloudinary using unsigned client-side upload.
 * Avoids heavy backend SDKs by using standard FormData and fetch.
 */
export async function uploadToCloudinary(
  file: File,
  folder: CloudinaryFolder = 'uploads',
  resourceType: 'image' | 'video' | 'auto' = 'auto',
  onProgress?: (progressPercent: number) => void
): Promise<CloudinaryUploadResponse> {
  const isVideo = resourceType === 'video' || (resourceType === 'auto' && file.type.startsWith('video/'));
  const maxBytes = isVideo ? MAX_VIDEO_SIZE_BYTES : MAX_IMAGE_SIZE_BYTES;
  const maxMb = isVideo ? MAX_VIDEO_SIZE_MB : MAX_IMAGE_SIZE_MB;

  if (file.size > maxBytes) {
    const sizeMb = (file.size / (1024 * 1024)).toFixed(1);
    throw new Error(
      `${isVideo ? 'Video' : 'Image'} file size (${sizeMb} MB) exceeds the maximum allowed limit of ${maxMb} MB. Please select a smaller file.`
    );
  }

  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

  if (!cloudName || !uploadPreset) {
    throw new Error(
      'Cloudinary configuration missing: VITE_CLOUDINARY_CLOUD_NAME and VITE_CLOUDINARY_UPLOAD_PRESET must be configured.'
    );
  }

  // Determine resource type: images or videos
  const type =
    resourceType === 'auto'
      ? file.type.startsWith('video/')
        ? 'video'
        : 'image'
      : resourceType;

  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', uploadPreset);
  formData.append('asset_folder', folder);

  const endpoint = `https://api.cloudinary.com/v1_1/${cloudName}/${type}/upload`;

  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open('POST', endpoint);

    if (xhr.upload && onProgress) {
      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          const percent = Math.min(100, Math.round((event.loaded / event.total) * 100));
          onProgress(percent);
        }
      };
    }

    xhr.onload = () => {
      try {
        const data = JSON.parse(xhr.responseText);
        if (xhr.status >= 200 && xhr.status < 300) {
          if (onProgress) onProgress(100);
          resolve({
            secure_url: data.secure_url,
            public_id: data.public_id,
            asset_id: data.asset_id,
            width: data.width,
            height: data.height,
            format: data.format,
            resource_type: data.resource_type,
          });
        } else {
          const errorMessage =
            data?.error?.message ||
            `Upload failed with status ${xhr.status}: ${xhr.statusText}`;
          reject(new Error(`[Cloudinary] ${errorMessage}`));
        }
      } catch (err) {
        reject(new Error(`Upload failed with invalid response (status ${xhr.status})`));
      }
    };

    xhr.onerror = () => {
      reject(new Error('Network error occurred during file upload.'));
    };

    xhr.ontimeout = () => {
      reject(new Error('Upload timed out.'));
    };

    xhr.send(formData);
  });
}

/**
 * Checks whether a given URL is hosted on Cloudinary
 */
export function isCloudinaryUrl(url?: string): boolean {
  if (!url) return false;
  return url.includes('res.cloudinary.com') && url.includes('/image/upload/');
}

export interface CloudinaryTransformOptions {
  width?: number;
  quality?: string; // e.g. 'auto'
  format?: string; // e.g. 'auto'
  crop?: string; // e.g. 'limit', 'fill', 'scale'
}

/**
 * Generates an optimized Cloudinary delivery URL using URL transformations.
 * Preserves existing URL transformations, folders, and query parameters (such as cache busters `?t=...`).
 * Returns non-Cloudinary URLs unmodified.
 */
export function getOptimizedCloudinaryUrl(
  url?: string,
  options: CloudinaryTransformOptions = {}
): string {
  if (!url || typeof url !== 'string' || !isCloudinaryUrl(url)) {
    return url || '';
  }

  const {
    width,
    quality = 'auto',
    format = 'auto',
    crop = 'limit',
  } = options;

  // Split query string (e.g., ?t=1234567) so transformations are inserted into the path correctly
  const [basePath, query] = url.split('?');
  const uploadMarker = '/image/upload/';
  const uploadIdx = basePath.indexOf(uploadMarker);

  if (uploadIdx === -1) {
    return url;
  }

  const prefix = basePath.substring(0, uploadIdx + uploadMarker.length);
  let rest = basePath.substring(uploadIdx + uploadMarker.length);

  // Build the transformation parameters array
  const transforms: string[] = [];
  if (crop && width) {
    transforms.push(`c_${crop}`);
  }
  if (width) {
    transforms.push(`w_${width}`);
  }
  if (quality) {
    transforms.push(`q_${quality}`);
  }
  if (format) {
    transforms.push(`f_${format}`);
  }

  const transformString = transforms.join(',');

  // Check if URL already has an existing transformation segment right after /upload/
  // Cloudinary transform segments look like: c_fill,w_800/... or v12345/...
  const firstSlashIdx = rest.indexOf('/');
  if (firstSlashIdx !== -1) {
    const firstSegment = rest.substring(0, firstSlashIdx);
    // If the first segment is not a version string (e.g. not v123456789), it's existing transforms
    if (!/^v\d+$/.test(firstSegment)) {
      // Merge new transforms with existing transforms without duplicating q_ or f_ or w_
      const existingParts = firstSegment.split(',').filter((part) => {
        if (width && part.startsWith('w_')) return false;
        if (crop && part.startsWith('c_')) return false;
        if (quality && part.startsWith('q_')) return false;
        if (format && part.startsWith('f_')) return false;
        return true;
      });

      const combined = [transformString, ...existingParts].filter(Boolean).join(',');
      rest = combined + rest.substring(firstSlashIdx);
      return query ? `${prefix}${rest}?${query}` : `${prefix}${rest}`;
    }
  }

  // Insert our transformations before the rest of the path
  const transformedPath = `${prefix}${transformString}/${rest}`;
  return query ? `${transformedPath}?${query}` : transformedPath;
}

/**
 * Generates responsive srcSet string for Cloudinary images (e.g. 400w, 800w, 1200w, 1600w).
 * Returns undefined for non-Cloudinary images to maintain native fallback behavior.
 */
export function getCloudinarySrcSet(
  url?: string,
  widths: number[] = [400, 800, 1200, 1600],
  crop: string = 'limit'
): string | undefined {
  if (!url || !isCloudinaryUrl(url)) {
    return undefined;
  }

  return widths
    .map((w) => `${getOptimizedCloudinaryUrl(url, { width: w, crop })} ${w}w`)
    .join(', ');
}
