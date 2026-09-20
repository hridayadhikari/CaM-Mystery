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
  const [showArchivedStories, setShowArchivedStories] = useState<boolean>(true);

  const categories = ['all', 'Pre Wedding', 'Wedding Day', 'Bridal Portrait', 'Celebration', 'Traditional Ceremony'];

  const filteredWork = activeCategory === 'all'
    ? selectedWork
    : selectedWork.filter((item) => item.category === activeCategory);

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
      <section className="max-w-7xl mx-auto px-6 sm:px-12 pt-8 sm:pt-10">
        <div className="flex border-b border-neutral-200">
          <button
            onClick={() => setPortfolioTab('photos')}
            className={`pb-3.5 px-3 sm:px-6 text-xs sm:text-sm tracking-[0.18em] uppercase font-medium transition-colors cursor-pointer border-b-2 -mb-px flex items-center gap-2 ${
              portfolioTab === 'photos'
                ? 'border-neutral-900 text-neutral-950 font-semibold'
                : 'border-transparent text-neutral-400 hover:text-neutral-700'
            }`}
          >
            <span>Curated Photos</span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-neutral-100 text-neutral-600 font-normal">
              {selectedWork.length}
            </span>
          </button>

          <button
            onClick={() => setPortfolioTab('projects')}
            className={`pb-3.5 px-3 sm:px-6 text-xs sm:text-sm tracking-[0.18em] uppercase font-medium transition-colors cursor-pointer border-b-2 -mb-px flex items-center gap-2 ml-4 sm:ml-8 ${
              portfolioTab === 'projects'
                ? 'border-neutral-900 text-neutral-950 font-semibold'
                : 'border-transparent text-neutral-400 hover:text-neutral-700'
            }`}
          >
            <span>Wedding Projects</span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-neutral-100 text-neutral-600 font-normal">
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
            {!showArchivedStories ? (
              <ScrollReveal distance={14} className="space-y-6 max-w-md mx-auto">
                <p className="text-neutral-500 font-sans text-sm tracking-wide">
                  No items in this section yet.
                </p>
                <div>
                  <button
                    id="portfolio-view-archives-btn"
                    onClick={() => setShowArchivedStories(true)}
                    className="text-[11px] tracking-[0.2em] uppercase text-neutral-400 hover:text-neutral-900 border-b border-neutral-300 hover:border-neutral-900 pb-0.5 transition-all cursor-pointer"
                  >
                    Browse Featured Wedding Galleries
                  </button>
                </div>
              </ScrollReveal>
            ) : (
              <div className="max-w-7xl mx-auto space-y-12">
                {/* Category Filter Pills */}
                <ScrollReveal distance={12} className="flex flex-wrap justify-center gap-3">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setActiveCategory(cat)}
                      className={`text-[11px] tracking-[0.2em] uppercase px-4 py-2 border transition-colors cursor-pointer ${
                        activeCategory === cat
                          ? 'border-neutral-900 bg-neutral-900 text-white'
                          : 'border-neutral-200 text-neutral-600 hover:border-neutral-400'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </ScrollReveal>

                {/* Special Highlight for Pre-Wedding Cinema */}
                {(activeCategory === 'all' || activeCategory === 'Pre Wedding') && (
                  <ScrollReveal distance={18} duration={0.65}>
                    <div className="bg-neutral-950 text-white rounded-sm overflow-hidden p-6 sm:p-10 border border-neutral-800 shadow-xl">
                      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                        <div className="lg:col-span-5 space-y-4 text-left">
                          <div className="flex items-center space-x-2">
                            <span className="text-[10px] tracking-[0.25em] uppercase text-neutral-400 font-medium">
                              FEATURED PRE-WEDDING FILM
                            </span>
                            <span className="text-[9px] tracking-wider uppercase font-semibold px-2 py-0.5 bg-white text-neutral-950 rounded-xs">
                              TEASER
                            </span>
                          </div>
                          <h3 className="font-serif text-2xl sm:text-3xl text-neutral-100 font-normal">
                            {videoFeature.title}
                          </h3>
                          <p className="text-neutral-400 text-sm leading-relaxed">
                            {videoFeature.description}
                          </p>
                          {onOpenVideo && (
                            <button
                              onClick={onOpenVideo}
                              className="inline-flex items-center text-xs tracking-[0.2em] uppercase text-white border-b border-white/60 hover:border-white pb-1 transition-colors cursor-pointer pt-2"
                            >
                              <span>PLAY FILM TEASER</span>
                              <span className="ml-2">→</span>
                            </button>
                          )}
                        </div>
                        <div
                          onClick={onOpenVideo}
                          className="lg:col-span-7 relative aspect-[16/9] bg-black rounded-xs overflow-hidden cursor-pointer group shadow-2xl"
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
                          <div className="absolute inset-0 bg-black/30 group-hover:bg-black/15 transition-colors flex items-center justify-center">
                            <div className="w-12 h-12 rounded-full bg-white text-neutral-900 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                              <Play size={18} className="fill-neutral-900 translate-x-0.5" />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </ScrollReveal>
                )}

                {/* Gallery Grid */}
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

                <div className="pt-8">
                  <button
                    onClick={() => setShowArchivedStories(false)}
                    className="text-xs text-neutral-400 hover:text-neutral-700 tracking-wider underline cursor-pointer"
                  >
                    Reset to default view
                  </button>
                </div>
              </div>
            )}
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

