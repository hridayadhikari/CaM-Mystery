import React from 'react';
import { ExternalLink } from 'lucide-react';
import { useCMS } from '../../../lib/cmsStore';
import { getOptimizedCloudinaryUrl } from '../../../lib/cloudinary';
import { CloudinaryImageUpload } from '../CloudinaryImageUpload';
import { NavPage } from '../../../types';

interface AboutTabProps {
  onNavigate: (page: NavPage) => void;
  showToast: (msg: string) => void;
}

export const AboutTab: React.FC<AboutTabProps> = ({ onNavigate, showToast }) => {
  const { aboutImages, updateAboutImages } = useCMS();

  return (
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
  );
};
