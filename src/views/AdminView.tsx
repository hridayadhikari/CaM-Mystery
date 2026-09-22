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
  Plus,
  Trash2,
  Edit2,
  ExternalLink,
  RotateCcw,
  Check,
  Lock,
  LogOut,
  Layers,
  X,
  Star,
  BookOpen,
  Loader2,
  Calendar,
  Phone,
  Eye,
  FileSpreadsheet,
  Film,
  Play,
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useCMS } from '../lib/cmsStore';
import { syncAllBookingsToGoogleSheet } from '../lib/googleSheets';
import {
  NavPage,
  SelectedWorkItem,
  PricingPackage,
  TeamMember,
  Testimonial,
  FaqItem,
  WeddingProject,
  BookingItem,
  BookingStatus,
  PreWeddingVideo,
} from '../types';
import { CloudinaryImageUpload } from '../components/admin/CloudinaryImageUpload';
import { CloudinaryVideoUpload } from '../components/admin/CloudinaryVideoUpload';
import { ConfirmModal } from '../components/admin/ConfirmModal';
import { getOptimizedCloudinaryUrl } from '../lib/cloudinary';

interface AdminViewProps {
  onNavigate: (page: NavPage) => void;
}

type TabType =
  | 'overview'
  | 'portfolio'
  | 'hero'
  | 'about'
  | 'pricing'
  | 'team'
  | 'testimonials'
  | 'faqs'
  | 'studio'
  | 'enquiries'
  | 'bookings';

export const AdminView: React.FC<AdminViewProps> = ({ onNavigate }) => {
  const {
    studioInfo,
    heroSlides,
    selectedWork,
    weddingProjects,
    pricingPackages,
    teamMembers,
    testimonials,
    faqItems,
    videoFeature,
    preWeddingVideos,
    aboutImages,
    enquiries,
    bookings,
    updateStudioInfo,
    updateHeroSlides,
    updateVideoFeature,
    updateAboutImages,
    addPreWeddingVideo,
    updatePreWeddingVideo,
    deletePreWeddingVideo,
    addWeddingProject,
    updateWeddingProject,
    deleteWeddingProject,
    addSelectedWork,
    updateSelectedWork,
    deleteSelectedWork,
    addPricingPackage,
    updatePricingPackage,
    deletePricingPackage,
    addTeamMember,
    updateTeamMember,
    deleteTeamMember,
    addTestimonial,
    updateTestimonial,
    deleteTestimonial,
    addFaqItem,
    updateFaqItem,
    deleteFaqItem,
    markEnquiryRead,
    deleteEnquiry,
    fetchBookingsFromDB,
    updateBookingStatus,
    deleteBooking,
    reloadData,
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

  // Automatically fetch bookings directly from Supabase table whenever Bookings tab is opened
  useEffect(() => {
    if (activeTab === 'bookings') {
      fetchBookingsFromDB();
    }
  }, [activeTab]);

  // Check Supabase session on mount
  React.useEffect(() => {
    let mounted = true;
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (mounted && session?.user) {
        setIsAuthenticated(true);
        sessionStorage.setItem('cammystery_admin_auth', 'true');
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
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

  // Portfolio Subtab: 'single' (individual photos) vs 'projects' (full wedding stories) vs 'videos' (pre-wedding films)
  const [portfolioSubTab, setPortfolioSubTab] = useState<'single' | 'projects' | 'videos'>('single');

  // Pre-Wedding Video Form Modals
  const [newVideoModal, setNewVideoModal] = useState(false);
  const [newVideoForm, setNewVideoForm] = useState<Omit<PreWeddingVideo, 'id'>>({
    title: '',
    coupleNames: '',
    location: '',
    videoUrl: '',
    posterUrl: '',
    description: '',
    displayOrder: 0,
    isFeatured: false,
  });
  const [editingVideo, setEditingVideo] = useState<PreWeddingVideo | null>(null);

  // Wedding Project Form Modals
  const [newProjectModal, setNewProjectModal] = useState(false);
  const [newProjectForm, setNewProjectForm] = useState<Omit<WeddingProject, 'id'>>({
    title: '',
    coupleNames: '',
    location: '',
    date: '',
    coverImage: '',
    description: '',
    images: [],
  });
  const [editingProject, setEditingProject] = useState<WeddingProject | null>(null);
  const [isSyncingSheet, setIsSyncingSheet] = useState(false);

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

  const requestDeleteConfirm = (title: string, message: string, onConfirm: () => void) => {
    requestConfirm(title, message, onConfirm, { confirmText: 'Delete', type: 'danger' });
  };

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

  // State for Portfolio Item Modals
  const [newWorkModal, setNewWorkModal] = useState(false);
  const [newWorkForm, setNewWorkForm] = useState({
    title: '',
    category: 'Wedding Day',
    imageUrl: '',
    isFeatured: false,
  });
  const [editingWork, setEditingWork] = useState<SelectedWorkItem | null>(null);

  // State for Hero Slide Edit Modal
  const [editingSlide, setEditingSlide] = useState<{
    index: number;
    slide: { id: number; title: string; subtitle: string; imageUrl: string };
  } | null>(null);

  // State for Editing Pre-wedding Video Modal
  const [videoModalOpen, setVideoModalOpen] = useState(false);
  const [videoForm, setVideoForm] = useState(videoFeature);

  // State for Team Member Modals
  const [newTeamModal, setNewTeamModal] = useState(false);
  const [newTeamForm, setNewTeamForm] = useState<TeamMember>({
    id: '',
    name: '',
    role: '',
    bio: '',
    imageUrl: '',
    iconName: 'Camera',
  });
  const [editingTeamMember, setEditingTeamMember] = useState<TeamMember | null>(null);

  // State for Pricing Package Modals
  const [newPricingModal, setNewPricingModal] = useState(false);
  const [newPricingForm, setNewPricingForm] = useState<PricingPackage>({
    id: '',
    name: '',
    coverage: '2 Days Coverage',
    price: 'Rs. 95,000',
    badge: '',
    isPopular: false,
    features: ['Traditional Photography', 'Traditional Videography'],
  });
  const [editingPricingPkg, setEditingPricingPkg] = useState<PricingPackage | null>(null);
  const [featureInput, setFeatureInput] = useState('');
  const [editFeatureInput, setEditFeatureInput] = useState('');

  // State for Testimonial Modals
  const [newTestimonialModal, setNewTestimonialModal] = useState(false);
  const [newTestimonialForm, setNewTestimonialForm] = useState({
    quote: '',
    authors: '',
  });
  const [editingTestimonial, setEditingTestimonial] = useState<Testimonial | null>(null);

  // State for FAQ Modals
  const [newFaqModal, setNewFaqModal] = useState(false);
  const [newFaqForm, setNewFaqForm] = useState({
    id: '',
    question: '',
    answer: '',
  });
  const [editingFaq, setEditingFaq] = useState<FaqItem | null>(null);

  // State for Studio Info Modal
  const [studioModalOpen, setStudioModalOpen] = useState(false);
  const [studioForm, setStudioForm] = useState(studioInfo);

  // State for Booking Detail Modal
  const [selectedBookingDetail, setSelectedBookingDetail] = useState<BookingItem | null>(null);

  // Lock background scrolling whenever any modal is open
  const isAnyModalOpen = Boolean(
    newProjectModal ||
    editingProject ||
    newWorkModal ||
    editingWork ||
    editingSlide ||
    videoModalOpen ||
    newTeamModal ||
    editingTeamMember ||
    newPricingModal ||
    editingPricingPkg ||
    newTestimonialModal ||
    editingTestimonial ||
    newFaqModal ||
    editingFaq ||
    studioModalOpen ||
    Boolean(selectedBookingDetail) ||
    confirmModalState.isOpen
  );

  React.useEffect(() => {
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
                { id: 'portfolio', label: `Portfolio (${selectedWork.length})`, icon: Camera },
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
            {/* TAB: OVERVIEW */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <div className="bg-white border border-neutral-200 p-6 sm:p-8 shadow-xs rounded-xs">
                  <h2 className="font-serif text-2xl text-neutral-900 mb-1">
                    Studio Management Dashboard
                  </h2>
                  <p className="text-xs text-neutral-500 mb-6 leading-relaxed">
                    Manage all website photos, wedding collections, hero slides, and customer bookings in one seamless interface.
                  </p>

                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
                    <div className="p-4 bg-neutral-50 border border-neutral-200 rounded-xs">
                      <span className="text-[10px] uppercase tracking-wider text-neutral-400">
                        Portfolio Works
                      </span>
                      <div className="text-2xl font-serif text-neutral-900 mt-1">
                        {selectedWork.length}
                      </div>
                    </div>
                    <div className="p-4 bg-neutral-50 border border-neutral-200 rounded-xs">
                      <span className="text-[10px] uppercase tracking-wider text-neutral-400">
                        Active Packages
                      </span>
                      <div className="text-2xl font-serif text-neutral-900 mt-1">
                        {pricingPackages.length}
                      </div>
                    </div>
                    <div className="p-4 bg-neutral-50 border border-neutral-200 rounded-xs">
                      <span className="text-[10px] uppercase tracking-wider text-neutral-400">
                        Team Artisans
                      </span>
                      <div className="text-2xl font-serif text-neutral-900 mt-1">
                        {teamMembers.length}
                      </div>
                    </div>
                    <div className="p-4 bg-neutral-50 border border-neutral-200 rounded-xs">
                      <span className="text-[10px] uppercase tracking-wider text-neutral-400">
                        Total Enquiries
                      </span>
                      <div className="text-2xl font-serif text-neutral-900 mt-1">
                        {enquiries.length}
                      </div>
                    </div>
                    <div className="p-4 bg-neutral-50 border border-neutral-200 rounded-xs">
                      <span className="text-[10px] uppercase tracking-wider text-neutral-400">
                        Total Bookings
                      </span>
                      <div className="text-2xl font-serif text-neutral-900 mt-1">
                        {bookings.length}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Quick actions */}
                <div className="bg-white border border-neutral-200 p-6 shadow-xs rounded-xs">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-neutral-700 mb-4">
                    Quick Actions
                  </h3>
                  <div className="flex flex-wrap gap-3">
                    <button
                      onClick={() => {
                        setActiveTab('portfolio');
                        setNewWorkModal(true);
                      }}
                      className="inline-flex items-center gap-1.5 px-4 py-2 bg-neutral-900 text-white hover:bg-neutral-800 text-xs tracking-wider uppercase rounded-xs transition-colors cursor-pointer"
                    >
                      <Plus size={13} />
                      <span>Upload New Photo</span>
                    </button>
                    <button
                      onClick={() => {
                        setActiveTab('pricing');
                        setNewPricingModal(true);
                      }}
                      className="inline-flex items-center gap-1.5 px-4 py-2 border border-neutral-300 hover:border-neutral-900 text-neutral-800 text-xs tracking-wider uppercase rounded-xs transition-colors cursor-pointer"
                    >
                      <DollarSign size={13} />
                      <span>Add Package</span>
                    </button>
                    <button
                      onClick={() => {
                        setActiveTab('hero');
                        setVideoModalOpen(true);
                      }}
                      className="inline-flex items-center gap-1.5 px-4 py-2 border border-neutral-300 hover:border-neutral-900 text-neutral-800 text-xs tracking-wider uppercase rounded-xs transition-colors cursor-pointer"
                    >
                      <ImageIcon size={13} />
                      <span>Update Video Teaser</span>
                    </button>
                    <button
                      onClick={() => setActiveTab('enquiries')}
                      className="inline-flex items-center gap-1.5 px-4 py-2 border border-neutral-300 hover:border-neutral-900 text-neutral-800 text-xs tracking-wider uppercase rounded-xs transition-colors cursor-pointer"
                    >
                      <Mail size={13} />
                      <span>Check Enquiries</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* TAB: PORTFOLIO */}
            {activeTab === 'portfolio' && (
              <div className="space-y-6">
                {/* Header & Subtab Switcher */}
                <div className="bg-white border border-neutral-200 p-6 shadow-xs rounded-xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <h2 className="font-serif text-xl text-neutral-900">
                      Portfolio &amp; Wedding Stories
                    </h2>
                    <p className="text-xs text-neutral-500">
                      Manage single categorized portfolio photos or organize full wedding projects with multiple couple ceremony images.
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    {portfolioSubTab === 'single' ? (
                      <button
                        onClick={() => setNewWorkModal(true)}
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-neutral-900 hover:bg-neutral-800 text-white text-xs uppercase tracking-wider rounded-xs cursor-pointer transition-colors"
                      >
                        <Plus size={14} />
                        <span>Upload Single Photo</span>
                      </button>
                    ) : portfolioSubTab === 'projects' ? (
                      <button
                        onClick={() => {
                          setNewProjectForm({
                            title: '',
                            coupleNames: '',
                            location: '',
                            date: '',
                            coverImage: '',
                            description: '',
                            images: [],
                          });
                          setNewProjectModal(true);
                        }}
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-neutral-900 hover:bg-neutral-800 text-white text-xs uppercase tracking-wider rounded-xs cursor-pointer transition-colors"
                      >
                        <Plus size={14} />
                        <span>Add Wedding Project</span>
                      </button>
                    ) : (
                      <button
                        id="admin-add-video-btn"
                        onClick={() => {
                          setNewVideoForm({
                            title: '',
                            coupleNames: '',
                            location: '',
                            videoUrl: '',
                            posterUrl: '',
                            description: '',
                            displayOrder: preWeddingVideos.length,
                            isFeatured: false,
                          });
                          setNewVideoModal(true);
                        }}
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-neutral-900 hover:bg-neutral-800 text-white text-xs uppercase tracking-wider rounded-xs cursor-pointer transition-colors"
                      >
                        <Plus size={14} />
                        <span>Add Pre-Wedding Video</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Subtab Toggle Buttons */}
                <div className="flex border-b border-neutral-200 gap-6 overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
                  <button
                    onClick={() => setPortfolioSubTab('single')}
                    className={`pb-3 text-xs tracking-wider uppercase font-medium border-b-2 -mb-px transition-colors cursor-pointer flex items-center gap-2 shrink-0 ${
                      portfolioSubTab === 'single'
                        ? 'border-neutral-900 text-neutral-900 font-semibold'
                        : 'border-transparent text-neutral-400 hover:text-neutral-700'
                    }`}
                  >
                    <span>Individual Photos</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-neutral-100 text-neutral-600">
                      {selectedWork.length}
                    </span>
                  </button>

                  <button
                    onClick={() => setPortfolioSubTab('projects')}
                    className={`pb-3 text-xs tracking-wider uppercase font-medium border-b-2 -mb-px transition-colors cursor-pointer flex items-center gap-2 shrink-0 ${
                      portfolioSubTab === 'projects'
                        ? 'border-neutral-900 text-neutral-900 font-semibold'
                        : 'border-transparent text-neutral-400 hover:text-neutral-700'
                    }`}
                  >
                    <span>Wedding Projects (Stories)</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-neutral-100 text-neutral-600">
                      {weddingProjects.length}
                    </span>
                  </button>

                  <button
                    id="admin-subtab-videos"
                    onClick={() => setPortfolioSubTab('videos')}
                    className={`pb-3 text-xs tracking-wider uppercase font-medium border-b-2 -mb-px transition-colors cursor-pointer flex items-center gap-2 shrink-0 ${
                      portfolioSubTab === 'videos'
                        ? 'border-neutral-900 text-neutral-900 font-semibold'
                        : 'border-transparent text-neutral-400 hover:text-neutral-700'
                    }`}
                  >
                    <Film size={13} className={portfolioSubTab === 'videos' ? 'text-neutral-900' : 'text-neutral-400'} />
                    <span>Pre-Wedding Videos</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-neutral-100 text-neutral-600">
                      {preWeddingVideos.length}
                    </span>
                  </button>
                </div>

                {/* View 1: Individual Photos Grid */}
                {portfolioSubTab === 'single' && (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {selectedWork.map((item) => (
                      <div
                        key={item.id}
                        className="bg-white border border-neutral-200 rounded-xs overflow-hidden shadow-xs group relative flex flex-col"
                      >
                        <div className="aspect-[4/5] bg-neutral-100 relative overflow-hidden">
                          <img
                            src={getOptimizedCloudinaryUrl(item.imageUrl, { width: 400 })}
                            alt={item.title}
                            loading="lazy"
                            decoding="async"
                            className="w-full h-full object-cover object-top"
                          />
                          {item.isFeatured && (
                            <div className="absolute top-2 left-2 bg-neutral-900/90 text-amber-400 px-2 py-0.5 text-[9px] uppercase tracking-wider font-semibold rounded-xs flex items-center gap-1 shadow-xs">
                              <Star size={10} className="fill-amber-400 text-amber-400" />
                              <span>Featured</span>
                            </div>
                          )}
                          <div className="absolute top-2 right-2 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={async () => {
                                const nextFeatured = !item.isFeatured;
                                await updateSelectedWork({ ...item, isFeatured: nextFeatured });
                                showToast(
                                  nextFeatured
                                    ? 'Marked as featured on homepage.'
                                    : 'Removed from homepage featured list.'
                                );
                              }}
                              className={`p-1.5 rounded-xs shadow-xs cursor-pointer transition-colors ${
                                item.isFeatured
                                  ? 'bg-amber-400 text-neutral-950 hover:bg-amber-300'
                                  : 'bg-white/90 hover:bg-white text-neutral-700'
                              }`}
                              title={item.isFeatured ? 'Unfeature from Homepage' : 'Feature on Homepage'}
                            >
                              <Star size={13} className={item.isFeatured ? 'fill-neutral-950' : ''} />
                            </button>
                            <button
                              onClick={() => setEditingWork(item)}
                              className="p-1.5 bg-white/90 hover:bg-white text-neutral-900 rounded-xs shadow-xs cursor-pointer"
                              title="Edit"
                            >
                              <Edit2 size={13} />
                            </button>
                            <button
                              onClick={() => {
                                requestDeleteConfirm(
                                  'Delete Photo',
                                  `Are you sure you want to permanently remove "${item.title}" from the portfolio gallery?`,
                                  async () => {
                                    await deleteSelectedWork(item.id);
                                    showToast('Photo removed.');
                                  }
                                );
                              }}
                              className="p-1.5 bg-white/90 hover:bg-rose-600 hover:text-white text-rose-600 rounded-xs shadow-xs cursor-pointer"
                              title="Delete"
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                        </div>
                        <div className="p-3">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] tracking-wider uppercase text-neutral-400 font-medium">
                              {item.category}
                            </span>
                            {item.isFeatured && (
                              <span className="text-[9px] text-amber-600 font-medium flex items-center gap-0.5">
                                <Star size={9} className="fill-amber-500 text-amber-500" />
                                Home
                              </span>
                            )}
                          </div>
                          <h4 className="font-serif text-sm text-neutral-900 truncate mt-0.5">
                            {item.title}
                          </h4>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* View 2: Wedding Projects Grid */}
                {portfolioSubTab === 'projects' && (
                  <div className="space-y-4">
                    {weddingProjects.length === 0 ? (
                      <div className="bg-white border border-neutral-200 p-12 text-center rounded-xs space-y-3">
                        <p className="text-sm text-neutral-500">
                          No wedding projects created yet.
                        </p>
                        <button
                          onClick={() => setNewProjectModal(true)}
                          className="px-4 py-2 bg-neutral-900 text-white text-xs uppercase tracking-wider rounded-xs cursor-pointer"
                        >
                          Create First Wedding Project
                        </button>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {weddingProjects.map((project) => (
                          <div
                            key={project.id}
                            className="bg-white border border-neutral-200 rounded-xs overflow-hidden shadow-xs flex flex-col justify-between"
                          >
                            <div>
                              <div className="aspect-[16/10] bg-neutral-900 relative overflow-hidden group">
                                <img
                                  src={getOptimizedCloudinaryUrl(project.coverImage, { width: 600 })}
                                  alt={project.coupleNames}
                                  loading="lazy"
                                  decoding="async"
                                  className="w-full h-full object-cover object-top"
                                />
                                <div className="absolute top-2 right-2 bg-black/70 text-white text-[10px] px-2 py-0.5 rounded-xs flex items-center gap-1">
                                  <span>{project.images?.length || 0} Photos</span>
                                </div>
                              </div>

                              <div className="p-4 space-y-2">
                                <span className="text-[10px] tracking-wider uppercase text-neutral-400 block font-medium">
                                  {project.coupleNames}
                                </span>
                                <h3 className="font-serif text-base text-neutral-900 font-medium">
                                  {project.title}
                                </h3>
                                <div className="text-xs text-neutral-500 space-y-0.5">
                                  {project.location && <p>📍 {project.location}</p>}
                                  {project.date && <p>📅 {project.date}</p>}
                                </div>
                                {project.description && (
                                  <p className="text-xs text-neutral-600 line-clamp-2 pt-1 font-sans">
                                    {project.description}
                                  </p>
                                )}
                              </div>
                            </div>

                            <div className="p-4 pt-2 border-t border-neutral-100 flex items-center justify-between gap-2">
                              <span className="text-[11px] text-neutral-400 font-mono">
                                ID: {project.id}
                              </span>
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => setEditingProject({ ...project })}
                                  className="p-1.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 rounded-xs text-xs flex items-center gap-1 cursor-pointer"
                                  title="Edit Project"
                                >
                                  <Edit2 size={13} />
                                  <span>Edit</span>
                                </button>
                                <button
                                  onClick={() => {
                                    requestDeleteConfirm(
                                      'Delete Wedding Project',
                                      `Permanently delete "${project.coupleNames}" wedding story and all associated photos?`,
                                      async () => {
                                        await deleteWeddingProject(project.id);
                                        showToast('Wedding project removed.');
                                      }
                                    );
                                  }}
                                  className="p-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-xs text-xs flex items-center gap-1 cursor-pointer"
                                  title="Delete Project"
                                >
                                  <Trash2 size={13} />
                                  <span>Delete</span>
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* View 3: Pre-Wedding Videos Grid */}
                {portfolioSubTab === 'videos' && (
                  <div className="space-y-4">
                    {preWeddingVideos.length === 0 ? (
                      <div className="bg-white border border-neutral-200 p-12 text-center rounded-xs space-y-3">
                        <Film size={32} className="mx-auto text-neutral-400" />
                        <h3 className="font-serif text-lg text-neutral-900">No Pre-Wedding Videos Yet</h3>
                        <p className="text-xs text-neutral-500 max-w-sm mx-auto">
                          Upload high-definition pre-wedding films or teaser videos to showcase them in the portfolio films tab.
                        </p>
                        <button
                          onClick={() => {
                            setNewVideoForm({
                              title: '',
                              coupleNames: '',
                              location: '',
                              videoUrl: '',
                              posterUrl: '',
                              description: '',
                              displayOrder: 0,
                              isFeatured: false,
                            });
                            setNewVideoModal(true);
                          }}
                          className="px-4 py-2 bg-neutral-900 text-white text-xs uppercase tracking-wider rounded-xs cursor-pointer inline-flex items-center gap-1.5"
                        >
                          <Plus size={14} />
                          <span>Add First Pre-Wedding Video</span>
                        </button>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {preWeddingVideos.map((video) => (
                          <div
                            key={video.id}
                            className="bg-white border border-neutral-200 rounded-xs overflow-hidden shadow-xs flex flex-col justify-between"
                          >
                            <div>
                              {/* Video thumbnail or video player */}
                              <div className="aspect-[16/10] bg-neutral-950 relative overflow-hidden group">
                                {video.posterUrl ? (
                                  <img
                                    src={getOptimizedCloudinaryUrl(video.posterUrl, { width: 600 })}
                                    alt={video.title}
                                    loading="lazy"
                                    decoding="async"
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  <video
                                    src={video.videoUrl}
                                    className="w-full h-full object-cover filter brightness-90"
                                    muted
                                  />
                                )}

                                <div className="absolute inset-0 bg-black/25 flex items-center justify-center pointer-events-none">
                                  <div className="w-10 h-10 rounded-full bg-white/90 text-neutral-900 flex items-center justify-center shadow-md">
                                    <Play size={16} className="fill-neutral-900 translate-x-0.5" />
                                  </div>
                                </div>

                                {video.isFeatured && (
                                  <div className="absolute top-2 left-2 bg-neutral-950/90 text-amber-400 px-2 py-0.5 text-[9px] uppercase tracking-wider font-semibold rounded-xs flex items-center gap-1">
                                    <Star size={10} className="fill-amber-400 text-amber-400" />
                                    <span>Featured</span>
                                  </div>
                                )}
                              </div>

                              <div className="p-4 space-y-2">
                                <div className="flex items-center justify-between">
                                  {video.coupleNames && (
                                    <span className="text-[10px] tracking-wider uppercase text-neutral-400 font-medium">
                                      {video.coupleNames}
                                    </span>
                                  )}
                                  <span className="text-[9px] text-neutral-400 font-mono">
                                    Order: {video.displayOrder ?? 0}
                                  </span>
                                </div>

                                <h3 className="font-serif text-base text-neutral-900 font-medium truncate">
                                  {video.title}
                                </h3>

                                {video.location && (
                                  <p className="text-xs text-neutral-500">
                                    📍 {video.location}
                                  </p>
                                )}

                                {video.description && (
                                  <p className="text-xs text-neutral-600 line-clamp-2 pt-0.5 font-sans">
                                    {video.description}
                                  </p>
                                )}

                                <div className="pt-1">
                                  <a
                                    href={video.videoUrl}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="text-[11px] text-neutral-500 hover:text-neutral-900 flex items-center gap-1 truncate"
                                  >
                                    <ExternalLink size={11} className="shrink-0" />
                                    <span className="truncate">{video.videoUrl}</span>
                                  </a>
                                </div>
                              </div>
                            </div>

                            <div className="p-4 pt-2 border-t border-neutral-100 flex items-center justify-between gap-2">
                              <button
                                onClick={async () => {
                                  const updated = { ...video, isFeatured: !video.isFeatured };
                                  await updatePreWeddingVideo(updated);
                                  showToast(updated.isFeatured ? 'Marked as featured film.' : 'Unmarked featured film.');
                                }}
                                className={`p-1.5 rounded-xs text-xs flex items-center gap-1 cursor-pointer transition-colors ${
                                  video.isFeatured
                                    ? 'bg-amber-100 text-amber-900 hover:bg-amber-200'
                                    : 'bg-neutral-100 hover:bg-neutral-200 text-neutral-600'
                                }`}
                                title={video.isFeatured ? 'Remove Featured Badge' : 'Set as Featured'}
                              >
                                <Star size={12} className={video.isFeatured ? 'fill-amber-500 text-amber-500' : ''} />
                                <span className="text-[10px] uppercase tracking-wider">{video.isFeatured ? 'Featured' : 'Feature'}</span>
                              </button>

                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => setEditingVideo({ ...video })}
                                  className="p-1.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 rounded-xs text-xs flex items-center gap-1 cursor-pointer"
                                  title="Edit Video"
                                >
                                  <Edit2 size={13} />
                                  <span>Edit</span>
                                </button>
                                <button
                                  onClick={() => {
                                    requestDeleteConfirm(
                                      'Delete Pre-Wedding Video',
                                      `Are you sure you want to permanently delete "${video.title}"?`,
                                      async () => {
                                        await deletePreWeddingVideo(video.id);
                                        showToast('Video removed.');
                                      }
                                    );
                                  }}
                                  className="p-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-xs text-xs flex items-center gap-1 cursor-pointer"
                                  title="Delete Video"
                                >
                                  <Trash2 size={13} />
                                  <span>Delete</span>
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* TAB: HERO & VIDEO */}
            {activeTab === 'hero' && (
              <div className="space-y-6">
                {/* Hero Slides */}
                <div className="bg-white border border-neutral-200 p-6 shadow-xs rounded-xs space-y-6">
                  <div>
                    <h2 className="font-serif text-xl text-neutral-900">
                      Home Hero Carousel Slides
                    </h2>
                    <p className="text-xs text-neutral-500">
                      Manage the panoramic background slides shown at the top of the homepage.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    {heroSlides.map((slide, idx) => (
                      <div
                        key={slide.id}
                        className="bg-white border border-neutral-200 rounded-xs overflow-hidden shadow-xs flex flex-col justify-between"
                      >
                        <div>
                          <div className="aspect-[16/10] bg-neutral-950 relative overflow-hidden flex items-center justify-center">
                            <img
                              src={getOptimizedCloudinaryUrl(slide.imageUrl, { width: 600 })}
                              alt={slide.title}
                              loading="lazy"
                              decoding="async"
                              className="w-full h-full object-contain"
                            />
                            <div className="absolute top-2 left-2 bg-black/60 px-2 py-0.5 text-[9px] uppercase tracking-wider text-white rounded-xs">
                              Slide #{idx + 1}
                            </div>
                          </div>
                          <div className="p-4 space-y-1">
                            <span className="text-[10px] uppercase tracking-wider text-neutral-400">
                              {slide.subtitle}
                            </span>
                            <h4 className="font-serif text-base text-neutral-900 font-normal">
                              {slide.title}
                            </h4>
                          </div>
                        </div>

                        <div className="p-4 pt-0">
                          <button
                            onClick={() => setEditingSlide({ index: idx, slide: { ...slide } })}
                            className="w-full py-2 bg-neutral-100 hover:bg-neutral-900 hover:text-white text-neutral-800 text-xs uppercase tracking-wider rounded-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                          >
                            <Edit2 size={12} />
                            <span>Edit Slide #{idx + 1}</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Pre-wedding Cinema Feature */}
                <div className="bg-white border border-neutral-200 p-6 shadow-xs rounded-xs space-y-4">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <h2 className="font-serif text-xl text-neutral-900">
                          Pre-Wedding Cinema Teaser Feature
                        </h2>
                        <span className="text-[9px] uppercase tracking-wider font-semibold px-2 py-0.5 bg-neutral-900 text-white rounded-xs">
                          Live Video
                        </span>
                      </div>
                      <p className="text-xs text-neutral-500 mt-0.5">
                        Featured teaser film: <span className="font-medium text-neutral-800">{videoFeature.title}</span> ({videoFeature.subtitle})
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        setVideoForm(videoFeature);
                        setVideoModalOpen(true);
                      }}
                      className="inline-flex items-center gap-1.5 px-4 py-2 bg-neutral-900 hover:bg-neutral-800 text-white text-xs uppercase tracking-wider rounded-xs cursor-pointer transition-colors shrink-0"
                    >
                      <Edit2 size={13} />
                      <span>Configure Video Teaser</span>
                    </button>
                  </div>

                  {/* Video player preview card */}
                  {videoFeature.videoUrl && (
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-5 pt-4 border-t border-neutral-100 items-center">
                      <div className="md:col-span-6 aspect-[16/9] bg-black rounded-xs overflow-hidden shadow-sm border border-neutral-200 relative group">
                        <video
                          key={videoFeature.videoUrl}
                          src={videoFeature.videoUrl}
                          poster={videoFeature.posterUrl}
                          controls
                          playsInline
                          preload="metadata"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="md:col-span-6 space-y-2 text-xs">
                        <div className="space-y-1">
                          <span className="text-[10px] tracking-wider uppercase text-neutral-400 font-medium">
                            {videoFeature.subtitle || 'Cinematic Film'}
                          </span>
                          <h4 className="font-serif text-lg text-neutral-900">
                            {videoFeature.title}
                          </h4>
                          {videoFeature.description && (
                            <p className="text-neutral-500 leading-relaxed text-xs">
                              {videoFeature.description}
                            </p>
                          )}
                        </div>
                        <div className="pt-2 text-[11px] text-neutral-400 truncate">
                          <span className="font-medium text-neutral-600">Video URL: </span>
                          <a
                            href={videoFeature.videoUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="underline hover:text-neutral-900"
                          >
                            {videoFeature.videoUrl}
                          </a>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* TAB: ABOUT PAGE PHOTOS */}
            {activeTab === 'about' && (
              <div className="space-y-6">
                <div className="bg-white border border-neutral-200 p-6 shadow-xs rounded-xs flex items-center justify-between">
                  <div>
                    <h2 className="font-serif text-xl text-neutral-900">
                      About Page Editorial Photos
                    </h2>
                    <p className="text-xs text-neutral-500">
                      Customize all imagery displayed across the "About CaM-Mystery" storytelling and FAQ sections.
                    </p>
                  </div>
                  <button
                    onClick={() => onNavigate('ABOUT')}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-neutral-300 text-neutral-700 hover:text-black hover:border-black text-xs uppercase tracking-wider rounded-xs cursor-pointer transition-colors"
                  >
                    <span>Preview About Page</span>
                    <ExternalLink size={12} />
                  </button>
                </div>

                {/* 1. Main Studio Portrait */}
                <div className="bg-white border border-neutral-200 p-6 shadow-xs rounded-xs space-y-4">
                  <div className="border-b border-neutral-100 pb-3">
                    <h3 className="font-serif text-base text-neutral-900 font-medium">
                      1. "The Studio Behind the Lens" - Primary Portrait
                    </h3>
                    <p className="text-xs text-neutral-500">
                      Shown prominently on the right side next to the studio philosophy and biography.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 items-center">
                    <div className="sm:col-span-4 aspect-[3/4] bg-neutral-100 rounded-xs overflow-hidden border border-neutral-200">
                      <img
                        src={getOptimizedCloudinaryUrl(aboutImages.storyPortrait, { width: 500 })}
                        alt="Primary Story Portrait"
                        loading="lazy"
                        decoding="async"
                        className="w-full h-full object-cover object-top"
                      />
                    </div>
                    <div className="sm:col-span-8 space-y-4">
                      <CloudinaryImageUpload
                        label="Change Primary Story Photo (Cloudinary Direct Upload)"
                        folder="images"
                        currentUrl={aboutImages.storyPortrait}
                        onUploaded={async (url) => {
                          await updateAboutImages({ ...aboutImages, storyPortrait: url });
                          showToast('Updated story portrait photo.');
                        }}
                      />
                    </div>
                  </div>
                </div>

                {/* 2. How We Work 3-Column Visuals */}
                <div className="bg-white border border-neutral-200 p-6 sm:p-8 shadow-xs rounded-xs space-y-6">
                  <div className="border-b border-neutral-100 pb-3">
                    <h3 className="font-serif text-lg text-neutral-900 font-medium">
                      2. "How We Work" Philosophy Visuals
                    </h3>
                    <p className="text-xs text-neutral-500">
                      Three artistic visual anchors representing Intimate, Intentional, and Eternal photography principles.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
                    {/* Card 1: Intimate */}
                    <div className="bg-neutral-50/70 border border-neutral-200 rounded-sm p-4 flex flex-col space-y-4 shadow-2xs hover:border-neutral-300 transition-colors">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] tracking-[0.2em] uppercase font-semibold text-neutral-500">
                          Pillar 1: Intimate
                        </span>
                        <span className="text-[9px] uppercase px-1.5 py-0.5 bg-neutral-200 text-neutral-700 rounded-xs">
                          4:5 Ratio
                        </span>
                      </div>
                      <div className="aspect-[4/5] bg-neutral-200 rounded-xs overflow-hidden border border-neutral-200 shadow-inner">
                        <img
                          src={getOptimizedCloudinaryUrl(aboutImages.howWeWork1, { width: 400 })}
                          alt="Pillar 1: Intimate"
                          loading="lazy"
                          decoding="async"
                          className="w-full h-full object-cover object-top"
                        />
                      </div>
                      <div className="pt-1">
                        <CloudinaryImageUpload
                          hidePreview={true}
                          buttonText="Replace Photo"
                          folder="images"
                          currentUrl={aboutImages.howWeWork1}
                          onUploaded={async (url) => {
                            await updateAboutImages({ ...aboutImages, howWeWork1: url });
                            showToast('Updated Intimate pillar photo.');
                          }}
                        />
                      </div>
                    </div>

                    {/* Card 2: Intentional */}
                    <div className="bg-neutral-50/70 border border-neutral-200 rounded-sm p-4 flex flex-col space-y-4 shadow-2xs hover:border-neutral-300 transition-colors">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] tracking-[0.2em] uppercase font-semibold text-neutral-500">
                          Pillar 2: Intentional
                        </span>
                        <span className="text-[9px] uppercase px-1.5 py-0.5 bg-neutral-200 text-neutral-700 rounded-xs">
                          4:5 Ratio
                        </span>
                      </div>
                      <div className="aspect-[4/5] bg-neutral-200 rounded-xs overflow-hidden border border-neutral-200 shadow-inner">
                        <img
                          src={getOptimizedCloudinaryUrl(aboutImages.howWeWork2, { width: 400 })}
                          alt="Pillar 2: Intentional"
                          loading="lazy"
                          decoding="async"
                          className="w-full h-full object-cover object-top"
                        />
                      </div>
                      <div className="pt-1">
                        <CloudinaryImageUpload
                          hidePreview={true}
                          buttonText="Replace Photo"
                          folder="images"
                          currentUrl={aboutImages.howWeWork2}
                          onUploaded={async (url) => {
                            await updateAboutImages({ ...aboutImages, howWeWork2: url });
                            showToast('Updated Intentional pillar photo.');
                          }}
                        />
                      </div>
                    </div>

                    {/* Card 3: Eternal */}
                    <div className="bg-neutral-50/70 border border-neutral-200 rounded-sm p-4 flex flex-col space-y-4 shadow-2xs hover:border-neutral-300 transition-colors">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] tracking-[0.2em] uppercase font-semibold text-neutral-500">
                          Pillar 3: Eternal
                        </span>
                        <span className="text-[9px] uppercase px-1.5 py-0.5 bg-neutral-200 text-neutral-700 rounded-xs">
                          4:5 Ratio
                        </span>
                      </div>
                      <div className="aspect-[4/5] bg-neutral-200 rounded-xs overflow-hidden border border-neutral-200 shadow-inner">
                        <img
                          src={getOptimizedCloudinaryUrl(aboutImages.howWeWork3, { width: 400 })}
                          alt="Pillar 3: Eternal"
                          loading="lazy"
                          decoding="async"
                          className="w-full h-full object-cover object-top"
                        />
                      </div>
                      <div className="pt-1">
                        <CloudinaryImageUpload
                          hidePreview={true}
                          buttonText="Replace Photo"
                          folder="images"
                          currentUrl={aboutImages.howWeWork3}
                          onUploaded={async (url) => {
                            await updateAboutImages({ ...aboutImages, howWeWork3: url });
                            showToast('Updated Eternal pillar photo.');
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* 3. Common Questions FAQ Background */}
                <div className="bg-white border border-neutral-200 p-6 shadow-xs rounded-xs space-y-4">
                  <div className="border-b border-neutral-100 pb-3">
                    <h3 className="font-serif text-base text-neutral-900 font-medium">
                      3. "Common Questions" Atmospheric Background
                    </h3>
                    <p className="text-xs text-neutral-500">
                      The full-bleed background photograph framed behind the FAQ accordion on the About page.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 items-center">
                    <div className="sm:col-span-5 aspect-[16/9] bg-neutral-950 rounded-xs overflow-hidden border border-neutral-200">
                      <img
                        src={getOptimizedCloudinaryUrl(aboutImages.faqBackground, { width: 600 })}
                        alt="FAQ Background Photograph"
                        loading="lazy"
                        decoding="async"
                        className="w-full h-full object-cover object-top"
                      />
                    </div>
                    <div className="sm:col-span-7 space-y-4">
                      <CloudinaryImageUpload
                        label="Change FAQ Background (Cloudinary Direct Upload)"
                        folder="images"
                        currentUrl={aboutImages.faqBackground}
                        onUploaded={async (url) => {
                          await updateAboutImages({ ...aboutImages, faqBackground: url });
                          showToast('Updated FAQ background photo.');
                        }}
                      />
                    </div>
                  </div>
                </div>

                {/* 4. Homepage "Reserve Your Date" CTA Banner Background */}
                <div className="bg-white border border-neutral-200 p-6 shadow-xs rounded-xs space-y-4">
                  <div className="border-b border-neutral-100 pb-3">
                    <h3 className="font-serif text-base text-neutral-900 font-medium">
                      4. Homepage "Reserve Your Date Before It's Gone" CTA Banner
                    </h3>
                    <p className="text-xs text-neutral-500">
                      The full-bleed background photograph framed behind the "Let's Make Something Together" reservation CTA on the homepage.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 items-center">
                    <div className="sm:col-span-5 aspect-[16/9] bg-neutral-950 rounded-xs overflow-hidden border border-neutral-200">
                      <img
                        src={getOptimizedCloudinaryUrl(
                          aboutImages.ctaBackground ||
                            'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=2000&q=85',
                          { width: 600 }
                        )}
                        alt="Homepage CTA Banner Background"
                        loading="lazy"
                        decoding="async"
                        className="w-full h-full object-cover object-center"
                      />
                    </div>
                    <div className="sm:col-span-7 space-y-4">
                      <CloudinaryImageUpload
                        label="Change Homepage CTA Background (Cloudinary Direct Upload)"
                        folder="images"
                        currentUrl={aboutImages.ctaBackground}
                        onUploaded={async (url) => {
                          await updateAboutImages({ ...aboutImages, ctaBackground: url });
                          showToast('Updated Homepage CTA background image.');
                        }}
                      />
                    </div>
                  </div>
                </div>

                {/* 5. Portfolio Showcase Hero Banner ("Stories We've Had the Honour to Tell") */}
                <div className="bg-white border border-neutral-200 p-6 shadow-xs rounded-xs space-y-4">
                  <div className="border-b border-neutral-100 pb-3">
                    <h3 className="font-serif text-base text-neutral-900 font-medium">
                      5. Portfolio Hero Showcase Banner ("Stories We've Had the Honour to Tell")
                    </h3>
                    <p className="text-xs text-neutral-500">
                      The panoramic hero banner featured at the top of the Our Work &amp; Portfolio page.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 items-center">
                    <div className="sm:col-span-5 aspect-[16/9] bg-neutral-950 rounded-xs overflow-hidden border border-neutral-200">
                      <img
                        src={getOptimizedCloudinaryUrl(
                          aboutImages.portfolioHero ||
                            'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=2000&q=85',
                          { width: 600 }
                        )}
                        alt="Portfolio Hero Showcase Banner"
                        loading="lazy"
                        decoding="async"
                        className="w-full h-full object-cover object-center"
                      />
                    </div>
                    <div className="sm:col-span-7 space-y-4">
                      <CloudinaryImageUpload
                        label="Change Portfolio Hero Banner (Cloudinary Direct Upload)"
                        folder="images"
                        currentUrl={aboutImages.portfolioHero}
                        onUploaded={async (url) => {
                          await updateAboutImages({ ...aboutImages, portfolioHero: url });
                          showToast('Updated Portfolio hero banner image.');
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB: PRICING */}
            {activeTab === 'pricing' && (
              <div className="space-y-6">
                <div className="bg-white border border-neutral-200 p-6 shadow-xs rounded-xs flex items-center justify-between">
                  <div>
                    <h2 className="font-serif text-xl text-neutral-900">
                      Wedding Packages & Collections
                    </h2>
                    <p className="text-xs text-neutral-500">
                      Manage rates, included items, and highlight popular collections.
                    </p>
                  </div>
                  <button
                    onClick={() => setNewPricingModal(true)}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-neutral-900 hover:bg-neutral-800 text-white text-xs uppercase tracking-wider rounded-xs cursor-pointer transition-colors"
                  >
                    <Plus size={14} />
                    <span>Add Package</span>
                  </button>
                </div>

                {/* Existing Packages Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {pricingPackages.map((pkg) => (
                    <div
                      key={pkg.id}
                      className={`bg-white p-6 border rounded-xs shadow-xs space-y-4 flex flex-col justify-between ${
                        pkg.isPopular ? 'border-neutral-900' : 'border-neutral-200'
                      }`}
                    >
                      <div>
                        <div className="flex items-start justify-between">
                          <div>
                            <span className="text-[10px] tracking-wider uppercase text-neutral-400">
                              {pkg.coverage}
                            </span>
                            <h3 className="font-serif text-lg text-neutral-900 mt-0.5">
                              {pkg.name}
                            </h3>
                          </div>
                          {pkg.badge && (
                            <span className="text-[9px] uppercase tracking-widest bg-neutral-900 text-white px-2 py-0.5 rounded-xs">
                              {pkg.badge}
                            </span>
                          )}
                        </div>

                        <div className="text-xl font-serif text-neutral-900 my-3">
                          {pkg.price}
                        </div>

                        <ul className="space-y-1.5 text-xs text-neutral-600 pt-2 border-t border-neutral-100">
                          {pkg.features.map((feat, i) => (
                            <li key={i} className="flex items-start gap-1.5">
                              <Check size={13} className="text-emerald-600 mt-0.5 shrink-0" />
                              <span>{feat}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="pt-4 border-t border-neutral-100 flex items-center justify-between">
                        <button
                          onClick={() => setEditingPricingPkg({ ...pkg })}
                          className="text-xs uppercase tracking-wider text-neutral-800 hover:text-black font-medium underline cursor-pointer"
                        >
                          Edit Details
                        </button>

                        <button
                          onClick={() => {
                            requestDeleteConfirm(
                              'Delete Package',
                              `Are you sure you want to remove the "${pkg.name}" collection?`,
                              async () => {
                                await deletePricingPackage(pkg.id);
                                showToast('Package removed.');
                              }
                            );
                          }}
                          className="text-xs uppercase tracking-wider text-rose-600 hover:text-rose-800 cursor-pointer"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB: TEAM */}
            {activeTab === 'team' && (
              <div className="space-y-6">
                <div className="bg-white border border-neutral-200 p-6 shadow-xs rounded-xs flex items-center justify-between">
                  <div>
                    <h2 className="font-serif text-xl text-neutral-900">
                      Studio Team & Artisans
                    </h2>
                    <p className="text-xs text-neutral-500">
                      Manage team members, roles, and creative bios.
                    </p>
                  </div>
                  <button
                    onClick={() => setNewTeamModal(true)}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-neutral-900 hover:bg-neutral-800 text-white text-xs uppercase tracking-wider rounded-xs cursor-pointer transition-colors"
                  >
                    <Plus size={14} />
                    <span>Add Member</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {teamMembers.map((member) => (
                    <div
                      key={member.id}
                      className="bg-white border border-neutral-200 rounded-xs overflow-hidden shadow-xs flex flex-col justify-between"
                    >
                      <div>
                        <div className="aspect-[4/5] bg-neutral-900 overflow-hidden flex items-center justify-center">
                          <img
                            src={getOptimizedCloudinaryUrl(member.imageUrl, { width: 400 })}
                            alt={member.name}
                            loading="lazy"
                            decoding="async"
                            className="w-full h-full object-contain grayscale"
                          />
                        </div>
                        <div className="p-4">
                          <span className="text-[10px] tracking-wider uppercase text-neutral-400">
                            {member.role}
                          </span>
                          <h4 className="font-serif text-base text-neutral-900 mt-0.5">
                            {member.name}
                          </h4>
                          <p className="text-xs text-neutral-500 mt-2 line-clamp-3 leading-relaxed">
                            {member.bio}
                          </p>
                        </div>
                      </div>

                      <div className="p-4 pt-0 flex gap-2">
                        <button
                          onClick={() => setEditingTeamMember({ ...member })}
                          className="flex-1 py-1.5 text-center text-xs text-neutral-700 hover:bg-neutral-100 border border-neutral-200 rounded-xs uppercase tracking-wider cursor-pointer"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => {
                            requestDeleteConfirm(
                              'Remove Team Member',
                              `Are you sure you want to remove artisan "${member.name}"?`,
                              async () => {
                                await deleteTeamMember(member.id);
                                showToast('Member removed.');
                              }
                            );
                          }}
                          className="py-1.5 px-3 text-center text-xs text-rose-600 hover:bg-rose-50 border border-rose-200 rounded-xs uppercase tracking-wider cursor-pointer"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB: TESTIMONIALS */}
            {activeTab === 'testimonials' && (
              <div className="space-y-6">
                <div className="bg-white border border-neutral-200 p-6 shadow-xs rounded-xs flex items-center justify-between">
                  <div>
                    <h2 className="font-serif text-xl text-neutral-900">
                      Kind Words & Reviews
                    </h2>
                    <p className="text-xs text-neutral-500">
                      Quotes and praise from brides and couples.
                    </p>
                  </div>
                  <button
                    onClick={() => setNewTestimonialModal(true)}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-neutral-900 hover:bg-neutral-800 text-white text-xs uppercase tracking-wider rounded-xs cursor-pointer transition-colors"
                  >
                    <Plus size={14} />
                    <span>Add Review</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  {testimonials.map((test, idx) => (
                    <div
                      key={test.id || idx}
                      className="bg-white border border-neutral-200 p-6 rounded-xs shadow-xs flex flex-col justify-between space-y-4"
                    >
                      <p className="font-serif italic text-neutral-700 text-sm leading-relaxed">
                        {test.quote}
                      </p>
                      <div className="pt-4 border-t border-neutral-100 flex items-center justify-between">
                        <span className="text-[10px] tracking-[0.2em] uppercase font-semibold text-neutral-500">
                          {test.authors}
                        </span>
                        <div className="flex gap-2">
                          <button
                            onClick={() => setEditingTestimonial({ ...test })}
                            className="text-xs text-neutral-500 hover:text-black p-1 cursor-pointer"
                            title="Edit"
                          >
                            <Edit2 size={13} />
                          </button>
                          <button
                            onClick={() => {
                              requestDeleteConfirm(
                                'Delete Review',
                                `Delete the review from ${test.authors}?`,
                                async () => {
                                  await deleteTestimonial(test.id || idx);
                                  showToast('Review deleted.');
                                }
                              );
                            }}
                            className="text-xs text-rose-600 hover:text-rose-800 p-1 cursor-pointer"
                            title="Delete"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB: FAQS */}
            {activeTab === 'faqs' && (
              <div className="space-y-6">
                <div className="bg-white border border-neutral-200 p-6 shadow-xs rounded-xs flex items-center justify-between">
                  <div>
                    <h2 className="font-serif text-xl text-neutral-900">
                      Frequently Asked Questions
                    </h2>
                    <p className="text-xs text-neutral-500">
                      Questions displayed on the About page accordion.
                    </p>
                  </div>
                  <button
                    onClick={() => setNewFaqModal(true)}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-neutral-900 hover:bg-neutral-800 text-white text-xs uppercase tracking-wider rounded-xs cursor-pointer transition-colors"
                  >
                    <Plus size={14} />
                    <span>Add Question</span>
                  </button>
                </div>

                <div className="space-y-4">
                  {faqItems.map((faq) => (
                    <div
                      key={faq.id}
                      className="bg-white border border-neutral-200 p-5 rounded-xs shadow-xs space-y-2"
                    >
                      <div className="flex items-start justify-between">
                        <h4 className="font-serif text-base text-neutral-900 font-normal">
                          {faq.question}
                        </h4>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setEditingFaq({ ...faq })}
                            className="text-neutral-500 hover:text-black cursor-pointer p-1"
                            title="Edit Question"
                          >
                            <Edit2 size={13} />
                          </button>
                          <button
                            onClick={() => {
                              requestDeleteConfirm(
                                'Delete FAQ',
                                `Delete question: "${faq.question}"?`,
                                async () => {
                                  await deleteFaqItem(faq.id);
                                  showToast('FAQ deleted.');
                                }
                              );
                            }}
                            className="text-neutral-400 hover:text-rose-600 cursor-pointer p-1"
                            title="Delete"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                      <p className="text-xs text-neutral-600 leading-relaxed font-sans">
                        {faq.answer}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB: STUDIO INFO */}
            {activeTab === 'studio' && (
              <div className="bg-white border border-neutral-200 p-6 sm:p-8 shadow-xs rounded-xs space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="font-serif text-xl text-neutral-900">
                      Studio & Contact Settings
                    </h2>
                    <p className="text-xs text-neutral-500">
                      Lead contact information shown in the footer and contact sections.
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setStudioForm(studioInfo);
                      setStudioModalOpen(true);
                    }}
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-neutral-900 hover:bg-neutral-800 text-white text-xs uppercase tracking-wider rounded-xs cursor-pointer transition-colors"
                  >
                    <Edit2 size={13} />
                    <span>Edit Studio Details</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-neutral-700">
                  <div className="p-4 bg-neutral-50 border border-neutral-200 rounded-xs">
                    <span className="text-[10px] uppercase tracking-wider text-neutral-400 block mb-1">
                      Lead Name
                    </span>
                    <span className="font-serif text-base text-neutral-900">{studioInfo.name}</span>
                  </div>
                  <div className="p-4 bg-neutral-50 border border-neutral-200 rounded-xs">
                    <span className="text-[10px] uppercase tracking-wider text-neutral-400 block mb-1">
                      Phone Number
                    </span>
                    <span className="text-neutral-900 font-medium">{studioInfo.phone}</span>
                  </div>
                  <div className="p-4 bg-neutral-50 border border-neutral-200 rounded-xs">
                    <span className="text-[10px] uppercase tracking-wider text-neutral-400 block mb-1">
                      Email Address
                    </span>
                    <span className="text-neutral-900 font-medium">{studioInfo.email}</span>
                  </div>
                  <div className="p-4 bg-neutral-50 border border-neutral-200 rounded-xs">
                    <span className="text-[10px] uppercase tracking-wider text-neutral-400 block mb-1">
                      Physical Address
                    </span>
                    <span className="text-neutral-900 font-medium">{studioInfo.address}</span>
                  </div>
                </div>
              </div>
            )}

            {/* TAB: ENQUIRIES */}
            {activeTab === 'enquiries' && (
              <div className="space-y-6">
                <div className="bg-white border border-neutral-200 p-6 shadow-xs rounded-xs flex items-center justify-between">
                  <div>
                    <h2 className="font-serif text-xl text-neutral-900">
                      Client Enquiries & Leads Inbox
                    </h2>
                    <p className="text-xs text-neutral-500">
                      Wedding booking inquiries submitted via the Contact page.
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={async () => {
                        await reloadData();
                        showToast('Inbox synced with Supabase.');
                      }}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-neutral-200 hover:border-neutral-900 text-neutral-700 hover:text-black rounded-xs text-xs tracking-wider uppercase transition-colors cursor-pointer"
                      title="Sync latest enquiries from Supabase"
                    >
                      <RotateCcw size={12} />
                      <span>Sync</span>
                    </button>
                    <span className="text-xs font-semibold px-2.5 py-1 bg-neutral-100 rounded-xs text-neutral-800">
                      Total: {enquiries.length}
                    </span>
                  </div>
                </div>

                {enquiries.length === 0 ? (
                  <div className="bg-white border border-neutral-200 p-12 text-center text-xs text-neutral-400">
                    No inquiries received yet.
                  </div>
                ) : (
                  <div className="space-y-4">
                    {enquiries.map((lead) => (
                      <div
                        key={lead.id}
                        className={`bg-white border p-6 rounded-xs shadow-xs space-y-4 transition-all ${
                          lead.isRead ? 'border-neutral-200' : 'border-neutral-900 bg-neutral-50/40'
                        }`}
                      >
                        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-neutral-100 pb-3">
                          <div>
                            <span className="font-serif text-lg text-neutral-900 font-normal">
                              {lead.name}
                            </span>
                            <span className="ml-3 text-xs text-neutral-500">
                              <a href={`mailto:${lead.email}`} className="underline hover:text-black">
                                {lead.email}
                              </a>
                            </span>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="text-[10px] uppercase tracking-wider text-neutral-400">
                              {new Date(lead.createdAt).toLocaleDateString()}
                            </span>
                            {!lead.isRead && (
                              <span className="text-[9px] uppercase tracking-wider bg-neutral-900 text-white px-2 py-0.5 rounded-xs">
                                New Lead
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs text-neutral-600 font-sans">
                          <div>
                            <span className="text-[10px] uppercase tracking-wider text-neutral-400 block">
                              Event Date
                            </span>
                            <span>{lead.eventDate || 'Not specified'}</span>
                          </div>
                          <div>
                            <span className="text-[10px] uppercase tracking-wider text-neutral-400 block">
                              Location
                            </span>
                            <span>{lead.eventLocation || 'Not specified'}</span>
                          </div>
                          <div>
                            <span className="text-[10px] uppercase tracking-wider text-neutral-400 block">
                              Desired Coverage
                            </span>
                            <span className="font-medium text-neutral-900">
                              {lead.coverageType || 'General Enquiry'}
                            </span>
                          </div>
                        </div>

                        <div className="p-3.5 bg-neutral-100/60 rounded-xs text-xs text-neutral-800 leading-relaxed font-sans">
                          {lead.message}
                        </div>

                        <div className="flex items-center justify-between pt-1 text-xs">
                          <span className="text-[11px] text-neutral-400">
                            Referred by: {lead.referralSource || 'Direct'}
                          </span>
                          <div className="flex items-center gap-3">
                            {!lead.isRead && (
                              <button
                                onClick={async () => {
                                  await markEnquiryRead(lead.id);
                                  showToast('Marked as read.');
                                }}
                                className="text-xs uppercase tracking-wider text-neutral-700 hover:text-black underline cursor-pointer"
                              >
                                Mark Read
                              </button>
                            )}
                            <button
                              onClick={() => {
                                requestDeleteConfirm(
                                  'Delete Client Enquiry',
                                  `Are you sure you want to permanently delete the inquiry from "${lead.name}"?`,
                                  async () => {
                                    await deleteEnquiry(lead.id);
                                    showToast('Inquiry deleted.');
                                  }
                                );
                              }}
                              className="text-xs text-rose-600 hover:text-rose-800 cursor-pointer"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* TAB: BOOKINGS */}
            {activeTab === 'bookings' && (
              <div className="space-y-6">
                <div className="bg-white border border-neutral-200 p-6 shadow-xs rounded-xs flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <h2 className="font-serif text-xl text-neutral-900">
                      Wedding Package Bookings
                    </h2>
                    <p className="text-xs text-neutral-500">
                      Confirmed & pending reservations submitted via the package booking modal.
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={async () => {
                        try {
                          setIsSyncingSheet(true);
                          // 1. Directly fetch latest bookings from Supabase database table
                          const freshBookings = await fetchBookingsFromDB();
                          // 2. Sync all fresh database records to Google Sheet
                          await syncAllBookingsToGoogleSheet(freshBookings);
                          showToast(`Synced ${freshBookings.length} bookings from Supabase to Google Sheet!`);
                        } catch (err: any) {
                          alert(err.message || 'Failed to sync to Google Sheet.');
                        } finally {
                          setIsSyncingSheet(false);
                        }
                      }}
                      disabled={isSyncingSheet}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xs text-xs tracking-wider uppercase transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                      title="Directly fetch from Supabase and push to Google Sheet"
                    >
                      <FileSpreadsheet size={13} />
                      <span>{isSyncingSheet ? 'Syncing...' : 'Sync to Google Sheet'}</span>
                    </button>
                    <a
                      href={import.meta.env.VITE_GOOGLE_SHEETS_DOC_URL || 'https://docs.google.com/spreadsheets/d/1Uwclnw1SAX0EIqMmT_sldCCkq4rVn6ML_ugztKS9wbI/edit?usp=sharing'}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-emerald-700 text-emerald-800 hover:bg-emerald-50 rounded-xs text-xs tracking-wider uppercase transition-colors cursor-pointer font-medium"
                      title="Open Google Sheet in new tab"
                    >
                      <ExternalLink size={12} />
                      <span>Open Sheet</span>
                    </a>
                    <button
                      onClick={async () => {
                        const fresh = await fetchBookingsFromDB();
                        showToast(`Loaded ${fresh.length} bookings directly from Supabase.`);
                      }}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-neutral-200 hover:border-neutral-900 text-neutral-700 hover:text-black rounded-xs text-xs tracking-wider uppercase transition-colors cursor-pointer"
                      title="Fetch latest bookings directly from Supabase database table"
                    >
                      <RotateCcw size={12} />
                      <span>Refresh</span>
                    </button>
                    <span className="text-xs font-semibold px-2.5 py-1 bg-neutral-100 rounded-xs text-neutral-800">
                      Total: {bookings.length}
                    </span>
                  </div>
                </div>

                {bookings.length === 0 ? (
                  <div className="bg-white border border-neutral-200 p-12 text-center text-xs text-neutral-400">
                    No bookings received yet. When clients book a package on the pricing page, their reservation will appear here.
                  </div>
                ) : (
                  <div className="space-y-4">
                    {bookings.map((booking) => {
                      const statusColors: Record<BookingStatus, string> = {
                        pending: 'bg-amber-100 text-amber-900 border-amber-300',
                        confirmed: 'bg-emerald-100 text-emerald-900 border-emerald-300',
                        cancelled: 'bg-rose-100 text-rose-900 border-rose-300',
                        completed: 'bg-neutral-100 text-neutral-900 border-neutral-300',
                      };

                      return (
                        <div
                          key={booking.id}
                          className="bg-white border border-neutral-200 p-6 rounded-xs shadow-xs space-y-4 transition-all hover:border-neutral-300"
                        >
                          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-neutral-100 pb-3">
                            <div className="flex items-center gap-3">
                              <span className="font-serif text-lg text-neutral-900 font-normal">
                                {booking.name}
                              </span>
                              <span className="text-xs text-neutral-500">
                                <a href={`mailto:${booking.email}`} className="underline hover:text-black">
                                  {booking.email}
                                </a>
                              </span>
                              {booking.phone && (
                                <span className="text-xs text-neutral-500">
                                  <a href={`tel:${booking.phone}`} className="underline hover:text-black">
                                    {booking.phone}
                                  </a>
                                </span>
                              )}
                            </div>
                            <div className="flex items-center gap-3">
                              <span className="text-[10px] uppercase tracking-wider text-neutral-400">
                                {new Date(booking.createdAt).toLocaleDateString()}
                              </span>
                              <span
                                className={`text-[10px] uppercase tracking-wider font-medium px-2.5 py-0.5 rounded-xs border ${
                                  statusColors[booking.status] || 'bg-neutral-100 text-neutral-800'
                                }`}
                              >
                                {booking.status}
                              </span>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs text-neutral-600 font-sans">
                            <div>
                              <span className="text-[10px] uppercase tracking-wider text-neutral-400 block">
                                Booked Package
                              </span>
                              <span className="font-medium text-neutral-900">{booking.package}</span>
                            </div>
                            <div>
                              <span className="text-[10px] uppercase tracking-wider text-neutral-400 block">
                                Event Date
                              </span>
                              <span>{booking.eventDate || 'Not specified'}</span>
                            </div>
                            <div>
                              <span className="text-[10px] uppercase tracking-wider text-neutral-400 block">
                                Location / Venue
                              </span>
                              <span>{booking.eventLocation || 'Not specified'}</span>
                            </div>
                            <div>
                              <span className="text-[10px] uppercase tracking-wider text-neutral-400 block">
                                Change Status
                              </span>
                              <select
                                value={booking.status}
                                onChange={async (e) => {
                                  const newStatus = e.target.value as BookingStatus;
                                  await updateBookingStatus(booking.id, newStatus);
                                  showToast(`Booking status updated to ${newStatus}.`);
                                }}
                                className="bg-transparent border-b border-neutral-300 py-0.5 text-xs text-neutral-900 outline-none cursor-pointer"
                              >
                                <option value="pending">Pending</option>
                                <option value="confirmed">Confirmed</option>
                                <option value="cancelled">Cancelled</option>
                                <option value="completed">Completed</option>
                              </select>
                            </div>
                          </div>

                          {booking.remarks && (
                            <div className="p-3 bg-neutral-50 border border-neutral-100 rounded-xs text-xs text-neutral-700 leading-relaxed font-sans">
                              <span className="font-medium text-neutral-900">Remarks: </span>
                              {booking.remarks}
                            </div>
                          )}

                          <div className="flex items-center justify-between pt-1 text-xs border-t border-neutral-100">
                            <div className="flex items-center gap-4 text-xs">
                              <a
                                href={`mailto:${booking.email}?subject=Wedding Booking Confirmation - Cam-Mystery Studio`}
                                className="inline-flex items-center gap-1 text-neutral-600 hover:text-black underline"
                              >
                                <Mail size={12} />
                                <span>Email Client</span>
                              </a>
                              {booking.phone && (
                                <a
                                  href={`tel:${booking.phone}`}
                                  className="inline-flex items-center gap-1 text-neutral-600 hover:text-black underline"
                                >
                                  <Phone size={12} />
                                  <span>Call Client</span>
                                </a>
                              )}
                            </div>
                            <div className="flex items-center gap-4">
                              <button
                                onClick={() => setSelectedBookingDetail(booking)}
                                className="inline-flex items-center gap-1 text-xs uppercase tracking-wider text-neutral-700 hover:text-black underline cursor-pointer"
                              >
                                <Eye size={12} />
                                <span>View Details</span>
                              </button>
                              <button
                                onClick={() => {
                                  requestDeleteConfirm(
                                    'Delete Booking Record',
                                    `Are you sure you want to permanently delete the reservation from "${booking.name}" for "${booking.package}"? This will free up the date on the calendar.`,
                                    async () => {
                                      await deleteBooking(booking.id);
                                      showToast('Booking deleted and date released.');
                                    }
                                  );
                                }}
                                className="text-xs text-rose-600 hover:text-rose-800 cursor-pointer"
                              >
                                Delete
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* MODALS: ALL FORMS (ADD, UPLOAD, AND UPDATE) OPEN CLEANLY IN POPUP MODALS */}
      {/* ========================================================================= */}

      {/* 0. Modal: Booking Complete Details */}
      {selectedBookingDetail && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={() => setSelectedBookingDetail(null)}
        >
          <div
            className="bg-white border border-neutral-200 p-6 sm:p-8 rounded-sm shadow-2xl max-w-lg w-full space-y-5 animate-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
              <div>
                <span className="text-[10px] tracking-wider uppercase text-neutral-400 block font-medium">
                  Reservation Details
                </span>
                <h3 className="font-serif text-xl text-neutral-900 font-normal">
                  {selectedBookingDetail.name}
                </h3>
              </div>
              <button
                onClick={() => setSelectedBookingDetail(null)}
                className="text-neutral-400 hover:text-black p-1 cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-4 text-xs text-neutral-700 font-sans">
              <div className="grid grid-cols-2 gap-4 p-4 bg-neutral-50 border border-neutral-100 rounded-xs">
                <div>
                  <span className="text-[10px] uppercase tracking-wider text-neutral-400 block">
                    Booked Package
                  </span>
                  <span className="font-medium text-neutral-900 text-sm">
                    {selectedBookingDetail.package}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] uppercase tracking-wider text-neutral-400 block">
                    Current Status
                  </span>
                  <span className="uppercase text-[11px] font-semibold text-neutral-900">
                    {selectedBookingDetail.status}
                  </span>
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <span className="text-[10px] uppercase tracking-wider text-neutral-400 block">
                    Email Address
                  </span>
                  <a
                    href={`mailto:${selectedBookingDetail.email}`}
                    className="text-neutral-900 underline hover:text-black font-medium"
                  >
                    {selectedBookingDetail.email}
                  </a>
                </div>

                <div>
                  <span className="text-[10px] uppercase tracking-wider text-neutral-400 block">
                    Mobile Number
                  </span>
                  <a
                    href={`tel:${selectedBookingDetail.phone}`}
                    className="text-neutral-900 underline hover:text-black font-medium"
                  >
                    {selectedBookingDetail.phone}
                  </a>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-neutral-400 block">
                      Event Date
                    </span>
                    <span className="text-neutral-900 font-medium">
                      {selectedBookingDetail.eventDate}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-neutral-400 block">
                      Location / Venue
                    </span>
                    <span className="text-neutral-900 font-medium">
                      {selectedBookingDetail.eventLocation}
                    </span>
                  </div>
                </div>

                <div>
                  <span className="text-[10px] uppercase tracking-wider text-neutral-400 block">
                    Submitted Date & Time
                  </span>
                  <span className="text-neutral-600">
                    {new Date(selectedBookingDetail.createdAt).toLocaleString()}
                  </span>
                </div>

                <div>
                  <span className="text-[10px] uppercase tracking-wider text-neutral-400 block mb-1">
                    Remarks / Client Notes
                  </span>
                  <div className="p-3 bg-neutral-100/70 rounded-xs text-neutral-800 leading-relaxed">
                    {selectedBookingDetail.remarks || 'No remarks provided by client.'}
                  </div>
                </div>
              </div>

              {/* Status Update directly in detail modal */}
              <div className="pt-3 border-t border-neutral-100 flex items-center justify-between">
                <span className="text-[10px] uppercase tracking-wider text-neutral-500 font-medium">
                  Update Status:
                </span>
                <div className="flex gap-1.5">
                  {(['pending', 'confirmed', 'cancelled', 'completed'] as BookingStatus[]).map((st) => (
                    <button
                      key={st}
                      onClick={async () => {
                        await updateBookingStatus(selectedBookingDetail.id, st);
                        setSelectedBookingDetail({
                          ...selectedBookingDetail,
                          status: st,
                        });
                        showToast(`Status changed to ${st}.`);
                      }}
                      className={`px-2.5 py-1 text-[10px] tracking-wider uppercase rounded-xs transition-colors cursor-pointer ${
                        selectedBookingDetail.status === st
                          ? 'bg-neutral-900 text-white font-medium'
                          : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-neutral-100">
              <button
                type="button"
                onClick={() => {
                  const bookingToDelete = selectedBookingDetail;
                  requestDeleteConfirm(
                    'Delete Booking Record',
                    `Are you sure you want to permanently delete the reservation from "${bookingToDelete.name}" for "${bookingToDelete.package}"? This will free up the date on the calendar.`,
                    async () => {
                      await deleteBooking(bookingToDelete.id);
                      setSelectedBookingDetail(null);
                      showToast('Booking deleted and date released.');
                    }
                  );
                }}
                className="inline-flex items-center gap-1.5 text-xs text-rose-600 hover:text-rose-800 transition-colors cursor-pointer"
              >
                <Trash2 size={13} />
                <span>Delete Booking</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedBookingDetail(null)}
                className="px-5 py-2 text-xs tracking-wider uppercase bg-neutral-950 text-white hover:bg-neutral-800 rounded-xs transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 0A. Modal: Add New Wedding Project */}
      {newProjectModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white border border-neutral-200 p-6 sm:p-8 rounded-sm shadow-2xl max-w-2xl w-full space-y-5 animate-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
              <div>
                <span className="text-[10px] tracking-wider uppercase text-neutral-400 font-medium">
                  PORTFOLIO STORIES
                </span>
                <h3 className="font-serif text-xl text-neutral-900 font-normal">
                  Create New Wedding Project
                </h3>
              </div>
              <button
                onClick={() => setNewProjectModal(false)}
                className="text-neutral-400 hover:text-neutral-700 p-1 cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-neutral-600 mb-1">
                    Couple Names *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Vikram & Radhika"
                    value={newProjectForm.coupleNames}
                    onChange={(e) =>
                      setNewProjectForm({ ...newProjectForm, coupleNames: e.target.value })
                    }
                    className="w-full text-xs px-3 py-2 border border-neutral-300 rounded-xs focus:border-neutral-900 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-neutral-600 mb-1">
                    Project Story Title *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. The Royal Heritage Vivah"
                    value={newProjectForm.title}
                    onChange={(e) =>
                      setNewProjectForm({ ...newProjectForm, title: e.target.value })
                    }
                    className="w-full text-xs px-3 py-2 border border-neutral-300 rounded-xs focus:border-neutral-900 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-neutral-600 mb-1">
                    Location
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Udaipur, Rajasthan"
                    value={newProjectForm.location || ''}
                    onChange={(e) =>
                      setNewProjectForm({ ...newProjectForm, location: e.target.value })
                    }
                    className="w-full text-xs px-3 py-2 border border-neutral-300 rounded-xs focus:border-neutral-900 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-neutral-600 mb-1">
                    Date / Season
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. December 2025"
                    value={newProjectForm.date || ''}
                    onChange={(e) =>
                      setNewProjectForm({ ...newProjectForm, date: e.target.value })
                    }
                    className="w-full text-xs px-3 py-2 border border-neutral-300 rounded-xs focus:border-neutral-900 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-neutral-600 mb-1">
                  Story Description
                </label>
                <textarea
                  rows={3}
                  placeholder="Share details about the ceremony, vibe, rituals, and unforgettable moments..."
                  value={newProjectForm.description || ''}
                  onChange={(e) =>
                    setNewProjectForm({ ...newProjectForm, description: e.target.value })
                  }
                  className="w-full text-xs px-3 py-2 border border-neutral-300 rounded-xs focus:border-neutral-900 outline-none"
                />
              </div>

              {/* Cover Photo Upload */}
              <CloudinaryImageUpload
                label="Main Project Cover Image *"
                folder="images"
                currentUrl={newProjectForm.coverImage}
                onUploaded={(url) => setNewProjectForm({ ...newProjectForm, coverImage: url })}
              />

              {/* Multiple Gallery Photos for the Wedding Project */}
              <div className="pt-3 border-t border-neutral-100 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="block text-xs uppercase tracking-wider text-neutral-700 font-semibold">
                    Wedding &amp; Couple Photos ({newProjectForm.images.length})
                  </label>
                  <span className="text-[10px] text-neutral-400">
                    Upload ceremonies, couple portraits, pheras, &amp; rituals
                  </span>
                </div>

                <CloudinaryImageUpload
                  label="Upload Additional Wedding Photo"
                  folder="images"
                  currentUrl=""
                  onUploaded={(url) => {
                    if (url) {
                      setNewProjectForm((prev) => ({
                        ...prev,
                        images: [...prev.images, url],
                      }));
                      showToast('Photo added to project gallery.');
                    }
                  }}
                />

                {/* Thumbnail strip of added images */}
                {newProjectForm.images.length > 0 && (
                  <div className="grid grid-cols-4 sm:grid-cols-6 gap-2 pt-2">
                    {newProjectForm.images.map((imgUrl, idx) => (
                      <div key={idx} className="relative aspect-square bg-neutral-100 rounded-xs overflow-hidden group">
                        <img
                          src={getOptimizedCloudinaryUrl(imgUrl, { width: 200 })}
                          alt={`Photo ${idx + 1}`}
                          loading="lazy"
                          decoding="async"
                          className="w-full h-full object-cover object-top"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            setNewProjectForm((prev) => ({
                              ...prev,
                              images: prev.images.filter((_, i) => i !== idx),
                            }));
                          }}
                          className="absolute top-1 right-1 bg-black/70 hover:bg-rose-600 text-white p-1 rounded-full text-xs transition-colors cursor-pointer"
                          title="Remove Photo"
                        >
                          <X size={10} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-neutral-100">
              <button
                onClick={() => setNewProjectModal(false)}
                className="px-4 py-2 border border-neutral-300 text-neutral-700 text-xs uppercase tracking-wider rounded-xs hover:bg-neutral-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  if (!newProjectForm.coupleNames || !newProjectForm.title || !newProjectForm.coverImage) {
                    alert('Please provide couple names, project title, and a cover image.');
                    return;
                  }
                  const newProj: WeddingProject = {
                    id: `proj-${Date.now()}`,
                    title: newProjectForm.title,
                    coupleNames: newProjectForm.coupleNames,
                    location: newProjectForm.location,
                    date: newProjectForm.date,
                    coverImage: newProjectForm.coverImage,
                    description: newProjectForm.description,
                    images: newProjectForm.images.length > 0 ? newProjectForm.images : [newProjectForm.coverImage],
                  };
                  await addWeddingProject(newProj);
                  setNewProjectModal(false);
                  showToast('Wedding project created successfully.');
                }}
                className="px-5 py-2 bg-neutral-900 hover:bg-neutral-800 text-white text-xs uppercase tracking-wider rounded-xs cursor-pointer font-medium"
              >
                Create Project
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 0B. Modal: Edit Existing Wedding Project */}
      {editingProject && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white border border-neutral-200 p-6 sm:p-8 rounded-sm shadow-2xl max-w-2xl w-full space-y-5 animate-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
              <div>
                <span className="text-[10px] tracking-wider uppercase text-neutral-400 font-medium">
                  EDIT PROJECT
                </span>
                <h3 className="font-serif text-xl text-neutral-900 font-normal">
                  {editingProject.coupleNames}
                </h3>
              </div>
              <button
                onClick={() => setEditingProject(null)}
                className="text-neutral-400 hover:text-neutral-700 p-1 cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-neutral-600 mb-1">
                    Couple Names *
                  </label>
                  <input
                    type="text"
                    value={editingProject.coupleNames}
                    onChange={(e) =>
                      setEditingProject({ ...editingProject, coupleNames: e.target.value })
                    }
                    className="w-full text-xs px-3 py-2 border border-neutral-300 rounded-xs focus:border-neutral-900 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-neutral-600 mb-1">
                    Project Story Title *
                  </label>
                  <input
                    type="text"
                    value={editingProject.title}
                    onChange={(e) =>
                      setEditingProject({ ...editingProject, title: e.target.value })
                    }
                    className="w-full text-xs px-3 py-2 border border-neutral-300 rounded-xs focus:border-neutral-900 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-neutral-600 mb-1">
                    Location
                  </label>
                  <input
                    type="text"
                    value={editingProject.location || ''}
                    onChange={(e) =>
                      setEditingProject({ ...editingProject, location: e.target.value })
                    }
                    className="w-full text-xs px-3 py-2 border border-neutral-300 rounded-xs focus:border-neutral-900 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-neutral-600 mb-1">
                    Date / Season
                  </label>
                  <input
                    type="text"
                    value={editingProject.date || ''}
                    onChange={(e) =>
                      setEditingProject({ ...editingProject, date: e.target.value })
                    }
                    className="w-full text-xs px-3 py-2 border border-neutral-300 rounded-xs focus:border-neutral-900 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-neutral-600 mb-1">
                  Story Description
                </label>
                <textarea
                  rows={3}
                  value={editingProject.description || ''}
                  onChange={(e) =>
                    setEditingProject({ ...editingProject, description: e.target.value })
                  }
                  className="w-full text-xs px-3 py-2 border border-neutral-300 rounded-xs focus:border-neutral-900 outline-none"
                />
              </div>

              {/* Cover Photo */}
              <CloudinaryImageUpload
                label="Cover Image *"
                folder="images"
                currentUrl={editingProject.coverImage}
                onUploaded={(url) => setEditingProject({ ...editingProject, coverImage: url })}
              />

              {/* Additional Photos */}
              <div className="pt-3 border-t border-neutral-100 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="block text-xs uppercase tracking-wider text-neutral-700 font-semibold">
                    Wedding &amp; Couple Photos ({editingProject.images?.length || 0})
                  </label>
                  <span className="text-[10px] text-neutral-400">
                    Upload ceremonies, portraits, &amp; celebration pictures
                  </span>
                </div>

                <CloudinaryImageUpload
                  label="Upload Additional Photo to Project"
                  folder="images"
                  currentUrl=""
                  onUploaded={(url) => {
                    if (url) {
                      setEditingProject((prev) =>
                        prev ? { ...prev, images: [...(prev.images || []), url] } : prev
                      );
                      showToast('Photo added to wedding gallery.');
                    }
                  }}
                />

                {/* Thumbnail strip of existing photos */}
                {editingProject.images && editingProject.images.length > 0 && (
                  <div className="grid grid-cols-4 sm:grid-cols-6 gap-2 pt-2">
                    {editingProject.images.map((imgUrl, idx) => (
                      <div key={idx} className="relative aspect-square bg-neutral-100 rounded-xs overflow-hidden group">
                        <img
                          src={getOptimizedCloudinaryUrl(imgUrl, { width: 200 })}
                          alt={`Photo ${idx + 1}`}
                          loading="lazy"
                          decoding="async"
                          className="w-full h-full object-cover object-top"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            setEditingProject((prev) =>
                              prev
                                ? { ...prev, images: prev.images.filter((_, i) => i !== idx) }
                                : prev
                            );
                          }}
                          className="absolute top-1 right-1 bg-black/70 hover:bg-rose-600 text-white p-1 rounded-full text-xs transition-colors cursor-pointer"
                          title="Remove Photo"
                        >
                          <X size={10} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-neutral-100">
              <button
                onClick={() => setEditingProject(null)}
                className="px-4 py-2 border border-neutral-300 text-neutral-700 text-xs uppercase tracking-wider rounded-xs hover:bg-neutral-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  if (!editingProject.coupleNames || !editingProject.title || !editingProject.coverImage) {
                    alert('Please provide couple names, project title, and a cover image.');
                    return;
                  }
                  await updateWeddingProject(editingProject);
                  setEditingProject(null);
                  showToast('Wedding project updated.');
                }}
                className="px-5 py-2 bg-neutral-900 hover:bg-neutral-800 text-white text-xs uppercase tracking-wider rounded-xs cursor-pointer font-medium"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 0C. Modal: Add New Pre-Wedding Video */}
      {newVideoModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white border border-neutral-200 p-6 sm:p-8 rounded-sm shadow-2xl max-w-xl w-full space-y-5 animate-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
              <div>
                <span className="text-[10px] tracking-wider uppercase text-neutral-400 font-medium">
                  PRE-WEDDING CINEMA
                </span>
                <h3 className="font-serif text-xl text-neutral-900 font-normal">
                  Add New Pre-Wedding Video
                </h3>
              </div>
              <button
                onClick={() => setNewVideoModal(false)}
                className="text-neutral-400 hover:text-neutral-700 p-1 cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-neutral-600 mb-1">
                    Film / Video Title *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Whispers of Udaipur"
                    value={newVideoForm.title}
                    onChange={(e) =>
                      setNewVideoForm({ ...newVideoForm, title: e.target.value })
                    }
                    className="w-full text-xs px-3 py-2 border border-neutral-300 rounded-xs focus:border-neutral-900 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-neutral-600 mb-1">
                    Couple Names
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Vikram & Radhika"
                    value={newVideoForm.coupleNames || ''}
                    onChange={(e) =>
                      setNewVideoForm({ ...newVideoForm, coupleNames: e.target.value })
                    }
                    className="w-full text-xs px-3 py-2 border border-neutral-300 rounded-xs focus:border-neutral-900 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-neutral-600 mb-1">
                    Location
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Udaipur, Rajasthan"
                    value={newVideoForm.location || ''}
                    onChange={(e) =>
                      setNewVideoForm({ ...newVideoForm, location: e.target.value })
                    }
                    className="w-full text-xs px-3 py-2 border border-neutral-300 rounded-xs focus:border-neutral-900 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-neutral-600 mb-1">
                    Display Order
                  </label>
                  <input
                    type="number"
                    value={newVideoForm.displayOrder || 0}
                    onChange={(e) =>
                      setNewVideoForm({ ...newVideoForm, displayOrder: parseInt(e.target.value, 10) || 0 })
                    }
                    className="w-full text-xs px-3 py-2 border border-neutral-300 rounded-xs focus:border-neutral-900 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-neutral-600 mb-1">
                  Description / Cinematic Notes
                </label>
                <textarea
                  rows={2}
                  placeholder="A short description of this pre-wedding film story..."
                  value={newVideoForm.description || ''}
                  onChange={(e) =>
                    setNewVideoForm({ ...newVideoForm, description: e.target.value })
                  }
                  className="w-full text-xs px-3 py-2 border border-neutral-300 rounded-xs focus:border-neutral-900 outline-none"
                />
              </div>

              {/* Video URL Upload */}
              <CloudinaryVideoUpload
                label="Pre-Wedding Video File (Cloudinary Direct) *"
                currentUrl={newVideoForm.videoUrl}
                onUploaded={(url) => setNewVideoForm({ ...newVideoForm, videoUrl: url })}
                helperText="Upload MP4 or MOV film file (max 100MB)"
              />

              {/* Poster Frame Upload */}
              <CloudinaryImageUpload
                label="Video Poster Frame (Cover Image Thumbnail)"
                folder="images"
                currentUrl={newVideoForm.posterUrl || ''}
                onUploaded={(url) => setNewVideoForm({ ...newVideoForm, posterUrl: url })}
              />

              {/* Featured Checkbox */}
              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="new-video-featured"
                  checked={newVideoForm.isFeatured || false}
                  onChange={(e) => setNewVideoForm({ ...newVideoForm, isFeatured: e.target.checked })}
                  className="rounded-xs text-neutral-900 focus:ring-neutral-900"
                />
                <label htmlFor="new-video-featured" className="text-xs text-neutral-700 cursor-pointer select-none">
                  Highlight as Featured Film in Portfolio &amp; Homepage
                </label>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-neutral-100">
              <button
                onClick={() => setNewVideoModal(false)}
                className="px-4 py-2 border border-neutral-300 text-neutral-700 text-xs uppercase tracking-wider rounded-xs hover:bg-neutral-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  if (!newVideoForm.title || !newVideoForm.videoUrl) {
                    alert('Please provide at least a title and a video URL or upload.');
                    return;
                  }
                  const newVid: PreWeddingVideo = {
                    id: `vid-${Date.now()}`,
                    title: newVideoForm.title,
                    coupleNames: newVideoForm.coupleNames,
                    location: newVideoForm.location,
                    videoUrl: newVideoForm.videoUrl,
                    posterUrl: newVideoForm.posterUrl,
                    description: newVideoForm.description,
                    displayOrder: newVideoForm.displayOrder ?? preWeddingVideos.length,
                    isFeatured: Boolean(newVideoForm.isFeatured),
                    createdAt: new Date().toISOString(),
                  };
                  await addPreWeddingVideo(newVid);
                  setNewVideoModal(false);
                  showToast('Pre-wedding video added successfully.');
                }}
                className="px-5 py-2 bg-neutral-900 hover:bg-neutral-800 text-white text-xs uppercase tracking-wider rounded-xs cursor-pointer font-medium"
              >
                Add Video
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 0D. Modal: Edit Pre-Wedding Video */}
      {editingVideo && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white border border-neutral-200 p-6 sm:p-8 rounded-sm shadow-2xl max-w-xl w-full space-y-5 animate-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
              <div>
                <span className="text-[10px] tracking-wider uppercase text-neutral-400 font-medium">
                  EDIT PRE-WEDDING FILM
                </span>
                <h3 className="font-serif text-xl text-neutral-900 font-normal">
                  {editingVideo.title}
                </h3>
              </div>
              <button
                onClick={() => setEditingVideo(null)}
                className="text-neutral-400 hover:text-neutral-700 p-1 cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-neutral-600 mb-1">
                    Film / Video Title *
                  </label>
                  <input
                    type="text"
                    value={editingVideo.title}
                    onChange={(e) =>
                      setEditingVideo({ ...editingVideo, title: e.target.value })
                    }
                    className="w-full text-xs px-3 py-2 border border-neutral-300 rounded-xs focus:border-neutral-900 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-neutral-600 mb-1">
                    Couple Names
                  </label>
                  <input
                    type="text"
                    value={editingVideo.coupleNames || ''}
                    onChange={(e) =>
                      setEditingVideo({ ...editingVideo, coupleNames: e.target.value })
                    }
                    className="w-full text-xs px-3 py-2 border border-neutral-300 rounded-xs focus:border-neutral-900 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-neutral-600 mb-1">
                    Location
                  </label>
                  <input
                    type="text"
                    value={editingVideo.location || ''}
                    onChange={(e) =>
                      setEditingVideo({ ...editingVideo, location: e.target.value })
                    }
                    className="w-full text-xs px-3 py-2 border border-neutral-300 rounded-xs focus:border-neutral-900 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-neutral-600 mb-1">
                    Display Order
                  </label>
                  <input
                    type="number"
                    value={editingVideo.displayOrder ?? 0}
                    onChange={(e) =>
                      setEditingVideo({ ...editingVideo, displayOrder: parseInt(e.target.value, 10) || 0 })
                    }
                    className="w-full text-xs px-3 py-2 border border-neutral-300 rounded-xs focus:border-neutral-900 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-neutral-600 mb-1">
                  Description / Cinematic Notes
                </label>
                <textarea
                  rows={2}
                  value={editingVideo.description || ''}
                  onChange={(e) =>
                    setEditingVideo({ ...editingVideo, description: e.target.value })
                  }
                  className="w-full text-xs px-3 py-2 border border-neutral-300 rounded-xs focus:border-neutral-900 outline-none"
                />
              </div>

              {/* Video URL Upload */}
              <CloudinaryVideoUpload
                label="Pre-Wedding Video File *"
                currentUrl={editingVideo.videoUrl}
                onUploaded={(url) => setEditingVideo({ ...editingVideo, videoUrl: url })}
                helperText="Upload MP4 or MOV film file"
              />

              {/* Poster Frame Upload */}
              <CloudinaryImageUpload
                label="Video Poster Frame (Cover Image Thumbnail)"
                folder="images"
                currentUrl={editingVideo.posterUrl || ''}
                onUploaded={(url) => setEditingVideo({ ...editingVideo, posterUrl: url })}
              />

              {/* Featured Checkbox */}
              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="edit-video-featured"
                  checked={editingVideo.isFeatured || false}
                  onChange={(e) => setEditingVideo({ ...editingVideo, isFeatured: e.target.checked })}
                  className="rounded-xs text-neutral-900 focus:ring-neutral-900"
                />
                <label htmlFor="edit-video-featured" className="text-xs text-neutral-700 cursor-pointer select-none">
                  Highlight as Featured Film in Portfolio &amp; Homepage
                </label>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-neutral-100">
              <button
                onClick={() => setEditingVideo(null)}
                className="px-4 py-2 border border-neutral-300 text-neutral-700 text-xs uppercase tracking-wider rounded-xs hover:bg-neutral-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  if (!editingVideo.title || !editingVideo.videoUrl) {
                    alert('Please provide title and video URL.');
                    return;
                  }
                  await updatePreWeddingVideo(editingVideo);
                  setEditingVideo(null);
                  showToast('Pre-wedding video updated.');
                }}
                className="px-5 py-2 bg-neutral-900 hover:bg-neutral-800 text-white text-xs uppercase tracking-wider rounded-xs cursor-pointer font-medium"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 1. Modal: Add New Portfolio Photo */}
      {newWorkModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white border border-neutral-200 p-6 sm:p-8 rounded-sm shadow-2xl max-w-xl w-full space-y-5 animate-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
              <h3 className="font-serif text-xl text-neutral-900 font-normal">
                Upload New Portfolio Photo
              </h3>
              <button
                onClick={() => setNewWorkModal(false)}
                className="text-neutral-400 hover:text-neutral-700 p-1 cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs uppercase tracking-wider text-neutral-600 mb-1">
                  Photo Title
                </label>
                <input
                  type="text"
                  placeholder="e.g. Royal Jodhpur Promenade"
                  value={newWorkForm.title}
                  onChange={(e) =>
                    setNewWorkForm({ ...newWorkForm, title: e.target.value })
                  }
                  className="w-full text-xs px-3 py-2 border border-neutral-300 rounded-xs focus:border-neutral-900 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-neutral-600 mb-1">
                  Category
                </label>
                <select
                  value={newWorkForm.category}
                  onChange={(e) =>
                    setNewWorkForm({ ...newWorkForm, category: e.target.value })
                  }
                  className="w-full text-xs px-3 py-2 border border-neutral-300 rounded-xs focus:border-neutral-900 outline-none"
                >
                  <option value="Wedding Day">Wedding Day</option>
                  <option value="Pre Wedding">Pre Wedding</option>
                  <option value="Bridal Portrait">Bridal Portrait</option>
                  <option value="Celebration">Celebration</option>
                  <option value="Traditional Ceremony">Traditional Ceremony</option>
                  <option value="Bridal Couture">Bridal Couture</option>
                  <option value="Couple Portrait">Couple Portrait</option>
                  <option value="Fine Art">Fine Art</option>
                  <option value="Reception">Reception</option>
                </select>
              </div>

              <CloudinaryImageUpload
                label="Photo File (Cloudinary Direct Upload)"
                folder="images"
                currentUrl={newWorkForm.imageUrl}
                onUploaded={(url) => setNewWorkForm({ ...newWorkForm, imageUrl: url })}
              />

              <div className="pt-2 border-t border-neutral-100">
                <label className="inline-flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={newWorkForm.isFeatured || false}
                    onChange={(e) =>
                      setNewWorkForm({ ...newWorkForm, isFeatured: e.target.checked })
                    }
                    className="w-4 h-4 accent-neutral-900 rounded-xs cursor-pointer"
                  />
                  <div className="flex flex-col">
                    <span className="text-xs font-medium text-neutral-800 flex items-center gap-1">
                      <Star size={12} className="fill-amber-400 text-amber-500" />
                      Feature on Homepage (Selected Work section)
                    </span>
                    <span className="text-[10px] text-neutral-400">
                      Display this photo immediately on the home page showcase.
                    </span>
                  </div>
                </label>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-neutral-100">
              <button
                onClick={() => setNewWorkModal(false)}
                className="px-4 py-2 border border-neutral-300 text-neutral-700 text-xs uppercase tracking-wider rounded-xs hover:bg-neutral-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  if (!newWorkForm.title || !newWorkForm.imageUrl) {
                    alert('Please provide a title and upload an image.');
                    return;
                  }
                  await addSelectedWork(newWorkForm);
                  setNewWorkModal(false);
                  setNewWorkForm({ title: '', category: 'Wedding Day', imageUrl: '', isFeatured: false });
                  showToast('Photo added to portfolio.');
                }}
                className="px-5 py-2 bg-neutral-900 hover:bg-neutral-800 text-white text-xs uppercase tracking-wider rounded-xs cursor-pointer font-medium"
              >
                Save Photo
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. Modal: Edit Existing Portfolio Item */}
      {editingWork && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white border border-neutral-200 p-6 sm:p-8 rounded-sm shadow-2xl max-w-xl w-full space-y-5 animate-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
              <h3 className="font-serif text-xl text-neutral-900 font-normal">
                Edit Portfolio Photo #{editingWork.id}
              </h3>
              <button
                onClick={() => setEditingWork(null)}
                className="text-neutral-400 hover:text-neutral-700 p-1 cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs uppercase tracking-wider text-neutral-600 mb-1">
                  Photo Title
                </label>
                <input
                  type="text"
                  value={editingWork.title}
                  onChange={(e) =>
                    setEditingWork({ ...editingWork, title: e.target.value })
                  }
                  className="w-full text-xs px-3 py-2 border border-neutral-300 rounded-xs focus:border-neutral-900 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-neutral-600 mb-1">
                  Category
                </label>
                <select
                  value={editingWork.category}
                  onChange={(e) =>
                    setEditingWork({ ...editingWork, category: e.target.value })
                  }
                  className="w-full text-xs px-3 py-2 border border-neutral-300 rounded-xs focus:border-neutral-900 outline-none"
                >
                  <option value="Wedding Day">Wedding Day</option>
                  <option value="Pre Wedding">Pre Wedding</option>
                  <option value="Bridal Portrait">Bridal Portrait</option>
                  <option value="Celebration">Celebration</option>
                  <option value="Traditional Ceremony">Traditional Ceremony</option>
                  <option value="Bridal Couture">Bridal Couture</option>
                  <option value="Couple Portrait">Couple Portrait</option>
                  <option value="Fine Art">Fine Art</option>
                  <option value="Reception">Reception</option>
                </select>
              </div>

              <CloudinaryImageUpload
                label="Replace Photo (Cloudinary Direct Upload)"
                folder="images"
                currentUrl={editingWork.imageUrl}
                onUploaded={(url) => setEditingWork({ ...editingWork, imageUrl: url })}
              />

              <div className="pt-2 border-t border-neutral-100">
                <label className="inline-flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={editingWork.isFeatured || false}
                    onChange={(e) =>
                      setEditingWork({ ...editingWork, isFeatured: e.target.checked })
                    }
                    className="w-4 h-4 accent-neutral-900 rounded-xs cursor-pointer"
                  />
                  <div className="flex flex-col">
                    <span className="text-xs font-medium text-neutral-800 flex items-center gap-1">
                      <Star size={12} className="fill-amber-400 text-amber-500" />
                      Feature on Homepage (Selected Work section)
                    </span>
                    <span className="text-[10px] text-neutral-400">
                      Show or hide this item from the curated home page gallery.
                    </span>
                  </div>
                </label>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-neutral-100">
              <button
                onClick={() => setEditingWork(null)}
                className="px-4 py-2 border border-neutral-300 text-neutral-700 text-xs uppercase tracking-wider rounded-xs hover:bg-neutral-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  await updateSelectedWork(editingWork);
                  setEditingWork(null);
                  showToast('Photo updated successfully.');
                }}
                className="px-5 py-2 bg-neutral-900 hover:bg-neutral-800 text-white text-xs uppercase tracking-wider rounded-xs cursor-pointer font-medium"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 3. Modal: Edit Hero Carousel Slide */}
      {editingSlide && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white border border-neutral-200 p-6 sm:p-8 rounded-sm shadow-2xl max-w-xl w-full space-y-5 animate-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
              <h3 className="font-serif text-xl text-neutral-900 font-normal">
                Edit Hero Slide #{editingSlide.index + 1}
              </h3>
              <button
                onClick={() => setEditingSlide(null)}
                className="text-neutral-400 hover:text-neutral-700 p-1 cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs uppercase tracking-wider text-neutral-600 mb-1">
                  Slide Title
                </label>
                <input
                  type="text"
                  value={editingSlide.slide.title}
                  onChange={(e) =>
                    setEditingSlide({
                      ...editingSlide,
                      slide: { ...editingSlide.slide, title: e.target.value },
                    })
                  }
                  className="w-full text-xs px-3 py-2 border border-neutral-300 rounded-xs focus:border-neutral-900 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-neutral-600 mb-1">
                  Slide Subtitle
                </label>
                <input
                  type="text"
                  value={editingSlide.slide.subtitle}
                  onChange={(e) =>
                    setEditingSlide({
                      ...editingSlide,
                      slide: { ...editingSlide.slide, subtitle: e.target.value },
                    })
                  }
                  className="w-full text-xs px-3 py-2 border border-neutral-300 rounded-xs focus:border-neutral-900 outline-none"
                />
              </div>

              <CloudinaryImageUpload
                label="Slide Panoramic Image (Cloudinary Direct Upload)"
                folder="images"
                currentUrl={editingSlide.slide.imageUrl}
                onUploaded={(url) =>
                  setEditingSlide({
                    ...editingSlide,
                    slide: { ...editingSlide.slide, imageUrl: url },
                  })
                }
              />
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-neutral-100">
              <button
                onClick={() => setEditingSlide(null)}
                className="px-4 py-2 border border-neutral-300 text-neutral-700 text-xs uppercase tracking-wider rounded-xs hover:bg-neutral-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  const updatedSlides = [...heroSlides];
                  updatedSlides[editingSlide.index] = editingSlide.slide;
                  await updateHeroSlides(updatedSlides);
                  setEditingSlide(null);
                  showToast(`Hero Slide #${editingSlide.index + 1} updated.`);
                }}
                className="px-5 py-2 bg-neutral-900 hover:bg-neutral-800 text-white text-xs uppercase tracking-wider rounded-xs cursor-pointer font-medium"
              >
                Save Slide
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 4. Modal: Configure Pre-Wedding Video Teaser */}
      {videoModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white border border-neutral-200 p-6 sm:p-8 rounded-sm shadow-2xl max-w-xl w-full space-y-5 animate-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
              <h3 className="font-serif text-xl text-neutral-900 font-normal">
                Configure Pre-Wedding Cinema Teaser
              </h3>
              <button
                onClick={() => setVideoModalOpen(false)}
                className="text-neutral-400 hover:text-neutral-700 p-1 cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-neutral-600 mb-1">
                    Couple / Title
                  </label>
                  <input
                    type="text"
                    value={videoForm.title}
                    onChange={(e) =>
                      setVideoForm({ ...videoForm, title: e.target.value })
                    }
                    className="w-full text-xs px-3 py-2 border border-neutral-300 rounded-xs focus:border-neutral-900 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wider text-neutral-600 mb-1">
                    Subtitle
                  </label>
                  <input
                    type="text"
                    value={videoForm.subtitle}
                    onChange={(e) =>
                      setVideoForm({ ...videoForm, subtitle: e.target.value })
                    }
                    className="w-full text-xs px-3 py-2 border border-neutral-300 rounded-xs focus:border-neutral-900 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-neutral-600 mb-1">
                  Video Description
                </label>
                <textarea
                  rows={2}
                  value={videoForm.description}
                  onChange={(e) =>
                    setVideoForm({ ...videoForm, description: e.target.value })
                  }
                  className="w-full text-xs px-3 py-2 border border-neutral-300 rounded-xs focus:border-neutral-900 outline-none"
                />
              </div>

              <CloudinaryVideoUpload
                label="Video File or Stream (.mp4 / Cloudinary Video)"
                currentUrl={videoForm.videoUrl}
                onUploaded={(url) => setVideoForm({ ...videoForm, videoUrl: url })}
                helperText="Upload an MP4/MOV teaser video directly to Cloudinary or paste a stream link"
              />

              <CloudinaryImageUpload
                label="Video Poster Frame (Cloudinary Direct Upload)"
                folder="images"
                currentUrl={videoForm.posterUrl}
                onUploaded={(url) => setVideoForm({ ...videoForm, posterUrl: url })}
              />
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-neutral-100">
              <button
                onClick={() => setVideoModalOpen(false)}
                className="px-4 py-2 border border-neutral-300 text-neutral-700 text-xs uppercase tracking-wider rounded-xs hover:bg-neutral-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  await updateVideoFeature(videoForm);
                  setVideoModalOpen(false);
                  showToast('Cinema teaser updated.');
                }}
                className="px-5 py-2 bg-neutral-900 hover:bg-neutral-800 text-white text-xs uppercase tracking-wider rounded-xs cursor-pointer font-medium"
              >
                Save Video Settings
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 5. Modal: Add New Pricing Package */}
      {newPricingModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white border border-neutral-200 p-6 sm:p-8 rounded-sm shadow-2xl max-w-xl w-full space-y-5 animate-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
              <h3 className="font-serif text-xl text-neutral-900 font-normal">
                Create New Wedding Package
              </h3>
              <button
                onClick={() => setNewPricingModal(false)}
                className="text-neutral-400 hover:text-neutral-700 p-1 cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-neutral-600 mb-1">
                    Package Name
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. PLATINUM PACKAGE"
                    value={newPricingForm.name}
                    onChange={(e) =>
                      setNewPricingForm({
                        ...newPricingForm,
                        name: e.target.value,
                        id: e.target.value.toLowerCase().replace(/\s+/g, '-'),
                      })
                    }
                    className="w-full text-xs px-3 py-2 border border-neutral-300 rounded-xs focus:border-neutral-900 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wider text-neutral-600 mb-1">
                    Price Display
                  </label>
                  <input
                    type="text"
                    placeholder="Rs. 1,25,000"
                    value={newPricingForm.price}
                    onChange={(e) =>
                      setNewPricingForm({ ...newPricingForm, price: e.target.value })
                    }
                    className="w-full text-xs px-3 py-2 border border-neutral-300 rounded-xs focus:border-neutral-900 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wider text-neutral-600 mb-1">
                    Coverage
                  </label>
                  <input
                    type="text"
                    placeholder="2 Days Coverage"
                    value={newPricingForm.coverage}
                    onChange={(e) =>
                      setNewPricingForm({ ...newPricingForm, coverage: e.target.value })
                    }
                    className="w-full text-xs px-3 py-2 border border-neutral-300 rounded-xs focus:border-neutral-900 outline-none"
                  />
                </div>
              </div>

              <label className="flex items-center gap-2 text-xs text-neutral-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={newPricingForm.isPopular}
                  onChange={(e) =>
                    setNewPricingForm({
                      ...newPricingForm,
                      isPopular: e.target.checked,
                      badge: e.target.checked ? 'MOST POPULAR' : '',
                    })
                  }
                />
                <span>Highlight as Most Popular</span>
              </label>

              <div className="space-y-2">
                <label className="block text-xs uppercase tracking-wider text-neutral-600">
                  Included Features
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Add feature (e.g. Drone Shoot — 1 Day)"
                    value={featureInput}
                    onChange={(e) => setFeatureInput(e.target.value)}
                    className="flex-1 text-xs px-3 py-2 border border-neutral-300 rounded-xs focus:border-neutral-900 outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (featureInput.trim()) {
                        setNewPricingForm({
                          ...newPricingForm,
                          features: [...newPricingForm.features, featureInput.trim()],
                        });
                        setFeatureInput('');
                      }
                    }}
                    className="px-3.5 py-2 bg-neutral-200 hover:bg-neutral-300 text-neutral-800 text-xs uppercase tracking-wider rounded-xs cursor-pointer"
                  >
                    Add
                  </button>
                </div>

                <div className="flex flex-wrap gap-2 pt-1">
                  {newPricingForm.features.map((f, fIdx) => (
                    <span
                      key={fIdx}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-neutral-100 border border-neutral-200 rounded-xs text-xs text-neutral-700"
                    >
                      <span>{f}</span>
                      <button
                        type="button"
                        onClick={() => {
                          setNewPricingForm({
                            ...newPricingForm,
                            features: newPricingForm.features.filter((_, i) => i !== fIdx),
                          });
                        }}
                        className="text-neutral-400 hover:text-rose-600"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-neutral-100">
              <button
                onClick={() => setNewPricingModal(false)}
                className="px-4 py-2 border border-neutral-300 text-neutral-700 text-xs uppercase tracking-wider rounded-xs hover:bg-neutral-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  if (!newPricingForm.name || !newPricingForm.price) {
                    alert('Package name and price are required.');
                    return;
                  }
                  await addPricingPackage(newPricingForm);
                  setNewPricingModal(false);
                  showToast('Package created.');
                }}
                className="px-5 py-2 bg-neutral-900 hover:bg-neutral-800 text-white text-xs uppercase tracking-wider rounded-xs cursor-pointer font-medium"
              >
                Save Package
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 6. Modal: Edit Existing Pricing Package */}
      {editingPricingPkg && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white border border-neutral-200 p-6 sm:p-8 rounded-sm shadow-2xl max-w-xl w-full space-y-5 animate-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
              <h3 className="font-serif text-xl text-neutral-900 font-normal">
                Edit Package: {editingPricingPkg.name}
              </h3>
              <button
                onClick={() => setEditingPricingPkg(null)}
                className="text-neutral-400 hover:text-neutral-700 p-1 cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-neutral-600 mb-1">
                    Package Name
                  </label>
                  <input
                    type="text"
                    value={editingPricingPkg.name}
                    onChange={(e) =>
                      setEditingPricingPkg({ ...editingPricingPkg, name: e.target.value })
                    }
                    className="w-full text-xs px-3 py-2 border border-neutral-300 rounded-xs focus:border-neutral-900 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wider text-neutral-600 mb-1">
                    Price Display
                  </label>
                  <input
                    type="text"
                    value={editingPricingPkg.price}
                    onChange={(e) =>
                      setEditingPricingPkg({ ...editingPricingPkg, price: e.target.value })
                    }
                    className="w-full text-xs px-3 py-2 border border-neutral-300 rounded-xs focus:border-neutral-900 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wider text-neutral-600 mb-1">
                    Coverage
                  </label>
                  <input
                    type="text"
                    value={editingPricingPkg.coverage}
                    onChange={(e) =>
                      setEditingPricingPkg({ ...editingPricingPkg, coverage: e.target.value })
                    }
                    className="w-full text-xs px-3 py-2 border border-neutral-300 rounded-xs focus:border-neutral-900 outline-none"
                  />
                </div>
              </div>

              <label className="flex items-center gap-2 text-xs text-neutral-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={editingPricingPkg.isPopular}
                  onChange={(e) =>
                    setEditingPricingPkg({
                      ...editingPricingPkg,
                      isPopular: e.target.checked,
                      badge: e.target.checked ? 'MOST POPULAR' : undefined,
                    })
                  }
                />
                <span>Highlight as Most Popular</span>
              </label>

              <div className="space-y-2">
                <label className="block text-xs uppercase tracking-wider text-neutral-600">
                  Included Features
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Add feature"
                    value={editFeatureInput}
                    onChange={(e) => setEditFeatureInput(e.target.value)}
                    className="flex-1 text-xs px-3 py-2 border border-neutral-300 rounded-xs focus:border-neutral-900 outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (editFeatureInput.trim()) {
                        setEditingPricingPkg({
                          ...editingPricingPkg,
                          features: [...editingPricingPkg.features, editFeatureInput.trim()],
                        });
                        setEditFeatureInput('');
                      }
                    }}
                    className="px-3.5 py-2 bg-neutral-200 hover:bg-neutral-300 text-neutral-800 text-xs uppercase tracking-wider rounded-xs cursor-pointer"
                  >
                    Add
                  </button>
                </div>

                <div className="flex flex-wrap gap-2 pt-1">
                  {editingPricingPkg.features.map((f, fIdx) => (
                    <span
                      key={fIdx}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-neutral-100 border border-neutral-200 rounded-xs text-xs text-neutral-700"
                    >
                      <span>{f}</span>
                      <button
                        type="button"
                        onClick={() => {
                          setEditingPricingPkg({
                            ...editingPricingPkg,
                            features: editingPricingPkg.features.filter((_, i) => i !== fIdx),
                          });
                        }}
                        className="text-neutral-400 hover:text-rose-600"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-neutral-100">
              <button
                onClick={() => setEditingPricingPkg(null)}
                className="px-4 py-2 border border-neutral-300 text-neutral-700 text-xs uppercase tracking-wider rounded-xs hover:bg-neutral-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  await updatePricingPackage(editingPricingPkg);
                  setEditingPricingPkg(null);
                  showToast('Package updated.');
                }}
                className="px-5 py-2 bg-neutral-900 hover:bg-neutral-800 text-white text-xs uppercase tracking-wider rounded-xs cursor-pointer font-medium"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 7. Modal: Add Team Member */}
      {newTeamModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white border border-neutral-200 p-6 sm:p-8 rounded-sm shadow-2xl max-w-xl w-full space-y-5 animate-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
              <h3 className="font-serif text-xl text-neutral-900 font-normal">
                Add Team Artisan
              </h3>
              <button
                onClick={() => setNewTeamModal(false)}
                className="text-neutral-400 hover:text-neutral-700 p-1 cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-neutral-600 mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Sanjib Bhowmik"
                    value={newTeamForm.name}
                    onChange={(e) =>
                      setNewTeamForm({
                        ...newTeamForm,
                        name: e.target.value,
                        id: e.target.value.toLowerCase().replace(/\s+/g, '-'),
                      })
                    }
                    className="w-full text-xs px-3 py-2 border border-neutral-300 rounded-xs focus:border-neutral-900 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wider text-neutral-600 mb-1">
                    Role Title
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Lead Cinematographer"
                    value={newTeamForm.role}
                    onChange={(e) =>
                      setNewTeamForm({ ...newTeamForm, role: e.target.value })
                    }
                    className="w-full text-xs px-3 py-2 border border-neutral-300 rounded-xs focus:border-neutral-900 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-neutral-600 mb-1">
                  Biography / Description
                </label>
                <textarea
                  rows={3}
                  placeholder="Short creative bio..."
                  value={newTeamForm.bio}
                  onChange={(e) =>
                    setNewTeamForm({ ...newTeamForm, bio: e.target.value })
                  }
                  className="w-full text-xs px-3 py-2 border border-neutral-300 rounded-xs focus:border-neutral-900 outline-none"
                />
              </div>

              <CloudinaryImageUpload
                label="Portrait Photograph (Cloudinary Direct Upload)"
                folder="avatars"
                currentUrl={newTeamForm.imageUrl}
                onUploaded={(url) => setNewTeamForm({ ...newTeamForm, imageUrl: url })}
              />
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-neutral-100">
              <button
                onClick={() => setNewTeamModal(false)}
                className="px-4 py-2 border border-neutral-300 text-neutral-700 text-xs uppercase tracking-wider rounded-xs hover:bg-neutral-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  if (!newTeamForm.name || !newTeamForm.imageUrl) {
                    alert('Name and photo are required.');
                    return;
                  }
                  await addTeamMember(newTeamForm);
                  setNewTeamModal(false);
                  showToast('Team member added.');
                }}
                className="px-5 py-2 bg-neutral-900 hover:bg-neutral-800 text-white text-xs uppercase tracking-wider rounded-xs cursor-pointer font-medium"
              >
                Save Member
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 8. Modal: Edit Team Member */}
      {editingTeamMember && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white border border-neutral-200 p-6 sm:p-8 rounded-sm shadow-2xl max-w-xl w-full space-y-5 animate-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
              <h3 className="font-serif text-xl text-neutral-900 font-normal">
                Edit Team Member: {editingTeamMember.name}
              </h3>
              <button
                onClick={() => setEditingTeamMember(null)}
                className="text-neutral-400 hover:text-neutral-700 p-1 cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-neutral-600 mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={editingTeamMember.name}
                    onChange={(e) =>
                      setEditingTeamMember({ ...editingTeamMember, name: e.target.value })
                    }
                    className="w-full text-xs px-3 py-2 border border-neutral-300 rounded-xs focus:border-neutral-900 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wider text-neutral-600 mb-1">
                    Role Title
                  </label>
                  <input
                    type="text"
                    value={editingTeamMember.role}
                    onChange={(e) =>
                      setEditingTeamMember({ ...editingTeamMember, role: e.target.value })
                    }
                    className="w-full text-xs px-3 py-2 border border-neutral-300 rounded-xs focus:border-neutral-900 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-neutral-600 mb-1">
                  Biography / Description
                </label>
                <textarea
                  rows={3}
                  value={editingTeamMember.bio}
                  onChange={(e) =>
                    setEditingTeamMember({ ...editingTeamMember, bio: e.target.value })
                  }
                  className="w-full text-xs px-3 py-2 border border-neutral-300 rounded-xs focus:border-neutral-900 outline-none"
                />
              </div>

              <CloudinaryImageUpload
                label="Portrait Photograph (Cloudinary Direct Upload)"
                folder="avatars"
                currentUrl={editingTeamMember.imageUrl}
                onUploaded={(url) => setEditingTeamMember({ ...editingTeamMember, imageUrl: url })}
              />
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-neutral-100">
              <button
                onClick={() => setEditingTeamMember(null)}
                className="px-4 py-2 border border-neutral-300 text-neutral-700 text-xs uppercase tracking-wider rounded-xs hover:bg-neutral-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  await updateTeamMember(editingTeamMember);
                  setEditingTeamMember(null);
                  showToast('Team member updated.');
                }}
                className="px-5 py-2 bg-neutral-900 hover:bg-neutral-800 text-white text-xs uppercase tracking-wider rounded-xs cursor-pointer font-medium"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 9. Modal: Add New Testimonial */}
      {newTestimonialModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white border border-neutral-200 p-6 sm:p-8 rounded-sm shadow-2xl max-w-lg w-full space-y-5 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
              <h3 className="font-serif text-xl text-neutral-900 font-normal">
                Add Bride & Groom Review
              </h3>
              <button
                onClick={() => setNewTestimonialModal(false)}
                className="text-neutral-400 hover:text-neutral-700 p-1 cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs uppercase tracking-wider text-neutral-600 mb-1">
                  Couple / Author Names
                </label>
                <input
                  type="text"
                  placeholder="e.g. PRIYA + SAMEER"
                  value={newTestimonialForm.authors}
                  onChange={(e) =>
                    setNewTestimonialForm({
                      ...newTestimonialForm,
                      authors: e.target.value.toUpperCase(),
                    })
                  }
                  className="w-full text-xs px-3 py-2 border border-neutral-300 rounded-xs focus:border-neutral-900 outline-none"
                />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wider text-neutral-600 mb-1">
                  Review Quote
                </label>
                <textarea
                  rows={4}
                  placeholder="‘Working with CaM-Mystery was...’"
                  value={newTestimonialForm.quote}
                  onChange={(e) =>
                    setNewTestimonialForm({ ...newTestimonialForm, quote: e.target.value })
                  }
                  className="w-full text-xs px-3 py-2 border border-neutral-300 rounded-xs focus:border-neutral-900 outline-none"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-neutral-100">
              <button
                onClick={() => setNewTestimonialModal(false)}
                className="px-4 py-2 border border-neutral-300 text-neutral-700 text-xs uppercase tracking-wider rounded-xs hover:bg-neutral-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  if (!newTestimonialForm.quote || !newTestimonialForm.authors) {
                    alert('Quote and authors are required.');
                    return;
                  }
                  await addTestimonial(newTestimonialForm);
                  setNewTestimonialModal(false);
                  showToast('Review added.');
                }}
                className="px-5 py-2 bg-neutral-900 hover:bg-neutral-800 text-white text-xs uppercase tracking-wider rounded-xs cursor-pointer font-medium"
              >
                Save Review
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 10. Modal: Edit Testimonial */}
      {editingTestimonial && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white border border-neutral-200 p-6 sm:p-8 rounded-sm shadow-2xl max-w-lg w-full space-y-5 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
              <h3 className="font-serif text-xl text-neutral-900 font-normal">
                Edit Review
              </h3>
              <button
                onClick={() => setEditingTestimonial(null)}
                className="text-neutral-400 hover:text-neutral-700 p-1 cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs uppercase tracking-wider text-neutral-600 mb-1">
                  Couple / Author Names
                </label>
                <input
                  type="text"
                  value={editingTestimonial.authors}
                  onChange={(e) =>
                    setEditingTestimonial({
                      ...editingTestimonial,
                      authors: e.target.value.toUpperCase(),
                    })
                  }
                  className="w-full text-xs px-3 py-2 border border-neutral-300 rounded-xs focus:border-neutral-900 outline-none"
                />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wider text-neutral-600 mb-1">
                  Review Quote
                </label>
                <textarea
                  rows={4}
                  value={editingTestimonial.quote}
                  onChange={(e) =>
                    setEditingTestimonial({ ...editingTestimonial, quote: e.target.value })
                  }
                  className="w-full text-xs px-3 py-2 border border-neutral-300 rounded-xs focus:border-neutral-900 outline-none"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-neutral-100">
              <button
                onClick={() => setEditingTestimonial(null)}
                className="px-4 py-2 border border-neutral-300 text-neutral-700 text-xs uppercase tracking-wider rounded-xs hover:bg-neutral-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  await updateTestimonial(editingTestimonial);
                  setEditingTestimonial(null);
                  showToast('Review updated.');
                }}
                className="px-5 py-2 bg-neutral-900 hover:bg-neutral-800 text-white text-xs uppercase tracking-wider rounded-xs cursor-pointer font-medium"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 11. Modal: Add New FAQ */}
      {newFaqModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white border border-neutral-200 p-6 sm:p-8 rounded-sm shadow-2xl max-w-lg w-full space-y-5 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
              <h3 className="font-serif text-xl text-neutral-900 font-normal">
                Add New FAQ
              </h3>
              <button
                onClick={() => setNewFaqModal(false)}
                className="text-neutral-400 hover:text-neutral-700 p-1 cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs uppercase tracking-wider text-neutral-600 mb-1">
                  Question
                </label>
                <input
                  type="text"
                  placeholder="e.g. Do you deliver raw unedited footage?"
                  value={newFaqForm.question}
                  onChange={(e) =>
                    setNewFaqForm({
                      ...newFaqForm,
                      question: e.target.value,
                      id: `faq-${Date.now()}`,
                    })
                  }
                  className="w-full text-xs px-3 py-2 border border-neutral-300 rounded-xs focus:border-neutral-900 outline-none"
                />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wider text-neutral-600 mb-1">
                  Answer
                </label>
                <textarea
                  rows={4}
                  placeholder="Detailed answer..."
                  value={newFaqForm.answer}
                  onChange={(e) =>
                    setNewFaqForm({ ...newFaqForm, answer: e.target.value })
                  }
                  className="w-full text-xs px-3 py-2 border border-neutral-300 rounded-xs focus:border-neutral-900 outline-none"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-neutral-100">
              <button
                onClick={() => setNewFaqModal(false)}
                className="px-4 py-2 border border-neutral-300 text-neutral-700 text-xs uppercase tracking-wider rounded-xs hover:bg-neutral-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  if (!newFaqForm.question || !newFaqForm.answer) {
                    alert('Both question and answer are required.');
                    return;
                  }
                  await addFaqItem(newFaqForm);
                  setNewFaqModal(false);
                  showToast('FAQ created.');
                }}
                className="px-5 py-2 bg-neutral-900 hover:bg-neutral-800 text-white text-xs uppercase tracking-wider rounded-xs cursor-pointer font-medium"
              >
                Save FAQ
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 12. Modal: Edit FAQ */}
      {editingFaq && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white border border-neutral-200 p-6 sm:p-8 rounded-sm shadow-2xl max-w-lg w-full space-y-5 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
              <h3 className="font-serif text-xl text-neutral-900 font-normal">
                Edit FAQ
              </h3>
              <button
                onClick={() => setEditingFaq(null)}
                className="text-neutral-400 hover:text-neutral-700 p-1 cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs uppercase tracking-wider text-neutral-600 mb-1">
                  Question
                </label>
                <input
                  type="text"
                  value={editingFaq.question}
                  onChange={(e) =>
                    setEditingFaq({ ...editingFaq, question: e.target.value })
                  }
                  className="w-full text-xs px-3 py-2 border border-neutral-300 rounded-xs focus:border-neutral-900 outline-none"
                />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wider text-neutral-600 mb-1">
                  Answer
                </label>
                <textarea
                  rows={4}
                  value={editingFaq.answer}
                  onChange={(e) =>
                    setEditingFaq({ ...editingFaq, answer: e.target.value })
                  }
                  className="w-full text-xs px-3 py-2 border border-neutral-300 rounded-xs focus:border-neutral-900 outline-none"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-neutral-100">
              <button
                onClick={() => setEditingFaq(null)}
                className="px-4 py-2 border border-neutral-300 text-neutral-700 text-xs uppercase tracking-wider rounded-xs hover:bg-neutral-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  await updateFaqItem(editingFaq);
                  setEditingFaq(null);
                  showToast('FAQ updated.');
                }}
                className="px-5 py-2 bg-neutral-900 hover:bg-neutral-800 text-white text-xs uppercase tracking-wider rounded-xs cursor-pointer font-medium"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 13. Modal: Edit Studio Info */}
      {studioModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white border border-neutral-200 p-6 sm:p-8 rounded-sm shadow-2xl max-w-xl w-full space-y-5 animate-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
              <h3 className="font-serif text-xl text-neutral-900 font-normal">
                Edit Studio & Contact Details
              </h3>
              <button
                onClick={() => setStudioModalOpen(false)}
                className="text-neutral-400 hover:text-neutral-700 p-1 cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-neutral-600 mb-1">
                    Studio Lead Name
                  </label>
                  <input
                    type="text"
                    value={studioForm.name}
                    onChange={(e) =>
                      setStudioForm({ ...studioForm, name: e.target.value })
                    }
                    className="w-full text-xs px-3 py-2 border border-neutral-300 rounded-xs focus:border-neutral-900 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wider text-neutral-600 mb-1">
                    Phone Number
                  </label>
                  <input
                    type="text"
                    value={studioForm.phone}
                    onChange={(e) =>
                      setStudioForm({ ...studioForm, phone: e.target.value })
                    }
                    className="w-full text-xs px-3 py-2 border border-neutral-300 rounded-xs focus:border-neutral-900 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wider text-neutral-600 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={studioForm.email}
                    onChange={(e) =>
                      setStudioForm({ ...studioForm, email: e.target.value })
                    }
                    className="w-full text-xs px-3 py-2 border border-neutral-300 rounded-xs focus:border-neutral-900 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wider text-neutral-600 mb-1">
                    Google Maps Link
                  </label>
                  <input
                    type="url"
                    value={studioForm.mapsUrl}
                    onChange={(e) =>
                      setStudioForm({ ...studioForm, mapsUrl: e.target.value })
                    }
                    className="w-full text-xs px-3 py-2 border border-neutral-300 rounded-xs focus:border-neutral-900 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-neutral-600 mb-1">
                  Physical Studio Address
                </label>
                <input
                  type="text"
                  value={studioForm.address}
                  onChange={(e) =>
                    setStudioForm({ ...studioForm, address: e.target.value })
                  }
                  className="w-full text-xs px-3 py-2 border border-neutral-300 rounded-xs focus:border-neutral-900 outline-none"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-neutral-100">
              <button
                onClick={() => setStudioModalOpen(false)}
                className="px-4 py-2 border border-neutral-300 text-neutral-700 text-xs uppercase tracking-wider rounded-xs hover:bg-neutral-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  await updateStudioInfo(studioForm);
                  setStudioModalOpen(false);
                  showToast('Studio settings saved.');
                }}
                className="px-5 py-2 bg-neutral-900 hover:bg-neutral-800 text-white text-xs uppercase tracking-wider rounded-xs cursor-pointer font-medium"
              >
                Save Settings
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Global Confirmation Modal */}
      <ConfirmModal
        isOpen={confirmModalState.isOpen}
        title={confirmModalState.title}
        message={confirmModalState.message}
        confirmText={confirmModalState.confirmText}
        type={confirmModalState.type}
        onConfirm={() => {
          confirmModalState.onConfirm();
          setConfirmModalState((prev) => ({ ...prev, isOpen: false }));
        }}
        onClose={() => setConfirmModalState((prev) => ({ ...prev, isOpen: false }))}
      />
    </div>
  );
};
