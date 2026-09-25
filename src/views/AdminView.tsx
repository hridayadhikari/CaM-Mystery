import React, { useState, useEffect } from 'react';
import {
  Camera,
  Image as ImageIcon,
  DollarSign,
  Users,
  MessageSquareQuote,
  HelpCircle,
  Settings,
  Mail,
  RotateCcw,
  Check,
  Lock,
  LogOut,
  Layers,
  Loader2,
  Calendar,
  ExternalLink,
  BookOpen,
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useCMS } from '../lib/cmsStore';
import { NavPage } from '../types';
import { ConfirmModal } from '../components/admin/ConfirmModal';
import { PhotoFramingModal } from '../components/admin/PhotoFramingModal';

// Modularized Tab Components
import { OverviewTab, TabType } from '../components/admin/tabs/OverviewTab';
import { PortfolioTab } from '../components/admin/tabs/PortfolioTab';
import { HeroTab } from '../components/admin/tabs/HeroTab';
import { AboutTab } from '../components/admin/tabs/AboutTab';
import { PricingTab } from '../components/admin/tabs/PricingTab';
import { TeamTab } from '../components/admin/tabs/TeamTab';
import { TestimonialsTab } from '../components/admin/tabs/TestimonialsTab';
import { FaqsTab } from '../components/admin/tabs/FaqsTab';
import { StudioTab } from '../components/admin/tabs/StudioTab';
import { EnquiriesTab } from '../components/admin/tabs/EnquiriesTab';
import { BookingsTab } from '../components/admin/tabs/BookingsTab';

interface AdminViewProps {
  onNavigate: (page: NavPage) => void;
}

export const AdminView: React.FC<AdminViewProps> = ({ onNavigate }) => {
  const {
    preWeddingStories,
    weddingProjects,
    preWeddingVideos,
    pricingPackages,
    teamMembers,
    testimonials,
    faqItems,
    enquiries,
    bookings,
    fetchBookingsFromDB,
    resetToDefaults,
  } = useCMS();

  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return sessionStorage.getItem('cammystery_admin_auth') === 'true';
  });
  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [authError, setAuthError] = useState('');
  const [authLoading, setAuthLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>('overview');

  // Subtab for Portfolio
  const [portfolioSubTab, setPortfolioSubTab] = useState<'single' | 'projects' | 'videos' | 'selected'>('single');

  // Modal triggers
  const [newPreWeddingStoryModal, setNewPreWeddingStoryModal] = useState(false);
  const [newPricingModal, setNewPricingModal] = useState(false);
  const [videoModalOpen, setVideoModalOpen] = useState(false);

  // Success toast feedback
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Reusable Generic Confirmation Modal State
  const [confirmModalState, setConfirmModalState] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    confirmText?: string;
    type?: 'danger' | 'primary' | 'success';
    onConfirm: () => void;
  }>({
    isOpen: false,
    title: '',
    message: '',
    confirmText: 'Confirm',
    type: 'danger',
    onConfirm: () => {},
  });

  const requestConfirm = (
    title: string,
    message: string,
    onConfirm: () => void,
    options?: { confirmText?: string; type?: 'danger' | 'primary' | 'success' }
  ) => {
    setConfirmModalState({
      isOpen: true,
      title,
      message,
      confirmText: options?.confirmText || 'Confirm',
      type: options?.type || 'danger',
      onConfirm,
    });
  };

  const requestDeleteConfirm = (
    title: string,
    message: string,
    onConfirm: () => void,
    confirmText: string = 'Delete'
  ) => {
    requestConfirm(title, message, onConfirm, { confirmText, type: 'danger' });
  };

  // Framing Editor Modal State
  const [framingModalState, setFramingModalState] = useState<{
    isOpen: boolean;
    imageUrl: string;
    title: string;
    initialX: number;
    initialY: number;
    onApply: (x: number, y: number) => void;
  }>({
    isOpen: false,
    imageUrl: '',
    title: 'Adjust Photo Framing',
    initialX: 50,
    initialY: 50,
    onApply: () => {},
  });

  const openFramingModal = (
    imageUrl: string,
    title: string,
    initialX: number,
    initialY: number,
    onApply: (x: number, y: number) => void
  ) => {
    setFramingModalState({
      isOpen: true,
      imageUrl,
      title,
      initialX,
      initialY,
      onApply: (fx, fy) => {
        onApply(fx, fy);
        setFramingModalState((s) => ({ ...s, isOpen: false }));
      },
    });
  };

  // Automatically fetch bookings directly from Supabase table whenever Bookings tab is opened
  useEffect(() => {
    if (activeTab === 'bookings') {
      fetchBookingsFromDB();
    }
  }, [activeTab]);

  // Check Supabase session on mount
  useEffect(() => {
    let mounted = true;
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (mounted && session?.user) {
        setIsAuthenticated(true);
        sessionStorage.setItem('cammystery_admin_auth', 'true');
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (mounted && session?.user) {
        setIsAuthenticated(true);
        sessionStorage.setItem('cammystery_admin_auth', 'true');
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');

    if (!emailInput.trim() || !passwordInput) {
      setAuthError('Please enter both email and password.');
      return;
    }

    setAuthLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: emailInput.trim(),
        password: passwordInput,
      });

      if (error) {
        setAuthError(error.message || 'Invalid email or password.');
        setAuthLoading(false);
        return;
      }

      if (data.session) {
        setIsAuthenticated(true);
        sessionStorage.setItem('cammystery_admin_auth', 'true');
      }
    } catch (err: any) {
      setAuthError(err?.message || 'Failed to authenticate. Please check your network and credentials.');
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
    } catch {
      // ignore
    }
    setIsAuthenticated(false);
    sessionStorage.removeItem('cammystery_admin_auth');
  };

  // Lock background scrolling whenever modal is open
  const isAnyModalOpen = Boolean(
    newPreWeddingStoryModal ||
    newPricingModal ||
    videoModalOpen ||
    confirmModalState.isOpen ||
    framingModalState.isOpen
  );

  useEffect(() => {
    if (isAnyModalOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [isAnyModalOpen]);

  if (!isAuthenticated) {
    return (
      <div className="min-h-[85vh] flex items-center justify-center px-4 bg-neutral-50 py-16">
        <div className="max-w-md w-full bg-white border border-neutral-200 p-8 sm:p-10 shadow-lg text-center">
          <div className="w-12 h-12 bg-neutral-900 text-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
            <Lock size={20} />
          </div>
          <span className="text-[10px] tracking-[0.25em] uppercase text-neutral-400 font-medium">
            STUDIO CONTROL SUITE
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl text-neutral-900 mt-1 mb-2">
            CaM-Mystery CMS
          </h1>
          <p className="text-xs text-neutral-500 mb-6">
            Sign in with your admin credentials to manage portfolio, prices, hero slides, and enquiries.
          </p>

          <form onSubmit={handleLogin} className="space-y-4 text-left">
            <div>
              <label className="block text-xs uppercase tracking-wider text-neutral-600 mb-1 font-medium">
                Email Address
              </label>
              <input
                type="email"
                placeholder="admin@cammystery.com"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-neutral-300 rounded-xs focus:border-neutral-900 outline-none"
                autoFocus
                required
              />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-wider text-neutral-600 mb-1 font-medium">
                Password
              </label>
              <input
                type="password"
                placeholder="••••••••"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-neutral-300 rounded-xs focus:border-neutral-900 outline-none"
                required
              />
            </div>

            {authError && (
              <p className="text-xs text-rose-600 font-sans">{authError}</p>
            )}

            <button
              type="submit"
              disabled={authLoading}
              className="w-full py-2.5 bg-neutral-900 hover:bg-neutral-800 disabled:bg-neutral-500 text-white text-xs uppercase tracking-[0.2em] font-medium transition-colors cursor-pointer flex items-center justify-center gap-2"
            >
              {authLoading ? (
                <>
                  <Loader2 size={14} className="animate-spin" />
                  <span>Signing In...</span>
                </>
              ) : (
                <span>Sign In to CMS</span>
              )}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-neutral-100 flex justify-end items-center text-xs text-neutral-400">
            <button
              onClick={() => onNavigate('HOME')}
              className="hover:text-neutral-800 underline cursor-pointer"
            >
              Back to Website
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-neutral-50 min-h-screen">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-neutral-950 text-white px-4 py-3 rounded-xs shadow-xl flex items-center gap-2 text-xs tracking-wide animate-in slide-in-from-bottom-3 duration-200">
          <Check size={14} className="text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Confirmation Modal */}
      <ConfirmModal
        isOpen={confirmModalState.isOpen}
        title={confirmModalState.title}
        message={confirmModalState.message}
        confirmText={confirmModalState.confirmText}
        type={confirmModalState.type}
        onConfirm={confirmModalState.onConfirm}
        onClose={() => setConfirmModalState((prev) => ({ ...prev, isOpen: false }))}
      />

      {/* Photo Framing Focal Point Modal */}
      <PhotoFramingModal
        isOpen={framingModalState.isOpen}
        imageUrl={framingModalState.imageUrl}
        title={framingModalState.title}
        initialX={framingModalState.initialX}
        initialY={framingModalState.initialY}
        onApply={framingModalState.onApply}
        onClose={() => setFramingModalState((prev) => ({ ...prev, isOpen: false }))}
      />

      {/* Top Admin Bar */}
      <div className="sticky top-0 z-40 bg-neutral-900 text-white px-6 sm:px-10 py-3.5 border-b border-neutral-800 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="text-[11px] tracking-[0.25em] uppercase font-semibold text-white">
            CAM-MYSTERY CMS
          </span>
          <span className="text-[9px] uppercase tracking-wider px-2 py-0.5 bg-emerald-950 text-emerald-300 border border-emerald-800/60 rounded-xs">
            Live
          </span>
        </div>

        <div className="flex items-center gap-4 text-xs">
          <button
            onClick={() => onNavigate('HOME')}
            className="inline-flex items-center gap-1.5 text-neutral-300 hover:text-white transition-colors cursor-pointer"
          >
            <span>View Website</span>
            <ExternalLink size={12} />
          </button>
          <button
            onClick={() => {
              requestConfirm(
                'Sign Out of CMS',
                'Are you sure you want to end your current session and sign out?',
                handleLogout,
                { confirmText: 'Sign Out', type: 'primary' }
              );
            }}
            className="inline-flex items-center gap-1.5 text-neutral-400 hover:text-rose-300 transition-colors cursor-pointer"
          >
            <LogOut size={13} />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Sidebar Tabs */}
          <div className="lg:col-span-3 bg-white border border-neutral-200 p-2 shadow-xs rounded-xs lg:sticky lg:top-20 self-start z-30 max-h-[calc(100vh-6rem)] overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
            <nav className="space-y-1">
              {[
                { id: 'overview', label: 'Dashboard Overview', icon: Layers },
                {
                  id: 'portfolio',
                  label: `Portfolio (${preWeddingStories.length + weddingProjects.length + preWeddingVideos.length})`,
                  icon: Camera,
                },
                { id: 'hero', label: 'Hero Carousel & Video', icon: ImageIcon },
                { id: 'about', label: 'About Page Photos', icon: BookOpen },
                { id: 'pricing', label: `Packages (${pricingPackages.length})`, icon: DollarSign },
                { id: 'team', label: `Our Team (${teamMembers.length})`, icon: Users },
                { id: 'testimonials', label: `Kind Words (${testimonials.length})`, icon: MessageSquareQuote },
                { id: 'faqs', label: `FAQs (${faqItems.length})`, icon: HelpCircle },
                { id: 'studio', label: 'Studio Info', icon: Settings },
                {
                  id: 'enquiries',
                  label: `Enquiry Inbox (${enquiries.filter((e) => !e.isRead).length} new)`,
                  icon: Mail,
                },
                {
                  id: 'bookings',
                  label: `Bookings (${bookings.filter((b) => b.status === 'pending').length} pending)`,
                  icon: Calendar,
                },
              ].map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id as TabType)}
                    className={`w-full flex items-center justify-between px-3.5 py-2.5 text-xs tracking-wider uppercase font-medium rounded-xs transition-colors cursor-pointer text-left ${
                      isActive
                        ? 'bg-neutral-900 text-white shadow-xs'
                        : 'text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon size={14} />
                      <span>{item.label}</span>
                    </div>
                  </button>
                );
              })}
            </nav>

            <div className="mt-6 pt-4 border-t border-neutral-100 px-2">
              <button
                onClick={() => {
                  requestDeleteConfirm(
                    'Reset CMS to Defaults',
                    'Are you sure you want to reset all site content back to initial project defaults? Any custom uploaded photos and edits will be reverted.',
                    () => {
                      resetToDefaults();
                      showToast('Reset back to factory defaults.');
                    }
                  );
                }}
                className="w-full flex items-center justify-center gap-1.5 py-2 text-[11px] text-neutral-400 hover:text-rose-600 tracking-wider uppercase transition-colors cursor-pointer"
              >
                <RotateCcw size={12} />
                <span>Reset Defaults</span>
              </button>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-9 space-y-6">
            {activeTab === 'overview' && (
              <OverviewTab
                onSelectTab={(tab) => setActiveTab(tab)}
                onAddStory={() => {
                  setActiveTab('portfolio');
                  setPortfolioSubTab('single');
                  setNewPreWeddingStoryModal(true);
                }}
                onAddPricing={() => {
                  setActiveTab('pricing');
                  setNewPricingModal(true);
                }}
                onEditVideoTeaser={() => {
                  setActiveTab('hero');
                  setVideoModalOpen(true);
                }}
              />
            )}

            {activeTab === 'portfolio' && (
              <PortfolioTab
                showToast={showToast}
                requestDeleteConfirm={requestDeleteConfirm}
                openFramingModal={openFramingModal}
                portfolioSubTab={portfolioSubTab}
                setPortfolioSubTab={setPortfolioSubTab}
                newPreWeddingStoryModal={newPreWeddingStoryModal}
                setNewPreWeddingStoryModal={setNewPreWeddingStoryModal}
              />
            )}

            {activeTab === 'hero' && (
              <HeroTab
                showToast={showToast}
                videoModalOpen={videoModalOpen}
                setVideoModalOpen={setVideoModalOpen}
              />
            )}

            {activeTab === 'about' && (
              <AboutTab
                onNavigate={onNavigate}
                showToast={showToast}
              />
            )}

            {activeTab === 'pricing' && (
              <PricingTab
                showToast={showToast}
                requestDeleteConfirm={requestDeleteConfirm}
                newPricingModal={newPricingModal}
                setNewPricingModal={setNewPricingModal}
              />
            )}

            {activeTab === 'team' && (
              <TeamTab
                showToast={showToast}
                requestDeleteConfirm={requestDeleteConfirm}
              />
            )}

            {activeTab === 'testimonials' && (
              <TestimonialsTab
                showToast={showToast}
                requestDeleteConfirm={requestDeleteConfirm}
              />
            )}

            {activeTab === 'faqs' && (
              <FaqsTab
                showToast={showToast}
                requestDeleteConfirm={requestDeleteConfirm}
              />
            )}

            {activeTab === 'studio' && (
              <StudioTab showToast={showToast} />
            )}

            {activeTab === 'enquiries' && (
              <EnquiriesTab
                showToast={showToast}
                requestDeleteConfirm={requestDeleteConfirm}
              />
            )}

            {activeTab === 'bookings' && (
              <BookingsTab
                showToast={showToast}
                requestDeleteConfirm={requestDeleteConfirm}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
