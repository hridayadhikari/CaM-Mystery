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

/**
 * Uploads a file (image or video) directly to Cloudinary using unsigned client-side upload.
 * Avoids heavy backend SDKs by using standard FormData and fetch.
 */
export async function uploadToCloudinary(
  file: File,
  folder: CloudinaryFolder = 'uploads',
  resourceType: 'image' | 'video' | 'auto' = 'auto'
): Promise<CloudinaryUploadResponse> {
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

  const response = await fetch(endpoint, {
    method: 'POST',
    body: formData,
  });

  const data = await response.json();

  if (!response.ok) {
    const errorMessage =
      data?.error?.message ||
      `Upload failed with status ${response.status}: ${response.statusText}`;
    throw new Error(`[Cloudinary] ${errorMessage}`);
  }

  return {
    secure_url: data.secure_url,
    public_id: data.public_id,
    asset_id: data.asset_id,
    width: data.width,
    height: data.height,
    format: data.format,
    resource_type: data.resource_type,
  };
}
