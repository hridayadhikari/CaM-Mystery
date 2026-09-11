import React from 'react';
import { NavPage } from '../types';
import { STUDIO_INFO } from '../data/content';
import { Camera, Film, Eye, Sparkles } from 'lucide-react';
import { ScrollReveal } from '../components/ScrollReveal';

interface TeamViewProps {
  onNavigate: (page: NavPage) => void;
}

export const TeamView: React.FC<TeamViewProps> = ({ onNavigate }) => {
  const teamMembers = [
    {
      name: 'Sanjib Bhowmik',
      role: 'Founder & Principal Photographer',
      bio: 'With over a decade dedicated to wedding visual arts, Sanjib leads every primary commission, bringing an instinctive eye for unscripted intimacy, cultural nuance, and evocative natural light.',
      imageUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
      icon: Camera,
    },
    {
      name: 'Rahul Debbarma',
      role: 'Head of Cinematic Filmmaking',
      bio: 'Mastering digital cinema cameras and delicate audio design, Rahul captures the movement, laughter, and sacred vows that transform memories into heirloom films.',
      imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80',
      icon: Film,
    },
    {
      name: 'Priyanka Saha',
      role: 'Lead Candid Artist & Drone Specialist',
      bio: 'Specializing in fleeting emotional micro-moments and licensed aerial perspectives, Priyanka documents the joyful spontaneity of wedding celebrations.',
      imageUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=800&q=80',
      icon: Eye,
    },
    {
      name: 'Debjit Paul',
      role: 'Master Colorist & Album Artisan',
      bio: 'Dedicated to timeless color fidelity, skin-tone perfection, and handcrafted flush-mount fine-art albums designed to endure for generations.',
      imageUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=800&q=80',
      icon: Sparkles,
    },
  ];

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
            storytellers led by {STUDIO_INFO.name}, united by a passion for authentic
            moments and timeless craft.
          </p>
        </ScrollReveal>
      </section>

      {/* 2. Team Grid */}
      <section className="pb-28 px-6 sm:px-10 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {teamMembers.map((member, idx) => {
            const Icon = member.icon;
            return (
              <ScrollReveal
                key={idx}
                delay={idx * 0.08}
                distance={16}
                duration={0.6}
                className="space-y-4 text-center sm:text-left"
              >
                <div className="aspect-[4/5] bg-neutral-100 overflow-hidden shadow-sm">
                  <img
                    src={member.imageUrl}
                    alt={member.name}
                    className="w-full h-full object-cover filter grayscale hover:grayscale-0 transition-all duration-700 hover:scale-105"
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
            — {STUDIO_INFO.name}, FOUNDER
          </div>
          <div className="pt-4">
            <button
              id="team-get-in-touch-btn"
              onClick={() => onNavigate('CONTACT')}
              className="inline-flex items-center text-xs tracking-[0.25em] uppercase font-medium text-neutral-900 border-b border-neutral-900 pb-1 hover:text-neutral-600 hover:border-neutral-400 transition-colors cursor-pointer"
            >
              <span>PLAN YOUR WEDDING WITH US</span>
              <span className="ml-2 font-sans text-sm">→</span>
            </button>
          </div>
        </ScrollReveal>
      </section>
    </div>
  );
};
