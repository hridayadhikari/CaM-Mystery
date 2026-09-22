import React, { useState } from 'react';
import { Upload, CheckCircle, AlertCircle, Loader2, Film, Play, X, ExternalLink } from 'lucide-react';
import { uploadToCloudinary, MAX_VIDEO_SIZE_BYTES, MAX_VIDEO_SIZE_MB } from '../../lib/cloudinary';

interface CloudinaryVideoUploadProps {
  label: string;
  currentUrl?: string;
  onUploaded: (secureUrl: string) => void;
  helperText?: string;
}

export const CloudinaryVideoUpload: React.FC<CloudinaryVideoUploadProps> = ({
  label,
  currentUrl,
  onUploaded,
  helperText,
}) => {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | undefined>(currentUrl);
  const [isPlaying, setIsPlaying] = useState(false);
  const [modalPreviewOpen, setModalPreviewOpen] = useState(false);
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);
  const videoRef = React.useRef<HTMLVideoElement | null>(null);

  React.useEffect(() => {
    if (confirmOpen || modalPreviewOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [confirmOpen, modalPreviewOpen]);

  // Sync state when currentUrl prop updates
  React.useEffect(() => {
    if (!uploading) {
      setPreview(currentUrl);
      setUploadedUrl(null);
    }
  }, [currentUrl, uploading]);

  const toggleInlinePlay = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  const triggerUpload = async (file: File) => {
    setError(null);
    setProgress(0);
    setUploading(true);

    const localBlob = URL.createObjectURL(file);
    setPreview(localBlob);

    try {
      const res = await uploadToCloudinary(file, 'videos', 'video', (pct) => setProgress(pct));
      
      const freshUrl = res.secure_url.includes('?')
        ? `${res.secure_url}&t=${Date.now()}`
        : `${res.secure_url}?t=${Date.now()}`;

      setPreview(freshUrl);
      setUploadedUrl(freshUrl);
      onUploaded(freshUrl);
    } catch (err: any) {
      console.error(err);
      setError(err?.message || 'Failed to upload video to Cloudinary.');
      if (!preview) setPreview(currentUrl);
    } finally {
      setUploading(false);
      setProgress(0);
      setPendingFile(null);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > MAX_VIDEO_SIZE_BYTES) {
      const sizeMb = (file.size / (1024 * 1024)).toFixed(1);
      setError(`Video file size (${sizeMb} MB) exceeds the ${MAX_VIDEO_SIZE_MB}MB limit. Rejected before upload.`);
      setPendingFile(null);
      e.target.value = '';
      return;
    }

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
        {/* Video Preview Box with interactive play */}
        <div
          onClick={() => {
            if (preview && !uploading) setModalPreviewOpen(true);
          }}
          className="relative w-44 h-28 sm:w-52 sm:h-32 bg-black border border-neutral-300 rounded-sm overflow-hidden shrink-0 flex items-center justify-center group shadow-xs cursor-pointer"
          title={preview ? 'Click to preview video with sound' : undefined}
        >
          {preview ? (
            <video
              ref={videoRef}
              key={preview}
              src={preview}
              className="w-full h-full object-cover"
              controls={false}
              muted
              loop
              playsInline
              onMouseEnter={(e) => {
                const target = e.currentTarget;
                target.play().then(() => setIsPlaying(true)).catch(() => {});
              }}
              onMouseLeave={(e) => {
                const target = e.currentTarget;
                target.pause();
                setIsPlaying(false);
              }}
            />
          ) : (
            <div className="flex flex-col items-center justify-center text-neutral-500">
              <Film size={22} />
              <span className="text-[9px] uppercase tracking-widest mt-1">No Video</span>
            </div>
          )}

          {/* Play/Pause Overlay indicator */}
          {preview && !uploading && !isPlaying && (
            <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center pointer-events-none group-hover:bg-black/25 transition-colors">
              <div className="w-10 h-10 rounded-full bg-white/90 text-neutral-900 flex items-center justify-center shadow-md transform group-hover:scale-110 transition-transform">
                <Play size={18} className="fill-neutral-900 translate-x-0.5" />
              </div>
              <span className="text-[9px] text-white/90 uppercase tracking-widest mt-1.5 font-medium drop-shadow-xs">
                Hover to loop / Click to play
              </span>
            </div>
          )}

          {uploading && (
            <div className="absolute inset-0 bg-black/85 backdrop-blur-xs flex flex-col items-center justify-center text-white z-10 px-3">
              <Loader2 size={22} className="animate-spin text-white mb-1.5" />
              <span className="text-[11px] uppercase tracking-wider font-semibold">
                Uploading Video ({progress}%)
              </span>
              <div className="w-full bg-white/20 h-1.5 rounded-full mt-2 overflow-hidden">
                <div
                  className="bg-white h-full transition-all duration-150 ease-out rounded-full"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Input & Upload Controls */}
        <div className="flex-1 space-y-2 w-full">
          <div className="flex items-center gap-2">
            <label className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-neutral-900 hover:bg-neutral-800 text-white text-[11px] tracking-wider uppercase font-medium rounded-xs cursor-pointer transition-colors">
              {uploading ? (
                <>
                  <Loader2 size={13} className="animate-spin" />
                  <span>Uploading {progress}%...</span>
                </>
              ) : (
                <>
                  <Upload size={13} />
                  <span>{preview ? 'Change Video File' : 'Upload Video File'}</span>
                </>
              )}
              <input
                type="file"
                accept="video/*"
                onChange={handleFileChange}
                disabled={uploading}
                className="hidden"
              />
            </label>

            {preview && !uploading && (
              <span className="inline-flex items-center gap-1 text-[11px] text-emerald-600 font-medium">
                <CheckCircle size={13} />
                <span>{uploadedUrl ? 'Uploaded to Cloud' : 'Video Selected'}</span>
              </span>
            )}
          </div>

          {/* Newly uploaded verified link & save reminder */}
          {uploadedUrl && !uploading && (
            <div className="flex flex-wrap items-center gap-2 text-[10px] bg-amber-50 text-amber-900 border border-amber-200 px-2.5 py-1.5 rounded-xs animate-in fade-in duration-200">
              <span className="font-semibold uppercase tracking-wider text-amber-800">
                Notice:
              </span>
              <span>Video stored in Cloudinary. Click "Save Video Settings" to apply changes permanently.</span>
              <a
                href={uploadedUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 font-mono text-[9px] text-amber-950 underline hover:text-black ml-auto"
                title="Open Cloudinary video URL in new tab to verify"
              >
                <span>Verify Link</span>
                <ExternalLink size={10} />
              </a>
            </div>
          )}

          {/* Upload Progress Bar for Large Video Files */}
          {uploading && (
            <div className="space-y-1 pt-0.5">
              <div className="flex justify-between text-[10px] text-neutral-600 font-medium tracking-wider uppercase">
                <span>Uploading Video to Cloudinary</span>
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

      {/* Video Upload Confirmation Modal */}
      {confirmOpen && pendingFile && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-white border border-neutral-200 p-6 rounded-sm shadow-2xl max-w-sm w-full space-y-4">
            <h4 className="font-serif text-base text-neutral-900 font-normal">
              Confirm Video Teaser Upload
            </h4>
            <p className="text-xs text-neutral-600 leading-relaxed">
              Upload video file <span className="font-medium text-neutral-900">"{pendingFile.name}"</span> ({(pendingFile.size / (1024 * 1024)).toFixed(2)} MB) to Cloudinary?
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
                Upload Video
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Full Video Player Preview Modal */}
      {modalPreviewOpen && preview && (
        <div className="fixed inset-0 z-[60] bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-neutral-950 border border-neutral-800 rounded-sm shadow-2xl max-w-2xl w-full overflow-hidden space-y-0">
            <div className="flex items-center justify-between px-4 py-3 border-b border-neutral-800 bg-neutral-900 text-white">
              <div className="flex items-center gap-2">
                <Film size={15} className="text-amber-400" />
                <span className="text-xs font-medium tracking-wide uppercase">
                  Video Teaser Playback Preview
                </span>
              </div>
              <div className="flex items-center gap-2">
                <a
                  href={preview}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-neutral-400 hover:text-white p-1"
                  title="Open video in new tab"
                >
                  <ExternalLink size={15} />
                </a>
                <button
                  type="button"
                  onClick={() => setModalPreviewOpen(false)}
                  className="text-neutral-400 hover:text-white p-1 cursor-pointer"
                  title="Close preview"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            <div className="aspect-video bg-black flex items-center justify-center">
              <video
                src={preview}
                controls
                autoPlay
                className="w-full h-full object-contain"
                playsInline
              />
            </div>

            <div className="px-4 py-3 bg-neutral-900/60 border-t border-neutral-800 flex items-center justify-between text-[11px] text-neutral-400">
              <span className="truncate max-w-md">{preview}</span>
              <button
                type="button"
                onClick={() => setModalPreviewOpen(false)}
                className="px-3 py-1 bg-neutral-800 hover:bg-neutral-700 text-white text-xs rounded-xs cursor-pointer uppercase tracking-wider"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
