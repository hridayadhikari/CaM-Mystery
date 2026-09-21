import React, { useState } from 'react';
import { Upload, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { uploadToCloudinary, CloudinaryFolder } from '../../lib/cloudinary';

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
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | undefined>(currentUrl);

  const triggerUpload = async (file: File) => {
    setError(null);
    setUploading(true);

    const localBlob = URL.createObjectURL(file);
    setPreview(localBlob);

    try {
      const res = await uploadToCloudinary(file, folder as CloudinaryFolder);
      setPreview(res.secure_url);
      onUploaded(res.secure_url);
    } catch (err: any) {
      console.error(err);
      setError(err?.message || 'Failed to upload image to Cloudinary.');
      setPreview(currentUrl);
    } finally {
      setUploading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
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
                src={preview}
                alt="Preview"
                className="w-full h-full object-cover object-top"
              />
            ) : (
              <span className="text-[10px] text-neutral-400 uppercase tracking-widest text-center px-2">
                No Image
              </span>
            )}

            {uploading && (
              <div className="absolute inset-0 bg-black/60 backdrop-blur-xs flex flex-col items-center justify-center text-white">
                <Loader2 size={20} className="animate-spin" />
                <span className="text-[9px] uppercase tracking-wider mt-1">Uploading</span>
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
                  <span>Uploading...</span>
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
                <span>Ready</span>
              </span>
            )}
          </div>

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
