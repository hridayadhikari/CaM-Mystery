import React, { useState, useEffect, useRef } from 'react';
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
  const closedByPopstateRef = useRef(false);
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;
  const touchStartXRef = useRef<number | null>(null);
  const touchStartYRef = useRef<number | null>(null);

  // Active pool of items - fallback to current item if list is empty
  const activeList = items && items.length > 0 ? items : item ? [item] : [];

  // Helper to find index in active list
  const currentIndex = item
    ? Math.max(
        0,
        activeList.findIndex((i) => i.id === item.id || i.imageUrl === item.imageUrl)
      )
    : 0;

  const currentDisplayItem = activeList[currentIndex] || item;
  const hasMultiple = activeList.length > 1;

  // Lock background scroll and interactions while lightbox is open
  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    const originalTouchAction = document.body.style.touchAction;
    document.body.style.overflow = 'hidden';
    document.body.style.touchAction = 'none';

    return () => {
      document.body.style.overflow = originalOverflow;
      document.body.style.touchAction = originalTouchAction;
    };
  }, []);

  // History & Back-button handling: on mobile, back closes the lightbox before navigating
  useEffect(() => {
    window.history.pushState({ modal: 'lightbox' }, '');
    closedByPopstateRef.current = false;

    const handlePopState = () => {
      closedByPopstateRef.current = true;
      onCloseRef.current();
    };
//help
    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('popstate', handlePopState);
      if (!closedByPopstateRef.current && window.history.state?.modal === 'lightbox') {
        window.history.back();
      }
    };
  }, []);

  const handlePrev = (e?: React.MouseEvent | React.TouchEvent | KeyboardEvent) => {
    if (e && 'stopPropagation' in e) e.stopPropagation();
    if (!hasMultiple) return;
    const prevIndex = (currentIndex - 1 + activeList.length) % activeList.length;
    onSelect(activeList[prevIndex]);
  };

  const handleNext = (e?: React.MouseEvent | React.TouchEvent | KeyboardEvent) => {
    if (e && 'stopPropagation' in e) e.stopPropagation();
    if (!hasMultiple) return;
    const nextIndex = (currentIndex + 1) % activeList.length;
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
        onCloseRef.current();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, activeList, hasMultiple]);

  // Touch gesture support: swipe left for next, swipe right for prev
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      touchStartXRef.current = e.touches[0].clientX;
      touchStartYRef.current = e.touches[0].clientY;
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartXRef.current === null || touchStartYRef.current === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const touchEndY = e.changedTouches[0].clientY;
    const deltaX = touchEndX - touchStartXRef.current;
    const deltaY = touchEndY - touchStartYRef.current;

    // Detect horizontal swipe if deltaX is significant and predominantly horizontal
    if (Math.abs(deltaX) > 40 && Math.abs(deltaX) > Math.abs(deltaY) * 1.5) {
      if (deltaX < 0) {
        handleNext();
      } else {
        handlePrev();
      }
    }

    touchStartXRef.current = null;
    touchStartYRef.current = null;
  };

  if (!item || !currentDisplayItem) return null;

  return (
    <div
      id="lightbox-backdrop"
      className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 sm:p-8 animate-in fade-in duration-200 select-none overscroll-none"
      onClick={onClose}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <button
        type="button"
        id="lightbox-close"
        onClick={(e) => {
          e.stopPropagation();
          onClose();
        }}
        className="absolute top-6 right-6 text-white/70 hover:text-white p-2.5 rounded-full bg-white/10 hover:bg-white/20 transition-all cursor-pointer z-30 touch-manipulation"
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
            className="absolute left-2 sm:left-6 top-1/2 -translate-y-1/2 text-white/90 hover:text-white p-3 sm:p-3.5 rounded-full bg-black/60 hover:bg-black/80 border border-white/20 hover:border-white/40 shadow-xl transition-all cursor-pointer z-30 active:scale-95 touch-manipulation"
            aria-label="Previous photo"
          >
            <ChevronLeft size={26} />
          </button>

          <button
            type="button"
            id="lightbox-next"
            onClick={handleNext}
            className="absolute right-2 sm:right-6 top-1/2 -translate-y-1/2 text-white/90 hover:text-white p-3 sm:p-3.5 rounded-full bg-black/60 hover:bg-black/80 border border-white/20 hover:border-white/40 shadow-xl transition-all cursor-pointer z-30 active:scale-95 touch-manipulation"
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
          className="max-h-[75vh] w-auto max-w-full object-contain rounded-xs shadow-2xl transition-all duration-300 pointer-events-none"
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
