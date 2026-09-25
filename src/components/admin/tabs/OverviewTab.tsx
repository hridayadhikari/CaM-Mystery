import React from 'react';
import { Plus, DollarSign, Image as ImageIcon, Mail } from 'lucide-react';
import { useCMS } from '../../../lib/cmsStore';

export type TabType =
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

interface OverviewTabProps {
  onSelectTab: (tab: TabType) => void;
  onAddStory: () => void;
  onAddPricing: () => void;
  onEditVideoTeaser: () => void;
}

export const OverviewTab: React.FC<OverviewTabProps> = ({
  onSelectTab,
  onAddStory,
  onAddPricing,
  onEditVideoTeaser,
}) => {
  const {
    preWeddingStories,
    weddingProjects,
    preWeddingVideos,
    pricingPackages,
    teamMembers,
    enquiries,
    bookings,
  } = useCMS();

  return (
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
              {preWeddingStories.length + weddingProjects.length + preWeddingVideos.length}
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
            onClick={onAddStory}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-neutral-900 text-white hover:bg-neutral-800 text-xs tracking-wider uppercase rounded-xs transition-colors cursor-pointer"
          >
            <Plus size={13} />
            <span>Add Pre-Wedding Story</span>
          </button>
          <button
            onClick={onAddPricing}
            className="inline-flex items-center gap-1.5 px-4 py-2 border border-neutral-300 hover:border-neutral-900 text-neutral-800 text-xs tracking-wider uppercase rounded-xs transition-colors cursor-pointer"
          >
            <DollarSign size={13} />
            <span>Add Package</span>
          </button>
          <button
            onClick={onEditVideoTeaser}
            className="inline-flex items-center gap-1.5 px-4 py-2 border border-neutral-300 hover:border-neutral-900 text-neutral-800 text-xs tracking-wider uppercase rounded-xs transition-colors cursor-pointer"
          >
            <ImageIcon size={13} />
            <span>Update Video Teaser</span>
          </button>
          <button
            onClick={() => onSelectTab('enquiries')}
            className="inline-flex items-center gap-1.5 px-4 py-2 border border-neutral-300 hover:border-neutral-900 text-neutral-800 text-xs tracking-wider uppercase rounded-xs transition-colors cursor-pointer"
          >
            <Mail size={13} />
            <span>Check Enquiries</span>
          </button>
        </div>
      </div>
    </div>
  );
};
