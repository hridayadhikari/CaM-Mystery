import React, { useEffect, useMemo } from 'react';
import { ArrowLeft, Calendar, MapPin, Heart } from 'lucide-react';
import { NavPage, SelectedWorkItem, WeddingProject } from '../types';
import { ScrollReveal } from '../components/ScrollReveal';
import { getOptimizedCloudinaryUrl, getCloudinarySrcSet } from '../lib/cloudinary';

interface WeddingProjectDetailViewProps {
  project: WeddingProject;
  storyType?: 'wedding' | 'prewedding';
  onBack: () => void;
  onNavigate: (page: NavPage, pkg?: string, initialPortfolioTab?: 'photos' | 'projects' | 'videos') => void;
  onOpenLightbox: (item: SelectedWorkItem, contextItems?: SelectedWorkItem[]) => void;
}

export const WeddingProjectDetailView: React.FC<WeddingProjectDetailViewProps> = ({
  project,
  storyType = 'wedding',
  onBack,
  onNavigate,
  onOpenLightbox,
}) => {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [project.id]);

  const images = project.images && project.images.length > 0 ? project.images : [project.coverImage];
  const isPrewedding = storyType === 'prewedding';

  const projectGalleryItems: SelectedWorkItem[] = useMemo(() => {
    return images.map((url, i) => {
      const framing = project.photoFraming?.[url];
      return {
        id: 888000 + i,
        title: `${project.coupleNames} - Photo #${i + 1}`,
        category: project.coupleNames,
        imageUrl: url,
        object_position_x: framing?.x ?? 50,
        object_position_y: framing?.y ?? 50,
      };
    });
  }, [images, project.coupleNames, project.photoFraming]);

  return (
    <div className="w-full bg-white text-neutral-900 animate-fadeIn">
      {/* 1. Back navigation bar */}
      <section className="pt-20 sm:pt-24 pb-3 sm:pb-4 px-4 sm:px-8 max-w-7xl mx-auto flex items-center justify-between border-b border-neutral-100">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-1.5 sm:gap-2 text-[10px] sm:text-xs tracking-[0.14em] sm:tracking-[0.2em] uppercase font-medium text-neutral-600 hover:text-black transition-colors cursor-pointer group py-1.5"
        >
          <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform sm:w-4 sm:h-4" />
          <span className="sm:hidden">Back to Stories</span>
          <span className="hidden sm:inline">
            {isPrewedding ? 'Back to Pre-Wedding Stories' : 'Back to Wedding Stories'}
          </span>
        </button>

        <div className="text-[9px] sm:text-[11px] tracking-wider sm:tracking-widest uppercase text-neutral-400 font-medium">
          {isPrewedding ? 'Pre-Wedding Archives' : 'Wedding Archives'}
        </div>
      </section>

      {/* 2. Panoramic Hero Story Banner */}
      <section className="relative w-full aspect-[4/3] sm:aspect-[21/9] min-h-[340px] sm:min-h-[420px] max-h-[640px] bg-neutral-950 overflow-hidden shadow-sm !rounded-none">
        <img
          src={getOptimizedCloudinaryUrl(project.coverImage, { width: 1600 })}
          srcSet={getCloudinarySrcSet(project.coverImage, [800, 1200, 1600, 2000])}
          sizes="100vw"
          alt={project.coupleNames}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: `${project.cover_position_x ?? 50}% ${project.cover_position_y ?? 50}%`,
          }}
          className="filter brightness-[0.88] contrast-[1.05]"
          loading="eager"
          decoding="sync"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

        <div className="absolute bottom-4 sm:bottom-10 left-4 sm:left-10 right-4 sm:right-10 max-w-5xl text-white space-y-1.5 sm:space-y-3">
          <span className="text-[9px] sm:text-[11px] tracking-[0.2em] sm:tracking-[0.25em] uppercase text-neutral-300 font-medium block">
            {isPrewedding ? 'Pre-Wedding Story' : 'Real Wedding Celebration'}
          </span>
          <h1 className="font-serif text-2xl sm:text-4xl md:text-5xl font-light leading-tight">
            {project.coupleNames}
          </h1>
          <div className="flex flex-wrap items-center gap-x-3 sm:gap-x-5 gap-y-1.5 text-[11px] sm:text-sm text-neutral-300 pt-0.5 sm:pt-1">
            <span className="font-serif italic text-white text-sm sm:text-lg">
              {project.title}
            </span>
            {project.location && (
              <span className="inline-flex items-center gap-1 text-neutral-300">
                <MapPin size={11} className="text-white/80 sm:w-3.5 sm:h-3.5" /> {project.location}
              </span>
            )}
            {project.date && (
              <span className="inline-flex items-center gap-1 text-neutral-300">
                <Calendar size={11} className="text-white/80 sm:w-3.5 sm:h-3.5" /> {project.date}
              </span>
            )}
          </div>
        </div>
      </section>

      {/* 3. Story Narrative Section */}
      <section className="py-10 sm:py-16 px-4 sm:px-8 max-w-4xl mx-auto text-center space-y-4 sm:space-y-6">
        <ScrollReveal distance={14} duration={0.6} className="space-y-3 sm:space-y-4">
          <span className="text-[10px] sm:text-[11px] tracking-[0.2em] sm:tracking-[0.25em] uppercase text-neutral-400 font-medium block">
            {isPrewedding ? 'THE CHAPTER' : 'THE CELEBRATION'}
          </span>
          <h2 className="font-serif text-xl sm:text-3xl md:text-4xl text-neutral-900 font-normal leading-snug px-2">
            {isPrewedding ? 'Romance in Anticipation' : 'Honouring Traditions, Bound by Love'}
          </h2>
          {project.description ? (
            <p className="text-neutral-600 font-sans text-xs sm:text-base leading-relaxed max-w-2xl mx-auto px-2">
              {project.description}
            </p>
          ) : (
            <p className="text-neutral-500 font-sans text-xs sm:text-base leading-relaxed max-w-2xl mx-auto px-2 italic">
              {isPrewedding
                ? '"Intimate pre-wedding moments captured with romance, warmth, and cinematic honesty before the big day."'
                : '"A timeless celebration of sacred promises, joyful laughter with loved ones, and candid heirloom memories crafted to endure for decades."'}
            </p>
          )}
        </ScrollReveal>
      </section>

      {/* 4. Complete Photographic Gallery */}
      <section className="pb-16 sm:pb-28 px-4 sm:px-8 max-w-7xl mx-auto">
        <div className="border-b border-neutral-200 pb-3 sm:pb-4 mb-6 sm:mb-8">
          <div>
            <h3 className="font-serif text-lg sm:text-2xl text-neutral-900 font-normal leading-snug">
              {isPrewedding ? 'Couple & Location Gallery' : 'Ceremonial & Couple Gallery'}
            </h3>
            <p className="text-[11px] sm:text-xs text-neutral-500 mt-0.5">
              Tap any photo to view in full resolution
            </p>
          </div>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-4">
          {images.map((imgUrl, idx) => {
            const currentItem = projectGalleryItems[idx];

            return (
              <ScrollReveal
                key={idx}
                delay={(idx % 4) * 0.05}
                distance={16}
                duration={0.55}
              >
                <div
                  onClick={() => onOpenLightbox(currentItem, projectGalleryItems)}
                  className="group relative aspect-[4/5] bg-neutral-100 overflow-hidden cursor-pointer shadow-xs rounded-xs"
                >
                <img
                  src={getOptimizedCloudinaryUrl(imgUrl, { width: 800 })}
                  srcSet={getCloudinarySrcSet(imgUrl, [400, 800, 1200])}
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 380px"
                  alt={`${project.coupleNames} photograph ${idx + 1}`}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    objectPosition: `${project.photoFraming?.[imgUrl]?.x ?? 50}% ${project.photoFraming?.[imgUrl]?.y ?? 50}%`,
                  }}
                  className="transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                  decoding="async"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-3 sm:p-4 text-white">
                  <span className="text-[9px] sm:text-[10px] tracking-[0.2em] uppercase text-white/80">
                    {project.coupleNames}
                  </span>
                  <span className="font-serif text-xs sm:text-sm font-light mt-0.5">
                    Frame #{idx + 1}
                  </span>
                </div>
              </div>
            </ScrollReveal>
            );
          })}
        </div>
      </section>

      {/* 5. Bottom Engagement CTA Banner */}
      <section className="py-14 sm:py-24 px-4 sm:px-6 bg-neutral-950 text-white text-center">
        <ScrollReveal distance={18} className="max-w-2xl mx-auto space-y-4 sm:space-y-5">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/10 flex items-center justify-center mx-auto text-rose-400">
            <Heart size={16} className="fill-rose-400 sm:w-[18px] sm:h-[18px]" />
          </div>
          <span className="text-[10px] sm:text-[11px] tracking-[0.2em] sm:tracking-[0.25em] uppercase text-neutral-400 font-medium block">
            CAPTURING YOUR UNIQUE STORY
          </span>
          <h2 className="font-serif text-2xl sm:text-4xl font-normal leading-snug">
            {isPrewedding ? 'Planning Your Pre-Wedding Shoot?' : 'Planning Your Wedding Day?'}
          </h2>
          <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed max-w-lg mx-auto px-2">
            Let us document your celebration with the same elegance, emotional depth, and timeless artistry seen in this story.
          </p>
          <div className="pt-2 sm:pt-3 flex flex-col sm:flex-row items-center justify-center gap-2.5 sm:gap-4 max-w-xs sm:max-w-none mx-auto w-full">
            <button
              onClick={() => onNavigate('CONTACT')}
              className="w-full sm:w-auto px-5 sm:px-6 py-2.5 sm:py-3 bg-white text-neutral-900 hover:bg-neutral-100 text-[10px] sm:text-xs tracking-[0.14em] sm:tracking-[0.2em] uppercase font-medium rounded-xs transition-colors cursor-pointer text-center"
            >
              INQUIRE ABOUT DATES
            </button>
            <button
              onClick={onBack}
              className="w-full sm:w-auto px-5 sm:px-6 py-2.5 sm:py-3 border border-white/40 hover:border-white text-white text-[10px] sm:text-xs tracking-[0.14em] sm:tracking-[0.2em] uppercase font-medium rounded-xs transition-colors cursor-pointer text-center"
            >
              {isPrewedding ? 'EXPLORE MORE STORIES' : 'EXPLORE MORE WEDDINGS'}
            </button>
          </div>
        </ScrollReveal>
      </section>
    </div>
  );
};
