import React, { useState } from 'react';
import { Play, Calendar, MapPin, Images, X, ChevronRight } from 'lucide-react';
import { NavPage, SelectedWorkItem, WeddingProject } from '../types';
import { ScrollReveal } from '../components/ScrollReveal';
import { useCMS } from '../lib/cmsStore';

interface PortfolioViewProps {
  onNavigate: (page: NavPage) => void;
  onOpenLightbox: (item: SelectedWorkItem) => void;
  onOpenVideo?: () => void;
  initialTab?: 'photos' | 'projects';
  onOpenProject?: (project: WeddingProject) => void;
}

export const PortfolioView: React.FC<PortfolioViewProps> = ({
  onOpenLightbox,
  onOpenVideo,
  initialTab = 'photos',
  onOpenProject,
}) => {
  const { selectedWork, videoFeature, weddingProjects } = useCMS();
  const [portfolioTab, setPortfolioTab] = useState<'photos' | 'projects'>(initialTab);
  const [activeCategory, setActiveCategory] = useState<string>('all');

  // Derive categories dynamically so all standalone photo categories are represented
  const dynamicCategories = Array.from(
    new Set(selectedWork.map((item) => item.category?.trim()).filter(Boolean) as string[])
  );
  const categories = ['all', ...dynamicCategories];

  const filteredWork = activeCategory === 'all'
    ? selectedWork
    : selectedWork.filter((item) => item.category?.trim().toLowerCase() === activeCategory.trim().toLowerCase());

  return (
    <div className="w-full">
      {/* 1. Header Section */}
      <section className="pt-20 sm:pt-28 pb-8 px-6 sm:px-12 max-w-7xl mx-auto">
        <ScrollReveal distance={16} duration={0.65} className="space-y-4">
          <span className="text-[11px] tracking-[0.25em] uppercase text-neutral-400 font-medium">
            OUR WORK &amp; PORTFOLIO
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl md:text-6xl text-neutral-900 font-normal tracking-tight max-w-2xl leading-[1.12]">
            Stories We've Had the <br />
            Honour to Tell
          </h1>
        </ScrollReveal>
      </section>

      {/* 2. Hero Panoramic Showcase Banner */}
      <section className="w-full px-0 sm:px-6 max-w-7xl mx-auto">
        <ScrollReveal distance={18} delay={0.1} duration={0.7}>
          <div className="relative w-full aspect-[16/10] sm:aspect-[16/9] md:aspect-[2/1] max-h-[620px] bg-neutral-900 overflow-hidden shadow-sm">
            <img
              src="https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=2000&q=85"
              alt="Bride in red bridal couture with warm ceremonial candle lights"
              className="w-full h-full object-cover filter brightness-[0.9] contrast-[1.05]"
              style={{ objectPosition: 'center 22%' }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
          </div>
        </ScrollReveal>
      </section>

      {/* 3. Tabs Menu: Positioned cleanly UNDER the Showcase Image */}
      <section className="max-w-7xl mx-auto px-4 sm:px-12 pt-6 sm:pt-10">
        <div className="flex border-b border-neutral-200 overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
          <button
            onClick={() => setPortfolioTab('photos')}
            className={`pb-2.5 sm:pb-3.5 px-1 sm:px-6 text-[10px] sm:text-sm tracking-[0.1em] sm:tracking-[0.18em] uppercase font-medium transition-colors cursor-pointer border-b-2 -mb-px flex items-center gap-1.5 sm:gap-2 whitespace-nowrap shrink-0 ${
              portfolioTab === 'photos'
                ? 'border-neutral-900 text-neutral-950 font-semibold'
                : 'border-transparent text-neutral-400 hover:text-neutral-700'
            }`}
          >
            <span>Curated Photos</span>
            <span className="text-[9px] sm:text-[10px] px-1.5 sm:px-2 py-0.5 rounded-full bg-neutral-100 text-neutral-600 font-normal">
              {selectedWork.length}
            </span>
          </button>

          <button
            onClick={() => setPortfolioTab('projects')}
            className={`pb-2.5 sm:pb-3.5 px-1 sm:px-6 text-[10px] sm:text-sm tracking-[0.1em] sm:tracking-[0.18em] uppercase font-medium transition-colors cursor-pointer border-b-2 -mb-px flex items-center gap-1.5 sm:gap-2 ml-4 sm:ml-8 whitespace-nowrap shrink-0 ${
              portfolioTab === 'projects'
                ? 'border-neutral-900 text-neutral-950 font-semibold'
                : 'border-transparent text-neutral-400 hover:text-neutral-700'
            }`}
          >
            <span>Wedding Projects</span>
            <span className="text-[9px] sm:text-[10px] px-1.5 sm:px-2 py-0.5 rounded-full bg-neutral-100 text-neutral-600 font-normal">
              {weddingProjects.length}
            </span>
          </button>
        </div>
      </section>

      {/* 4. Content depending on tab: Photos vs Wedding Projects */}
      {portfolioTab === 'photos' ? (
        <>
          {/* Curated Photos Gallery */}
          <section className="py-14 sm:py-20 px-6 text-center">
            <div className="max-w-7xl mx-auto space-y-12">
              {/* Category Filter Pills: Single scrollable row on mobile, centered on desktop */}
              <ScrollReveal distance={12} className="w-full">
                <div className="flex items-center overflow-x-auto gap-2 sm:gap-3 justify-start sm:justify-center py-2 px-1 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setActiveCategory(cat)}
                      className={`whitespace-nowrap shrink-0 text-[10px] sm:text-[11px] tracking-[0.16em] sm:tracking-[0.2em] uppercase px-3.5 sm:px-4 py-1.5 sm:py-2 border transition-colors cursor-pointer ${
                        activeCategory === cat
                          ? 'border-neutral-900 bg-neutral-900 text-white'
                          : 'border-neutral-200 text-neutral-600 hover:border-neutral-400'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </ScrollReveal>

              {/* Special Highlight for Pre-Wedding Cinema */}
              {(activeCategory === 'all' || activeCategory.toLowerCase() === 'pre wedding') && (
                <ScrollReveal distance={18} duration={0.65}>
                  <div className="bg-neutral-950 text-white rounded-sm overflow-hidden p-0 sm:p-8 lg:p-10 border border-neutral-800 shadow-xl">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-8 items-center">
                      {/* Video Frame - On mobile placed first, edge-to-edge, taking the majority of the card */}
                      <div
                        onClick={onOpenVideo}
                        className="lg:col-span-7 order-1 lg:order-2 relative aspect-[16/10] sm:aspect-[16/9] bg-black sm:rounded-xs overflow-hidden cursor-pointer group shadow-2xl"
                      >
                        <video
                          key={videoFeature.videoUrl}
                          src={videoFeature.videoUrl}
                          className="w-full h-full object-cover filter brightness-[0.88] group-hover:brightness-100 transition-all duration-500"
                          muted
                          loop
                          playsInline
                          autoPlay
                          poster={videoFeature.posterUrl}
                        />
                        <div className="absolute inset-0 bg-black/25 group-hover:bg-black/15 transition-colors flex items-center justify-center">
                          <div className="w-13 h-13 sm:w-14 sm:h-14 rounded-full bg-white text-neutral-900 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                            <Play size={20} className="fill-neutral-900 translate-x-0.5" />
                          </div>
                        </div>
                        <div className="absolute bottom-2.5 right-3 text-[9px] tracking-widest uppercase bg-black/60 px-2 py-0.5 rounded-xs text-white/90 backdrop-blur-xs">
                          Tap to Play
                        </div>
                      </div>

                      {/* Text info - Concise on mobile so video remains the focus */}
                      <div className="lg:col-span-5 order-2 lg:order-1 px-5 pb-5 pt-1 sm:p-0 space-y-2.5 sm:space-y-4 text-left">
                        <div className="flex items-center space-x-2">
                          <span className="text-[9px] sm:text-[10px] tracking-[0.2em] sm:tracking-[0.25em] uppercase text-neutral-400 font-medium">
                            FEATURED PRE-WEDDING FILM
                          </span>
                          <span className="text-[8px] sm:text-[9px] tracking-wider uppercase font-semibold px-1.5 sm:px-2 py-0.5 bg-white text-neutral-950 rounded-xs">
                            TEASER
                          </span>
                        </div>
                        <h3 className="font-serif text-xl sm:text-2xl lg:text-3xl text-neutral-100 font-normal">
                          {videoFeature.title}
                        </h3>
                        <p className="text-neutral-400 text-xs sm:text-sm leading-relaxed line-clamp-2 sm:line-clamp-none">
                          {videoFeature.description}
                        </p>
                        {onOpenVideo && (
                          <div className="pt-1">
                            <button
                              onClick={onOpenVideo}
                              className="inline-flex items-center text-[10px] sm:text-xs tracking-[0.15em] sm:tracking-[0.2em] uppercase text-white border-b border-white/60 hover:border-white pb-1 transition-colors cursor-pointer whitespace-nowrap"
                            >
                              <span>PLAY FILM TEASER</span>
                              <span className="ml-1.5 sm:ml-2 font-sans text-xs sm:text-sm">→</span>
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </ScrollReveal>
              )}

              {/* Gallery Grid */}
              {filteredWork.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-left">
                  {filteredWork.map((item, idx) => (
                    <ScrollReveal
                      key={item.id}
                      delay={(idx % 4) * 0.06}
                      distance={14}
                      duration={0.55}
                    >
                      <div
                        onClick={() => onOpenLightbox(item)}
                        className="group relative aspect-[4/5] bg-neutral-100 overflow-hidden cursor-pointer shadow-sm"
                      >
                        <img
                          src={item.imageUrl}
                          alt={item.title}
                          className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-700"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                          <span className="text-[10px] tracking-[0.2em] uppercase text-white/80">
                            {item.category}
                          </span>
                          <span className="font-serif text-white text-sm font-light mt-0.5">
                            {item.title}
                          </span>
                        </div>
                      </div>
                    </ScrollReveal>
                  ))}
                </div>
              ) : (
                <div className="py-12 text-center">
                  <p className="text-neutral-400 text-xs tracking-wider uppercase">
                    No photos found in this category
                  </p>
                </div>
              )}
            </div>
          </section>
        </>
      ) : (
        /* WEDDING PROJECTS TAB */
        <section className="py-12 sm:py-16 px-6 sm:px-12 max-w-7xl mx-auto">
          <ScrollReveal distance={16} duration={0.65} className="mb-10 text-center max-w-2xl mx-auto">
            <span className="text-[11px] tracking-[0.22em] uppercase text-neutral-400 font-medium">
              REAL WEDDINGS &amp; CELEBRATIONS
            </span>
            <h2 className="font-serif text-2xl sm:text-4xl text-neutral-900 mt-2 font-normal">
              Every Couple Has a Tale
            </h2>
            <p className="text-xs sm:text-sm text-neutral-500 mt-3 leading-relaxed">
              Explore complete wedding projects featuring portraits of the couples and intimate ceremonies captured across destinations.
            </p>
          </ScrollReveal>

          {weddingProjects.length === 0 ? (
            <div className="text-center py-20 text-neutral-400 text-sm">
              No wedding projects added yet. Add projects from the Studio CMS.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {weddingProjects.map((project, idx) => (
                <ScrollReveal
                  key={project.id}
                  delay={(idx % 3) * 0.08}
                  distance={18}
                  duration={0.6}
                >
                  <div
                    onClick={() => {
                      if (onOpenProject) {
                        onOpenProject(project);
                      }
                    }}
                    className="group bg-white border border-neutral-200/80 hover:border-neutral-900/40 rounded-xs overflow-hidden transition-all duration-500 hover:shadow-xl cursor-pointer flex flex-col h-full"
                  >
                    {/* Cover image */}
                    <div className="relative aspect-[4/3] bg-neutral-100 overflow-hidden">
                      <img
                        src={project.coverImage}
                        alt={project.coupleNames}
                        className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-700"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-80 group-hover:opacity-95 transition-opacity" />

                      {/* Photo Count badge */}
                      <div className="absolute top-3 right-3 bg-neutral-950/80 backdrop-blur-md text-white text-[10px] tracking-wider px-2.5 py-1 rounded-xs flex items-center gap-1.5 border border-white/10">
                        <Images size={12} />
                        <span>{project.images?.length || 1} Photos</span>
                      </div>

                      {/* Couple names on cover */}
                      <div className="absolute bottom-3 left-4 right-4 text-white">
                        <span className="text-[10px] tracking-[0.2em] uppercase text-neutral-300 block mb-1">
                          COUPLE STORY
                        </span>
                        <h3 className="font-serif text-xl sm:text-2xl font-light leading-snug">
                          {project.coupleNames}
                        </h3>
                      </div>
                    </div>

                    {/* Meta info & Description */}
                    <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                      <div className="space-y-2">
                        <h4 className="font-serif text-base text-neutral-900 font-medium group-hover:text-neutral-600 transition-colors">
                          {project.title}
                        </h4>

                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-neutral-500 text-xs">
                          {project.location && (
                            <span className="inline-flex items-center gap-1">
                              <MapPin size={12} className="text-neutral-400" />
                              {project.location}
                            </span>
                          )}
                          {project.date && (
                            <span className="inline-flex items-center gap-1">
                              <Calendar size={12} className="text-neutral-400" />
                              {project.date}
                            </span>
                          )}
                        </div>

                        {project.description && (
                          <p className="text-xs text-neutral-600 line-clamp-2 leading-relaxed pt-1">
                            {project.description}
                          </p>
                        )}
                      </div>

                      <div className="pt-2 border-t border-neutral-100 flex items-center justify-between text-neutral-900 text-xs tracking-wider uppercase font-medium">
                        <span>Open Wedding Story Page</span>
                        <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          )}
        </section>
      )}
    </div>
  );
};

