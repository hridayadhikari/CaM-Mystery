import React, { useState } from 'react';
import { Upload, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { uploadToCloudinary, CloudinaryFolder } from '../../lib/cloudinary';

interface CloudinaryImageUploadProps {
  label: string;
  currentUrl?: string;
  folder?: CloudinaryFolder;
  onUploaded: (secureUrl: string) => void;
  helperText?: string;
}

export const CloudinaryImageUpload: React.FC<CloudinaryImageUploadProps> = ({
  label,
  currentUrl,
  folder = 'images',
  onUploaded,
  helperText,
}) => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | undefined>(currentUrl);
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);

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
      setPendingFile(null);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPendingFile(file);
    setConfirmOpen(true);
    e.target.value = '';
  };

  return (
    <div className="space-y-2">
      <label className="block text-xs uppercase tracking-wider text-neutral-600 font-medium">
        {label}
      </label>

      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
        {/* Preview Box */}
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

        {/* Input & Upload Details */}
        <div className="flex-1 space-y-2">
          <div className="flex items-center gap-2">
            <label className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-neutral-900 hover:bg-neutral-800 text-white text-[11px] tracking-wider uppercase font-medium rounded-xs cursor-pointer transition-colors">
              <Upload size={13} />
              <span>{preview ? 'Change Image' : 'Upload Image'}</span>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                disabled={uploading}
                className="hidden"
              />
            </label>

            {preview && !uploading && (
              <span className="inline-flex items-center gap-1 text-[11px] text-emerald-600 font-medium">
                <CheckCircle size={13} />
                <span>Ready</span>
              </span>
            )}
          </div>

          <div className="text-[11px] text-neutral-400">
            {helperText || `Uploads directly to Cloudinary (${folder} folder)`}
          </div>

          {/* Or manual URL input fallback */}
          <div className="pt-1">
            <input
              type="url"
              placeholder="Or paste direct image URL (https://...)"
              value={preview?.startsWith('blob:') ? '' : preview || ''}
              onChange={(e) => {
                setPreview(e.target.value);
                onUploaded(e.target.value);
              }}
              className="w-full text-xs px-2.5 py-1.5 border border-neutral-200 rounded-xs focus:border-neutral-900 outline-none text-neutral-800 bg-white"
            />
          </div>

          {error && (
            <div className="flex items-center gap-1 text-[11px] text-rose-600">
              <AlertCircle size={12} className="shrink-0" />
              <span>{error}</span>
            </div>
          )}
        </div>
      </div>

      {/* Upload Confirmation Modal */}
      {confirmOpen && pendingFile && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-white border border-neutral-200 p-6 rounded-sm shadow-2xl max-w-sm w-full space-y-4">
            <h4 className="font-serif text-base text-neutral-900 font-normal">
              Confirm Image Upload
            </h4>
            <p className="text-xs text-neutral-600 leading-relaxed">
              Upload <span className="font-medium text-neutral-900">"{pendingFile.name}"</span> ({(pendingFile.size / 1024).toFixed(1)} KB) directly to Cloudinary?
            </p>
            <div className="flex justify-end gap-2.5 pt-2 border-t border-neutral-100">
              <button
                type="button"
                onClick={() => {
                  setConfirmOpen(false);
                  setPendingFile(null);
                }}
                className="px-3.5 py-1.5 text-xs uppercase tracking-wider text-neutral-600 hover:bg-neutral-100 rounded-xs cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  setConfirmOpen(false);
                  if (pendingFile) triggerUpload(pendingFile);
                }}
                className="px-4 py-1.5 text-xs uppercase tracking-wider bg-neutral-900 hover:bg-neutral-800 text-white rounded-xs font-medium cursor-pointer"
              >
                Upload Now
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
