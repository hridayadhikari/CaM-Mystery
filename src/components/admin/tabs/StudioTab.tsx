import React, { useState } from 'react';
import { Edit2, X } from 'lucide-react';
import { useCMS } from '../../../lib/cmsStore';

interface StudioTabProps {
  showToast: (msg: string) => void;
}

export const StudioTab: React.FC<StudioTabProps> = ({ showToast }) => {
  const { studioInfo, updateStudioInfo } = useCMS();

  // Modal state
  const [studioModalOpen, setStudioModalOpen] = useState(false);
  const [studioForm, setStudioForm] = useState(studioInfo);

  // Sync if studioInfo updates
  React.useEffect(() => {
    setStudioForm(studioInfo);
  }, [studioInfo]);

  return (
    <div className="bg-white border border-neutral-200 p-6 sm:p-8 shadow-xs rounded-xs space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-serif text-xl text-neutral-900">
            Studio & Contact Settings
          </h2>
          <p className="text-xs text-neutral-500">
            Lead contact information shown in the footer and contact sections.
          </p>
        </div>
        <button
          onClick={() => {
            setStudioForm(studioInfo);
            setStudioModalOpen(true);
          }}
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-neutral-900 hover:bg-neutral-800 text-white text-xs uppercase tracking-wider rounded-xs cursor-pointer transition-colors"
        >
          <Edit2 size={13} />
          <span>Edit Studio Details</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-neutral-700">
        <div className="p-4 bg-neutral-50 border border-neutral-200 rounded-xs">
          <span className="text-[10px] uppercase tracking-wider text-neutral-400 block mb-1">
            Lead Name
          </span>
          <span className="font-serif text-base text-neutral-900">{studioInfo.name}</span>
        </div>
        <div className="p-4 bg-neutral-50 border border-neutral-200 rounded-xs">
          <span className="text-[10px] uppercase tracking-wider text-neutral-400 block mb-1">
            Phone Number
          </span>
          <span className="text-neutral-900 font-medium">{studioInfo.phone}</span>
        </div>
        <div className="p-4 bg-neutral-50 border border-neutral-200 rounded-xs">
          <span className="text-[10px] uppercase tracking-wider text-neutral-400 block mb-1">
            Email Address
          </span>
          <span className="text-neutral-900 font-medium">{studioInfo.email}</span>
        </div>
        <div className="p-4 bg-neutral-50 border border-neutral-200 rounded-xs">
          <span className="text-[10px] uppercase tracking-wider text-neutral-400 block mb-1">
            Physical Address
          </span>
          <span className="text-neutral-900 font-medium">{studioInfo.address}</span>
        </div>
      </div>

      {/* Modal: Edit Studio Info */}
      {studioModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white border border-neutral-200 p-6 sm:p-8 rounded-sm shadow-2xl max-w-xl w-full space-y-5 animate-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
              <h3 className="font-serif text-xl text-neutral-900 font-normal">
                Edit Studio & Contact Details
              </h3>
              <button
                onClick={() => setStudioModalOpen(false)}
                className="text-neutral-400 hover:text-neutral-700 p-1 cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-neutral-600 mb-1">
                    Studio Lead Name
                  </label>
                  <input
                    type="text"
                    value={studioForm.name}
                    onChange={(e) =>
                      setStudioForm({ ...studioForm, name: e.target.value })
                    }
                    className="w-full text-xs px-3 py-2 border border-neutral-300 rounded-xs focus:border-neutral-900 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wider text-neutral-600 mb-1">
                    Phone Number
                  </label>
                  <input
                    type="text"
                    value={studioForm.phone}
                    onChange={(e) =>
                      setStudioForm({ ...studioForm, phone: e.target.value })
                    }
                    className="w-full text-xs px-3 py-2 border border-neutral-300 rounded-xs focus:border-neutral-900 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wider text-neutral-600 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={studioForm.email}
                    onChange={(e) =>
                      setStudioForm({ ...studioForm, email: e.target.value })
                    }
                    className="w-full text-xs px-3 py-2 border border-neutral-300 rounded-xs focus:border-neutral-900 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wider text-neutral-600 mb-1">
                    Google Maps Link
                  </label>
                  <input
                    type="url"
                    value={studioForm.mapsUrl}
                    onChange={(e) =>
                      setStudioForm({ ...studioForm, mapsUrl: e.target.value })
                    }
                    className="w-full text-xs px-3 py-2 border border-neutral-300 rounded-xs focus:border-neutral-900 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-neutral-600 mb-1">
                  Physical Studio Address
                </label>
                <input
                  type="text"
                  value={studioForm.address}
                  onChange={(e) =>
                    setStudioForm({ ...studioForm, address: e.target.value })
                  }
                  className="w-full text-xs px-3 py-2 border border-neutral-300 rounded-xs focus:border-neutral-900 outline-none"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-neutral-100">
              <button
                onClick={() => setStudioModalOpen(false)}
                className="px-4 py-2 border border-neutral-300 text-neutral-700 text-xs uppercase tracking-wider rounded-xs hover:bg-neutral-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  await updateStudioInfo(studioForm);
                  setStudioModalOpen(false);
                  showToast('Studio settings saved.');
                }}
                className="px-5 py-2 bg-neutral-900 hover:bg-neutral-800 text-white text-xs uppercase tracking-wider rounded-xs cursor-pointer font-medium"
              >
                Save Settings
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
