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
import { AdminView } from './views/AdminView';
import { WeddingProjectDetailView } from './views/WeddingProjectDetailView';
import { LightboxModal } from './components/LightboxModal';
import { VideoModal } from './components/VideoModal';
import { CMSProvider, useCMS } from './lib/cmsStore';
import { WeddingProject } from './types';

function MainApp() {
  const [currentPage, setCurrentPage] = useState<NavPage>('HOME');
  const [selectedPackage, setSelectedPackage] = useState<string | undefined>(undefined);
  const [activeLightboxItem, setActiveLightboxItem] = useState<SelectedWorkItem | null>(null);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [activeProject, setActiveProject] = useState<WeddingProject | null>(null);
  const { selectedWork, videoFeature, weddingProjects } = useCMS();

  // Sync with browser URL pathname and hash for easy navigation & sharing
  useEffect(() => {
    const handleLocationChange = () => {
      const pathname = window.location.pathname.toLowerCase().replace(/\/+$/, '');
      const hash = window.location.hash.toLowerCase().replace('#', '');

      // Check if URL matches a project path (e.g. /#project-proj-1 or /#wedding-vikram-radhika)
      if (hash.startsWith('project-')) {
        const projId = hash.replace('project-', '');
        const found = weddingProjects.find((p) => p.id === projId);
        if (found) {
          setActiveProject(found);
          return;
        }
      }

      setActiveProject(null);

      if (pathname === '/admin' || hash === 'admin') {
        setCurrentPage('ADMIN');
      } else if (pathname === '/about' || hash === 'about') {
        setCurrentPage('ABOUT');
      } else if (pathname === '/portfolio' || hash === 'portfolio' || hash === 'wedding-projects') {
        setCurrentPage('PORTFOLIO');
        if (hash === 'wedding-projects') {
          setPortfolioInitialTab('projects');
        }
      } else if (pathname === '/team' || pathname === '/know-our-team' || hash === 'team' || hash === 'know-our-team') {
        setCurrentPage('KNOW OUR TEAM');
      } else if (pathname === '/pricing' || hash === 'pricing') {
        setCurrentPage('PRICING');
      } else if (pathname === '/contact' || hash === 'contact') {
        setCurrentPage('CONTACT');
      } else {
        setCurrentPage('HOME');
      }
    };

    handleLocationChange();
    window.addEventListener('popstate', handleLocationChange);
    window.addEventListener('hashchange', handleLocationChange);
    return () => {
      window.removeEventListener('popstate', handleLocationChange);
      window.removeEventListener('hashchange', handleLocationChange);
    };
  }, [weddingProjects]);

  const [portfolioInitialTab, setPortfolioInitialTab] = useState<'photos' | 'projects'>('photos');

  const handleOpenProject = (project: WeddingProject) => {
    setActiveProject(project);
    window.history.pushState(null, '', `/#project-${project.id}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackFromProject = () => {
    setActiveProject(null);
    setCurrentPage('PORTFOLIO');
    setPortfolioInitialTab('projects');
    window.history.pushState(null, '', '/#wedding-projects');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigate = (page: NavPage, preselectedPkg?: string, initialPortfolioTab?: 'photos' | 'projects') => {
    setActiveProject(null);
    setCurrentPage(page);
    if (preselectedPkg) {
      setSelectedPackage(preselectedPkg);
    }
    if (initialPortfolioTab) {
      setPortfolioInitialTab(initialPortfolioTab);
    } else if (page === 'PORTFOLIO') {
      setPortfolioInitialTab('photos');
    }
    const pathMapping: Record<NavPage, string> = {
      'HOME': '/',
      'ABOUT': '/#about',
      'PORTFOLIO': initialPortfolioTab === 'projects' ? '/#wedding-projects' : '/#portfolio',
      'KNOW OUR TEAM': '/#team',
      'PRICING': '/#pricing',
      'CONTACT': '/#contact',
      'ADMIN': '/admin',
    };
    const targetUrl = pathMapping[page] || '/';
    window.history.pushState(null, '', targetUrl);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-white text-neutral-900 selection:bg-neutral-900 selection:text-white">
      {/* Top Header */}
      {currentPage !== 'ADMIN' && (
        <Header currentPage={currentPage} onNavigate={handleNavigate} />
      )}

      {/* Main Page View */}
      <main className={`flex-1 w-full ${currentPage !== 'HOME' && currentPage !== 'ADMIN' ? 'pt-20' : ''}`}>
        {activeProject ? (
          <WeddingProjectDetailView
            project={activeProject}
            onBack={handleBackFromProject}
            onNavigate={handleNavigate}
            onOpenLightbox={(item) => setActiveLightboxItem(item)}
          />
        ) : (
          <>
            {currentPage === 'HOME' && (
              <HomeView
                onNavigate={handleNavigate}
                onOpenLightbox={(item) => setActiveLightboxItem(item)}
                onOpenVideo={() => setIsVideoModalOpen(true)}
                onOpenProject={handleOpenProject}
              />
            )}
            {currentPage === 'ABOUT' && (
              <AboutView onNavigate={handleNavigate} />
            )}
            {currentPage === 'PORTFOLIO' && (
              <PortfolioView
                key={portfolioInitialTab}
                initialTab={portfolioInitialTab}
                onNavigate={handleNavigate}
                onOpenLightbox={(item) => setActiveLightboxItem(item)}
                onOpenVideo={() => setIsVideoModalOpen(true)}
                onOpenProject={handleOpenProject}
              />
            )}
            {currentPage === 'KNOW OUR TEAM' && (
              <TeamView onNavigate={handleNavigate} />
            )}
            {currentPage === 'PRICING' && (
              <PricingView onNavigate={handleNavigate} />
            )}
            {currentPage === 'CONTACT' && (
              <ContactView />
            )}
            {currentPage === 'ADMIN' && (
              <AdminView onNavigate={handleNavigate} />
            )}
          </>
        )}
      </main>

      {/* Footer on all public pages */}
      {currentPage !== 'ADMIN' && (
        <Footer onNavigate={handleNavigate} />
      )}

      {/* Lightbox for Selected Work */}
      <LightboxModal
        item={activeLightboxItem}
        items={selectedWork}
        onClose={() => setActiveLightboxItem(null)}
        onSelect={(item) => setActiveLightboxItem(item)}
      />

      {/* Soul Cinema Film Player Modal */}
      <VideoModal
        isOpen={isVideoModalOpen}
        onClose={() => setIsVideoModalOpen(false)}
        videoUrl={videoFeature.videoUrl}
        videoTitle={[videoFeature.title, videoFeature.subtitle].filter(Boolean).join(' • ')}
        posterUrl={videoFeature.posterUrl}
      />
    </div>
  );
}

export default function App() {
  return (
    <CMSProvider>
      <MainApp />
    </CMSProvider>
  );
}
