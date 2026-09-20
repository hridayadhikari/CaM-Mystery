import React, { useEffect } from 'react';
import { ArrowLeft, Calendar, MapPin, Images, Heart } from 'lucide-react';
import { NavPage, SelectedWorkItem, WeddingProject } from '../types';
import { ScrollReveal } from '../components/ScrollReveal';

interface WeddingProjectDetailViewProps {
  project: WeddingProject;
  onBack: () => void;
  onNavigate: (page: NavPage, pkg?: string, initialPortfolioTab?: 'photos' | 'projects') => void;
  onOpenLightbox: (item: SelectedWorkItem) => void;
}

export const WeddingProjectDetailView: React.FC<WeddingProjectDetailViewProps> = ({
  project,
  onBack,
  onNavigate,
  onOpenLightbox,
}) => {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [project.id]);

  const images = project.images && project.images.length > 0 ? project.images : [project.coverImage];

  return (
    <div className="w-full bg-white text-neutral-900 animate-fadeIn">
      {/* 1. Back navigation bar */}
      <section className="pt-24 sm:pt-28 pb-4 px-6 sm:px-12 max-w-7xl mx-auto flex items-center justify-between border-b border-neutral-100">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-xs tracking-[0.2em] uppercase font-medium text-neutral-600 hover:text-black transition-colors cursor-pointer group py-2"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          <span>BACK TO WEDDING PROJECTS</span>
        </button>

        <div className="text-[11px] tracking-widest uppercase text-neutral-400 font-medium">
          WEDDING ARCHIVES
        </div>
      </section>

      {/* 2. Panoramic Hero Story Banner */}
      <section className="relative w-full aspect-[16/10] sm:aspect-[21/9] max-h-[640px] bg-neutral-950 overflow-hidden shadow-sm">
        <img
          src={project.coverImage}
          alt={project.coupleNames}
          className="w-full h-full object-cover object-top filter brightness-[0.88] contrast-[1.05]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />

        <div className="absolute bottom-6 sm:bottom-12 left-6 sm:left-12 right-6 sm:right-12 max-w-5xl text-white space-y-2 sm:space-y-3">
          <span className="text-[10px] sm:text-[11px] tracking-[0.25em] uppercase text-neutral-300 font-medium">
            REAL WEDDING CELEBRATION
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl md:text-6xl font-light leading-tight">
            {project.coupleNames}
          </h1>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs sm:text-sm text-neutral-300 pt-1">
            <span className="font-serif italic text-white text-base sm:text-lg">
              {project.title}
            </span>
            {project.location && (
              <span className="inline-flex items-center gap-1.5 text-neutral-300">
                <MapPin size={13} className="text-white/80" /> {project.location}
              </span>
            )}
            {project.date && (
              <span className="inline-flex items-center gap-1.5 text-neutral-300">
                <Calendar size={13} className="text-white/80" /> {project.date}
              </span>
            )}
            <span className="inline-flex items-center gap-1.5 text-neutral-300 bg-white/10 px-2.5 py-0.5 rounded-xs text-xs backdrop-blur-xs">
              <Images size={12} /> {images.length} Photographs
            </span>
          </div>
        </div>
      </section>

      {/* 3. Story Narrative Section */}
      <section className="py-16 sm:py-20 px-6 sm:px-12 max-w-4xl mx-auto text-center space-y-6">
        <ScrollReveal distance={16} duration={0.65} className="space-y-4">
          <span className="text-[11px] tracking-[0.25em] uppercase text-neutral-400 font-medium">
            THE CELEBRATION
          </span>
          <h2 className="font-serif text-2xl sm:text-4xl text-neutral-900 font-normal">
            Honouring Traditions, Bound by Love
          </h2>
          {project.description ? (
            <p className="text-neutral-600 font-sans text-sm sm:text-base leading-relaxed max-w-2xl mx-auto pt-2">
              {project.description}
            </p>
          ) : (
            <p className="text-neutral-500 font-sans text-sm sm:text-base leading-relaxed max-w-2xl mx-auto pt-2 italic">
              "A timeless celebration of sacred promises, joyful laughter with loved ones, and candid heirloom memories crafted to endure for decades."
            </p>
          )}
        </ScrollReveal>
      </section>

      {/* 4. Complete Photographic Gallery */}
      <section className="pb-24 sm:pb-32 px-6 sm:px-12 max-w-7xl mx-auto">
        <div className="flex items-center justify-between border-b border-neutral-200 pb-4 mb-8">
          <div>
            <h3 className="font-serif text-xl sm:text-2xl text-neutral-900">
              Ceremonial &amp; Couple Gallery
            </h3>
            <p className="text-xs text-neutral-500 mt-1">
              Click any photo to open the high-resolution lightbox view
            </p>
          </div>
          <span className="text-xs tracking-wider uppercase text-neutral-400">
            {images.length} Moments
          </span>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
          {images.map((imgUrl, idx) => (
            <ScrollReveal
              key={idx}
              delay={(idx % 4) * 0.05}
              distance={16}
              duration={0.55}
            >
              <div
                onClick={() =>
                  onOpenLightbox({
                    id: 888000 + idx,
                    title: `${project.coupleNames} - Photo #${idx + 1}`,
                    category: project.title,
                    imageUrl: imgUrl,
                  })
                }
                className="group relative aspect-[4/5] bg-neutral-100 overflow-hidden cursor-pointer shadow-xs rounded-xs"
              >
                <img
                  src={imgUrl}
                  alt={`${project.coupleNames} photograph ${idx + 1}`}
                  className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4 text-white">
                  <span className="text-[10px] tracking-[0.2em] uppercase text-white/80">
                    {project.coupleNames}
                  </span>
                  <span className="font-serif text-sm font-light mt-0.5">
                    Frame #{idx + 1}
                  </span>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* 5. Bottom Engagement CTA Banner */}
      <section className="py-20 sm:py-24 px-6 bg-neutral-950 text-white text-center">
        <ScrollReveal distance={18} className="max-w-2xl mx-auto space-y-5">
          <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center mx-auto text-rose-400">
            <Heart size={18} className="fill-rose-400" />
          </div>
          <span className="text-[11px] tracking-[0.25em] uppercase text-neutral-400 font-medium">
            CAPTURING YOUR UNIQUE STORY
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-normal">
            Planning Your Wedding Day?
          </h2>
          <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed max-w-lg mx-auto">
            Let us document your celebration with the same elegance, emotional depth, and timeless artistry seen in this story.
          </p>
          <div className="pt-3 flex flex-wrap justify-center gap-4">
            <button
              onClick={() => onNavigate('CONTACT')}
              className="px-6 py-3 bg-white text-neutral-900 hover:bg-neutral-100 text-xs tracking-[0.2em] uppercase font-medium rounded-xs transition-colors cursor-pointer"
            >
              INQUIRE ABOUT DATES
            </button>
            <button
              onClick={onBack}
              className="px-6 py-3 border border-white/40 hover:border-white text-white text-xs tracking-[0.2em] uppercase font-medium rounded-xs transition-colors cursor-pointer"
            >
              EXPLORE MORE WEDDINGS
            </button>
          </div>
        </ScrollReveal>
      </section>
    </div>
  );
};
