import React, { useState, useRef } from 'react';
import { Plus, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { uploadToCloudinary, CloudinaryFolder, MAX_IMAGE_SIZE_BYTES } from '../../lib/cloudinary';

interface BatchUploadItem {
  id: string;
  file: File;
  previewUrl: string;
  status: 'pending' | 'uploading' | 'completed' | 'error';
  progress: number;
  uploadedUrl?: string;
  error?: string;
}

interface BatchImageUploadProps {
  label?: string;
  helperText?: string;
  folder?: CloudinaryFolder;
  onPhotosUploaded: (uploadedUrls: string[]) => void;
  maxFilesPerBatch?: number;
}

export const BatchImageUpload: React.FC<BatchImageUploadProps> = ({
  label = 'Upload Multiple Photos at Once',
  helperText = 'Select multiple images (Ctrl/Cmd + click or drag-select) to upload together.',
  folder = 'images',
  onPhotosUploaded,
  maxFilesPerBatch = 40,
}) => {
  const [queue, setQueue] = useState<BatchUploadItem[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFilesSelected = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = e.target.files;
    if (!fileList || fileList.length === 0) return;

    const filesArray = Array.from(fileList).slice(0, maxFilesPerBatch);
    const newItems: BatchUploadItem[] = filesArray.map((file, i) => ({
      id: `${Date.now()}-${i}-${file.name}`,
      file,
      previewUrl: URL.createObjectURL(file),
      status: 'pending',
      progress: 0,
    }));

    setQueue((prev) => [...prev, ...newItems]);
    setIsProcessing(true);
    e.target.value = '';

    // Upload with concurrency of up to 4 parallel uploads for optimal speed & browser throughput
    const CONCURRENCY_LIMIT = 4;
    const uploadedUrls: string[] = [];

    const uploadSingle = async (item: BatchUploadItem) => {
      if (item.file.size > MAX_IMAGE_SIZE_BYTES) {
        setQueue((prev) =>
          prev.map((q) =>
            q.id === item.id
              ? { ...q, status: 'error', error: 'Exceeds 10MB limit' }
              : q
          )
        );
        return;
      }

      setQueue((prev) =>
        prev.map((q) =>
          q.id === item.id ? { ...q, status: 'uploading', progress: 5 } : q
        )
      );

      try {
        const res = await uploadToCloudinary(
          item.file,
          folder,
          'image',
          (pct) => {
            setQueue((prev) =>
              prev.map((q) =>
                q.id === item.id ? { ...q, progress: Math.max(5, pct) } : q
              )
            );
          }
        );

        const freshUrl = res.secure_url.includes('?')
          ? `${res.secure_url}&t=${Date.now()}`
          : `${res.secure_url}?t=${Date.now()}`;

        uploadedUrls.push(freshUrl);

        setQueue((prev) =>
          prev.map((q) =>
            q.id === item.id
              ? { ...q, status: 'completed', progress: 100, uploadedUrl: freshUrl }
              : q
          )
        );
      } catch (err: any) {
        setQueue((prev) =>
          prev.map((q) =>
            q.id === item.id
              ? { ...q, status: 'error', error: err?.message || 'Upload failed' }
              : q
          )
        );
      }
    };

    let currentIndex = 0;
    const workers = Array.from({ length: Math.min(CONCURRENCY_LIMIT, newItems.length) }, async () => {
      while (currentIndex < newItems.length) {
        const indexToTake = currentIndex++;
        await uploadSingle(newItems[indexToTake]);
      }
    });

    await Promise.all(workers);
    setIsProcessing(false);

    if (uploadedUrls.length > 0) {
      onPhotosUploaded(uploadedUrls);
    }
  };

  const completedCount = queue.filter((i) => i.status === 'completed').length;
  const inProgressCount = queue.filter((i) => i.status === 'uploading' || i.status === 'pending').length;
  const totalInBatch = queue.length;
  const overallProgress = totalInBatch > 0
    ? Math.round(queue.reduce((acc, curr) => acc + curr.progress, 0) / totalInBatch)
    : 0;

  const clearCompleted = () => {
    setQueue((prev) => prev.filter((item) => item.status !== 'completed'));
  };

  return (
    <div className="space-y-3 p-3 bg-neutral-50/80 border border-neutral-200/80 rounded-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <label className="block text-xs uppercase tracking-wider text-neutral-800 font-semibold">
            {label}
          </label>
          <p className="text-[11px] text-neutral-500">{helperText}</p>
        </div>

        <div className="flex items-center gap-2">
          {queue.length > 0 && !isProcessing && (
            <button
              type="button"
              onClick={clearCompleted}
              className="text-[10px] uppercase tracking-wider text-neutral-500 hover:text-neutral-900 transition-colors cursor-pointer"
            >
              Clear Log
            </button>
          )}

          <label
            className={`inline-flex items-center justify-center gap-1.5 px-3 py-1.5 bg-neutral-900 hover:bg-neutral-800 text-white text-[11px] tracking-wider uppercase font-medium rounded-xs cursor-pointer transition-colors shadow-xs ${
              isProcessing ? 'opacity-80 pointer-events-none' : ''
            }`}
          >
            {isProcessing ? (
              <>
                <Loader2 size={13} className="animate-spin" />
                <span>Uploading ({completedCount}/{totalInBatch})...</span>
              </>
            ) : (
              <>
                <Plus size={13} />
                <span>Select Multiple Photos</span>
              </>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              onChange={handleFilesSelected}
              disabled={isProcessing}
              className="hidden"
            />
          </label>
        </div>
      </div>

      {/* Aggregate Progress Bar when uploading */}
      {isProcessing && (
        <div className="space-y-1.5 pt-1 animate-in fade-in duration-200">
          <div className="flex items-center justify-between text-[11px] font-medium text-neutral-700">
            <span className="flex items-center gap-1.5">
              <Loader2 size={12} className="animate-spin text-neutral-900" />
              <span>Uploading {inProgressCount} photo{inProgressCount > 1 ? 's' : ''}...</span>
            </span>
            <span className="font-mono text-neutral-900">{overallProgress}%</span>
          </div>
          <div className="w-full bg-neutral-200 h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-neutral-900 h-full transition-all duration-300 ease-out rounded-full"
              style={{ width: `${overallProgress}%` }}
            />
          </div>
        </div>
      )}

      {/* Visual processing grid so user sees all pictures loading together */}
      {queue.length > 0 && (
        <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2 pt-1 max-h-48 overflow-y-auto pr-1">
          {queue.map((item) => (
            <div
              key={item.id}
              className="relative aspect-square bg-neutral-100 rounded-xs overflow-hidden border border-neutral-200 group"
            >
              <img
                src={item.previewUrl}
                alt="Upload preview"
                className={`w-full h-full object-cover transition-opacity duration-200 ${
                  item.status === 'uploading' || item.status === 'pending'
                    ? 'opacity-60 scale-105 transition-transform'
                    : 'opacity-100'
                }`}
              />

              {item.status === 'uploading' && (
                <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center p-1 text-white">
                  <Loader2 size={14} className="animate-spin mb-1 text-white" />
                  <span className="text-[9px] font-mono font-medium">{item.progress}%</span>
                  <div className="w-3/4 bg-white/20 h-1 rounded-full mt-1 overflow-hidden">
                    <div
                      className="bg-white h-full transition-all duration-150"
                      style={{ width: `${item.progress}%` }}
                    />
                  </div>
                </div>
              )}

              {item.status === 'pending' && (
                <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center p-1 text-white">
                  <span className="text-[9px] uppercase tracking-wider text-neutral-300">Queued</span>
                </div>
              )}

              {item.status === 'completed' && (
                <div className="absolute top-1 right-1 bg-emerald-600 text-white rounded-full p-0.5 shadow-xs">
                  <CheckCircle2 size={12} />
                </div>
              )}

              {item.status === 'error' && (
                <div className="absolute inset-0 bg-rose-950/80 flex flex-col items-center justify-center p-1 text-rose-200 text-center">
                  <AlertCircle size={14} className="text-rose-400 mb-0.5" />
                  <span className="text-[8px] leading-tight line-clamp-2">{item.error || 'Failed'}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
