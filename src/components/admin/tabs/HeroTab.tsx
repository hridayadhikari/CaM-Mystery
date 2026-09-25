import React, { useState } from 'react';
import { Edit2, X } from 'lucide-react';
import { useCMS } from '../../../lib/cmsStore';
import { getOptimizedCloudinaryUrl } from '../../../lib/cloudinary';
import { CloudinaryImageUpload } from '../CloudinaryImageUpload';
import { CloudinaryVideoUpload } from '../CloudinaryVideoUpload';

interface HeroTabProps {
  showToast: (msg: string) => void;
  videoModalOpen: boolean;
  setVideoModalOpen: (open: boolean) => void;
}

export const HeroTab: React.FC<HeroTabProps> = ({
  showToast,
  videoModalOpen,
  setVideoModalOpen,
}) => {
  const { heroSlides, videoFeature, updateHeroSlides, updateVideoFeature } = useCMS();

  // State for Hero Slide Edit Modal
  const [editingSlide, setEditingSlide] = useState<{
    index: number;
    slide: { id: number; title: string; subtitle: string; imageUrl: string };
  } | null>(null);

  // State for Video Feature Form
  const [videoForm, setVideoForm] = useState(videoFeature);

  // Keep videoForm in sync if videoFeature updates externally
  React.useEffect(() => {
    setVideoForm(videoFeature);
  }, [videoFeature]);

  return (
    <div className="space-y-6">
      {/* Hero Slides */}
      <div className="bg-white border border-neutral-200 p-6 shadow-xs rounded-xs space-y-6">
        <div>
          <h2 className="font-serif text-xl text-neutral-900">
            Home Hero Carousel Slides
          </h2>
          <p className="text-xs text-neutral-500">
            Manage the panoramic background slides shown at the top of the homepage.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {heroSlides.map((slide, idx) => (
            <div
              key={slide.id}
              className="bg-white border border-neutral-200 rounded-xs overflow-hidden shadow-xs flex flex-col justify-between"
            >
              <div>
                <div className="aspect-[16/10] bg-neutral-950 relative overflow-hidden flex items-center justify-center">
                  <img
                    src={getOptimizedCloudinaryUrl(slide.imageUrl, { width: 600 })}
                    alt={slide.title}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-contain"
                  />
                  <div className="absolute top-2 left-2 bg-black/60 px-2 py-0.5 text-[9px] uppercase tracking-wider text-white rounded-xs">
                    Slide #{idx + 1}
                  </div>
                </div>
                <div className="p-4 space-y-1">
                  <span className="text-[10px] uppercase tracking-wider text-neutral-400">
                    {slide.subtitle}
                  </span>
                  <h4 className="font-serif text-base text-neutral-900 font-normal">
                    {slide.title}
                  </h4>
                </div>
              </div>

              <div className="p-4 pt-0">
                <button
                  onClick={() => setEditingSlide({ index: idx, slide: { ...slide } })}
                  className="w-full py-2 bg-neutral-100 hover:bg-neutral-900 hover:text-white text-neutral-800 text-xs uppercase tracking-wider rounded-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Edit2 size={12} />
                  <span>Edit Slide #{idx + 1}</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Pre-wedding Cinema Feature */}
      <div className="bg-white border border-neutral-200 p-6 shadow-xs rounded-xs space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-serif text-xl text-neutral-900">
                Pre-Wedding Cinema Teaser Feature
              </h2>
              <span className="text-[9px] uppercase tracking-wider font-semibold px-2 py-0.5 bg-neutral-900 text-white rounded-xs">
                Live Video
              </span>
            </div>
            <p className="text-xs text-neutral-500 mt-0.5">
              Featured teaser film: <span className="font-medium text-neutral-800">{videoFeature.title}</span> ({videoFeature.subtitle})
            </p>
          </div>
          <button
            onClick={() => {
              setVideoForm(videoFeature);
              setVideoModalOpen(true);
            }}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-neutral-900 hover:bg-neutral-800 text-white text-xs uppercase tracking-wider rounded-xs cursor-pointer transition-colors shrink-0"
          >
            <Edit2 size={13} />
            <span>Configure Video Teaser</span>
          </button>
        </div>

        {/* Video player preview card */}
        {videoFeature.videoUrl && (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-5 pt-4 border-t border-neutral-100 items-center">
            <div className="md:col-span-6 aspect-[16/9] bg-black rounded-xs overflow-hidden shadow-sm border border-neutral-200 relative group">
              <video
                key={videoFeature.videoUrl}
                src={videoFeature.videoUrl}
                poster={videoFeature.posterUrl}
                controls
                playsInline
                preload="metadata"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="md:col-span-6 space-y-2 text-xs">
              <div className="space-y-1">
                <span className="text-[10px] tracking-wider uppercase text-neutral-400 font-medium">
                  {videoFeature.subtitle || 'Cinematic Film'}
                </span>
                <h4 className="font-serif text-lg text-neutral-900">
                  {videoFeature.title}
                </h4>
                {videoFeature.description && (
                  <p className="text-neutral-500 leading-relaxed text-xs">
                    {videoFeature.description}
                  </p>
                )}
              </div>
              <div className="pt-2 text-[11px] text-neutral-400 truncate">
                <span className="font-medium text-neutral-600">Video URL: </span>
                <a
                  href={videoFeature.videoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline hover:text-neutral-900"
                >
                  {videoFeature.videoUrl}
                </a>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modal: Edit Hero Carousel Slide */}
      {editingSlide && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white border border-neutral-200 p-6 sm:p-8 rounded-sm shadow-2xl max-w-xl w-full space-y-5 animate-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
              <h3 className="font-serif text-xl text-neutral-900 font-normal">
                Edit Hero Slide #{editingSlide.index + 1}
              </h3>
              <button
                onClick={() => setEditingSlide(null)}
                className="text-neutral-400 hover:text-neutral-700 p-1 cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs uppercase tracking-wider text-neutral-600 mb-1">
                  Slide Title
                </label>
                <input
                  type="text"
                  value={editingSlide.slide.title}
                  onChange={(e) =>
                    setEditingSlide({
                      ...editingSlide,
                      slide: { ...editingSlide.slide, title: e.target.value },
                    })
                  }
                  className="w-full text-xs px-3 py-2 border border-neutral-300 rounded-xs focus:border-neutral-900 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-neutral-600 mb-1">
                  Slide Subtitle
                </label>
                <input
                  type="text"
                  value={editingSlide.slide.subtitle}
                  onChange={(e) =>
                    setEditingSlide({
                      ...editingSlide,
                      slide: { ...editingSlide.slide, subtitle: e.target.value },
                    })
                  }
                  className="w-full text-xs px-3 py-2 border border-neutral-300 rounded-xs focus:border-neutral-900 outline-none"
                />
              </div>

              <CloudinaryImageUpload
                label="Slide Panoramic Image (Cloudinary Direct Upload)"
                folder="images"
                currentUrl={editingSlide.slide.imageUrl}
                onUploaded={(url) =>
                  setEditingSlide({
                    ...editingSlide,
                    slide: { ...editingSlide.slide, imageUrl: url },
                  })
                }
              />
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-neutral-100">
              <button
                onClick={() => setEditingSlide(null)}
                className="px-4 py-2 border border-neutral-300 text-neutral-700 text-xs uppercase tracking-wider rounded-xs hover:bg-neutral-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  const updatedSlides = [...heroSlides];
                  updatedSlides[editingSlide.index] = editingSlide.slide;
                  await updateHeroSlides(updatedSlides);
                  setEditingSlide(null);
                  showToast(`Hero Slide #${editingSlide.index + 1} updated.`);
                }}
                className="px-5 py-2 bg-neutral-900 hover:bg-neutral-800 text-white text-xs uppercase tracking-wider rounded-xs cursor-pointer font-medium"
              >
                Save Slide
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Configure Pre-Wedding Video Teaser */}
      {videoModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white border border-neutral-200 p-6 sm:p-8 rounded-sm shadow-2xl max-w-xl w-full space-y-5 animate-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
              <h3 className="font-serif text-xl text-neutral-900 font-normal">
                Configure Pre-Wedding Cinema Teaser
              </h3>
              <button
                onClick={() => setVideoModalOpen(false)}
                className="text-neutral-400 hover:text-neutral-700 p-1 cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-neutral-600 mb-1">
                    Couple / Title
                  </label>
                  <input
                    type="text"
                    value={videoForm.title}
                    onChange={(e) =>
                      setVideoForm({ ...videoForm, title: e.target.value })
                    }
                    className="w-full text-xs px-3 py-2 border border-neutral-300 rounded-xs focus:border-neutral-900 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wider text-neutral-600 mb-1">
                    Subtitle
                  </label>
                  <input
                    type="text"
                    value={videoForm.subtitle}
                    onChange={(e) =>
                      setVideoForm({ ...videoForm, subtitle: e.target.value })
                    }
                    className="w-full text-xs px-3 py-2 border border-neutral-300 rounded-xs focus:border-neutral-900 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-neutral-600 mb-1">
                  Video Description
                </label>
                <textarea
                  rows={2}
                  value={videoForm.description}
                  onChange={(e) =>
                    setVideoForm({ ...videoForm, description: e.target.value })
                  }
                  className="w-full text-xs px-3 py-2 border border-neutral-300 rounded-xs focus:border-neutral-900 outline-none"
                />
              </div>

              <CloudinaryVideoUpload
                label="Video File or Stream (.mp4 / Cloudinary Video)"
                currentUrl={videoForm.videoUrl}
                onUploaded={(url) => setVideoForm({ ...videoForm, videoUrl: url })}
                helperText="Upload an MP4/MOV teaser video directly to Cloudinary or paste a stream link"
              />

              <CloudinaryImageUpload
                label="Video Poster Frame (Cloudinary Direct Upload)"
                folder="images"
                currentUrl={videoForm.posterUrl}
                onUploaded={(url) => setVideoForm({ ...videoForm, posterUrl: url })}
              />
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-neutral-100">
              <button
                onClick={() => setVideoModalOpen(false)}
                className="px-4 py-2 border border-neutral-300 text-neutral-700 text-xs uppercase tracking-wider rounded-xs hover:bg-neutral-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  await updateVideoFeature(videoForm);
                  setVideoModalOpen(false);
                  showToast('Cinema teaser updated.');
                }}
                className="px-5 py-2 bg-neutral-900 hover:bg-neutral-800 text-white text-xs uppercase tracking-wider rounded-xs cursor-pointer font-medium"
              >
                Save Video Settings
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
