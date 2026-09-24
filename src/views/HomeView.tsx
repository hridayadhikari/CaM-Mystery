import React, { useState, useEffect } from 'react';
import { NavPage, SelectedWorkItem, WeddingProject } from '../types';
import { Play, ChevronRight, MapPin, Calendar } from 'lucide-react';
import { ScrollReveal } from '../components/ScrollReveal';
import { useCMS } from '../lib/cmsStore';
import { getOptimizedCloudinaryUrl, getCloudinarySrcSet } from '../lib/cloudinary';

interface HomeViewProps {
  onNavigate: (page: NavPage, pkg?: string, initialPortfolioTab?: 'photos' | 'projects' | 'videos') => void;
  onOpenLightbox: (item: SelectedWorkItem, contextItems?: SelectedWorkItem[]) => void;
  onOpenVideo: (video?: { url: string; title?: string; poster?: string }) => void;
  onOpenProject?: (project: WeddingProject) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  onNavigate,
  onOpenLightbox,
  onOpenVideo,
  onOpenProject,
}) => {
  const { heroSlides, selectedWork, testimonials, videoFeature, weddingProjects, preWeddingStories, aboutImages } = useCMS();
  const [currentSlide, setCurrentSlide] = useState(0);

  // Auto advance hero slider every 6 seconds
  useEffect(() => {
    if (heroSlides.length === 0) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [heroSlides.length]);

  return (
    <div className="w-full">
      {/* 1. Hero Carousel taking the place of the transparent header at the very top */}
      <section className="relative w-full h-screen min-h-[640px] max-h-[1100px] bg-neutral-950 overflow-hidden">
        {heroSlides.map((slide, idx) => {
          const isLCP = idx === 0;
          return (
            <div
              key={slide.id}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                idx === currentSlide ? 'opacity-100' : 'opacity-0 pointer-events-none'
              }`}
            >
              <img
                src={getOptimizedCloudinaryUrl(slide.imageUrl, { width: 1600 })}
                srcSet={getCloudinarySrcSet(slide.imageUrl, [800, 1200, 1600, 2000])}
                sizes="100vw"
                alt={slide.title}
                className="w-full h-full object-cover filter brightness-[0.82] contrast-[1.04]"
                style={{ objectPosition: 'center' }}
                loading={isLCP ? 'eager' : 'lazy'}
                decoding={isLCP ? 'sync' : 'async'}
                fetchPriority={isLCP ? 'high' : 'auto'}
              />
              {/* Subtle top gradient for transparent header legibility and bottom gradient for indicators */}
              <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-transparent to-black/65 pointer-events-none" />
            </div>
          );
        })}

        {/* Carousel indicators (3 dashes at bottom) */}
        <div className="absolute bottom-10 left-0 right-0 z-20 flex justify-center items-center space-x-3">
          {heroSlides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              className={`h-[2px] transition-all duration-300 cursor-pointer focus:outline-none ${
                idx === currentSlide ? 'w-10 bg-white' : 'w-6 bg-white/40 hover:bg-white/70'
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      </section>

      {/* 2. Intro Philosophy Statement */}
      <section className="py-24 sm:py-32 px-6 sm:px-12 bg-white">
        <ScrollReveal distance={18} duration={0.7} className="max-w-3xl mx-auto text-center">
          <p
            className="font-serif text-xl sm:text-2xl md:text-3xl text-neutral-800 text-center"
            style={{
              textAlign: 'center',
              letterSpacing: '0.01em',
              wordSpacing: 'normal',
              lineHeight: 1.65,
              fontWeight: 450,
            }}
          >
            At CaM-Mystery, we believe every wedding is a story waiting to be told.
            Through timeless photography and cinematic films, we capture genuine
            emotions, meaningful traditions, and the moments that make your
            celebration uniquely yours.
          </p>
          <div className="mt-8">
            <button
              id="home-our-story-link"
              onClick={() => onNavigate('ABOUT')}
              className="inline-flex items-center text-[10px] sm:text-xs tracking-[0.18em] sm:tracking-[0.25em] uppercase font-medium text-neutral-900 border-b border-neutral-900 pb-1 hover:text-neutral-600 hover:border-neutral-400 transition-colors cursor-pointer"
            >
              <span>OUR STORY</span>
              <span className="ml-1.5 sm:ml-2 font-sans text-xs sm:text-sm">→</span>
            </button>
          </div>
        </ScrollReveal>
      </section>

      {/* 3. Selected Work */}
      <section className="py-12 px-6 sm:px-10 max-w-7xl mx-auto">
        <ScrollReveal distance={12} className="text-center mb-12">
          <span className="text-[11px] tracking-[0.25em] uppercase text-neutral-400 font-medium">
            SELECTED WORK
          </span>
        </ScrollReveal>

        {/* 8-Photo Grid: 4 columns x 2 rows */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-3">
          {(() => {
            // 1. Featured photos from Wedding Projects
            const featuredFromWeddings: SelectedWorkItem[] = [];
            weddingProjects.forEach((proj, pIdx) => {
              const featList = proj.featuredImages || [];
              featList.forEach((url, iIdx) => {
                featuredFromWeddings.push({
                  id: 100000 + pIdx * 100 + iIdx,
                  title: proj.coupleNames || proj.title,
                  category: 'Wedding Story',
                  imageUrl: url,
                  isFeatured: true,
                });
              });
            });

            // 2. Featured photos from Pre-Wedding Stories
            const featuredFromPreWeddings: SelectedWorkItem[] = [];
            preWeddingStories.forEach((story, sIdx) => {
              const featList = story.featuredImages || [];
              featList.forEach((url, iIdx) => {
                featuredFromPreWeddings.push({
                  id: 200000 + sIdx * 100 + iIdx,
                  title: story.coupleNames || story.title,
                  category: 'Pre-Wedding Story',
                  imageUrl: url,
                  isFeatured: true,
                });
              });
            });

            // 3. Featured items from selectedWork
            const featuredFromSelectedWork = selectedWork.filter((item) => item.isFeatured);

            // Combine all featured
            const allFeatured = [
              ...featuredFromWeddings,
              ...featuredFromPreWeddings,
              ...featuredFromSelectedWork,
            ];

            const displayItems = allFeatured.length > 0
              ? allFeatured
              : selectedWork.slice(0, 8);

            return displayItems.map((item, idx) => (
              <ScrollReveal
                key={item.id}
                delay={(idx % 4) * 0.07}
                distance={14}
                duration={0.55}
              >
                  <div
                    onClick={() => onOpenLightbox(item, displayItems)}
                    className="group relative aspect-[4/5] bg-neutral-100 overflow-hidden cursor-pointer"
                  >
                    <img
                      src={getOptimizedCloudinaryUrl(item.imageUrl, { width: 800 })}
                      srcSet={getCloudinarySrcSet(item.imageUrl, [400, 800, 1200])}
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 300px"
                      alt={item.title}
                      className="w-full h-full object-cover object-top transition-transform duration-700 ease-out group-hover:scale-105 filter brightness-[0.97]"
                      loading="lazy"
                      decoding="async"
                    />
                  <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                    <span className="text-[10px] tracking-[0.2em] uppercase text-white/80">
                      {item.category}
                    </span>
                    <span className="font-serif text-white text-sm font-light mt-0.5">
                      {item.title}
                    </span>
                  </div>
                </div>
              </ScrollReveal>
            ));
          })()}
        </div>

        {/* Link to portfolio */}
        <ScrollReveal distance={12} delay={0.1} className="text-center mt-12 mb-16">
          <button
            id="home-view-portfolio-link"
            onClick={() => onNavigate('PORTFOLIO', undefined, 'photos')}
            className="inline-flex items-center text-[10px] sm:text-xs tracking-[0.16em] sm:tracking-[0.25em] uppercase font-medium text-neutral-900 border-b border-neutral-900 pb-1 hover:text-neutral-600 hover:border-neutral-400 transition-colors cursor-pointer"
          >
            <span>VIEW ALL PORTFOLIO PHOTOS</span>
            <span className="ml-1.5 sm:ml-2 font-sans text-xs sm:text-sm">→</span>
          </button>
        </ScrollReveal>
      </section>

      {/* 3.5. Featured Real Wedding Projects Section */}
      {weddingProjects.length > 0 && (
        <section className="py-20 sm:py-28 px-6 sm:px-12 max-w-7xl mx-auto border-t border-neutral-100 bg-[#fbfbfb]">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 sm:mb-14 gap-6">
            <ScrollReveal distance={14} className="space-y-3 max-w-xl">
              <span className="text-[11px] tracking-[0.25em] uppercase text-neutral-400 font-medium">
                FEATURED WEDDING STORIES
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl text-neutral-900 font-normal tracking-tight leading-[1.15]">
                Real Weddings &amp; Couple Chronicles
              </h2>
              <p className="text-neutral-500 font-sans text-xs sm:text-sm leading-relaxed">
                Step into complete wedding celebrations — from intimate couple portraits to joyous traditions and sacred moments.
              </p>
            </ScrollReveal>

            <ScrollReveal distance={14} delay={0.1}>
              <button
                onClick={() => onNavigate('PORTFOLIO', undefined, 'projects')}
                className="inline-flex items-center justify-center gap-2 px-4 sm:px-5 py-2.5 sm:py-3 border border-neutral-900 bg-neutral-900 text-white hover:bg-neutral-800 text-[11px] sm:text-xs tracking-[0.15em] sm:tracking-[0.2em] uppercase font-medium transition-colors cursor-pointer rounded-xs w-full sm:w-auto"
              >
                <span>EXPLORE ALL PROJECTS</span>
                <ChevronRight size={14} />
              </button>
            </ScrollReveal>
          </div>

          {/* Cards Grid: Showcase top 3 real wedding projects */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {weddingProjects.slice(0, 3).map((project, idx) => (
              <ScrollReveal
                key={project.id}
                delay={idx * 0.1}
                distance={18}
                duration={0.6}
              >
                <div
                  onClick={() => {
                    if (onOpenProject) {
                      onOpenProject(project);
                    } else {
                      onNavigate('PORTFOLIO', undefined, 'projects');
                    }
                  }}
                  className="group bg-white border border-neutral-200/80 hover:border-neutral-900/50 rounded-xs overflow-hidden transition-all duration-500 hover:shadow-xl cursor-pointer flex flex-col h-full"
                >
                  {/* Image cover */}
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
                    <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-transparent opacity-80 group-hover:opacity-95 transition-opacity" />

                    {/* Couple names on cover */}
                    <div className="absolute bottom-3.5 left-4 right-4 text-white">
                      <span className="text-[10px] tracking-[0.2em] uppercase text-neutral-300 block mb-1">
                        COUPLE ARCHIVE
                      </span>
                      <h3 className="font-serif text-xl sm:text-2xl font-light leading-snug">
                        {project.coupleNames}
                      </h3>
                    </div>
                  </div>

                  {/* Body content */}
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
                      <span>View Couple &amp; Ceremonies</span>
                      <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>

          {/* Bottom CTA to Projects */}
          <ScrollReveal distance={12} delay={0.15} className="text-center mt-12 px-2">
            <button
              onClick={() => onNavigate('PORTFOLIO', undefined, 'projects')}
              className="inline-flex items-center text-[10px] sm:text-xs tracking-[0.12em] sm:tracking-[0.22em] uppercase font-medium text-neutral-900 border-b border-neutral-900 pb-1 hover:text-neutral-600 hover:border-neutral-400 transition-colors cursor-pointer text-center"
            >
              <span>SEE ALL WEDDING STORIES IN PORTFOLIO</span>
              <span className="ml-1.5 sm:ml-2 font-sans text-xs sm:text-sm">→</span>
            </button>
          </ScrollReveal>
        </section>
      )}

      {/* 4. Pre-Wedding Cinema & Films Section */}
      {Boolean(videoFeature?.videoUrl) && (
        <section className="py-20 sm:py-28 px-6 sm:px-12 max-w-6xl mx-auto border-t border-neutral-100">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 sm:gap-16 items-center">
          {/* Left Column Text */}
          <ScrollReveal distance={18} duration={0.7} className="space-y-6">
            <div className="flex items-center space-x-2">
              <span className="text-[11px] tracking-[0.25em] uppercase text-neutral-400 font-medium">
                PRE-WEDDING CINEMA
              </span>
              <span className="text-[9px] tracking-wider uppercase font-semibold px-2 py-0.5 bg-neutral-900 text-white rounded-xs">
                TEASER
              </span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl text-neutral-900 font-normal tracking-tight leading-[1.15]">
              Films that play like memory.
            </h2>
            <p className="text-neutral-600 font-sans text-sm sm:text-base leading-relaxed">
              {videoFeature.description ||
                'Cinematic wedding and pre-wedding films built from the sound and movement a photograph cannot hold — vows, laughter, and picturesque journeys.'}
            </p>
            <div className="pt-2">
              <button
                id="home-explore-videos-cta"
                onClick={() => onNavigate('PORTFOLIO', undefined, 'videos')}
                className="inline-flex items-center text-[10px] sm:text-xs tracking-[0.16em] sm:tracking-[0.25em] uppercase font-medium text-neutral-900 border-b border-neutral-900 pb-1 hover:text-neutral-600 hover:border-neutral-400 transition-colors cursor-pointer"
              >
                <span>EXPLORE ALL PRE-WEDDING VIDEOS</span>
                <span className="ml-1.5 sm:ml-2 font-sans text-xs sm:text-sm">→</span>
              </button>
            </div>
          </ScrollReveal>

          {/* Right Column Video Player / Frame */}
          <ScrollReveal distance={20} delay={0.15} duration={0.7}>
            <div
              onClick={() => onOpenVideo()}
              className="relative aspect-[16/10] bg-neutral-950 rounded-sm overflow-hidden group cursor-pointer shadow-xl border border-neutral-200"
            >
              <video
                key={videoFeature.videoUrl}
                src={videoFeature.videoUrl}
                className="w-full h-full object-cover filter brightness-[0.88] group-hover:brightness-[0.98] transition-all duration-700"
                muted
                loop
                playsInline
                autoPlay
                poster={videoFeature.posterUrl}
              />
              <div className="absolute inset-0 bg-black/25 group-hover:bg-black/15 transition-colors flex items-center justify-center">
                <div className="w-14 h-14 rounded-full bg-white/90 group-hover:bg-white text-neutral-900 flex items-center justify-center transition-all shadow-md group-hover:scale-110">
                  <Play size={20} className="fill-neutral-900 translate-x-0.5" />
                </div>
              </div>
              <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-[11px] text-white/90 tracking-wider">
                <span className="font-serif italic drop-shadow-sm">
                  {videoFeature.title} • {videoFeature.subtitle}
                </span>
                <span className="uppercase text-[9px] tracking-widest bg-black/50 px-2 py-0.5 rounded-xs backdrop-blur-xs">
                  Click to Play
                </span>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>
      )}

      {/* 5. Kind Words Testimonials */}
      <section className="py-24 sm:py-32 px-6 sm:px-12 bg-[#fafafa] border-t border-neutral-100">
        <div className="max-w-6xl mx-auto">
          <ScrollReveal distance={12} className="text-center mb-16 sm:mb-20">
            <span className="text-[11px] tracking-[0.25em] uppercase text-neutral-400 font-medium">
              KIND WORDS
            </span>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 sm:gap-14">
            {testimonials.map((testimonial, idx) => (
              <ScrollReveal
                key={testimonial.id || idx}
                delay={idx * 0.12}
                distance={16}
                duration={0.65}
                className="flex flex-col justify-between space-y-6 text-center md:text-left"
              >
                <p className="font-serif italic text-neutral-700 text-base sm:text-[17px] leading-relaxed">
                  {testimonial.quote}
                </p>
                <div className="text-[11px] tracking-[0.25em] uppercase text-neutral-500 font-medium">
                  {testimonial.authors}
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* 6. Bottom CTA Banner */}
      <section className="relative w-full py-32 sm:py-44 px-6 text-center bg-neutral-950 overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          {(() => {
            const ctaImage =
              aboutImages?.ctaBackground ||
              'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=2000&q=85';
            return (
              <img
                key={ctaImage}
                src={getOptimizedCloudinaryUrl(ctaImage, { width: 1600 })}
                srcSet={getCloudinarySrcSet(ctaImage, [800, 1200, 1600, 2000])}
                sizes="100vw"
                alt="Bride in lehenga at dusk"
                className="w-full h-full object-cover filter brightness-[0.4] contrast-[1.1]"
                style={{ objectPosition: 'center 22%' }}
                loading="lazy"
                decoding="async"
              />
            );
          })()}
          <div className="absolute inset-0 bg-black/60" />
        </div>

        {/* Content - strictly centered */}
        <ScrollReveal
          distance={22}
          duration={0.75}
          className="relative z-10 max-w-3xl mx-auto flex flex-col items-center justify-center text-center space-y-6"
        >
          <p className="w-full text-center text-[11px] sm:text-xs tracking-[0.25em] sm:tracking-[0.3em] uppercase text-neutral-300 font-medium">
            RESERVE YOUR DATE BEFORE IT'S GONE
          </p>
          <h2 className="w-full text-center font-serif text-3xl sm:text-5xl md:text-6xl text-white font-normal tracking-wide leading-tight">
            Let's Make Something Together
          </h2>
          <div className="pt-2 sm:pt-4 flex justify-center w-full">
            <button
              id="cta-get-in-touch-btn"
              onClick={() => onNavigate('CONTACT')}
              className="inline-flex items-center justify-center px-6 sm:px-8 py-3 sm:py-3.5 border border-white/70 text-white hover:bg-white hover:text-neutral-900 transition-all text-[11px] sm:text-xs tracking-[0.16em] sm:tracking-[0.22em] uppercase font-medium cursor-pointer"
            >
              <span>GET IN TOUCH</span>
              <span className="ml-2 font-sans text-xs sm:text-sm">→</span>
            </button>
          </div>
        </ScrollReveal>
      </section>
    </div>
  );
};
