export type NavPage = 'HOME' | 'ABOUT' | 'PORTFOLIO' | 'KNOW OUR TEAM' | 'PRICING' | 'CONTACT';

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
