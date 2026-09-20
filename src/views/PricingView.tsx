import React from 'react';
import { NavPage } from '../types';
import { Check } from 'lucide-react';
import { ScrollReveal } from '../components/ScrollReveal';
import { useCMS } from '../lib/cmsStore';

interface PricingViewProps {
  onNavigate: (page: NavPage, selectedPackage?: string) => void;
}

export const PricingView: React.FC<PricingViewProps> = ({ onNavigate }) => {
  const { pricingPackages } = useCMS();
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
      <section className="pb-24 px-6 sm:px-10 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch pt-4">
          {pricingPackages.map((pkg, idx) => {
            const isPopular = pkg.isPopular;
            return (
              <ScrollReveal
                key={pkg.id}
                delay={idx * 0.1}
                distance={18}
                duration={0.65}
                className="flex"
              >
                <div
                  className={`relative w-full bg-white flex flex-col justify-between p-8 sm:p-10 transition-all ${
                    isPopular
                      ? 'border-2 border-neutral-900 shadow-xl'
                      : 'border border-neutral-200'
                  }`}
                >
                  {/* Popular Badge */}
                  {pkg.badge && (
                    <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-neutral-950 text-white text-[10px] tracking-[0.22em] font-medium uppercase px-4 py-1">
                      {pkg.badge}
                    </div>
                  )}

                  {/* Top: Title, Duration & Price */}
                  <div>
                    <div className="text-center pb-8 border-b border-neutral-100">
                      <h3 className="text-xs tracking-[0.25em] uppercase text-neutral-800 font-medium">
                        {pkg.name}
                      </h3>
                      <p className="text-xs text-neutral-400 font-sans tracking-wider mt-1.5 mb-6">
                        {pkg.coverage}
                      </p>
                      <div className="font-serif text-3xl sm:text-4xl text-neutral-900 font-normal tracking-tight">
                        {pkg.price}
                      </div>
                    </div>

                    {/* Features list */}
                    <ul className="py-8 space-y-4 text-xs sm:text-[13px] text-neutral-600 font-sans">
                      {pkg.features.map((feature, fIdx) => (
                        <li key={fIdx} className="flex items-start space-x-3">
                          <Check size={14} className="text-neutral-900 mt-0.5 shrink-0" />
                          <span className="leading-snug">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Bottom: Book Link */}
                  <div className="pt-6 border-t border-neutral-100 text-center">
                    <button
                      id={`book-package-${pkg.id}`}
                      onClick={() => onNavigate('CONTACT', pkg.name)}
                      className="inline-flex items-center text-xs tracking-[0.22em] uppercase font-medium text-neutral-900 border-b border-neutral-900 pb-1 hover:text-neutral-600 hover:border-neutral-400 transition-colors cursor-pointer"
                    >
                      <span>BOOK {pkg.name}</span>
                      <span className="ml-2 font-sans text-sm">→</span>
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
              className="inline-flex items-center text-xs tracking-[0.25em] uppercase font-medium text-neutral-900 border-b border-neutral-900 pb-1 hover:text-neutral-600 hover:border-neutral-400 transition-colors cursor-pointer"
            >
              <span>GET A CUSTOM QUOTE</span>
              <span className="ml-2 font-sans text-sm">→</span>
            </button>
          </div>
        </ScrollReveal>
      </section>
    </div>
  );
};
