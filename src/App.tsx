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
  const [activeLightboxItems, setActiveLightboxItems] = useState<SelectedWorkItem[] | null>(null);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [activeProject, setActiveProject] = useState<WeddingProject | null>(null);
  const [activeStoryType, setActiveStoryType] = useState<'wedding' | 'prewedding'>('wedding');
  const { selectedWork, videoFeature, weddingProjects, preWeddingStories } = useCMS();

  // Sync with browser URL pathname and hash for easy navigation & sharing
  useEffect(() => {
    const handleLocationChange = () => {
      const pathname = window.location.pathname.toLowerCase().replace(/\/+$/, '');
      const hash = window.location.hash.toLowerCase().replace('#', '');

      // Check if URL matches a project path (e.g. /#project-proj-1 or /#wedding-vikram-radhika)
      if (hash.startsWith('project-')) {
        const projId = hash.replace('project-', '');
        const foundWedding = weddingProjects.find((p) => p.id === projId);
        if (foundWedding) {
          setActiveProject(foundWedding);
          setActiveStoryType('wedding');
          return;
        }
        const foundPrewedding = preWeddingStories.find((p) => p.id === projId);
        if (foundPrewedding) {
          setActiveProject(foundPrewedding);
          setActiveStoryType('prewedding');
          return;
        }
      }

      setActiveProject(null);

      if (pathname === '/admin' || hash === 'admin') {
        setCurrentPage('ADMIN');
      } else if (pathname === '/about' || hash === 'about') {
        setCurrentPage('ABOUT');
      } else if (
        pathname === '/portfolio' ||
        hash === 'portfolio' ||
        hash === 'pre-wedding-stories' ||
        hash === 'wedding-projects' ||
        hash === 'videos' ||
        hash === 'films' ||
        hash === 'pre-wedding-films'
      ) {
        setCurrentPage('PORTFOLIO');
        if (hash === 'pre-wedding-stories' || hash === 'portfolio') {
          setPortfolioInitialTab('photos');
        } else if (hash === 'wedding-projects') {
          setPortfolioInitialTab('projects');
        } else if (hash === 'videos' || hash === 'films' || hash === 'pre-wedding-films') {
          setPortfolioInitialTab('videos');
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
  }, [weddingProjects, preWeddingStories]);

  const [portfolioInitialTab, setPortfolioInitialTab] = useState<'photos' | 'projects' | 'videos'>('photos');
  const [activeVideoModalData, setActiveVideoModalData] = useState<{
    url: string;
    title?: string;
    poster?: string;
  } | null>(null);

  const handleOpenVideoModal = (customVideo?: { url: string; title?: string; poster?: string }) => {
    if (customVideo && customVideo.url) {
      setActiveVideoModalData(customVideo);
    } else {
      setActiveVideoModalData({
        url: videoFeature.videoUrl,
        title: [videoFeature.title, videoFeature.subtitle].filter(Boolean).join(' • '),
        poster: videoFeature.posterUrl,
      });
    }
    setIsVideoModalOpen(true);
  };

  const handleOpenProject = (project: WeddingProject, storyType: 'wedding' | 'prewedding' = 'wedding') => {
    setActiveProject(project);
    setActiveStoryType(storyType);
    window.history.pushState(null, '', `/#project-${project.id}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackFromProject = () => {
    const isPrewedding = activeStoryType === 'prewedding';
    setActiveProject(null);
    setCurrentPage('PORTFOLIO');
    setPortfolioInitialTab(isPrewedding ? 'photos' : 'projects');
    window.history.pushState(null, '', isPrewedding ? '/#pre-wedding-stories' : '/#wedding-projects');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigate = (page: NavPage, preselectedPkg?: string, initialPortfolioTab?: 'photos' | 'projects' | 'videos') => {
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
      'PORTFOLIO':
        initialPortfolioTab === 'projects'
          ? '/#wedding-projects'
          : initialPortfolioTab === 'videos'
          ? '/#videos'
          : '/#portfolio',
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
            storyType={activeStoryType}
            onBack={handleBackFromProject}
            onNavigate={handleNavigate}
            onOpenLightbox={(item, contextItems) => {
              setActiveLightboxItems(contextItems || null);
              setActiveLightboxItem(item);
            }}
          />
        ) : (
          <>
            {currentPage === 'HOME' && (
              <HomeView
                onNavigate={handleNavigate}
                onOpenLightbox={(item, contextItems) => {
                  setActiveLightboxItems(contextItems || null);
                  setActiveLightboxItem(item);
                }}
                onOpenVideo={handleOpenVideoModal}
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
                onOpenLightbox={(item) => {
                  setActiveLightboxItems(null);
                  setActiveLightboxItem(item);
                }}
                onOpenVideo={handleOpenVideoModal}
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

      {/* Lightbox for Selected Work & Story Projects */}
      <LightboxModal
        item={activeLightboxItem}
        items={activeLightboxItems && activeLightboxItems.length > 0 ? activeLightboxItems : selectedWork}
        onClose={() => {
          setActiveLightboxItem(null);
          setActiveLightboxItems(null);
        }}
        onSelect={(item) => setActiveLightboxItem(item)}
      />

      {/* Soul Cinema Film Player Modal */}
      <VideoModal
        isOpen={isVideoModalOpen}
        onClose={() => setIsVideoModalOpen(false)}
        videoUrl={activeVideoModalData?.url || videoFeature.videoUrl}
        videoTitle={
          activeVideoModalData?.title ||
          [videoFeature.title, videoFeature.subtitle].filter(Boolean).join(' • ')
        }
        posterUrl={activeVideoModalData?.poster || videoFeature.posterUrl}
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
