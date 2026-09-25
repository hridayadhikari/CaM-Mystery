import React from 'react';
import { NavPage } from '../types';
import { Camera, Film, Eye, Sparkles } from 'lucide-react';
import { ScrollReveal } from '../components/ScrollReveal';
import { useCMS } from '../lib/cmsStore';
import { getOptimizedCloudinaryUrl, getCloudinarySrcSet } from '../lib/cloudinary';

interface TeamViewProps {
  onNavigate: (page: NavPage) => void;
}

const iconMap = {
  Camera,
  Film,
  Eye,
  Sparkles,
};

export const TeamView: React.FC<TeamViewProps> = ({ onNavigate }) => {
  const { teamMembers, studioInfo } = useCMS();

  return (
    <div className="w-full">
      {/* 1. Header */}
      <section className="pt-20 sm:pt-28 pb-16 px-6 sm:px-12 text-center max-w-3xl mx-auto">
        <ScrollReveal distance={16} duration={0.65}>
          <span className="text-[11px] tracking-[0.25em] uppercase text-neutral-400 font-medium">
            THE ARTISANS BEHIND THE LENS
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl md:text-6xl text-neutral-900 font-normal tracking-tight mt-4 mb-5">
            Know Our Team
          </h1>
          <p className="text-neutral-600 font-sans text-xs sm:text-sm max-w-xl mx-auto leading-relaxed">
            We are a tight-knit collective of visual artists, cinematographers, and
            storytellers led by {studioInfo.name}, united by a passion for authentic
            moments and timeless craft.
          </p>
        </ScrollReveal>
      </section>

      {/* 2. Team Grid */}
      <section className="pb-28 px-6 sm:px-10 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[...teamMembers]
            .sort((a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0))
            .map((member, idx) => {
            const Icon = (member.iconName && iconMap[member.iconName]) || Camera;
            return (
              <ScrollReveal
                key={member.id || idx}
                delay={idx * 0.08}
                distance={16}
                duration={0.6}
                className="space-y-4 text-center sm:text-left"
              >
                <div className="aspect-[4/5] bg-neutral-100 overflow-hidden shadow-sm rounded-xs">
                  <img
                    src={getOptimizedCloudinaryUrl(member.imageUrl, { width: 600 })}
                    srcSet={getCloudinarySrcSet(member.imageUrl, [300, 600, 900])}
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    loading="lazy"
                    decoding="async"
                    alt={member.name}
                    className="w-full h-full object-cover object-top filter grayscale hover:grayscale-0 transition-all duration-700 hover:scale-105"
                  />
                </div>
                <div>
                  <div className="flex items-center justify-center sm:justify-start space-x-2 text-[10px] tracking-[0.2em] uppercase text-neutral-400 font-medium">
                    <Icon size={12} />
                    <span>{member.role}</span>
                  </div>
                  <h3 className="font-serif text-lg text-neutral-900 mt-1 font-normal">
                    {member.name}
                  </h3>
                  <p className="text-neutral-600 font-sans text-xs leading-relaxed mt-2">
                    {member.bio}
                  </p>
                </div>
              </ScrollReveal>
            );
          })}
        </div>

        {/* 3. Studio Philosophy Quote */}
        <ScrollReveal distance={18} duration={0.7} className="mt-20 pt-16 border-t border-neutral-100 text-center max-w-2xl mx-auto space-y-6">
          <p className="font-serif italic text-lg sm:text-xl text-neutral-700 leading-relaxed">
            “The name CaM-Mystery reflects our philosophy: every love story holds
            a unique mystery waiting to unfold. Our role is to discover those
            beautiful, unscripted moments and transform them into memories that
            will be treasured for generations.”
          </p>
          <div className="text-[11px] tracking-[0.25em] uppercase text-neutral-400 font-medium">
            — {studioInfo.name}, FOUNDER
          </div>
          <div className="pt-4">
            <button
              id="team-get-in-touch-btn"
              onClick={() => onNavigate('CONTACT')}
              className="inline-flex items-center text-[10px] sm:text-xs tracking-[0.14em] sm:tracking-[0.22em] uppercase font-medium text-neutral-900 border-b border-neutral-900 pb-1 hover:text-neutral-600 hover:border-neutral-400 transition-colors cursor-pointer"
            >
              <span>PLAN YOUR WEDDING WITH US</span>
              <span className="ml-1.5 sm:ml-2 font-sans text-xs sm:text-sm">→</span>
            </button>
          </div>
        </ScrollReveal>
      </section>
    </div>
  );
};
