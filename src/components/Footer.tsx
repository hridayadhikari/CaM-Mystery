import React from 'react';
import { NavPage } from '../types';
import { ArrowUp } from 'lucide-react';
import { ScrollReveal } from './ScrollReveal';

interface FooterProps {
  onNavigate: (page: NavPage) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navItems: NavPage[] = [
    'HOME',
    'ABOUT',
    'PORTFOLIO',
    'KNOW OUR TEAM',
    'PRICING',
    'CONTACT',
  ];

  return (
    <footer className="w-full bg-white border-t border-neutral-100 mt-auto py-12 px-6 sm:px-10">
      <ScrollReveal distance={10} duration={0.5} className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8 text-[11px] tracking-[0.2em] text-neutral-500">
        {/* Left: Copyright */}
        <div id="footer-copyright" className="text-center md:text-left text-neutral-400">
          © 2026 CaM-Mystery
        </div>

        {/* Center: Navigation */}
        <div className="flex flex-col items-center">
          <nav className="flex flex-wrap justify-center items-center gap-6 sm:gap-8">
            {navItems.map((item) => (
              <button
                key={item}
                id={`footer-link-${item.toLowerCase().replace(/\s+/g, '-')}`}
                onClick={() => {
                  onNavigate(item);
                  scrollToTop();
                }}
                className="uppercase hover:text-neutral-950 transition-colors cursor-pointer focus:outline-none"
              >
                {item}
              </button>
            ))}
          </nav>
        </div>

        {/* Right: Scroll to top & discreet Admin access */}
        <div className="flex items-center gap-4 text-center md:text-right">
          <button
            id="footer-admin-link"
            onClick={() => onNavigate('ADMIN')}
            className="text-[10px] tracking-[0.25em] uppercase text-neutral-400 hover:text-neutral-900 transition-colors cursor-pointer"
          >
            Studio CMS
          </button>
          <button
            id="scroll-to-top"
            onClick={scrollToTop}
            className="p-2.5 rounded-full border border-neutral-200 text-neutral-600 hover:text-black hover:border-black transition-all cursor-pointer inline-flex items-center justify-center focus:outline-none"
            aria-label="Scroll to top of page"
            title="Scroll to top"
          >
            <ArrowUp size={14} />
          </button>
        </div>
      </ScrollReveal>
    </footer>
  );
};
