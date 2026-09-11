/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { NavPage, SelectedWorkItem } from './types';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { HomeView } from './views/HomeView';
import { AboutView } from './views/AboutView';
import { PortfolioView } from './views/PortfolioView';
import { PricingView } from './views/PricingView';
import { ContactView } from './views/ContactView';
import { TeamView } from './views/TeamView';
import { LightboxModal } from './components/LightboxModal';
import { VideoModal } from './components/VideoModal';
import { SELECTED_WORK } from './data/content';

export default function App() {
  const [currentPage, setCurrentPage] = useState<NavPage>('HOME');
  const [selectedPackage, setSelectedPackage] = useState<string | undefined>(undefined);
  const [activeLightboxItem, setActiveLightboxItem] = useState<SelectedWorkItem | null>(null);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);

  // Sync with browser hash for easy navigation & sharing
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.toLowerCase().replace('#', '');
      if (hash === 'about') setCurrentPage('ABOUT');
      else if (hash === 'portfolio') setCurrentPage('PORTFOLIO');
      else if (hash === 'team' || hash === 'know-our-team') setCurrentPage('KNOW OUR TEAM');
      else if (hash === 'pricing') setCurrentPage('PRICING');
      else if (hash === 'contact') setCurrentPage('CONTACT');
      else setCurrentPage('HOME');
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const handleNavigate = (page: NavPage, preselectedPkg?: string) => {
    setCurrentPage(page);
    if (preselectedPkg) {
      setSelectedPackage(preselectedPkg);
    }
    const hashMapping: Record<NavPage, string> = {
      'HOME': '',
      'ABOUT': '#about',
      'PORTFOLIO': '#portfolio',
      'KNOW OUR TEAM': '#team',
      'PRICING': '#pricing',
      'CONTACT': '#contact',
    };
    window.history.pushState(null, '', hashMapping[page] || '/');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-white text-neutral-900 selection:bg-neutral-900 selection:text-white">
      {/* Top Header */}
      <Header currentPage={currentPage} onNavigate={handleNavigate} />

      {/* Main Page View */}
      <main className={`flex-1 w-full ${currentPage !== 'HOME' ? 'pt-20' : ''}`}>
        {currentPage === 'HOME' && (
          <HomeView
            onNavigate={handleNavigate}
            onOpenLightbox={(item) => setActiveLightboxItem(item)}
            onOpenVideo={() => setIsVideoModalOpen(true)}
          />
        )}
        {currentPage === 'ABOUT' && (
          <AboutView onNavigate={handleNavigate} />
        )}
        {currentPage === 'PORTFOLIO' && (
          <PortfolioView
            onNavigate={handleNavigate}
            onOpenLightbox={(item) => setActiveLightboxItem(item)}
            onOpenVideo={() => setIsVideoModalOpen(true)}
          />
        )}
        {currentPage === 'KNOW OUR TEAM' && (
          <TeamView onNavigate={handleNavigate} />
        )}
        {currentPage === 'PRICING' && (
          <PricingView onNavigate={handleNavigate} />
        )}
        {currentPage === 'CONTACT' && (
          <ContactView initialPackage={selectedPackage} />
        )}
      </main>

      {/* Footer on all pages */}
      <Footer onNavigate={handleNavigate} />

      {/* Lightbox for Selected Work */}
      <LightboxModal
        item={activeLightboxItem}
        items={SELECTED_WORK}
        onClose={() => setActiveLightboxItem(null)}
        onSelect={(item) => setActiveLightboxItem(item)}
      />

      {/* Soul Cinema Film Player Modal */}
      <VideoModal
        isOpen={isVideoModalOpen}
        onClose={() => setIsVideoModalOpen(false)}
      />
    </div>
  );
}
