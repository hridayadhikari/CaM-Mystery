import React, { useState, useEffect } from 'react';
import { Upload, CheckCircle, AlertCircle, Loader2, ExternalLink } from 'lucide-react';
import { uploadToCloudinary, CloudinaryFolder, MAX_FILE_SIZE_BYTES, MAX_FILE_SIZE_MB, getOptimizedCloudinaryUrl } from '../../lib/cloudinary';

interface CloudinaryImageUploadProps {
  label?: string;
  currentUrl?: string;
  folder?: CloudinaryFolder;
  onUploaded: (secureUrl: string) => void;
  helperText?: string;
  hidePreview?: boolean;
  buttonText?: string;
}

export const CloudinaryImageUpload: React.FC<CloudinaryImageUploadProps> = ({
  label,
  currentUrl,
  folder = 'images',
  onUploaded,
  helperText,
  hidePreview = false,
  buttonText,
}) => {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | undefined>(currentUrl);
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);

  // Sync internal preview whenever currentUrl prop updates from parent
  useEffect(() => {
    if (!uploading) {
      setPreview(currentUrl);
      setUploadedUrl(null);
    }
  }, [currentUrl, uploading]);

  const triggerUpload = async (file: File) => {
    setError(null);
    setProgress(0);
    setUploading(true);

    const localBlob = URL.createObjectURL(file);
    setPreview(localBlob);

    try {
      const res = await uploadToCloudinary(
        file,
        folder as CloudinaryFolder,
        'image',
        (pct) => setProgress(pct)
      );

      // Append timestamp query param to completely bust browser and CDN caches
      const freshUrl = res.secure_url.includes('?')
        ? `${res.secure_url}&t=${Date.now()}`
        : `${res.secure_url}?t=${Date.now()}`;

      setPreview(freshUrl);
      setUploadedUrl(freshUrl);
      onUploaded(freshUrl);
    } catch (err: any) {
      console.error(err);
      setError(err?.message || 'Failed to upload image to Cloudinary.');
      // Keep local blob or previous preview visible so user sees what failed instead of mysterious silent rollback
      if (!preview) setPreview(currentUrl);
    } finally {
      setUploading(false);
      setProgress(0);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > MAX_FILE_SIZE_BYTES) {
      const sizeMb = (file.size / (1024 * 1024)).toFixed(1);
      setError(`File size (${sizeMb} MB) exceeds 10MB limit. Rejected before upload.`);
      e.target.value = '';
      return;
    }

    triggerUpload(file);
    e.target.value = '';
  };

  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-xs uppercase tracking-wider text-neutral-600 font-medium">
          {label}
        </label>
      )}

      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
        {/* Preview Box (optional) */}
        {!hidePreview && (
          <div className="relative w-24 h-24 sm:w-28 sm:h-28 bg-neutral-100 border border-neutral-200 rounded-sm overflow-hidden shrink-0 flex items-center justify-center group shadow-xs">
            {preview ? (
              <img
                src={getOptimizedCloudinaryUrl(preview, { width: 300 })}
                alt="Preview"
                loading="lazy"
                decoding="async"
                className="w-full h-full object-cover object-top"
              />
            ) : (
              <span className="text-[10px] text-neutral-400 uppercase tracking-widest text-center px-2">
                No Image
              </span>
            )}

            {uploading && (
              <div className="absolute inset-0 bg-black/70 backdrop-blur-xs flex flex-col items-center justify-center text-white px-2">
                <Loader2 size={18} className="animate-spin text-white mb-1" />
                <span className="text-[10px] font-semibold tracking-wider">{progress}%</span>
                <div className="w-full bg-white/20 h-1 rounded-full mt-1.5 overflow-hidden">
                  <div
                    className="bg-white h-full transition-all duration-150 ease-out"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            )}
          </div>
        )}

        {/* Input & Upload Details */}
        <div className="flex-1 space-y-2 w-full">
          <div className="flex items-center gap-2">
            <label className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 bg-neutral-900 hover:bg-neutral-800 text-white text-[11px] tracking-wider uppercase font-medium rounded-xs cursor-pointer transition-colors w-full sm:w-auto">
              {uploading ? (
                <>
                  <Loader2 size={13} className="animate-spin" />
                  <span>Uploading {progress}%...</span>
                </>
              ) : (
                <>
                  <Upload size={13} />
                  <span>{buttonText || (preview ? 'Change Image' : 'Upload Image')}</span>
                </>
              )}
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                disabled={uploading}
                className="hidden"
              />
            </label>

            {preview && !uploading && !hidePreview && (
              <span className="inline-flex items-center gap-1 text-[11px] text-emerald-600 font-medium">
                <CheckCircle size={13} />
                <span>{uploadedUrl ? 'Uploaded to Cloud' : 'Ready'}</span>
              </span>
            )}
          </div>

          {/* Newly uploaded verified link & save reminder */}
          {uploadedUrl && !uploading && (
            <div className="flex flex-wrap items-center gap-2 text-[10px] bg-amber-50 text-amber-900 border border-amber-200 px-2.5 py-1.5 rounded-xs animate-in fade-in duration-200">
              <span className="font-semibold uppercase tracking-wider text-amber-800">
                Notice:
              </span>
              <span>Image stored in Cloudinary. Click modal "Save" button to apply changes permanently.</span>
              <a
                href={uploadedUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 font-mono text-[9px] text-amber-950 underline hover:text-black ml-auto"
                title="Open Cloudinary image URL in new tab to verify"
              >
                <span>Verify Link</span>
                <ExternalLink size={10} />
              </a>
            </div>
          )}

          {/* Upload Progress Bar */}
          {uploading && (
            <div className="space-y-1 pt-0.5">
              <div className="flex justify-between text-[10px] text-neutral-600 font-medium tracking-wider uppercase">
                <span>Uploading Image to Cloudinary</span>
                <span>{progress}%</span>
              </div>
              <div className="w-full bg-neutral-100 h-1.5 rounded-full overflow-hidden border border-neutral-200">
                <div
                  className="bg-neutral-900 h-full transition-all duration-150 ease-out rounded-full"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}

          {helperText && (
            <div className="text-[11px] text-neutral-400">
              {helperText}
            </div>
          )}

          {error && (
            <div className="flex items-center gap-1 text-[11px] text-rose-600">
              <AlertCircle size={12} className="shrink-0" />
              <span>{error}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
