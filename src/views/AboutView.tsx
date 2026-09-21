import React, { useState } from 'react';
import { NavPage } from '../types';
import { ABOUT_PARAGRAPHS } from '../data/content';
import { Plus, Minus } from 'lucide-react';
import { ScrollReveal } from '../components/ScrollReveal';
import { useCMS } from '../lib/cmsStore';

interface AboutViewProps {
  onNavigate: (page: NavPage) => void;
}

export const AboutView: React.FC<AboutViewProps> = ({ onNavigate }) => {
  const { faqItems, aboutImages } = useCMS();
  const [openFaqs, setOpenFaqs] = useState<string[]>([]);

  const toggleFaq = (id: string) => {
    setOpenFaqs((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Calculate zoom scale based on how many questions are expanded
  const zoomScale = 1 + openFaqs.length * 0.08;

  return (
    <div className="w-full">
      {/* 1. The Studio Behind the Lens */}
      <section className="py-20 sm:py-28 px-6 sm:px-12 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 sm:gap-16 items-start">
          {/* Left: Text Content */}
          <ScrollReveal distance={16} duration={0.65} className="lg:col-span-7 space-y-6">
            <span className="text-[11px] tracking-[0.25em] uppercase text-neutral-400 font-medium">
              THE STUDIO BEHIND THE LENS
            </span>
            <h1 className="font-serif text-3xl sm:text-5xl text-neutral-900 font-normal tracking-tight">
              About CaM-Mystery
            </h1>

            <div className="space-y-5 text-neutral-600 font-sans text-sm sm:text-[15px] leading-relaxed pt-2 text-justify">
              {ABOUT_PARAGRAPHS.map((para, idx) => (
                <p key={idx} className="text-justify">{para}</p>
              ))}
            </div>

            <div className="pt-6">
              <button
                id="about-say-hello-btn"
                onClick={() => onNavigate('CONTACT')}
                className="inline-flex items-center text-xs tracking-[0.25em] uppercase font-medium text-neutral-900 border-b border-neutral-900 pb-1 hover:text-neutral-600 hover:border-neutral-400 transition-colors cursor-pointer"
              >
                <span>SAY HELLO</span>
                <span className="ml-2 font-sans text-sm">→</span>
              </button>
            </div>
          </ScrollReveal>

          {/* Right: Tall Portrait Image */}
          <ScrollReveal distance={20} delay={0.15} duration={0.7} className="lg:col-span-5 sticky top-28">
            <div className="aspect-[3/4] sm:aspect-[4/5] lg:aspect-[3/4.2] bg-neutral-100 overflow-hidden shadow-sm">
              <img
                src={aboutImages.storyPortrait}
                alt="Indian Bride in fine art bridal lehenga by window"
                className="w-full h-full object-cover object-top filter brightness-[0.98] contrast-[1.02]"
              />
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* 2. HOW WE WORK Section */}
      <section className="py-24 sm:py-32 px-6 sm:px-12 bg-white border-t border-neutral-100">
        <div className="max-w-7xl mx-auto">
          <ScrollReveal distance={12} className="text-center mb-16 sm:mb-20">
            <span className="text-[11px] tracking-[0.25em] uppercase text-neutral-400 font-medium">
              HOW WE WORK
            </span>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 sm:gap-12">
            {/* Column 1: INTIMATE */}
            <ScrollReveal distance={16} delay={0} duration={0.6} className="space-y-6">
              <div className="aspect-[4/5] bg-neutral-100 overflow-hidden">
                <img
                  src={aboutImages.howWeWork1}
                  alt="Intimate bridal smile"
                  className="w-full h-full object-cover object-top hover:scale-105 transition-transform duration-700"
                />
              </div>
              <h3 className="font-serif text-lg tracking-[0.2em] uppercase text-neutral-900 font-normal">
                INTIMATE
              </h3>
              <p className="text-neutral-600 font-sans text-xs sm:text-sm leading-relaxed text-justify">
                Trust is the foundation of every great photograph. Before we raise
                the camera we spend time understanding who you are, how you move, and
                what makes you laugh. That familiarity shows in the images — they look
                and feel like you, not like a version of yourselves performing for a
                lens.
              </p>
            </ScrollReveal>

            {/* Column 2: INTENTIONAL */}
            <ScrollReveal distance={16} delay={0.12} duration={0.6} className="space-y-6">
              <div className="aspect-[4/5] bg-neutral-100 overflow-hidden">
                <img
                  src={aboutImages.howWeWork2}
                  alt="Intentional couple portrait"
                  className="w-full h-full object-cover object-top hover:scale-105 transition-transform duration-700"
                />
              </div>
              <h3 className="font-serif text-lg tracking-[0.2em] uppercase text-neutral-900 font-normal">
                INTENTIONAL
              </h3>
              <p className="text-neutral-600 font-sans text-xs sm:text-sm leading-relaxed text-justify">
                We approach each wedding as a unique creative brief. We study the
                venue, the light, the timeline, and the emotional arc of the day long
                before it begins. When we're on the floor we move with purpose —
                observing, anticipating, and always ready for the moment that can't be
                posed or repeated.
              </p>
            </ScrollReveal>

            {/* Column 3: ETERNAL */}
            <ScrollReveal distance={16} delay={0.24} duration={0.6} className="space-y-6">
              <div className="aspect-[4/5] bg-neutral-100 overflow-hidden">
                <img
                  src={aboutImages.howWeWork3}
                  alt="Eternal details and heirloom traditions"
                  className="w-full h-full object-cover object-top hover:scale-105 transition-transform duration-700"
                />
              </div>
              <h3 className="font-serif text-lg tracking-[0.2em] uppercase text-neutral-900 font-normal">
                ETERNAL
              </h3>
              <p className="text-neutral-600 font-sans text-xs sm:text-sm leading-relaxed text-justify">
                Trends come and go; love doesn't. Our editing philosophy mirrors
                that: clean, timeless tones that won't feel dated in ten years. The
                photographs and films we create together are meant to be printed
                large, passed down, and played on anniversaries. They are built to
                last.
              </p>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* 3. Common Questions FAQ Section */}
      <section className="relative w-full py-28 sm:py-36 px-6 sm:px-12 bg-neutral-950 overflow-hidden">
        {/* Background Photography with dynamic zoom on expanding questions */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
          <img
            src={aboutImages.faqBackground}
            alt="Bride in atmospheric ceremonial lights"
            style={{
              transform: `scale(${zoomScale})`,
              objectPosition: 'center 25%',
            }}
            className="w-full h-full object-cover filter brightness-[0.6] contrast-[1.1] transition-transform duration-1000 ease-out will-change-transform"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/70 to-black/80" />
        </div>

        <div className="relative z-10 max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 sm:gap-16 items-start">
          {/* Left Title */}
          <ScrollReveal distance={16} duration={0.65} className="lg:col-span-5">
            <h2 className="font-serif italic text-4xl sm:text-5xl md:text-6xl text-white font-light tracking-wide leading-tight">
              Common <br />
              Questions
            </h2>
          </ScrollReveal>

          {/* Right Accordion */}
          <ScrollReveal distance={18} delay={0.1} duration={0.65} className="lg:col-span-7 divide-y divide-white/15">
            {faqItems.map((faq) => {
              const isOpen = openFaqs.includes(faq.id);
              return (
                <div key={faq.id} className="py-5">
                  <button
                    id={`faq-toggle-${faq.id}`}
                    onClick={() => toggleFaq(faq.id)}
                    className="w-full flex items-center justify-between text-left py-2 group cursor-pointer focus:outline-none whitespace-normal"
                    aria-expanded={isOpen}
                  >
                    <span className="text-sm sm:text-base font-sans text-neutral-200 group-hover:text-white transition-colors">
                      {faq.question}
                    </span>
                    <span className="text-neutral-400 group-hover:text-white transition-colors ml-4 shrink-0">
                      {isOpen ? <Minus size={16} /> : <Plus size={16} />}
                    </span>
                  </button>

                  {isOpen && (
                    <div className="pt-3 pb-2 pr-8 text-xs sm:text-sm text-neutral-400 font-sans leading-relaxed animate-in fade-in duration-200">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </ScrollReveal>
        </div>
      </section>

      {/* 4. Bottom Link */}
      <section className="py-16 sm:py-24 text-center bg-white">
        <ScrollReveal distance={12}>
          <button
            id="about-explore-work-btn"
            onClick={() => onNavigate('PORTFOLIO')}
            className="inline-flex items-center text-[10px] sm:text-xs tracking-[0.16em] sm:tracking-[0.25em] uppercase font-medium text-neutral-900 border-b border-neutral-900 pb-1 hover:text-neutral-600 hover:border-neutral-400 transition-colors cursor-pointer"
          >
            <span>EXPLORE THE WORK</span>
            <span className="ml-1.5 sm:ml-2 font-sans text-xs sm:text-sm">→</span>
          </button>
        </ScrollReveal>
      </section>
    </div>
  );
};
