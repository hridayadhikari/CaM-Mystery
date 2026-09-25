import React from 'react';
import { RotateCcw } from 'lucide-react';
import { useCMS } from '../../../lib/cmsStore';

interface EnquiriesTabProps {
  showToast: (msg: string) => void;
  requestDeleteConfirm: (title: string, message: string, onConfirm: () => void) => void;
}

export const EnquiriesTab: React.FC<EnquiriesTabProps> = ({ showToast, requestDeleteConfirm }) => {
  const { enquiries, markEnquiryRead, deleteEnquiry, reloadData } = useCMS();

  return (
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
  );
};
