import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  SelectedWorkItem,
  HeroSlide,
  PricingPackage,
  TeamMember,
  Testimonial,
  FaqItem,
  StudioInfo,
  VideoFeature,
  EnquiryItem,
  WeddingProject,
  AboutPageImages,
  BookingItem,
  BookingFormData,
  BookingStatus,
  PreWeddingVideo,
} from '../types';
import { supabase } from './supabase';
import { sendBookingToGoogleSheet } from './googleSheets';

interface CMSContextType {
  studioInfo: StudioInfo;
  heroSlides: HeroSlide[];
  selectedWork: SelectedWorkItem[];
  weddingProjects: WeddingProject[];
  pricingPackages: PricingPackage[];
  teamMembers: TeamMember[];
  testimonials: Testimonial[];
  faqItems: FaqItem[];
  videoFeature: VideoFeature;
  preWeddingVideos: PreWeddingVideo[];
  aboutImages: AboutPageImages;
  enquiries: EnquiryItem[];
  bookings: BookingItem[];
  loading: boolean;
  isSupabaseConnected: boolean;

  // Actions
  updateStudioInfo: (info: StudioInfo) => Promise<void>;
  updateHeroSlides: (slides: HeroSlide[]) => Promise<void>;
  updateVideoFeature: (feature: VideoFeature) => Promise<void>;
  updateAboutImages: (images: AboutPageImages) => Promise<void>;

  // Pre-Wedding Videos CRUD
  addPreWeddingVideo: (video: PreWeddingVideo) => Promise<void>;
  updatePreWeddingVideo: (video: PreWeddingVideo) => Promise<void>;
  deletePreWeddingVideo: (id: string) => Promise<void>;

  // Wedding Projects CRUD
  addWeddingProject: (proj: WeddingProject) => Promise<void>;
  updateWeddingProject: (proj: WeddingProject) => Promise<void>;
  deleteWeddingProject: (id: string) => Promise<void>;

  // Selected Work CRUD
  addSelectedWork: (item: Omit<SelectedWorkItem, 'id'>) => Promise<void>;
  updateSelectedWork: (item: SelectedWorkItem) => Promise<void>;
  deleteSelectedWork: (id: number) => Promise<void>;

  // Pricing Packages CRUD
  addPricingPackage: (pkg: PricingPackage) => Promise<void>;
  updatePricingPackage: (pkg: PricingPackage) => Promise<void>;
  deletePricingPackage: (id: string) => Promise<void>;

  // Team Members CRUD
  addTeamMember: (member: TeamMember) => Promise<void>;
  updateTeamMember: (member: TeamMember) => Promise<void>;
  deleteTeamMember: (id: string) => Promise<void>;

  // Testimonials CRUD
  addTestimonial: (test: Testimonial) => Promise<void>;
  updateTestimonial: (test: Testimonial) => Promise<void>;
  deleteTestimonial: (idOrIndex: string | number) => Promise<void>;

  // FAQs CRUD
  addFaqItem: (item: FaqItem) => Promise<void>;
  updateFaqItem: (item: FaqItem) => Promise<void>;
  deleteFaqItem: (id: string) => Promise<void>;

  // Enquiries
  addEnquiry: (enquiry: Omit<EnquiryItem, 'id' | 'createdAt'>) => Promise<void>;
  markEnquiryRead: (id: string) => Promise<void>;
  deleteEnquiry: (id: string) => Promise<void>;

  // Bookings
  fetchBookingsFromDB: () => Promise<BookingItem[]>;
  addBooking: (bookingData: BookingFormData) => Promise<BookingItem>;
  updateBooking: (id: string, updates: Partial<BookingItem>) => Promise<void>;
  updateBookingStatus: (id: string, status: BookingStatus) => Promise<void>;
  deleteBooking: (id: string) => Promise<void>;

  // Reload data from DB
  reloadData: () => Promise<void>;
  resetToDefaults: () => void;
}

const STORAGE_KEY_PREFIX = 'cammystery_cms_';

function getLocal<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_PREFIX + key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function setLocal<T>(key: string, value: T) {
  try {
    localStorage.setItem(STORAGE_KEY_PREFIX + key, JSON.stringify(value));
  } catch (err) {
    console.error('LocalStorage error:', err);
  }
}

const normalizeWorkItem = (row: any): SelectedWorkItem => ({
  id: Number(row.id),
  title: row.title || '',
  category: row.category || '',
  imageUrl: row.imageUrl || row.imageurl || '',
  aspect: row.aspect || 'aspect-[4/5]',
  isFeatured: Boolean(row.isFeatured ?? row.isfeatured ?? false),
  displayOrder: row.displayOrder ?? row.displayorder,
});

const normalizeTeamMember = (row: any): TeamMember => ({
  id: String(row.id),
  name: row.name || '',
  role: row.role || '',
  bio: row.bio || '',
  imageUrl: row.imageUrl || row.imageurl || '',
  iconName: row.iconName || row.iconname || 'Camera',
});

const normalizeHeroSlide = (row: any): HeroSlide => ({
  id: Number(row.id),
  title: row.title || '',
  subtitle: row.subtitle || '',
  imageUrl: row.imageUrl || row.imageurl || '',
});

const normalizePricing = (row: any): PricingPackage => ({
  id: String(row.id),
  name: row.name || '',
  badge: row.badge,
  coverage: row.coverage || '',
  price: row.price || '',
  features: Array.isArray(row.features) ? row.features : [],
  isPopular: Boolean(row.isPopular ?? row.ispopular ?? false),
});

const normalizeWeddingProject = (row: any): WeddingProject => ({
  id: String(row.id),
  title: row.title || '',
  coupleNames: row.coupleNames || row.couplenames || '',
  location: row.location || '',
  date: row.date || '',
  coverImage: row.coverImage || row.coverimage || row.cover_image || '',
  description: row.description || '',
  images: Array.isArray(row.images) ? row.images : [],
});

const normalizeEnquiry = (row: any): EnquiryItem => ({
  id: String(row.id),
  name: row.name || '',
  email: row.email || '',
  phone: row.phone || '',
  eventDate: row.eventDate || row.eventdate,
  eventLocation: row.eventLocation || row.eventlocation,
  coverageType: row.coverageType || row.coveragetype,
  message: row.message || '',
  referralSource: row.referralSource || row.referralsource,
  createdAt: row.createdAt || row.createdat || row.created_at || new Date().toISOString(),
  isRead: Boolean(row.isRead ?? row.isread ?? false),
});

const normalizePreWeddingVideo = (row: any): PreWeddingVideo => ({
  id: String(row.id),
  title: row.title || '',
  coupleNames: row.coupleNames || row.couplenames || row.couple_names || '',
  location: row.location || '',
  videoUrl: row.videoUrl || row.videourl || row.video_url || '',
  posterUrl: row.posterUrl || row.posterurl || row.poster_url || '',
  description: row.description || '',
  displayOrder: Number(row.displayOrder ?? row.displayorder ?? row.display_order ?? 0),
  isFeatured: Boolean(row.isFeatured ?? row.isfeatured ?? row.is_featured ?? false),
  createdAt: row.createdAt || row.createdat || row.created_at || new Date().toISOString(),
});

const normalizeBooking = (row: any): BookingItem => ({
  id: String(row.id),
  name: row.name || '',
  package: row.package || '',
  email: row.email || '',
  phone: row.phone || '',
  eventDate: row.event_date || row.eventDate || row.eventdate || '',
  eventLocation: row.event_location || row.eventLocation || row.eventlocation || '',
  remarks: row.remarks || '',
  status: (row.status as BookingStatus) || 'pending',
  createdAt: row.created_at || row.createdAt || row.createdat || new Date().toISOString(),
});

const CMSContext = createContext<CMSContextType | null>(null);

export const CMSProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [isSupabaseConnected, setIsSupabaseConnected] = useState(false);


  // States initialized from local cache or empty defaults (no hardcoded data)
  const [studioInfo, setStudioInfo] = useState<StudioInfo>(() =>
    getLocal('studio_info', {
      name: '',
      phone: '',
      email: '',
      address: '',
      mapsUrl: '',
    })
  );
  const [heroSlides, setHeroSlides] = useState<HeroSlide[]>(() =>
    getLocal('hero_slides', []).map(normalizeHeroSlide)
  );
  const [selectedWork, setSelectedWork] = useState<SelectedWorkItem[]>(() =>
    getLocal('selected_work', []).map(normalizeWorkItem)
  );
  const [pricingPackages, setPricingPackages] = useState<PricingPackage[]>(() =>
    getLocal('pricing_packages', []).map(normalizePricing)
  );
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>(() =>
    getLocal('team_members', []).map(normalizeTeamMember)
  );
  const [testimonials, setTestimonials] = useState<Testimonial[]>(() =>
    getLocal('testimonials', [])
  );
  const [faqItems, setFaqItems] = useState<FaqItem[]>(() =>
    getLocal('faq_items', [])
  );
  const [videoFeature, setVideoFeature] = useState<VideoFeature>(() =>
    getLocal('video_feature', {
      title: '',
      subtitle: '',
      description: '',
      videoUrl: '',
      posterUrl: '',
    })
  );
  const [aboutImages, setAboutImages] = useState<AboutPageImages>(() =>
    getLocal('about_images', {
      storyPortrait: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1200&q=85',
      howWeWork1: 'https://images.unsplash.com/photo-1601121141461-9d6647bca1ed?auto=format&fit=crop&w=800&q=80',
      howWeWork2: 'https://images.unsplash.com/photo-1606800052052-a08af7148866?auto=format&fit=crop&w=800&q=80',
      howWeWork3: 'https://images.unsplash.com/photo-1583939411023-14783179e581?auto=format&fit=crop&w=800&q=80',
      faqBackground: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=2000&q=85',
      ctaBackground: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=2000&q=85',
      portfolioHero: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=2000&q=85',
    })
  );
  const [weddingProjects, setWeddingProjects] = useState<WeddingProject[]>(() =>
    getLocal('wedding_projects', []).map(normalizeWeddingProject)
  );
  const [preWeddingVideos, setPreWeddingVideos] = useState<PreWeddingVideo[]>(() =>
    getLocal('pre_wedding_videos', []).map(normalizePreWeddingVideo)
  );
  const [enquiries, setEnquiries] = useState<EnquiryItem[]>(() =>
    getLocal('enquiries', []).map(normalizeEnquiry)
  );
  const [bookings, setBookings] = useState<BookingItem[]>(() =>
    getLocal('bookings', []).map(normalizeBooking)
  );

  // Fetch ALL data exclusively from Supabase database
  const fetchAllFromDB = async () => {
    try {
      setLoading(true);

      // 1. Fetch site_settings (studio_info, hero_slides, video_feature, wedding_projects, about_images)
      const { data: settingsData, error: settingsError } = await supabase
        .from('site_settings')
        .select('*');

      if (settingsError) {
        console.warn('[CMS] site_settings fetch error:', settingsError.message);
      } else if (settingsData) {
        setIsSupabaseConnected(true);
        settingsData.forEach((row: { key: string; value: any }) => {
          if (row.key === 'studio_info' && row.value) {
            setStudioInfo(row.value);
            setLocal('studio_info', row.value);
          } else if (row.key === 'hero_slides' && Array.isArray(row.value)) {
            const normalized = row.value.map(normalizeHeroSlide);
            setHeroSlides(normalized);
            setLocal('hero_slides', normalized);
          } else if (row.key === 'video_feature' && row.value) {
            setVideoFeature(row.value);
            setLocal('video_feature', row.value);
          } else if (row.key === 'about_images' && row.value) {
            setAboutImages(row.value);
            setLocal('about_images', row.value);
          } else if (row.key === 'wedding_projects' && Array.isArray(row.value)) {
            setWeddingProjects(row.value);
            setLocal('wedding_projects', row.value);
          } else if (row.key === 'pre_wedding_videos' && Array.isArray(row.value)) {
            const normalized = row.value.map(normalizePreWeddingVideo);
            setPreWeddingVideos(normalized);
            setLocal('pre_wedding_videos', normalized);
          }
        });
      }

      // 2. Fetch Portfolio
      const { data: portfolioData, error: portError } = await supabase
        .from('portfolio')
        .select('*')
        .order('id', { ascending: true });

      if (portError) {
        console.warn('[CMS] portfolio fetch error:', portError.message);
      } else if (portfolioData) {
        const normalized = portfolioData.map(normalizeWorkItem);
        setSelectedWork(normalized);
        setLocal('selected_work', normalized);
      }

      // 3. Fetch Pricing Packages
      const { data: pricingData, error: priceError } = await supabase
        .from('pricing_packages')
        .select('*')
        .order('created_at', { ascending: true });

      if (priceError) {
        console.warn('[CMS] pricing_packages fetch error:', priceError.message);
      } else if (pricingData) {
        const normalized = pricingData.map(normalizePricing);
        setPricingPackages(normalized);
        setLocal('pricing_packages', normalized);
      }

      // 4. Fetch Team Members
      const { data: teamData, error: teamError } = await supabase
        .from('team_members')
        .select('*')
        .order('created_at', { ascending: true });

      if (teamError) {
        console.warn('[CMS] team_members fetch error:', teamError.message);
      } else if (teamData) {
        const normalized = teamData.map(normalizeTeamMember);
        setTeamMembers(normalized);
        setLocal('team_members', normalized);
      }

      // 5. Fetch Testimonials
      const { data: testData, error: testError } = await supabase
        .from('testimonials')
        .select('*')
        .order('created_at', { ascending: true });

      if (testError) {
        console.warn('[CMS] testimonials fetch error:', testError.message);
      } else if (testData) {
        setTestimonials(testData);
        setLocal('testimonials', testData);
      }

      // 6. Fetch FAQs
      const { data: faqData, error: faqError } = await supabase
        .from('faqs')
        .select('*')
        .order('created_at', { ascending: true });

      if (faqError) {
        console.warn('[CMS] faqs fetch error:', faqError.message);
      } else if (faqData) {
        setFaqItems(faqData);
        setLocal('faq_items', faqData);
      }

      // 7. Fetch Enquiries
      try {
        let enqData: any[] | null = null;
        let enqError: any = null;

        // In Supabase/Postgres, column names are lowercase (createdat)
        const resEnq = await supabase
          .from('enquiries')
          .select('*')
          .order('createdat', { ascending: false });

        if (resEnq.error) {
          // Fallback: order by id if createdat fails, or plain select
          const fallbackRes = await supabase
            .from('enquiries')
            .select('*')
            .order('id', { ascending: false });
          if (fallbackRes.error) {
            const plainRes = await supabase.from('enquiries').select('*');
            enqData = plainRes.data;
            enqError = plainRes.error;
          } else {
            enqData = fallbackRes.data;
          }
        } else {
          enqData = resEnq.data;
        }

        if (enqError) {
          console.warn('[CMS] enquiries fetch error:', enqError.message);
        } else if (enqData) {
          const normalized = enqData.map(normalizeEnquiry);
          setEnquiries(normalized);
          setLocal('enquiries', normalized);
        }
      } catch (err) {
        console.warn('[CMS] enquiries fetch exception:', err);
      }

      // 9. Fetch bookings
      try {
        let bookData: any = null;
        let bookError: any = null;

        const resBook = await supabase
          .from('bookings')
          .select('*')
          .order('created_at', { ascending: false });

        if (resBook.error) {
          const fallbackRes = await supabase
            .from('bookings')
            .select('*')
            .order('id', { ascending: false });
          if (fallbackRes.error) {
            const plainRes = await supabase.from('bookings').select('*');
            bookData = plainRes.data;
            bookError = plainRes.error;
          } else {
            bookData = fallbackRes.data;
          }
        } else {
          bookData = resBook.data;
        }

        if (bookError) {
          console.warn('[CMS] bookings fetch error:', bookError.message);
        } else if (bookData) {
          const normalized = bookData.map(normalizeBooking);
          setBookings(normalized);
          setLocal('bookings', normalized);
        }
      } catch (err) {
        console.warn('[CMS] bookings fetch exception:', err);
      }

      // 10. Fetch Pre-Wedding Videos (table with fallback to site_settings)
      try {
        let vidData: any[] | null = null;
        let vidError: any = null;

        const resVid = await supabase
          .from('pre_wedding_videos')
          .select('*')
          .order('display_order', { ascending: true });

        if (resVid.error) {
          // Attempt select without display_order ordering
          const plainRes = await supabase.from('pre_wedding_videos').select('*');
          if (plainRes.error) {
            vidError = plainRes.error;
          } else {
            vidData = plainRes.data;
          }
        } else {
          vidData = resVid.data;
        }

        if (vidError) {
          console.info('[CMS] pre_wedding_videos table query fallback (may use site_settings):', vidError.message);
        } else if (vidData && Array.isArray(vidData) && vidData.length > 0) {
          const normalized = vidData.map(normalizePreWeddingVideo);
          setPreWeddingVideos(normalized);
          setLocal('pre_wedding_videos', normalized);
        }
      } catch (err) {
        console.info('[CMS] pre_wedding_videos fetch exception, using cached state:', err);
      }
    } catch (err) {
      console.warn('[CMS] Supabase load error:', err);
    } finally {
      setLoading(false);
    }
  };

const toDbPortfolio = (item: Partial<SelectedWorkItem>) => {
  const res: Record<string, any> = {};
  if (item.id !== undefined) res.id = item.id;
  if (item.title !== undefined) res.title = item.title;
  if (item.category !== undefined) res.category = item.category;
  if (item.imageUrl !== undefined) res.imageurl = item.imageUrl;
  if (item.aspect !== undefined) res.aspect = item.aspect;
  if (item.isFeatured !== undefined) res.isFeatured = item.isFeatured;
  return res;
};

const toDbTeamMember = (item: Partial<TeamMember>) => {
  const res: Record<string, any> = {};
  if (item.id !== undefined) res.id = item.id;
  if (item.name !== undefined) res.name = item.name;
  if (item.role !== undefined) res.role = item.role;
  if (item.bio !== undefined) res.bio = item.bio;
  if (item.imageUrl !== undefined) res.imageurl = item.imageUrl;
  if (item.iconName !== undefined) res.iconname = item.iconName;
  return res;
};

const toDbEnquiry = (item: Partial<EnquiryItem>) => {
  const res: Record<string, any> = {};
  if (item.id !== undefined) res.id = String(item.id);
  if (item.name !== undefined) res.name = item.name;
  if (item.email !== undefined) res.email = item.email;
  if (item.phone !== undefined) res.phone = item.phone;
  if (item.eventDate !== undefined) res.eventdate = item.eventDate;
  if (item.eventLocation !== undefined) res.eventlocation = item.eventLocation;
  if (item.coverageType !== undefined) res.coveragetype = item.coverageType;
  if (item.message !== undefined) res.message = item.message;
  if (item.referralSource !== undefined) res.referralsource = item.referralSource;
  if (item.createdAt !== undefined) res.createdat = item.createdAt;
  if (item.isRead !== undefined) res.isread = Boolean(item.isRead);
  return res;
};

const toDbBooking = (item: Partial<BookingItem>) => {
  const res: Record<string, any> = {};
  if (item.id !== undefined) res.id = item.id;
  if (item.name !== undefined) res.name = item.name;
  if (item.package !== undefined) res.package = item.package;
  if (item.email !== undefined) res.email = item.email;
  if (item.phone !== undefined) res.phone = item.phone;
  if (item.eventDate !== undefined) res.event_date = item.eventDate;
  if (item.eventLocation !== undefined) res.event_location = item.eventLocation;
  if (item.remarks !== undefined) res.remarks = item.remarks;
  if (item.status !== undefined) res.status = item.status;
  if (item.createdAt !== undefined) res.created_at = item.createdAt;
  return res;
};

const toDbPreWeddingVideo = (item: Partial<PreWeddingVideo>) => {
  const res: Record<string, any> = {};
  if (item.id !== undefined) res.id = item.id;
  if (item.title !== undefined) res.title = item.title;
  if (item.coupleNames !== undefined) res.couple_names = item.coupleNames;
  if (item.location !== undefined) res.location = item.location;
  if (item.videoUrl !== undefined) res.video_url = item.videoUrl;
  if (item.posterUrl !== undefined) res.poster_url = item.posterUrl;
  if (item.description !== undefined) res.description = item.description;
  if (item.displayOrder !== undefined) res.display_order = item.displayOrder;
  if (item.isFeatured !== undefined) res.is_featured = item.isFeatured;
  if (item.createdAt !== undefined) res.created_at = item.createdAt;
  return res;
};

  // Safe Supabase write helper with automated column casing retry
  const safeSupabaseWrite = async (
    table: string,
    action: 'insert' | 'update' | 'upsert' | 'delete',
    payload?: any,
    matchKey?: string,
    matchVal?: any
  ) => {
    try {
      const q = supabase.from(table) as any;
      let res;
      if (action === 'insert') res = await q.insert(payload);
      else if (action === 'upsert') res = await q.upsert(payload);
      else if (action === 'update') res = await q.update(payload).eq(matchKey, matchVal);
      else if (action === 'delete') res = await q.delete().eq(matchKey, matchVal);

      if (res?.error) {
        console.warn(`[Supabase] ${table} ${action} initial attempt notice:`, res.error.message);
        if (payload && res.error.message && (res.error.message.includes('column') || res.error.code === 'PGRST204')) {
          // If table is portfolio, try preserving "isFeatured" exact case while lowercasing others
          if (table === 'portfolio') {
            const portfolioMapped = toDbPortfolio(payload);
            let pRes;
            if (action === 'insert') pRes = await supabase.from(table).insert(portfolioMapped);
            else if (action === 'upsert') pRes = await supabase.from(table).upsert(portfolioMapped);
            else if (action === 'update') pRes = await supabase.from(table).update(portfolioMapped).eq(matchKey || 'id', matchVal);
            if (!pRes?.error) return { error: null };
          }

          const lowercased: Record<string, any> = {};
          for (const [k, v] of Object.entries(payload)) {
            lowercased[k.toLowerCase()] = v;
          }
          let retryRes;
          if (action === 'insert') retryRes = await supabase.from(table).insert(lowercased);
          else if (action === 'upsert') retryRes = await supabase.from(table).upsert(lowercased);
          else if (action === 'update') retryRes = await supabase.from(table).update(lowercased).eq((matchKey || '').toLowerCase(), matchVal);

          if (retryRes?.error) {
            console.error(`[Supabase] ${table} ${action} retry error:`, retryRes.error.message);
            return { error: retryRes.error };
          }
          return { error: null };
        }
        console.error(`[Supabase] ${table} ${action} error:`, res.error.message);
        return { error: res.error };
      }
      return { error: null };
    } catch (e: any) {
      console.warn(`[Supabase] ${table} ${action} exception:`, e);
      return { error: e };
    }
  };

  useEffect(() => {
    fetchAllFromDB();
  }, []);

  // Studio Info
  const updateStudioInfo = async (info: StudioInfo) => {
    setStudioInfo(info);
    setLocal('studio_info', info);
    await safeSupabaseWrite('site_settings', 'upsert', { key: 'studio_info', value: info });
  };

  // Hero Slides
  const updateHeroSlides = async (slides: HeroSlide[]) => {
    setHeroSlides(slides);
    setLocal('hero_slides', slides);
    await safeSupabaseWrite('site_settings', 'upsert', { key: 'hero_slides', value: slides });
  };

  // Video Feature
  const updateVideoFeature = async (feature: VideoFeature) => {
    setVideoFeature(feature);
    setLocal('video_feature', feature);
    await safeSupabaseWrite('site_settings', 'upsert', { key: 'video_feature', value: feature });
  };

  // Selected Work CRUD
  const addSelectedWork = async (item: Omit<SelectedWorkItem, 'id'>) => {
    const maxId = selectedWork.reduce((acc, curr) => Math.max(acc, curr.id), 0);
    const newItem: SelectedWorkItem = { ...item, id: maxId + 1 };
    const updated = [newItem, ...selectedWork];
    setSelectedWork(updated);
    setLocal('selected_work', updated);
    await safeSupabaseWrite('portfolio', 'insert', toDbPortfolio(newItem));
  };

  const updateSelectedWork = async (item: SelectedWorkItem) => {
    const updated = selectedWork.map((w) => (w.id === item.id ? item : w));
    setSelectedWork(updated);
    setLocal('selected_work', updated);
    await safeSupabaseWrite('portfolio', 'update', toDbPortfolio(item), 'id', item.id);
  };

  const deleteSelectedWork = async (id: number) => {
    const updated = selectedWork.filter((w) => w.id !== id);
    setSelectedWork(updated);
    setLocal('selected_work', updated);
    await safeSupabaseWrite('portfolio', 'delete', undefined, 'id', id);
  };

  // Pricing Packages CRUD
  const addPricingPackage = async (pkg: PricingPackage) => {
    const updated = [...pricingPackages, pkg];
    setPricingPackages(updated);
    setLocal('pricing_packages', updated);
    await safeSupabaseWrite('pricing_packages', 'insert', pkg);
  };

  const updatePricingPackage = async (pkg: PricingPackage) => {
    const updated = pricingPackages.map((p) => (p.id === pkg.id ? pkg : p));
    setPricingPackages(updated);
    setLocal('pricing_packages', updated);
    await safeSupabaseWrite('pricing_packages', 'update', pkg, 'id', pkg.id);
  };

  const deletePricingPackage = async (id: string) => {
    const updated = pricingPackages.filter((p) => p.id !== id);
    setPricingPackages(updated);
    setLocal('pricing_packages', updated);
    await safeSupabaseWrite('pricing_packages', 'delete', undefined, 'id', id);
  };

  // Team Members CRUD
  const addTeamMember = async (member: TeamMember) => {
    const updated = [...teamMembers, member];
    setTeamMembers(updated);
    setLocal('team_members', updated);
    await safeSupabaseWrite('team_members', 'insert', toDbTeamMember(member));
  };

  const updateTeamMember = async (member: TeamMember) => {
    const updated = teamMembers.map((m) => (m.id === member.id ? member : m));
    setTeamMembers(updated);
    setLocal('team_members', updated);
    await safeSupabaseWrite('team_members', 'update', toDbTeamMember(member), 'id', member.id);
  };

  const deleteTeamMember = async (id: string) => {
    const updated = teamMembers.filter((m) => m.id !== id);
    setTeamMembers(updated);
    setLocal('team_members', updated);
    await safeSupabaseWrite('team_members', 'delete', undefined, 'id', id);
  };

  // Testimonials CRUD
  const addTestimonial = async (test: Testimonial) => {
    const newTest: Testimonial = {
      ...test,
      id: test.id || `test-${Date.now()}`,
    };
    const updated = [...testimonials, newTest];
    setTestimonials(updated);
    setLocal('testimonials', updated);
    await safeSupabaseWrite('testimonials', 'insert', newTest);
  };

  const updateTestimonial = async (test: Testimonial) => {
    const updated = testimonials.map((t) => (t.id === test.id ? test : t));
    setTestimonials(updated);
    setLocal('testimonials', updated);
    await safeSupabaseWrite('testimonials', 'update', test, 'id', test.id);
  };

  const deleteTestimonial = async (idOrIndex: string | number) => {
    const target = testimonials.find((t, idx) =>
      typeof idOrIndex === 'number' ? idx === idOrIndex : t.id === idOrIndex
    );
    const updated = testimonials.filter((t, idx) =>
      typeof idOrIndex === 'number' ? idx !== idOrIndex : t.id !== idOrIndex
    );
    setTestimonials(updated);
    setLocal('testimonials', updated);
    if (target?.id) {
      await safeSupabaseWrite('testimonials', 'delete', undefined, 'id', target.id);
    }
  };

  // FAQ CRUD
  const addFaqItem = async (item: FaqItem) => {
    const updated = [...faqItems, item];
    setFaqItems(updated);
    setLocal('faq_items', updated);
    await safeSupabaseWrite('faqs', 'insert', item);
  };

  const updateFaqItem = async (item: FaqItem) => {
    const updated = faqItems.map((f) => (f.id === item.id ? item : f));
    setFaqItems(updated);
    setLocal('faq_items', updated);
    await safeSupabaseWrite('faqs', 'update', item, 'id', item.id);
  };

  const deleteFaqItem = async (id: string) => {
    const updated = faqItems.filter((f) => f.id !== id);
    setFaqItems(updated);
    setLocal('faq_items', updated);
    await safeSupabaseWrite('faqs', 'delete', undefined, 'id', id);
  };

  // Enquiries
  const addEnquiry = async (enquiryData: Omit<EnquiryItem, 'id' | 'createdAt'>) => {
    const newEnquiry: EnquiryItem = {
      ...enquiryData,
      id: `lead_${Date.now()}`,
      createdAt: new Date().toISOString(),
      isRead: false,
    };
    const updated = [newEnquiry, ...enquiries];
    setEnquiries(updated);
    setLocal('enquiries', updated);
    await safeSupabaseWrite('enquiries', 'insert', toDbEnquiry(newEnquiry));
  };

  const markEnquiryRead = async (id: string) => {
    const updated = enquiries.map((e) => (e.id === id ? { ...e, isRead: true } : e));
    setEnquiries(updated);
    setLocal('enquiries', updated);
    await safeSupabaseWrite('enquiries', 'update', { isread: true }, 'id', id);
  };

  const deleteEnquiry = async (id: string) => {
    const updated = enquiries.filter((e) => e.id !== id);
    setEnquiries(updated);
    setLocal('enquiries', updated);
    await safeSupabaseWrite('enquiries', 'delete', undefined, 'id', id);
  };

  // Bookings CRUD - Direct Supabase table operations
  const fetchBookingsFromDB = async (): Promise<BookingItem[]> => {
    try {
      const { data, error } = await supabase
        .from('bookings')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.warn('[CMS] Supabase direct bookings fetch warning:', error.message);
        return bookings;
      }

      if (data && Array.isArray(data)) {
        const normalized = data.map(normalizeBooking);
        setBookings(normalized);
        setLocal('bookings', normalized);
        return normalized;
      }
    } catch (err) {
      console.warn('[CMS] fetchBookingsFromDB error:', err);
    }
    return bookings;
  };

  const addBooking = async (bookingData: BookingFormData): Promise<BookingItem> => {
    // Generate UUID v4 for Supabase id
    const newId = typeof crypto !== 'undefined' && crypto.randomUUID
      ? crypto.randomUUID()
      : 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
          const r = (Math.random() * 16) | 0;
          const v = c === 'x' ? r : (r & 0x3) | 0x8;
          return v.toString(16);
        });

    let newBooking: BookingItem = {
      ...bookingData,
      id: newId,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };

    // 1. Directly insert into Supabase bookings table
    try {
      const dbPayload = toDbBooking(newBooking);
      const { data, error } = await supabase
        .from('bookings')
        .insert(dbPayload)
        .select('*')
        .single();

      if (error) {
        console.warn('[CMS] Supabase direct insert warning:', error.message);
        await safeSupabaseWrite('bookings', 'insert', dbPayload);
      } else if (data) {
        newBooking = normalizeBooking(data);
      }
    } catch (dbErr) {
      console.warn('[CMS] Supabase booking insert error:', dbErr);
    }

    // Update local state & cache
    setBookings((prev) => {
      const filtered = prev.filter((b) => b.id !== newBooking.id);
      const updated = [newBooking, ...filtered];
      setLocal('bookings', updated);
      return updated;
    });

    // 2. Directly send this database booking to Google Sheets
    try {
      await sendBookingToGoogleSheet(newBooking);
    } catch (sheetErr) {
      console.warn('[CMS] Google Sheets dispatch error:', sheetErr);
    }

    return newBooking;
  };

  const updateBooking = async (id: string, updates: Partial<BookingItem>) => {
    // 1. Direct update to Supabase bookings table
    try {
      await supabase
        .from('bookings')
        .update(toDbBooking(updates))
        .eq('id', id);
    } catch (dbErr) {
      console.warn('[CMS] Supabase update booking error:', dbErr);
      await safeSupabaseWrite('bookings', 'update', toDbBooking(updates), 'id', id);
    }

    const updated = bookings.map((b) => (b.id === id ? { ...b, ...updates } : b));
    setBookings(updated);
    setLocal('bookings', updated);
  };

  const updateBookingStatus = async (id: string, status: BookingStatus) => {
    // 1. Direct update to Supabase bookings table
    try {
      await supabase
        .from('bookings')
        .update({ status })
        .eq('id', id);
    } catch (dbErr) {
      console.warn('[CMS] Supabase update status error:', dbErr);
      await safeSupabaseWrite('bookings', 'update', { status }, 'id', id);
    }

    // 2. Update state and cache
    let updatedBooking: BookingItem | undefined;
    setBookings((prev) => {
      const next = prev.map((b) => {
        if (b.id === id) {
          const u = { ...b, status };
          updatedBooking = u;
          return u;
        }
        return b;
      });
      setLocal('bookings', next);
      return next;
    });

    // 3. Immediately sync updated status to Google Sheets
    if (updatedBooking) {
      try {
        await sendBookingToGoogleSheet(updatedBooking);
      } catch (err) {
        console.warn('[CMS] Google Sheets status sync warning:', err);
      }
    }
  };

  const deleteBooking = async (id: string) => {
    // 1. Direct delete from Supabase bookings table
    try {
      await supabase
        .from('bookings')
        .delete()
        .eq('id', id);
    } catch (dbErr) {
      console.warn('[CMS] Supabase delete booking error:', dbErr);
      await safeSupabaseWrite('bookings', 'delete', undefined, 'id', id);
    }

    const updated = bookings.filter((b) => b.id !== id);
    setBookings(updated);
    setLocal('bookings', updated);
  };

  const resetToDefaults = () => {
    localStorage.removeItem(STORAGE_KEY_PREFIX + 'studio_info');
    localStorage.removeItem(STORAGE_KEY_PREFIX + 'hero_slides');
    localStorage.removeItem(STORAGE_KEY_PREFIX + 'selected_work');
    localStorage.removeItem(STORAGE_KEY_PREFIX + 'pricing_packages');
    localStorage.removeItem(STORAGE_KEY_PREFIX + 'team_members');
    localStorage.removeItem(STORAGE_KEY_PREFIX + 'testimonials');
    localStorage.removeItem(STORAGE_KEY_PREFIX + 'faq_items');
    localStorage.removeItem(STORAGE_KEY_PREFIX + 'video_feature');
    localStorage.removeItem(STORAGE_KEY_PREFIX + 'about_images');
    localStorage.removeItem(STORAGE_KEY_PREFIX + 'wedding_projects');
    localStorage.removeItem(STORAGE_KEY_PREFIX + 'pre_wedding_videos');
    localStorage.removeItem(STORAGE_KEY_PREFIX + 'enquiries');
    localStorage.removeItem(STORAGE_KEY_PREFIX + 'bookings');
    fetchAllFromDB();
  };

  // About Page Images
  const updateAboutImages = async (images: AboutPageImages) => {
    setAboutImages(images);
    setLocal('about_images', images);
    await safeSupabaseWrite('site_settings', 'upsert', { key: 'about_images', value: images });
  };

  // Wedding Projects CRUD
  const addWeddingProject = async (proj: WeddingProject) => {
    const updated = [proj, ...weddingProjects];
    setWeddingProjects(updated);
    setLocal('wedding_projects', updated);
    await safeSupabaseWrite('site_settings', 'upsert', { key: 'wedding_projects', value: updated });
  };

  const updateWeddingProject = async (proj: WeddingProject) => {
    const updated = weddingProjects.map((p) => (p.id === proj.id ? proj : p));
    setWeddingProjects(updated);
    setLocal('wedding_projects', updated);
    await safeSupabaseWrite('site_settings', 'upsert', { key: 'wedding_projects', value: updated });
  };

  const deleteWeddingProject = async (id: string) => {
    const updated = weddingProjects.filter((p) => p.id !== id);
    setWeddingProjects(updated);
    setLocal('wedding_projects', updated);
    await safeSupabaseWrite('site_settings', 'upsert', { key: 'wedding_projects', value: updated });
  };

  // Pre-Wedding Videos CRUD (Dual write: Supabase pre_wedding_videos table + site_settings fallback)
  const addPreWeddingVideo = async (video: PreWeddingVideo) => {
    const updated = [video, ...preWeddingVideos];
    setPreWeddingVideos(updated);
    setLocal('pre_wedding_videos', updated);

    // 1. Direct table write attempt
    try {
      const dbPayload = toDbPreWeddingVideo(video);
      const { error } = await supabase.from('pre_wedding_videos').insert(dbPayload);
      if (error) {
        console.warn('[CMS] pre_wedding_videos table insert warning, falling back to site_settings:', error.message);
        await safeSupabaseWrite('site_settings', 'upsert', { key: 'pre_wedding_videos', value: updated });
      }
    } catch (e) {
      console.warn('[CMS] pre_wedding_videos insert exception, saving to site_settings:', e);
      await safeSupabaseWrite('site_settings', 'upsert', { key: 'pre_wedding_videos', value: updated });
    }
  };

  const updatePreWeddingVideo = async (video: PreWeddingVideo) => {
    const updated = preWeddingVideos.map((v) => (v.id === video.id ? video : v));
    setPreWeddingVideos(updated);
    setLocal('pre_wedding_videos', updated);

    // 1. Direct table write attempt
    try {
      const dbPayload = toDbPreWeddingVideo(video);
      const { error } = await supabase
        .from('pre_wedding_videos')
        .update(dbPayload)
        .eq('id', video.id);
      if (error) {
        console.warn('[CMS] pre_wedding_videos table update warning, falling back to site_settings:', error.message);
        await safeSupabaseWrite('site_settings', 'upsert', { key: 'pre_wedding_videos', value: updated });
      }
    } catch (e) {
      console.warn('[CMS] pre_wedding_videos update exception, saving to site_settings:', e);
      await safeSupabaseWrite('site_settings', 'upsert', { key: 'pre_wedding_videos', value: updated });
    }
  };

  const deletePreWeddingVideo = async (id: string) => {
    const updated = preWeddingVideos.filter((v) => v.id !== id);
    setPreWeddingVideos(updated);
    setLocal('pre_wedding_videos', updated);

    // 1. Direct table delete attempt
    try {
      const { error } = await supabase.from('pre_wedding_videos').delete().eq('id', id);
      if (error) {
        console.warn('[CMS] pre_wedding_videos table delete warning, falling back to site_settings:', error.message);
        await safeSupabaseWrite('site_settings', 'upsert', { key: 'pre_wedding_videos', value: updated });
      }
    } catch (e) {
      console.warn('[CMS] pre_wedding_videos delete exception, saving to site_settings:', e);
      await safeSupabaseWrite('site_settings', 'upsert', { key: 'pre_wedding_videos', value: updated });
    }
  };

  return (
    <CMSContext.Provider
      value={{
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
        loading,
        isSupabaseConnected,
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
        addEnquiry,
        markEnquiryRead,
        deleteEnquiry,
        fetchBookingsFromDB,
        addBooking,
        updateBooking,
        updateBookingStatus,
        deleteBooking,
        reloadData: fetchAllFromDB,
        resetToDefaults,
      }}
    >
      {children}
    </CMSContext.Provider>
  );
};

export const useCMS = () => {
  const context = useContext(CMSContext);
  if (!context) {
    throw new Error('useCMS must be used within a CMSProvider');
  }
  return context;
};
