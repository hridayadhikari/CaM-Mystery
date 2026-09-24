import React, { useState } from 'react';
import { Play, Calendar, MapPin, X, ChevronRight, Film } from 'lucide-react';
import { NavPage, SelectedWorkItem, WeddingProject, PreWeddingVideo } from '../types';
import { ScrollReveal } from '../components/ScrollReveal';
import { useCMS } from '../lib/cmsStore';
import { getOptimizedCloudinaryUrl, getCloudinarySrcSet } from '../lib/cloudinary';

interface PortfolioViewProps {
  onNavigate: (page: NavPage) => void;
  onOpenLightbox: (item: SelectedWorkItem) => void;
  onOpenVideo?: (video?: { url: string; title?: string; poster?: string }) => void;
  initialTab?: 'photos' | 'projects' | 'videos';
  onOpenProject?: (project: WeddingProject, storyType?: 'wedding' | 'prewedding') => void;
}

export const PortfolioView: React.FC<PortfolioViewProps> = ({
  onOpenLightbox,
  onOpenVideo,
  initialTab = 'photos',
  onOpenProject,
}) => {
  const { selectedWork, videoFeature, weddingProjects, preWeddingStories, preWeddingVideos, aboutImages } = useCMS();
  const [portfolioTab, setPortfolioTab] = useState<'photos' | 'projects' | 'videos'>(initialTab);
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const heroImage =
    aboutImages?.portfolioHero ||
    'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=2000&q=85';

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
              key={heroImage}
              src={getOptimizedCloudinaryUrl(heroImage, { width: 1600 })}
              srcSet={getCloudinarySrcSet(heroImage, [800, 1200, 1600, 2000])}
              sizes="(max-width: 1280px) 100vw, 1280px"
              alt="Bride in red bridal couture with warm ceremonial candle lights"
              className="w-full h-full object-cover filter brightness-[0.9] contrast-[1.05]"
              style={{ objectPosition: 'center 22%' }}
              loading="eager"
              decoding="sync"
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
            <span>Pre-Wedding Stories</span>
          </button>

          <button
            onClick={() => setPortfolioTab('projects')}
            className={`pb-2.5 sm:pb-3.5 px-1 sm:px-6 text-[10px] sm:text-sm tracking-[0.1em] sm:tracking-[0.18em] uppercase font-medium transition-colors cursor-pointer border-b-2 -mb-px flex items-center gap-1.5 sm:gap-2 ml-4 sm:ml-8 whitespace-nowrap shrink-0 ${
              portfolioTab === 'projects'
                ? 'border-neutral-900 text-neutral-950 font-semibold'
                : 'border-transparent text-neutral-400 hover:text-neutral-700'
            }`}
          >
            <span>Wedding Stories</span>
          </button>

          <button
            id="portfolio-tab-videos"
            onClick={() => setPortfolioTab('videos')}
            className={`pb-2.5 sm:pb-3.5 px-1 sm:px-6 text-[10px] sm:text-sm tracking-[0.1em] sm:tracking-[0.18em] uppercase font-medium transition-colors cursor-pointer border-b-2 -mb-px flex items-center gap-1.5 sm:gap-2 ml-4 sm:ml-8 whitespace-nowrap shrink-0 ${
              portfolioTab === 'videos'
                ? 'border-neutral-900 text-neutral-950 font-semibold'
                : 'border-transparent text-neutral-400 hover:text-neutral-700'
            }`}
          >
            <Film size={14} className={portfolioTab === 'videos' ? 'text-neutral-900' : 'text-neutral-400'} />
            <span>Films</span>
          </button>
        </div>
      </section>

      {/* 4. Content depending on tab: Photos vs Wedding Projects */}
      {portfolioTab === 'photos' ? (
        /* PRE-WEDDING STORIES TAB */
        <section className="py-12 sm:py-16 px-6 sm:px-12 max-w-7xl mx-auto">
          <ScrollReveal distance={16} duration={0.65} className="mb-10 text-center max-w-2xl mx-auto">
            <span className="text-[11px] tracking-[0.22em] uppercase text-neutral-400 font-medium">
              ROMANCE &amp; ANTICIPATION
            </span>
            <h2 className="font-serif text-2xl sm:text-4xl text-neutral-900 mt-2 font-normal">
              Pre-Wedding Stories
            </h2>
            <p className="text-xs sm:text-sm text-neutral-500 mt-3 leading-relaxed">
              Explore intimate couple chronicles, destination shoots, and timeless love chapters captured before the big day.
            </p>
          </ScrollReveal>

          {preWeddingStories.length === 0 ? (
            <div className="text-center py-20 text-neutral-400 text-sm">
              No pre-wedding stories added yet
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {preWeddingStories.map((story, idx) => (
                <ScrollReveal
                  key={story.id}
                  delay={(idx % 3) * 0.08}
                  distance={18}
                  duration={0.6}
                >
                  <div
                    onClick={() => {
                      if (onOpenProject) {
                        onOpenProject(story, 'prewedding');
                      }
                    }}
                    className="group bg-white border border-neutral-200/80 hover:border-neutral-900/40 rounded-xs overflow-hidden transition-all duration-500 hover:shadow-xl cursor-pointer flex flex-col h-full"
                  >
                    {/* Cover image */}
                    <div className="relative aspect-[4/3] bg-neutral-100 overflow-hidden">
                      <img
                        src={getOptimizedCloudinaryUrl(story.coverImage, { width: 800 })}
                        srcSet={getCloudinarySrcSet(story.coverImage, [400, 800, 1200])}
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 400px"
                        alt={story.coupleNames}
                        className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-700"
                        loading="lazy"
                        decoding="async"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-80 group-hover:opacity-95 transition-opacity" />

                      {/* Couple names on cover */}
                      <div className="absolute bottom-3 left-4 right-4 text-white">
                        <span className="text-[10px] tracking-[0.2em] uppercase text-neutral-300 block mb-1">
                          PRE-WEDDING CHAPTER
                        </span>
                        <h3 className="font-serif text-xl sm:text-2xl font-light leading-snug">
                          {story.coupleNames}
                        </h3>
                      </div>
                    </div>

                    {/* Meta info & Description */}
                    <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                      <div className="space-y-2">
                        <h4 className="font-serif text-base text-neutral-900 font-medium group-hover:text-neutral-600 transition-colors">
                          {story.title}
                        </h4>

                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-neutral-500 text-xs">
                          {story.location && (
                            <span className="inline-flex items-center gap-1">
                              <MapPin size={12} className="text-neutral-400" />
                              {story.location}
                            </span>
                          )}
                          {story.date && (
                            <span className="inline-flex items-center gap-1">
                              <Calendar size={12} className="text-neutral-400" />
                              {story.date}
                            </span>
                          )}
                        </div>

                        {story.description && (
                          <p className="text-xs text-neutral-600 line-clamp-2 leading-relaxed pt-1">
                            {story.description}
                          </p>
                        )}
                      </div>

                      <div className="pt-2 border-t border-neutral-100 flex items-center justify-between text-neutral-900 text-xs tracking-wider uppercase font-medium">
                        <span>Open Pre-Wedding Story Page</span>
                        <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          )}
        </section>
      ) : portfolioTab === 'projects' ? (
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
                        onOpenProject(project, 'wedding');
                      }
                    }}
                    className="group bg-white border border-neutral-200/80 hover:border-neutral-900/40 rounded-xs overflow-hidden transition-all duration-500 hover:shadow-xl cursor-pointer flex flex-col h-full"
                  >
                    {/* Cover image */}
                    <div className="relative aspect-[4/3] bg-neutral-100 overflow-hidden">
                      <img
                        src={getOptimizedCloudinaryUrl(project.coverImage, { width: 800 })}
                        srcSet={getCloudinarySrcSet(project.coverImage, [400, 800, 1200])}
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 400px"
                        alt={project.coupleNames}
                        className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-700"
                        loading="lazy"
                        decoding="async"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-80 group-hover:opacity-95 transition-opacity" />

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
      ) : (
        /* Pre-Wedding Films Tab */
        <section className="py-14 sm:py-20 px-6 max-w-7xl mx-auto space-y-12">
          {/* Header intro */}
          <ScrollReveal distance={14} className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-[10px] sm:text-[11px] tracking-[0.25em] uppercase text-neutral-400 font-medium">
              CINEMATOGRAPHIC ARCHIVE
            </span>
            <h2 className="font-serif text-2xl sm:text-4xl text-neutral-900 font-normal">
              Pre-Wedding Films &amp; Teasers
            </h2>
            <p className="text-xs sm:text-sm text-neutral-500 leading-relaxed font-sans">
              Moving pictures that capture anticipation, intimacy, and the romance of beginning a life together.
            </p>
          </ScrollReveal>

          {/* Videos Grid */}
          {preWeddingVideos.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {preWeddingVideos.map((video, idx) => (
                <ScrollReveal
                  key={video.id}
                  delay={idx * 0.08}
                  distance={16}
                  duration={0.6}
                >
                  <div
                    onClick={() => {
                      if (onOpenVideo) {
                        onOpenVideo({
                          url: video.videoUrl,
                          title: [video.title, video.coupleNames].filter(Boolean).join(' • '),
                          poster: video.posterUrl,
                        });
                      }
                    }}
                    className="group bg-white border border-neutral-200/90 hover:border-neutral-900/50 rounded-xs overflow-hidden transition-all duration-500 hover:shadow-xl cursor-pointer flex flex-col h-full"
                  >
                    {/* Video poster / thumbnail with play overlay */}
                    <div className="relative aspect-[16/10] bg-neutral-950 overflow-hidden">
                      {video.posterUrl ? (
                        <img
                          src={getOptimizedCloudinaryUrl(video.posterUrl, { width: 800 })}
                          srcSet={getCloudinarySrcSet(video.posterUrl, [400, 800, 1200])}
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 400px"
                          alt={video.title}
                          className="w-full h-full object-cover filter brightness-[0.85] group-hover:brightness-95 group-hover:scale-105 transition-all duration-700"
                          loading="lazy"
                          decoding="async"
                        />
                      ) : (
                        <video
                          src={video.videoUrl}
                          className="w-full h-full object-cover filter brightness-[0.85] group-hover:brightness-95 group-hover:scale-105 transition-all duration-700"
                          muted
                          loop
                          playsInline
                        />
                      )}
                      <div className="absolute inset-0 bg-black/30 group-hover:bg-black/15 transition-colors flex items-center justify-center">
                        <div className="w-13 h-13 sm:w-14 sm:h-14 rounded-full bg-white/95 text-neutral-900 flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:bg-white transition-all">
                          <Play size={20} className="fill-neutral-900 translate-x-0.5" />
                        </div>
                      </div>

                      {video.isFeatured && (
                        <div className="absolute top-3 left-3 bg-neutral-950/85 backdrop-blur-md text-amber-300 text-[10px] tracking-wider px-2.5 py-1 rounded-xs flex items-center gap-1 border border-white/10 font-medium">
                          <span>FEATURED FILM</span>
                        </div>
                      )}

                      <div className="absolute bottom-2.5 right-3 text-[9px] tracking-widest uppercase bg-black/60 px-2 py-0.5 rounded-xs text-white/90 backdrop-blur-xs">
                        Watch Film
                      </div>
                    </div>

                    {/* Meta info */}
                    <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                      <div className="space-y-2">
                        {video.coupleNames && (
                          <span className="text-[10px] tracking-[0.2em] uppercase text-neutral-400 font-medium block">
                            {video.coupleNames}
                          </span>
                        )}
                        <h3 className="font-serif text-lg text-neutral-900 font-medium group-hover:text-neutral-600 transition-colors">
                          {video.title}
                        </h3>

                        {video.location && (
                          <div className="flex items-center gap-1 text-neutral-500 text-xs">
                            <MapPin size={12} className="text-neutral-400" />
                            <span>{video.location}</span>
                          </div>
                        )}

                        {video.description && (
                          <p className="text-xs text-neutral-600 line-clamp-2 leading-relaxed pt-1">
                            {video.description}
                          </p>
                        )}
                      </div>

                      <div className="pt-3 border-t border-neutral-100 flex items-center justify-between text-neutral-900 text-xs tracking-wider uppercase font-medium">
                        <span>Play Film</span>
                        <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          ) : videoFeature?.videoUrl ? (
            /* Fallback single featured film if no separate list created yet */
            <ScrollReveal distance={16} className="max-w-4xl mx-auto">
              <div
                onClick={() => {
                  if (onOpenVideo) {
                    onOpenVideo({
                      url: videoFeature.videoUrl,
                      title: [videoFeature.title, videoFeature.subtitle].filter(Boolean).join(' • '),
                      poster: videoFeature.posterUrl,
                    });
                  }
                }}
                className="group bg-neutral-950 text-white rounded-sm overflow-hidden p-6 sm:p-10 border border-neutral-800 shadow-2xl cursor-pointer"
              >
                <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
                  <div className="md:col-span-7 relative aspect-[16/10] bg-black rounded-xs overflow-hidden shadow-inner">
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
                      <div className="w-14 h-14 rounded-full bg-white text-neutral-900 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                        <Play size={22} className="fill-neutral-900 translate-x-0.5" />
                      </div>
                    </div>
                  </div>

                  <div className="md:col-span-5 space-y-4">
                    <span className="text-[10px] tracking-[0.25em] uppercase text-neutral-400 font-medium block">
                      FEATURED PRE-WEDDING CINEMA
                    </span>
                    <h3 className="font-serif text-2xl sm:text-3xl text-neutral-100 font-normal">
                      {videoFeature.title || 'Soul Cinema Teaser'}
                    </h3>
                    <p className="text-neutral-400 text-xs sm:text-sm leading-relaxed">
                      {videoFeature.description ||
                        'Cinematic wedding and pre-wedding films built from vows, laughter, and picturesque journeys.'}
                    </p>
                    <div className="pt-2">
                      <span className="inline-flex items-center text-xs tracking-[0.2em] uppercase text-white border-b border-white/60 pb-1">
                        WATCH PRE-WEDDING FILM →
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          ) : (
            <div className="bg-white border border-neutral-200 p-12 text-center rounded-xs space-y-3 max-w-md mx-auto">
              <Film size={32} className="mx-auto text-neutral-400" />
              <h3 className="font-serif text-lg text-neutral-900">Pre-Wedding Films Coming Soon</h3>
              <p className="text-xs text-neutral-500">
                Our pre-wedding films and teasers are being curated. Check back soon or visit our photo stories!
              </p>
            </div>
          )}
        </section>
      )}
    </div>
  );
};

