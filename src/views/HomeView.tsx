import React, { useState, useEffect } from 'react';
import { NavPage, SelectedWorkItem } from '../types';
import { HERO_SLIDES, SELECTED_WORK, TESTIMONIALS } from '../data/content';
import { Play } from 'lucide-react';
import { ScrollReveal } from '../components/ScrollReveal';

interface HomeViewProps {
  onNavigate: (page: NavPage) => void;
  onOpenLightbox: (item: SelectedWorkItem) => void;
  onOpenVideo: () => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  onNavigate,
  onOpenLightbox,
  onOpenVideo,
}) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Auto advance hero slider every 6 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="w-full">
      {/* 1. Hero Carousel taking the place of the transparent header at the very top */}
      <section className="relative w-full h-screen min-h-[640px] max-h-[1100px] bg-neutral-950 overflow-hidden">
        {HERO_SLIDES.map((slide, idx) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              idx === currentSlide ? 'opacity-100' : 'opacity-0 pointer-events-none'
            }`}
          >
            <img
              src={slide.imageUrl}
              alt={slide.title}
              className="w-full h-full object-cover object-center filter brightness-[0.82] contrast-[1.04]"
            />
            {/* Subtle top gradient for transparent header legibility and bottom gradient for indicators */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-transparent to-black/65 pointer-events-none" />
          </div>
        ))}

        {/* Carousel indicators (3 dashes at bottom) */}
        <div className="absolute bottom-10 left-0 right-0 z-20 flex justify-center items-center space-x-3">
          {HERO_SLIDES.map((_, idx) => (
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
          <p className="font-serif text-xl sm:text-2xl md:text-3xl text-neutral-800 leading-relaxed font-normal tracking-wide">
            At CaM-Mystery, we believe every wedding is a story waiting to be told.
            Through timeless photography and cinematic films, we capture genuine
            emotions, meaningful traditions, and the moments that make your
            celebration uniquely yours.
          </p>
          <div className="mt-8">
            <button
              id="home-our-story-link"
              onClick={() => onNavigate('ABOUT')}
              className="inline-flex items-center text-xs tracking-[0.25em] uppercase font-medium text-neutral-900 border-b border-neutral-900 pb-1 hover:text-neutral-600 hover:border-neutral-400 transition-colors cursor-pointer"
            >
              <span>OUR STORY</span>
              <span className="ml-2 font-sans text-sm">→</span>
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
          {SELECTED_WORK.map((item, idx) => (
            <ScrollReveal
              key={item.id}
              delay={(idx % 4) * 0.07}
              distance={14}
              duration={0.55}
            >
              <div
                onClick={() => onOpenLightbox(item)}
                className="group relative aspect-[4/5] bg-neutral-100 overflow-hidden cursor-pointer"
              >
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105 filter brightness-[0.97]"
                  loading="lazy"
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
          ))}
        </div>

        {/* Link to portfolio */}
        <ScrollReveal distance={12} delay={0.1} className="text-center mt-12 mb-16">
          <button
            id="home-view-portfolio-link"
            onClick={() => onNavigate('PORTFOLIO')}
            className="inline-flex items-center text-xs tracking-[0.25em] uppercase font-medium text-neutral-900 border-b border-neutral-900 pb-1 hover:text-neutral-600 hover:border-neutral-400 transition-colors cursor-pointer"
          >
            <span>VIEW THE PORTFOLIO</span>
            <span className="ml-2 font-sans text-sm">→</span>
          </button>
        </ScrollReveal>
      </section>

      {/* 4. Pre-Wedding Cinema & Films Section */}
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
              Cinematic wedding and pre-wedding films built from the sound and movement a photograph
              cannot hold — vows, laughter, and picturesque journeys.
            </p>
            <div className="pt-2">
              <button
                id="home-watch-films-btn"
                onClick={onOpenVideo}
                className="inline-flex items-center text-xs tracking-[0.25em] uppercase font-medium text-neutral-900 border-b border-neutral-900 pb-1 hover:text-neutral-600 hover:border-neutral-400 transition-colors cursor-pointer"
              >
                <span>WATCH PRE-WEDDING FILM</span>
                <span className="ml-2 font-sans text-sm">→</span>
              </button>
            </div>
          </ScrollReveal>

          {/* Right Column Video Player / Frame */}
          <ScrollReveal distance={20} delay={0.15} duration={0.7}>
            <div
              onClick={onOpenVideo}
              className="relative aspect-[16/10] bg-neutral-950 rounded-sm overflow-hidden group cursor-pointer shadow-xl border border-neutral-200"
            >
              <video
                className="w-full h-full object-cover filter brightness-[0.88] group-hover:brightness-[0.98] transition-all duration-700"
                muted
                loop
                playsInline
                autoPlay
                poster="https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=1200&q=80"
              >
                <source
                  src="https://res.cloudinary.com/naqb7hm2/video/upload/v1789134902/PRE_WEDDING_COMING_SOON_4K_ANKIT_ASHMITA_BALA_G_STUDIO_RISHIKESH_-_Bala-G_Studio_720p_h264_cnqgoj.mp4"
                  type="video/mp4"
                />
              </video>
              <div className="absolute inset-0 bg-black/25 group-hover:bg-black/15 transition-colors flex items-center justify-center">
                <div className="w-14 h-14 rounded-full bg-white/90 group-hover:bg-white text-neutral-900 flex items-center justify-center transition-all shadow-md group-hover:scale-110">
                  <Play size={20} className="fill-neutral-900 translate-x-0.5" />
                </div>
              </div>
              <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-[11px] text-white/90 tracking-wider">
                <span className="font-serif italic drop-shadow-sm">Ankit & Ashmita • Pre-Wedding</span>
                <span className="uppercase text-[9px] tracking-widest bg-black/50 px-2 py-0.5 rounded-xs backdrop-blur-xs">Click to Play</span>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* 5. Kind Words Testimonials */}
      <section className="py-24 sm:py-32 px-6 sm:px-12 bg-[#fafafa] border-t border-neutral-100">
        <div className="max-w-6xl mx-auto">
          <ScrollReveal distance={12} className="text-center mb-16 sm:mb-20">
            <span className="text-[11px] tracking-[0.25em] uppercase text-neutral-400 font-medium">
              KIND WORDS
            </span>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 sm:gap-14">
            {TESTIMONIALS.map((testimonial, idx) => (
              <ScrollReveal
                key={idx}
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
          <img
            src="https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=2000&q=85"
            alt="Bride in lehenga at dusk"
            className="w-full h-full object-cover filter brightness-[0.4] contrast-[1.1]"
          />
          <div className="absolute inset-0 bg-black/60" />
        </div>

        {/* Content */}
        <ScrollReveal distance={22} duration={0.75} className="relative z-10 max-w-3xl mx-auto space-y-6">
          <p className="text-[11px] tracking-[0.25em] uppercase text-neutral-300 font-medium">
            RESERVE YOUR DATE BEFORE IT'S GONE
          </p>
          <h2 className="font-serif text-3xl sm:text-5xl md:text-6xl text-white font-normal tracking-wide">
            Let's Make Something Together
          </h2>
          <div className="pt-4">
            <button
              id="cta-get-in-touch-btn"
              onClick={() => onNavigate('CONTACT')}
              className="inline-flex items-center px-8 py-3.5 border border-white/70 text-white hover:bg-white hover:text-neutral-900 transition-all text-xs tracking-[0.22em] uppercase font-medium cursor-pointer"
            >
              <span>GET IN TOUCH</span>
              <span className="ml-2 font-sans text-sm">→</span>
            </button>
          </div>
        </ScrollReveal>
      </section>
    </div>
  );
};
