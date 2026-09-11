import React, { useState } from 'react';
import { Play } from 'lucide-react';
import { NavPage, SelectedWorkItem } from '../types';
import { SELECTED_WORK } from '../data/content';
import { ScrollReveal } from '../components/ScrollReveal';

interface PortfolioViewProps {
  onNavigate: (page: NavPage) => void;
  onOpenLightbox: (item: SelectedWorkItem) => void;
  onOpenVideo?: () => void;
}

export const PortfolioView: React.FC<PortfolioViewProps> = ({
  onOpenLightbox,
  onOpenVideo,
}) => {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [showArchivedStories, setShowArchivedStories] = useState<boolean>(false);

  const categories = ['all', 'Pre Wedding', 'Wedding Day', 'Bridal Portrait', 'Celebration', 'Traditional Ceremony'];

  const filteredWork = activeCategory === 'all'
    ? SELECTED_WORK
    : SELECTED_WORK.filter((item) => item.category === activeCategory);

  return (
    <div className="w-full">
      {/* 1. Header Section */}
      <section className="pt-20 sm:pt-28 pb-12 sm:pb-16 px-6 sm:px-12 max-w-7xl mx-auto">
        <ScrollReveal distance={16} duration={0.65} className="space-y-4">
          <span className="text-[11px] tracking-[0.25em] uppercase text-neutral-400 font-medium">
            OUR WORK
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
          <div className="relative w-full aspect-[21/9] sm:aspect-[2.4/1] max-h-[580px] bg-neutral-900 overflow-hidden shadow-sm">
            <img
              src="https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=2000&q=85"
              alt="Bride in red bridal couture with warm ceremonial candle lights"
              className="w-full h-full object-cover object-center filter brightness-[0.9] contrast-[1.05]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
          </div>
        </ScrollReveal>
      </section>

      {/* 3. Content Section matching original screenshot */}
      <section className="py-24 sm:py-32 px-6 text-center">
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
                        Ankit & Ashmita
                      </h3>
                      <p className="text-neutral-400 text-sm leading-relaxed">
                        Captured amidst the scenic hills of Rishikesh with authentic cinematic storytelling and delicate color tones.
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
                        className="w-full h-full object-cover filter brightness-[0.88] group-hover:brightness-100 transition-all duration-500"
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
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
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
    </div>
  );
};
