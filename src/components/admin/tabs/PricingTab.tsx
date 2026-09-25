import React, { useState } from 'react';
import { Plus, Check, Trash2, X } from 'lucide-react';
import { useCMS } from '../../../lib/cmsStore';
import { PricingPackage } from '../../../types';

interface PricingTabProps {
  showToast: (msg: string) => void;
  requestDeleteConfirm: (title: string, message: string, onConfirm: () => void) => void;
  newPricingModal: boolean;
  setNewPricingModal: (open: boolean) => void;
}

export const PricingTab: React.FC<PricingTabProps> = ({
  showToast,
  requestDeleteConfirm,
  newPricingModal,
  setNewPricingModal,
}) => {
  const { pricingPackages, addPricingPackage, updatePricingPackage, deletePricingPackage } = useCMS();

  // Modal forms
  const [newPricingForm, setNewPricingForm] = useState<PricingPackage>({
    id: '',
    name: '',
    coverage: '2 Days Coverage',
    price: 'Rs. 95,000',
    badge: '',
    isPopular: false,
    features: ['Traditional Photography', 'Traditional Videography'],
  });
  const [editingPricingPkg, setEditingPricingPkg] = useState<PricingPackage | null>(null);
  const [featureInput, setFeatureInput] = useState('');
  const [editFeatureInput, setEditFeatureInput] = useState('');

  return (
    <div className="space-y-6">
      <div className="bg-white border border-neutral-200 p-6 shadow-xs rounded-xs flex items-center justify-between">
        <div>
          <h2 className="font-serif text-xl text-neutral-900">
            Wedding Packages & Collections
          </h2>
          <p className="text-xs text-neutral-500">
            Manage rates, included items, and highlight popular collections.
          </p>
        </div>
        <button
          onClick={() => setNewPricingModal(true)}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-neutral-900 hover:bg-neutral-800 text-white text-xs uppercase tracking-wider rounded-xs cursor-pointer transition-colors"
        >
          <Plus size={14} />
          <span>Add Package</span>
        </button>
      </div>

      {/* Existing Packages Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {pricingPackages.map((pkg) => (
          <div
            key={pkg.id}
            className={`bg-white p-6 border rounded-xs shadow-xs space-y-4 flex flex-col justify-between ${
              pkg.isPopular ? 'border-neutral-900' : 'border-neutral-200'
            }`}
          >
            <div>
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] tracking-wider uppercase text-neutral-400">
                    {pkg.coverage}
                  </span>
                  <h3 className="font-serif text-lg text-neutral-900 mt-0.5">
                    {pkg.name}
                  </h3>
                </div>
                {pkg.badge && (
                  <span className="text-[9px] uppercase tracking-widest bg-neutral-900 text-white px-2 py-0.5 rounded-xs">
                    {pkg.badge}
                  </span>
                )}
              </div>

              <div className="text-xl font-serif text-neutral-900 my-3">
                {pkg.price}
              </div>

              <ul className="space-y-1.5 text-xs text-neutral-600 pt-2 border-t border-neutral-100">
                {pkg.features.map((feat, i) => (
                  <li key={i} className="flex items-start gap-1.5">
                    <Check size={13} className="text-emerald-600 mt-0.5 shrink-0" />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="pt-4 border-t border-neutral-100 flex items-center justify-between">
              <button
                onClick={() => setEditingPricingPkg({ ...pkg })}
                className="text-xs uppercase tracking-wider text-neutral-800 hover:text-black font-medium underline cursor-pointer"
              >
                Edit Details
              </button>

              <button
                onClick={() => {
                  requestDeleteConfirm(
                    'Delete Package',
                    `Are you sure you want to remove the "${pkg.name}" collection?`,
                    async () => {
                      await deletePricingPackage(pkg.id);
                      showToast('Package removed.');
                    }
                  );
                }}
                className="text-xs uppercase tracking-wider text-rose-600 hover:text-rose-800 cursor-pointer"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal: Add New Pricing Package */}
      {newPricingModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white border border-neutral-200 p-6 sm:p-8 rounded-sm shadow-2xl max-w-xl w-full space-y-5 animate-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
              <h3 className="font-serif text-xl text-neutral-900 font-normal">
                Create New Wedding Package
              </h3>
              <button
                onClick={() => setNewPricingModal(false)}
                className="text-neutral-400 hover:text-neutral-700 p-1 cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-neutral-600 mb-1">
                    Package Name
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. PLATINUM PACKAGE"
                    value={newPricingForm.name}
                    onChange={(e) =>
                      setNewPricingForm({
                        ...newPricingForm,
                        name: e.target.value,
                        id: e.target.value.toLowerCase().replace(/\s+/g, '-'),
                      })
                    }
                    className="w-full text-xs px-3 py-2 border border-neutral-300 rounded-xs focus:border-neutral-900 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wider text-neutral-600 mb-1">
                    Price Display
                  </label>
                  <input
                    type="text"
                    placeholder="Rs. 1,25,000"
                    value={newPricingForm.price}
                    onChange={(e) =>
                      setNewPricingForm({ ...newPricingForm, price: e.target.value })
                    }
                    className="w-full text-xs px-3 py-2 border border-neutral-300 rounded-xs focus:border-neutral-900 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wider text-neutral-600 mb-1">
                    Coverage
                  </label>
                  <input
                    type="text"
                    placeholder="2 Days Coverage"
                    value={newPricingForm.coverage}
                    onChange={(e) =>
                      setNewPricingForm({ ...newPricingForm, coverage: e.target.value })
                    }
                    className="w-full text-xs px-3 py-2 border border-neutral-300 rounded-xs focus:border-neutral-900 outline-none"
                  />
                </div>
              </div>

              <label className="flex items-center gap-2 text-xs text-neutral-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={newPricingForm.isPopular}
                  onChange={(e) =>
                    setNewPricingForm({
                      ...newPricingForm,
                      isPopular: e.target.checked,
                      badge: e.target.checked ? 'MOST POPULAR' : '',
                    })
                  }
                />
                <span>Highlight as Most Popular</span>
              </label>

              <div className="space-y-2">
                <label className="block text-xs uppercase tracking-wider text-neutral-600">
                  Included Features
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Add feature (e.g. Drone Shoot — 1 Day)"
                    value={featureInput}
                    onChange={(e) => setFeatureInput(e.target.value)}
                    className="flex-1 text-xs px-3 py-2 border border-neutral-300 rounded-xs focus:border-neutral-900 outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (featureInput.trim()) {
                        setNewPricingForm({
                          ...newPricingForm,
                          features: [...newPricingForm.features, featureInput.trim()],
                        });
                        setFeatureInput('');
                      }
                    }}
                    className="px-3.5 py-2 bg-neutral-200 hover:bg-neutral-300 text-neutral-800 text-xs uppercase tracking-wider rounded-xs cursor-pointer"
                  >
                    Add
                  </button>
                </div>

                <div className="flex flex-wrap gap-2 pt-1">
                  {newPricingForm.features.map((f, fIdx) => (
                    <span
                      key={fIdx}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-neutral-100 border border-neutral-200 rounded-xs text-xs text-neutral-700"
                    >
                      <span>{f}</span>
                      <button
                        type="button"
                        onClick={() => {
                          setNewPricingForm({
                            ...newPricingForm,
                            features: newPricingForm.features.filter((_, i) => i !== fIdx),
                          });
                        }}
                        className="text-neutral-400 hover:text-rose-600"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-neutral-100">
              <button
                onClick={() => setNewPricingModal(false)}
                className="px-4 py-2 border border-neutral-300 text-neutral-700 text-xs uppercase tracking-wider rounded-xs hover:bg-neutral-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  if (!newPricingForm.name || !newPricingForm.price) {
                    alert('Package name and price are required.');
                    return;
                  }
                  await addPricingPackage(newPricingForm);
                  setNewPricingModal(false);
                  showToast('Package created.');
                }}
                className="px-5 py-2 bg-neutral-900 hover:bg-neutral-800 text-white text-xs uppercase tracking-wider rounded-xs cursor-pointer font-medium"
              >
                Save Package
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Edit Existing Pricing Package */}
      {editingPricingPkg && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white border border-neutral-200 p-6 sm:p-8 rounded-sm shadow-2xl max-w-xl w-full space-y-5 animate-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
              <h3 className="font-serif text-xl text-neutral-900 font-normal">
                Edit Package: {editingPricingPkg.name}
              </h3>
              <button
                onClick={() => setEditingPricingPkg(null)}
                className="text-neutral-400 hover:text-neutral-700 p-1 cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-neutral-600 mb-1">
                    Package Name
                  </label>
                  <input
                    type="text"
                    value={editingPricingPkg.name}
                    onChange={(e) =>
                      setEditingPricingPkg({ ...editingPricingPkg, name: e.target.value })
                    }
                    className="w-full text-xs px-3 py-2 border border-neutral-300 rounded-xs focus:border-neutral-900 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wider text-neutral-600 mb-1">
                    Price Display
                  </label>
                  <input
                    type="text"
                    value={editingPricingPkg.price}
                    onChange={(e) =>
                      setEditingPricingPkg({ ...editingPricingPkg, price: e.target.value })
                    }
                    className="w-full text-xs px-3 py-2 border border-neutral-300 rounded-xs focus:border-neutral-900 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wider text-neutral-600 mb-1">
                    Coverage
                  </label>
                  <input
                    type="text"
                    value={editingPricingPkg.coverage}
                    onChange={(e) =>
                      setEditingPricingPkg({ ...editingPricingPkg, coverage: e.target.value })
                    }
                    className="w-full text-xs px-3 py-2 border border-neutral-300 rounded-xs focus:border-neutral-900 outline-none"
                  />
                </div>
              </div>

              <label className="flex items-center gap-2 text-xs text-neutral-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={editingPricingPkg.isPopular}
                  onChange={(e) =>
                    setEditingPricingPkg({
                      ...editingPricingPkg,
                      isPopular: e.target.checked,
                      badge: e.target.checked ? 'MOST POPULAR' : undefined,
                    })
                  }
                />
                <span>Highlight as Most Popular</span>
              </label>

              <div className="space-y-2">
                <label className="block text-xs uppercase tracking-wider text-neutral-600">
                  Included Features
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Add feature"
                    value={editFeatureInput}
                    onChange={(e) => setEditFeatureInput(e.target.value)}
                    className="flex-1 text-xs px-3 py-2 border border-neutral-300 rounded-xs focus:border-neutral-900 outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (editFeatureInput.trim()) {
                        setEditingPricingPkg({
                          ...editingPricingPkg,
                          features: [...editingPricingPkg.features, editFeatureInput.trim()],
                        });
                        setEditFeatureInput('');
                      }
                    }}
                    className="px-3.5 py-2 bg-neutral-200 hover:bg-neutral-300 text-neutral-800 text-xs uppercase tracking-wider rounded-xs cursor-pointer"
                  >
                    Add
                  </button>
                </div>

                <div className="flex flex-wrap gap-2 pt-1">
                  {editingPricingPkg.features.map((f, fIdx) => (
                    <span
                      key={fIdx}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-neutral-100 border border-neutral-200 rounded-xs text-xs text-neutral-700"
                    >
                      <span>{f}</span>
                      <button
                        type="button"
                        onClick={() => {
                          setEditingPricingPkg({
                            ...editingPricingPkg,
                            features: editingPricingPkg.features.filter((_, i) => i !== fIdx),
                          });
                        }}
                        className="text-neutral-400 hover:text-rose-600"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-neutral-100">
              <button
                onClick={() => setEditingPricingPkg(null)}
                className="px-4 py-2 border border-neutral-300 text-neutral-700 text-xs uppercase tracking-wider rounded-xs hover:bg-neutral-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  await updatePricingPackage(editingPricingPkg);
                  setEditingPricingPkg(null);
                  showToast('Package updated.');
                }}
                className="px-5 py-2 bg-neutral-900 hover:bg-neutral-800 text-white text-xs uppercase tracking-wider rounded-xs cursor-pointer font-medium"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
