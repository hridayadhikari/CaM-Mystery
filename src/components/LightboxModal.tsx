import React, { useState, useEffect } from 'react';
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

  // Active pool of items - fallback to current item if list is empty
  const activeList = items && items.length > 0 ? items : [item];

  // Helper to find index in active list
  const findItemIndex = (target: SelectedWorkItem) => {
    const idx = activeList.findIndex((i) => i.id === target.id || i.imageUrl === target.imageUrl);
    return idx >= 0 ? idx : 0;
  };

  const [currentIndex, setCurrentIndex] = useState<number>(() => findItemIndex(item));

  // Sync index whenever item or activeList changes
  useEffect(() => {
    setCurrentIndex(findItemIndex(item));
  }, [item?.id, item?.imageUrl, activeList.length]);

  const currentDisplayItem = activeList[currentIndex] || item;
  const hasMultiple = activeList.length > 1;

  const handlePrev = (e?: React.MouseEvent | KeyboardEvent) => {
    if (e && 'stopPropagation' in e) e.stopPropagation();
    if (!hasMultiple) return;
    const prevIndex = (currentIndex - 1 + activeList.length) % activeList.length;
    setCurrentIndex(prevIndex);
    onSelect(activeList[prevIndex]);
  };

  const handleNext = (e?: React.MouseEvent | KeyboardEvent) => {
    if (e && 'stopPropagation' in e) e.stopPropagation();
    if (!hasMultiple) return;
    const nextIndex = (currentIndex + 1) % activeList.length;
    setCurrentIndex(nextIndex);
    onSelect(activeList[nextIndex]);
  };

  // Keyboard navigation: ArrowLeft, ArrowRight, and Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        handlePrev(e);
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        handleNext(e);
      } else if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, activeList]);

  return (
    <div
      id="lightbox-backdrop"
      className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 sm:p-8 animate-in fade-in duration-200 select-none"
      onClick={onClose}
    >
      <button
        type="button"
        id="lightbox-close"
        onClick={(e) => {
          e.stopPropagation();
          onClose();
        }}
        className="absolute top-6 right-6 text-white/70 hover:text-white p-2.5 rounded-full bg-white/10 hover:bg-white/20 transition-all cursor-pointer z-30"
        aria-label="Close modal"
      >
        <X size={22} />
      </button>

      {/* Navigation buttons: shown whenever there are multiple photos */}
      {hasMultiple && (
        <>
          <button
            type="button"
            id="lightbox-prev"
            onClick={handlePrev}
            className="absolute left-4 sm:left-8 text-white/80 hover:text-white p-3 sm:p-3.5 rounded-full bg-black/50 hover:bg-black/75 border border-white/20 hover:border-white/40 shadow-lg transition-all cursor-pointer z-30 active:scale-95"
            aria-label="Previous photo"
          >
            <ChevronLeft size={26} />
          </button>

          <button
            type="button"
            id="lightbox-next"
            onClick={handleNext}
            className="absolute right-4 sm:right-8 text-white/80 hover:text-white p-3 sm:p-3.5 rounded-full bg-black/50 hover:bg-black/75 border border-white/20 hover:border-white/40 shadow-lg transition-all cursor-pointer z-30 active:scale-95"
            aria-label="Next photo"
          >
            <ChevronRight size={26} />
          </button>
        </>
      )}

      <div
        className="max-w-4xl max-h-[85vh] flex flex-col items-center justify-center relative z-20 pointer-events-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <img
          key={currentDisplayItem.imageUrl}
          src={getOptimizedCloudinaryUrl(currentDisplayItem.imageUrl, { width: 1600 })}
          srcSet={getCloudinarySrcSet(currentDisplayItem.imageUrl, [800, 1200, 1600, 2000])}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 1200px"
          decoding="async"
          alt={currentDisplayItem.title}
          className="max-h-[75vh] w-auto max-w-full object-contain rounded-sm shadow-2xl transition-all duration-300"
        />
        <div className="mt-4 text-center text-white">
          <div className="flex items-center justify-center gap-2 text-xs uppercase tracking-[0.25em] text-neutral-400">
            <span>{currentDisplayItem.category}</span>
            {hasMultiple && (
              <>
                <span>•</span>
                <span className="text-white/80 font-mono tracking-normal">
                  {currentIndex + 1} / {activeList.length}
                </span>
              </>
            )}
          </div>
          <h3 className="font-serif text-lg tracking-wide text-white mt-1">
            {currentDisplayItem.title}
          </h3>
        </div>
      </div>
    </div>
  );
};
