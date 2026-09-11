import React, { useState } from 'react';
import { STUDIO_INFO } from '../data/content';
import { ChevronDown, CheckCircle2 } from 'lucide-react';
import { ScrollReveal } from '../components/ScrollReveal';

interface ContactViewProps {
  initialPackage?: string;
}

export const ContactView: React.FC<ContactViewProps> = ({ initialPackage }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    eventDate: '',
    eventLocation: '',
    coverageType: initialPackage || '',
    message: '',
    referralSource: '',
  });

  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email) {
      alert('Please provide your name and email address.');
      return;
    }
    setSubmitted(true);
  };

  const coverageOptions = [
    'Choose an option',
    'Silver Package (2 Days)',
    'Gold Package (2 Days)',
    'Diamond Package (2 Days)',
    'Pre-Wedding Shoot Only',
    'Cinematic Film Only',
    'Custom Package',
  ];

  const referralOptions = [
    'Choose an option',
    'Instagram',
    'Google Search',
    'Friend or Family Recommendation',
    'Attended a Wedding We Photographed',
    'Other',
  ];

  return (
    <div className="w-full">
      {/* 1. Header */}
      <section className="pt-20 sm:pt-28 pb-12 px-6 sm:px-12 text-center max-w-3xl mx-auto">
        <ScrollReveal distance={16} duration={0.65}>
          <h1 className="font-serif text-3xl sm:text-5xl md:text-6xl text-neutral-900 font-normal tracking-tight mb-4">
            Tell Us About Your Day
          </h1>
          <p className="text-neutral-600 font-sans text-xs sm:text-sm max-w-xl mx-auto leading-relaxed">
            We're honoured you're considering us. Share a few details about your
            celebration below and we'll be in touch within 48 hours to begin the
            conversation.
          </p>
        </ScrollReveal>
      </section>

      {/* 2. Enquiry Form Card */}
      <section className="px-6 pb-24 max-w-2xl mx-auto">
        <ScrollReveal distance={18} delay={0.08} duration={0.7}>
          <div className="bg-[#f9f9f9] p-8 sm:p-14 border border-neutral-100 shadow-sm">
          {submitted ? (
            <div className="text-center py-12 space-y-4 animate-in fade-in duration-300">
              <CheckCircle2 size={44} className="mx-auto text-neutral-800" />
              <h3 className="font-serif text-2xl text-neutral-900">
                Thank You, {formData.name}
              </h3>
              <p className="text-xs sm:text-sm text-neutral-600 max-w-md mx-auto leading-relaxed">
                Your celebration details have been received. Sanjib Bhowmik and the
                team will review your dates and reach out within 48 hours.
              </p>
              <div className="pt-4">
                <button
                  onClick={() => {
                    setSubmitted(false);
                    setFormData({
                      name: '',
                      email: '',
                      eventDate: '',
                      eventLocation: '',
                      coverageType: '',
                      message: '',
                      referralSource: '',
                    });
                  }}
                  className="text-xs tracking-[0.2em] uppercase text-neutral-500 hover:text-black underline cursor-pointer"
                >
                  Send another enquiry
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Name */}
              <div className="space-y-1">
                <label
                  htmlFor="contact-name"
                  className="block text-xs text-neutral-600 font-sans"
                >
                  Your Name *
                </label>
                <input
                  id="contact-name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-transparent border-b border-neutral-300 focus:border-neutral-900 py-2 text-sm text-neutral-900 outline-none transition-colors"
                />
              </div>

              {/* Email */}
              <div className="space-y-1">
                <label
                  htmlFor="contact-email"
                  className="block text-xs text-neutral-600 font-sans"
                >
                  Email Address *
                </label>
                <input
                  id="contact-email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full bg-transparent border-b border-neutral-300 focus:border-neutral-900 py-2 text-sm text-neutral-900 outline-none transition-colors"
                />
              </div>

              {/* Event Date & Location (2 columns) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                <div className="space-y-1">
                  <label
                    htmlFor="contact-date"
                    className="block text-xs text-neutral-600 font-sans"
                  >
                    Event Date
                  </label>
                  <input
                    id="contact-date"
                    type="date"
                    value={formData.eventDate}
                    onChange={(e) => setFormData({ ...formData, eventDate: e.target.value })}
                    className="w-full bg-transparent border-b border-neutral-300 focus:border-neutral-900 py-2 text-sm text-neutral-900 outline-none transition-colors"
                  />
                </div>

                <div className="space-y-1">
                  <label
                    htmlFor="contact-location"
                    className="block text-xs text-neutral-600 font-sans"
                  >
                    Event Location
                  </label>
                  <input
                    id="contact-location"
                    type="text"
                    placeholder="City / Venue"
                    value={formData.eventLocation}
                    onChange={(e) => setFormData({ ...formData, eventLocation: e.target.value })}
                    className="w-full bg-transparent border-b border-neutral-300 focus:border-neutral-900 py-2 text-sm text-neutral-900 outline-none transition-colors"
                  />
                </div>
              </div>

              {/* Type of Coverage */}
              <div className="space-y-1">
                <label
                  htmlFor="contact-coverage"
                  className="block text-xs text-neutral-600 font-sans"
                >
                  Type of Coverage *
                </label>
                <div className="relative">
                  <select
                    id="contact-coverage"
                    required
                    value={formData.coverageType}
                    onChange={(e) => setFormData({ ...formData, coverageType: e.target.value })}
                    className="w-full appearance-none bg-transparent border-b border-neutral-300 focus:border-neutral-900 py-2 text-sm text-neutral-900 outline-none cursor-pointer"
                  >
                    {coverageOptions.map((opt, i) => (
                      <option key={i} value={i === 0 ? '' : opt} disabled={i === 0}>
                        {opt}
                      </option>
                    ))}
                  </select>
                  <ChevronDown
                    size={14}
                    className="absolute right-2 top-3 pointer-events-none text-neutral-500"
                  />
                </div>
              </div>

              {/* Your Message */}
              <div className="space-y-1">
                <label
                  htmlFor="contact-message"
                  className="block text-xs text-neutral-600 font-sans"
                >
                  Your Message *
                </label>
                <textarea
                  id="contact-message"
                  rows={4}
                  required
                  placeholder="Share your vision — venues, timeline, vibe, must-have moments."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full bg-transparent border-b border-neutral-300 focus:border-neutral-900 py-2 text-sm text-neutral-900 placeholder:text-neutral-400 outline-none resize-y transition-colors"
                />
              </div>

              {/* How Did You Find Us? */}
              <div className="space-y-1">
                <label
                  htmlFor="contact-referral"
                  className="block text-xs text-neutral-600 font-sans"
                >
                  How Did You Find Us?
                </label>
                <div className="relative">
                  <select
                    id="contact-referral"
                    value={formData.referralSource}
                    onChange={(e) => setFormData({ ...formData, referralSource: e.target.value })}
                    className="w-full appearance-none bg-transparent border-b border-neutral-300 focus:border-neutral-900 py-2 text-sm text-neutral-900 outline-none cursor-pointer"
                  >
                    {referralOptions.map((opt, i) => (
                      <option key={i} value={i === 0 ? '' : opt} disabled={i === 0}>
                        {opt}
                      </option>
                    ))}
                  </select>
                  <ChevronDown
                    size={14}
                    className="absolute right-2 top-3 pointer-events-none text-neutral-500"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-4">
                <button
                  id="contact-submit-btn"
                  type="submit"
                  className="w-full sm:w-auto px-8 py-3.5 bg-neutral-950 text-white hover:bg-neutral-800 transition-colors text-xs tracking-[0.22em] uppercase font-medium cursor-pointer"
                >
                  SEND MY ENQUIRY
                </button>
              </div>
            </form>
          )}
        </div>
        </ScrollReveal>
      </section>

      {/* 3. Studio Details */}
      <section className="pb-28 px-6 text-center max-w-xl mx-auto space-y-3">
        <ScrollReveal distance={16} duration={0.65}>
          <span className="text-[11px] tracking-[0.25em] uppercase text-neutral-400 font-medium">
            STUDIO
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl text-neutral-900 font-normal">
            {STUDIO_INFO.name}
          </h2>
          <div className="space-y-1 text-xs sm:text-sm text-neutral-600 font-sans pt-1">
            <p>
              <a
                href={`tel:${STUDIO_INFO.phone}`}
                className="hover:text-black transition-colors"
              >
                {STUDIO_INFO.phone}
              </a>
            </p>
            <p>
              <a
                href={`mailto:${STUDIO_INFO.email}`}
                className="hover:text-black transition-colors"
              >
                {STUDIO_INFO.email}
              </a>
            </p>
            <p className="text-neutral-500">{STUDIO_INFO.address}</p>
          </div>
          <div className="pt-3">
            <a
              id="view-on-google-maps"
              href={STUDIO_INFO.mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block text-[11px] tracking-[0.22em] uppercase text-neutral-900 border-b border-neutral-900 pb-0.5 hover:text-neutral-600 hover:border-neutral-400 transition-colors"
            >
              VIEW ON GOOGLE MAPS
            </a>
          </div>
        </ScrollReveal>
      </section>
    </div>
  );
};
