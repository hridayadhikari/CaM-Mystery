import React from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { SelectedWorkItem } from '../types';
import { getOptimizedCloudinaryUrl, getCloudinarySrcSet } from '../lib/cloudinary';

interface LightboxModalProps {
  item: SelectedWorkItem | null;
  items: SelectedWorkItem[];
  onClose: () => void;
  onSelect: (item: SelectedWorkItem) => void;
}

export const LightboxModal: React.FC<LightboxModalProps> = ({
  item,
  items,
  onClose,
  onSelect,
}) => {
  if (!item) return null;

  const currentIndex = items.findIndex((i) => i.id === item.id);

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    const prevIndex = (currentIndex - 1 + items.length) % items.length;
    onSelect(items[prevIndex]);
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    const nextIndex = (currentIndex + 1) % items.length;
    onSelect(items[nextIndex]);
  };

  return (
    <div
      id="lightbox-backdrop"
      className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 sm:p-8 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <button
        id="lightbox-close"
        onClick={onClose}
        className="absolute top-6 right-6 text-white/70 hover:text-white p-2 rounded-full bg-white/10 hover:bg-white/20 transition-all cursor-pointer z-10"
        aria-label="Close modal"
      >
        <X size={22} />
      </button>

      {/* Navigation buttons */}
      <button
        id="lightbox-prev"
        onClick={handlePrev}
        className="absolute left-4 sm:left-8 text-white/70 hover:text-white p-3 rounded-full bg-white/10 hover:bg-white/20 transition-all cursor-pointer z-10"
        aria-label="Previous photo"
      >
        <ChevronLeft size={24} />
      </button>

      <button
        id="lightbox-next"
        onClick={handleNext}
        className="absolute right-4 sm:right-8 text-white/70 hover:text-white p-3 rounded-full bg-white/10 hover:bg-white/20 transition-all cursor-pointer z-10"
        aria-label="Next photo"
      >
        <ChevronRight size={24} />
      </button>

      <div
        className="max-w-4xl max-h-[85vh] flex flex-col items-center justify-center"
        onClick={(e) => e.stopPropagation()}
      >
        <img
          src={getOptimizedCloudinaryUrl(item.imageUrl, { width: 1600 })}
          srcSet={getCloudinarySrcSet(item.imageUrl, [800, 1200, 1600, 2000])}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 1200px"
          decoding="async"
          alt={item.title}
          className="max-h-[75vh] w-auto max-w-full object-contain rounded-sm shadow-2xl"
        />
        <div className="mt-4 text-center text-white">
          <p className="text-xs uppercase tracking-[0.25em] text-neutral-400">
            {item.category}
          </p>
          <h3 className="font-serif text-lg tracking-wide text-white mt-1">
            {item.title}
          </h3>
        </div>
      </div>
    </div>
  );
};
