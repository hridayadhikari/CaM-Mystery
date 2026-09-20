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

export interface AboutPageImages {
  storyPortrait: string;
  howWeWork1: string;
  howWeWork2: string;
  howWeWork3: string;
  faqBackground: string;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  bio: string;
  imageUrl: string;
  iconName?: 'Camera' | 'Film' | 'Eye' | 'Sparkles';
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
}

export interface EnquiryItem {
  id: string;
  name: string;
  email: string;
  eventDate?: string;
  eventLocation?: string;
  coverageType?: string;
  message: string;
  referralSource?: string;
  createdAt: string;
  isRead?: boolean;
}

export interface EnquiryFormData {
  name: string;
  email: string;
  eventDate: string;
  eventLocation: string;
  coverageType: string;
  message: string;
  referralSource: string;
}
