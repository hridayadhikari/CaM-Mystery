import React, { useState, useRef, useEffect, useCallback } from 'react';
import { X, Check, RotateCcw, Move, Info } from 'lucide-react';
import { getOptimizedCloudinaryUrl } from '../../lib/cloudinary';

interface PhotoFramingModalProps {
  isOpen: boolean;
  imageUrl: string;
  initialX?: number;
  initialY?: number;
  title?: string;
  aspectRatioClass?: string;
  onApply: (x: number, y: number) => void;
  onCancel: () => void;
}

export const PhotoFramingModal: React.FC<PhotoFramingModalProps> = ({
  isOpen,
  imageUrl,
  initialX = 50,
  initialY = 50,
  title = 'Adjust Photo Framing',
  aspectRatioClass = 'aspect-[4/5]',
  onApply,
  onCancel,
}) => {
  const [posX, setPosX] = useState<number>(initialX);
  const [posY, setPosY] = useState<number>(initialY);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const dragStartRef = useRef<{ startMouseX: number; startMouseY: number; startPosX: number; startPosY: number } | null>(null);

  // Sync initial values when modal opens or initial values change
  useEffect(() => {
    if (isOpen) {
      setPosX(Math.max(0, Math.min(100, Math.round(initialX))));
      setPosY(Math.max(0, Math.min(100, Math.round(initialY))));
      setIsDragging(false);
      dragStartRef.current = null;
    }
  }, [isOpen, initialX, initialY]);

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    e.preventDefault();
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
    setIsDragging(true);
    dragStartRef.current = {
      startMouseX: e.clientX,
      startMouseY: e.clientY,
      startPosX: posX,
      startPosY: posY,
    };
  };

  const handlePointerMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (!isDragging || !dragStartRef.current || !containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const deltaX = e.clientX - dragStartRef.current.startMouseX;
      const deltaY = e.clientY - dragStartRef.current.startMouseY;

      // Moving mouse right shifts focal point left (shows more left of image)
      // Moving mouse down shifts focal point up (shows more top of image)
      const pctDeltaX = (deltaX / rect.width) * 100;
      const pctDeltaY = (deltaY / rect.height) * 100;

      const nextX = Math.max(0, Math.min(100, Math.round(dragStartRef.current.startPosX - pctDeltaX)));
      const nextY = Math.max(0, Math.min(100, Math.round(dragStartRef.current.startPosY - pctDeltaY)));

      setPosX(nextX);
      setPosY(nextY);
    },
    [isDragging]
  );

  const handlePointerUp = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    if (isDragging) {
      setIsDragging(false);
      dragStartRef.current = null;
      try {
        (e.target as HTMLElement).releasePointerCapture?.(e.pointerId);
      } catch {
        // ignore
      }
    }
  }, [isDragging]);

  if (!isOpen || !imageUrl) return null;

  return (
    <div className="fixed inset-0 z-[70] bg-black/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-150">
      <div
        className="bg-neutral-900 border border-neutral-800 text-white rounded-sm shadow-2xl max-w-lg w-full overflow-hidden flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-neutral-800 bg-neutral-950/60">
          <div className="flex items-center gap-2">
            <Move size={15} className="text-amber-400" />
            <div>
              <h3 className="font-serif text-base text-neutral-100 font-medium tracking-wide">
                {title}
              </h3>
              <p className="text-[11px] text-neutral-400">
                Drag photo to adjust visual crop without modifying original image
              </p>
            </div>
          </div>
          <button
            onClick={onCancel}
            className="text-neutral-400 hover:text-white p-1 rounded-full transition-colors cursor-pointer"
            title="Close without applying"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-6 flex flex-col items-center justify-center space-y-4 overflow-y-auto">
          {/* Instruction hint */}
          <div className="w-full flex items-center justify-between text-[11px] text-neutral-400 px-1">
            <span className="flex items-center gap-1.5">
              <Info size={12} className="text-neutral-500" />
              <span>Public Gallery Crop (4:5 Aspect Ratio)</span>
            </span>
            <span className="font-mono text-neutral-300">
              X: {posX}% · Y: {posY}%
            </span>
          </div>

          {/* Framing / Crop Container */}
          <div
            ref={containerRef}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerUp}
            className={`relative w-full max-w-[320px] ${aspectRatioClass} bg-neutral-950 rounded-xs overflow-hidden border-2 border-neutral-700 select-none touch-none shadow-xl cursor-grab active:cursor-grabbing group`}
          >
            {/* Live Cropped Image Rendering with object-fit: cover and object-position */}
            <img
              src={getOptimizedCloudinaryUrl(imageUrl, { width: 1000 })}
              alt="Framing preview"
              draggable={false}
              className="w-full h-full pointer-events-none select-none"
              style={{
                objectFit: 'cover',
                objectPosition: `${posX}% ${posY}%`,
              }}
            />

            {/* Rule-of-thirds grid overlay */}
            <div className="absolute inset-0 pointer-events-none grid grid-cols-3 grid-rows-3 opacity-30 group-hover:opacity-40 transition-opacity">
              <div className="border-r border-b border-white/40" />
              <div className="border-r border-b border-white/40" />
              <div className="border-b border-white/40" />
              <div className="border-r border-b border-white/40" />
              <div className="border-r border-b border-white/40" />
              <div className="border-b border-white/40" />
              <div className="border-r border-white/40" />
              <div className="border-r border-white/40" />
              <div />
            </div>

            {/* Drag helper indicator overlay */}
            <div className="absolute inset-0 pointer-events-none flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              <div className="px-2.5 py-1 bg-black/60 backdrop-blur-xs rounded-full text-[10px] text-white/90 flex items-center gap-1 shadow-xs border border-white/20">
                <Move size={10} />
                <span>Drag to reposition</span>
              </div>
            </div>
          </div>

          {/* Quick Controls & Sliders */}
          <div className="w-full max-w-[320px] space-y-2 pt-1 text-xs">
            <div className="space-y-1">
              <div className="flex justify-between text-[11px] text-neutral-400">
                <span>Horizontal (X)</span>
                <span className="font-mono">{posX}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={posX}
                onChange={(e) => setPosX(Number(e.target.value))}
                className="w-full accent-amber-400 h-1.5 bg-neutral-800 rounded-lg appearance-none cursor-pointer"
              />
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-[11px] text-neutral-400">
                <span>Vertical (Y)</span>
                <span className="font-mono">{posY}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={posY}
                onChange={(e) => setPosY(Number(e.target.value))}
                className="w-full accent-amber-400 h-1.5 bg-neutral-800 rounded-lg appearance-none cursor-pointer"
              />
            </div>

            <div className="pt-2 flex justify-between items-center">
              <button
                type="button"
                onClick={() => {
                  setPosX(50);
                  setPosY(50);
                }}
                className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] text-neutral-400 hover:text-white bg-neutral-800/80 hover:bg-neutral-800 rounded-xs transition-colors cursor-pointer"
              >
                <RotateCcw size={11} />
                <span>Reset to Center (50/50)</span>
              </button>
              <span className="text-[10px] text-neutral-500 italic">
                No Cloudinary upload
              </span>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-2.5 px-5 py-3 border-t border-neutral-800 bg-neutral-950/70">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-xs uppercase tracking-wider text-neutral-400 hover:text-white border border-neutral-700 hover:border-neutral-600 rounded-xs transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => onApply(posX, posY)}
            className="inline-flex items-center gap-1.5 px-5 py-2 text-xs uppercase tracking-wider font-medium text-neutral-950 bg-amber-400 hover:bg-amber-300 rounded-xs transition-colors cursor-pointer shadow-sm"
          >
            <Check size={13} />
            <span>Apply Framing</span>
          </button>
        </div>
      </div>
    </div>
  );
};
