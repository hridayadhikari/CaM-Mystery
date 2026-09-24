import React, { useState, useEffect } from 'react';
import { NavPage } from '../types';
import { Menu, X } from 'lucide-react';

interface HeaderProps {
  currentPage: NavPage;
  onNavigate: (page: NavPage) => void;
}

export const Header: React.FC<HeaderProps> = ({ currentPage, onNavigate }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems: NavPage[] = [
    'HOME',
    'ABOUT',
    'PORTFOLIO',
    'KNOW OUR TEAM',
    'PRICING',
    'CONTACT',
  ];

  const handleNavClick = (page: NavPage) => {
    onNavigate(page);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const isTransparent = currentPage === 'HOME' && !isScrolled;

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 w-full transition-all duration-300 ${
        isTransparent
          ? 'bg-gradient-to-b from-black/60 via-black/25 to-transparent border-transparent text-white'
          : 'bg-white/95 backdrop-blur-sm border-b border-neutral-100 shadow-xs text-neutral-900'
      }`}
    >
      <div className="max-w-7xl mx-auto px-3 sm:px-10 h-20 flex items-center justify-between">
        {/* Logo */}
        <button
          id="nav-logo"
          onClick={() => handleNavClick('HOME')}
          className="text-left group cursor-pointer focus:outline-none flex items-center -ml-1 sm:ml-0"
        >
          <img
            src="/assets/NavLogo.png"
            alt="CAM-MYSTERY"
            className="h-12 sm:h-13 md:h-16 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
          />
        </button>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8 lg:space-x-10">
          {navItems.map((item) => {
            const isActive = currentPage === item;
            return (
              <button
                key={item}
                id={`nav-link-${item.toLowerCase().replace(/\s+/g, '-')}`}
                onClick={() => handleNavClick(item)}
                className={`relative py-2 text-xs tracking-[0.2em] uppercase font-medium transition-colors cursor-pointer focus:outline-none ${
                  isActive
                    ? isTransparent
                      ? 'text-white font-semibold'
                      : 'text-neutral-900 font-semibold'
                    : isTransparent
                    ? 'text-white/80 hover:text-white'
                    : 'text-neutral-500 hover:text-neutral-900'
                }`}
              >
                {item}
                {isActive && (
                  <span
                    className={`absolute bottom-0 left-0 right-0 h-[1.5px] animate-in fade-in duration-200 ${
                      isTransparent ? 'bg-white' : 'bg-neutral-900'
                    }`}
                  />
                )}
              </button>
            );
          })}
        </nav>

        {/* Mobile Menu Button */}
        <button
          id="mobile-menu-toggle"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className={`md:hidden p-2 focus:outline-none transition-colors ${
            isTransparent ? 'text-white hover:text-white/80' : 'text-neutral-700 hover:text-black'
          }`}
          aria-label="Toggle navigation menu"
        >
          {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div
          className={`md:hidden border-b px-6 py-6 shadow-xl animate-in slide-in-from-top-2 duration-200 ${
            isTransparent
              ? 'bg-neutral-950/95 backdrop-blur-md border-neutral-800 text-white'
              : 'bg-white border-neutral-200 text-neutral-900'
          }`}
        >
          <div className="flex flex-col space-y-4">
            {navItems.map((item) => {
              const isActive = currentPage === item;
              return (
                <button
                  key={item}
                  id={`mobile-nav-${item.toLowerCase().replace(/\s+/g, '-')}`}
                  onClick={() => handleNavClick(item)}
                  className={`text-left py-2 text-xs tracking-[0.22em] uppercase font-medium transition-colors flex items-center justify-between ${
                    isActive
                      ? isTransparent
                        ? 'text-white font-semibold'
                        : 'text-black font-semibold'
                      : isTransparent
                      ? 'text-neutral-300 hover:text-white'
                      : 'text-neutral-600 hover:text-black'
                  }`}
                >
                  <span>{item}</span>
                  {isActive && (
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        isTransparent ? 'bg-white' : 'bg-black'
                      }`}
                    />
                  )} 
                </button>
              );
            })}
          </div>
        </div>
      )}
    </header>
  );
};
