import React, { useState } from 'react';
import { NavPage } from '../types';
import { Check } from 'lucide-react';
import { ScrollReveal } from '../components/ScrollReveal';
import { useCMS } from '../lib/cmsStore';
import { BookingModal } from '../components/BookingModal';

interface PricingViewProps {
  onNavigate: (page: NavPage, selectedPackage?: string) => void;
}

export const PricingView: React.FC<PricingViewProps> = ({ onNavigate }) => {
  const { pricingPackages } = useCMS();
  const [bookingModalPackage, setBookingModalPackage] = useState<string | null>(null);

  return (
    <div className="w-full">
      {/* 1. Header Section */}
      <section className="pt-20 sm:pt-28 pb-14 px-6 sm:px-12 text-center max-w-4xl mx-auto">
        <ScrollReveal distance={16} duration={0.65}>
          <span className="text-[11px] tracking-[0.25em] uppercase text-neutral-400 font-medium">
            WEDDING PACKAGES
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl md:text-6xl text-neutral-900 font-normal tracking-tight mt-4 mb-5">
            Choose Your Perfect Package
          </h1>
          <p className="text-neutral-600 font-sans text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            Every package includes our full dedication, artistry, and the highest
            quality coverage for your special day.
          </p>
        </ScrollReveal>
      </section>

      {/* 2. Three Pricing Cards */}
      <section className="pb-16 sm:pb-20 px-4 sm:px-8 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch pt-2">
          {(pricingPackages || []).map((pkg, idx) => {
            const isPopular = pkg.isPopular;
            const features = Array.isArray(pkg.features) ? pkg.features : [];
            return (
              <ScrollReveal
                key={pkg.id}
                delay={idx * 0.1}
                distance={18}
                className="flex"
              >
                <div
                  className={`w-full flex flex-col justify-between p-5 sm:p-6 md:p-7 border rounded-xs transition-all duration-300 relative bg-white text-neutral-900 ${
                    isPopular
                      ? 'border-2 border-neutral-900 shadow-md'
                      : 'border-neutral-200 hover:border-neutral-400'
                  }`}
                >
                  {/* Popular Badge */}
                  {pkg.badge && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-neutral-900 text-white text-[9px] tracking-[0.18em] uppercase font-bold py-0.5 px-2.5 rounded-xs">
                      {pkg.badge}
                    </div>
                  )}

                  <div>
                    {/* Header */}
                    <div className="text-center pb-4 border-b border-neutral-100 flex flex-col items-center">
                      <h3 className="text-xs tracking-[0.22em] uppercase text-neutral-800 font-medium text-center">
                        {pkg.name}
                      </h3>
                      <p className="text-[11px] text-neutral-400 font-sans tracking-wider mt-1 mb-3 text-center w-full">
                        {pkg.coverage}
                      </p>
                      <div className="font-serif text-2xl sm:text-3xl text-neutral-900 font-normal tracking-tight text-center">
                        {pkg.price}
                      </div>
                    </div>

                    {/* Features list */}
                    <ul className="py-4 space-y-2.5 text-xs text-neutral-600 font-sans">
                      {features.map((feature, fIdx) => (
                        <li key={fIdx} className="flex items-start space-x-2.5">
                          <Check size={13} className="text-neutral-900 mt-0.5 shrink-0" />
                          <span className="leading-snug text-[11.5px] sm:text-xs">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Bottom: Book Link */}
                  <div className="pt-4 border-t border-neutral-100 text-center">
                    <button
                      id={`book-package-${pkg.id}`}
                      onClick={() => setBookingModalPackage(pkg.name)}
                      className="inline-flex items-center text-[10px] sm:text-xs tracking-[0.14em] sm:tracking-[0.2em] uppercase font-medium text-neutral-900 border-b border-neutral-900 pb-0.5 hover:text-neutral-600 hover:border-neutral-400 transition-colors cursor-pointer whitespace-nowrap"
                    >
                      <span>BOOK {pkg.name}</span>
                      <span className="ml-1 sm:ml-1.5 font-sans text-xs">→</span>
                    </button>
                  </div>
                </div>
              </ScrollReveal>
            );
          })}
        </div>

        {/* 3. Bottom Notice & Custom Quote */}
        <ScrollReveal distance={14} delay={0.1} className="mt-20 text-center space-y-5 max-w-xl mx-auto">
          <p className="text-neutral-600 font-sans text-xs sm:text-sm leading-relaxed">
            All packages are customisable. Reach out to discuss your specific
            requirements and we'll build the perfect coverage for your day.
          </p>
          <div>
            <button
              id="pricing-custom-quote-btn"
              onClick={() => onNavigate('CONTACT', 'Custom Package')}
              className="inline-flex items-center text-[10px] sm:text-xs tracking-[0.14em] sm:tracking-[0.25em] uppercase font-medium text-neutral-900 border-b border-neutral-900 pb-1 hover:text-neutral-600 hover:border-neutral-400 transition-colors cursor-pointer whitespace-nowrap"
            >
              <span>GET A CUSTOM QUOTE</span>
              <span className="ml-1.5 sm:ml-2 font-sans text-xs sm:text-sm">→</span>
            </button>
          </div>
        </ScrollReveal>
      </section>

      {/* Booking Form Modal */}
      <BookingModal
        isOpen={Boolean(bookingModalPackage)}
        packageName={bookingModalPackage || ''}
        onClose={() => setBookingModalPackage(null)}
      />
    </div>
  );
};
