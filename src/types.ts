export type NavPage = 'HOME' | 'ABOUT' | 'PORTFOLIO' | 'KNOW OUR TEAM' | 'PRICING' | 'CONTACT' | 'ADMIN';

export interface StudioInfo {
  name: string;
  phone: string;
  email: string;
  address: string;
  mapsUrl: string;
}

export type ContentFit = 'cover' | 'contain' | 'fill' | 'scale-down' | 'none';

export interface HeroSlide {
  id: number;
  title: string;
  subtitle: string;
  imageUrl: string;
  contentFit?: ContentFit;
}

export interface VideoFeature {
  title: string;
  subtitle: string;
  description: string;
  videoUrl: string;
  posterUrl: string;
}

export interface PreWeddingVideo {
  id: string;
  title: string;
  coupleNames?: string;
  location?: string;
  videoUrl: string;
  posterUrl?: string;
  description?: string;
  displayOrder?: number;
  isFeatured?: boolean;
  createdAt?: string;
}

export interface AboutPageImages {
  storyPortrait: string;
  howWeWork1: string;
  howWeWork2: string;
  howWeWork3: string;
  faqBackground: string;
  ctaBackground?: string;
  portfolioHero?: string;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  bio: string;
  imageUrl: string;
  iconName?: 'Camera' | 'Film' | 'Eye' | 'Sparkles';
  displayOrder?: number;
}

export interface PricingPackage {
  id: string;
  name: string;
  badge?: string;
  coverage: string;
  price: string;
  features: string[];
  isPopular?: boolean;
}

export interface Testimonial {
  id?: string;
  quote: string;
  authors: string;
}

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

export interface SelectedWorkItem {
  id: number;
  title: string;
  category: string;
  imageUrl: string;
  aspect?: string;
  isFeatured?: boolean;
  displayOrder?: number;
  object_position_x?: number;
  object_position_y?: number;
}

export interface WeddingProject {
  id: string;
  title: string;
  coupleNames: string;
  location?: string;
  date?: string;
  coverImage: string;
  description?: string;
  images: string[];
  featuredImages?: string[];
  cover_position_x?: number;
  cover_position_y?: number;
  photoFraming?: Record<string, { x: number; y: number }>;
}

export type PreWeddingStory = WeddingProject;

export interface EnquiryItem {
  id: string;
  name: string;
  email: string;
  phone?: string;
  eventDate?: string;
  eventLocation?: string;
  coverageType?: string;
  message: string;
  referralSource?: string;
  createdAt: string;
  isRead?: boolean;
}

export type BookingStatus = 'pending' | 'confirmed' | 'cancelled' | 'completed';

export interface BookingItem {
  id: string;
  name: string;
  package: string;
  email: string;
  phone: string;
  eventDate: string;
  eventLocation: string;
  remarks?: string;
  status: BookingStatus;
  createdAt: string;
}

export interface BookingFormData {
  name: string;
  package: string;
  email: string;
  phone: string;
  eventDate: string;
  eventLocation: string;
  remarks?: string;
}

