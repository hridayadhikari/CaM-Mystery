import React from 'react';
import { NavPage } from '../types';
import { Instagram, Facebook } from 'lucide-react';
import { ScrollReveal } from './ScrollReveal';

interface FooterProps {
  onNavigate?: (page: NavPage) => void;
}

export const Footer: React.FC<FooterProps> = () => {
  return (
    <footer className="w-full bg-white border-t border-neutral-100 mt-auto py-8 sm:py-10 px-5 sm:px-10">
      <ScrollReveal
        distance={10}
        duration={0.5}
        className="max-w-7xl mx-auto flex flex-col items-center justify-center gap-3 sm:gap-4 text-[10px] sm:text-[11px] tracking-[0.14em] sm:tracking-[0.2em] text-neutral-500"
      >
        {/* Above: Social Icons */}
        <div className="flex items-center gap-2 sm:gap-3 text-neutral-400">
          <a
            href="https://www.instagram.com/cam.mystery/"
            target="_blank"
            rel="noopener noreferrer"
            className="p-1.5 hover:text-neutral-950 transition-colors"
            aria-label="Instagram"
            title="Instagram"
          >
            <Instagram size={16} />
          </a>
          <a
            href="https://www.facebook.com/people/CaM-Mystery/100064026484296/?locale=fy_NL"
            target="_blank"
            rel="noopener noreferrer"
            className="p-1.5 hover:text-neutral-950 transition-colors"
            aria-label="Facebook"
            title="Facebook"
          >
            <Facebook size={16} />
          </a>
        </div>

        {/* Bottom: Copyright */}
        <div id="footer-copyright" className="text-neutral-400 text-[10px] sm:text-[11px] text-center">
          © 2026 CaM-Mystery
        </div>
      </ScrollReveal>
    </footer>
  );
};
