import React from 'react';
import { X, Film } from 'lucide-react';

interface VideoModalProps {
  isOpen: boolean;
  onClose: () => void;
  videoUrl?: string;
  videoTitle?: string;
}

export const VideoModal: React.FC<VideoModalProps> = ({
  isOpen,
  onClose,
  videoUrl = 'https://res.cloudinary.com/naqb7hm2/video/upload/v1789134902/PRE_WEDDING_COMING_SOON_4K_ANKIT_ASHMITA_BALA_G_STUDIO_RISHIKESH_-_Bala-G_Studio_720p_h264_cnqgoj.mp4',
  videoTitle = 'Ankit & Ashmita • Pre-Wedding Film',
}) => {
  if (!isOpen) return null;

  return (
    <div
      id="video-modal-backdrop"
      className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 md:p-8 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <button
        id="video-modal-close"
        onClick={onClose}
        className="absolute top-4 right-4 sm:top-6 sm:right-6 text-white/70 hover:text-white p-2 rounded-full bg-white/10 hover:bg-white/20 transition-all cursor-pointer z-20"
        aria-label="Close video player"
      >
        <X size={20} />
      </button>

      <div
        className="w-full max-w-5xl bg-black rounded-sm overflow-hidden shadow-2xl border border-neutral-800 flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Main Video Player - takes up the vast majority of the modal */}
        <div className="relative w-full aspect-video bg-black flex items-center justify-center overflow-hidden">
          <video
            className="w-full h-full object-contain bg-black"
            autoPlay
            controls
            playsInline
            poster="https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=1200&q=80"
          >
            <source
              src={videoUrl}
              type="video/mp4"
            />
            Your browser does not support the video tag.
          </video>
        </div>

        {/* Minimal Bottom Bar - clean and unobtrusive */}
        <div className="px-4 py-2.5 sm:px-6 sm:py-3 bg-neutral-950 text-neutral-300 flex items-center justify-between text-xs tracking-wider border-t border-neutral-900">
          <div className="flex items-center space-x-2">
            <Film size={13} className="text-neutral-400 shrink-0" />
            <span className="font-serif text-sm text-neutral-200 font-normal tracking-wide">
              {videoTitle}
            </span>
          </div>
          <span className="text-[10px] tracking-[0.2em] uppercase text-neutral-500 hidden sm:inline">
            CaM-Mystery Cinema
          </span>
        </div>
      </div>
    </div>
  );
};
