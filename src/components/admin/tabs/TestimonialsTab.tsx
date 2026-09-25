import React, { useState } from 'react';
import { Plus, Edit2, Trash2, X } from 'lucide-react';
import { useCMS } from '../../../lib/cmsStore';
import { Testimonial } from '../../../types';

interface TestimonialsTabProps {
  showToast: (msg: string) => void;
  requestDeleteConfirm: (title: string, message: string, onConfirm: () => void) => void;
}

export const TestimonialsTab: React.FC<TestimonialsTabProps> = ({
  showToast,
  requestDeleteConfirm,
}) => {
  const { testimonials, addTestimonial, updateTestimonial, deleteTestimonial } = useCMS();

  // Modals state
  const [newTestimonialModal, setNewTestimonialModal] = useState(false);
  const [newTestimonialForm, setNewTestimonialForm] = useState({
    quote: '',
    authors: '',
  });
  const [editingTestimonial, setEditingTestimonial] = useState<Testimonial | null>(null);

  return (
    <div className="space-y-6">
      <div className="bg-white border border-neutral-200 p-6 shadow-xs rounded-xs flex items-center justify-between">
        <div>
          <h2 className="font-serif text-xl text-neutral-900">
            Kind Words & Reviews
          </h2>
          <p className="text-xs text-neutral-500">
            Quotes and praise from brides and couples.
          </p>
        </div>
        <button
          onClick={() => {
            setNewTestimonialForm({ quote: '', authors: '' });
            setNewTestimonialModal(true);
          }}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-neutral-900 hover:bg-neutral-800 text-white text-xs uppercase tracking-wider rounded-xs cursor-pointer transition-colors"
        >
          <Plus size={14} />
          <span>Add Review</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {testimonials.map((test, idx) => (
          <div
            key={test.id || idx}
            className="bg-white border border-neutral-200 p-6 rounded-xs shadow-xs flex flex-col justify-between space-y-4"
          >
            <p className="font-serif italic text-neutral-700 text-sm leading-relaxed">
              {test.quote}
            </p>
            <div className="pt-4 border-t border-neutral-100 flex items-center justify-between">
              <span className="text-[10px] tracking-[0.2em] uppercase font-semibold text-neutral-500">
                {test.authors}
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() => setEditingTestimonial({ ...test })}
                  className="text-xs text-neutral-500 hover:text-black p-1 cursor-pointer"
                  title="Edit"
                >
                  <Edit2 size={13} />
                </button>
                <button
                  onClick={() => {
                    requestDeleteConfirm(
                      'Delete Review',
                      `Delete the review from ${test.authors}?`,
                      async () => {
                        await deleteTestimonial(test.id || idx);
                        showToast('Review deleted.');
                      }
                    );
                  }}
                  className="text-xs text-rose-600 hover:text-rose-800 p-1 cursor-pointer"
                  title="Delete"
                >
                  <Trash2 size={13} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal: Add Bride & Groom Review */}
      {newTestimonialModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white border border-neutral-200 p-6 sm:p-8 rounded-sm shadow-2xl max-w-lg w-full space-y-5 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
              <h3 className="font-serif text-xl text-neutral-900 font-normal">
                Add Bride & Groom Review
              </h3>
              <button
                onClick={() => setNewTestimonialModal(false)}
                className="text-neutral-400 hover:text-neutral-700 p-1 cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs uppercase tracking-wider text-neutral-600 mb-1">
                  Couple / Author Names
                </label>
                <input
                  type="text"
                  placeholder="e.g. PRIYA + SAMEER"
                  value={newTestimonialForm.authors}
                  onChange={(e) =>
                    setNewTestimonialForm({
                      ...newTestimonialForm,
                      authors: e.target.value.toUpperCase(),
                    })
                  }
                  className="w-full text-xs px-3 py-2 border border-neutral-300 rounded-xs focus:border-neutral-900 outline-none"
                />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wider text-neutral-600 mb-1">
                  Review Quote
                </label>
                <textarea
                  rows={4}
                  placeholder="‘Working with CaM-Mystery was...’"
                  value={newTestimonialForm.quote}
                  onChange={(e) =>
                    setNewTestimonialForm({ ...newTestimonialForm, quote: e.target.value })
                  }
                  className="w-full text-xs px-3 py-2 border border-neutral-300 rounded-xs focus:border-neutral-900 outline-none"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-neutral-100">
              <button
                onClick={() => setNewTestimonialModal(false)}
                className="px-4 py-2 border border-neutral-300 text-neutral-700 text-xs uppercase tracking-wider rounded-xs hover:bg-neutral-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  if (!newTestimonialForm.quote || !newTestimonialForm.authors) {
                    alert('Quote and authors are required.');
                    return;
                  }
                  await addTestimonial(newTestimonialForm);
                  setNewTestimonialModal(false);
                  showToast('Review added.');
                }}
                className="px-5 py-2 bg-neutral-900 hover:bg-neutral-800 text-white text-xs uppercase tracking-wider rounded-xs cursor-pointer font-medium"
              >
                Save Review
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Edit Testimonial */}
      {editingTestimonial && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white border border-neutral-200 p-6 sm:p-8 rounded-sm shadow-2xl max-w-lg w-full space-y-5 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
              <h3 className="font-serif text-xl text-neutral-900 font-normal">
                Edit Review
              </h3>
              <button
                onClick={() => setEditingTestimonial(null)}
                className="text-neutral-400 hover:text-neutral-700 p-1 cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs uppercase tracking-wider text-neutral-600 mb-1">
                  Couple / Author Names
                </label>
                <input
                  type="text"
                  value={editingTestimonial.authors}
                  onChange={(e) =>
                    setEditingTestimonial({
                      ...editingTestimonial,
                      authors: e.target.value.toUpperCase(),
                    })
                  }
                  className="w-full text-xs px-3 py-2 border border-neutral-300 rounded-xs focus:border-neutral-900 outline-none"
                />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wider text-neutral-600 mb-1">
                  Review Quote
                </label>
                <textarea
                  rows={4}
                  value={editingTestimonial.quote}
                  onChange={(e) =>
                    setEditingTestimonial({ ...editingTestimonial, quote: e.target.value })
                  }
                  className="w-full text-xs px-3 py-2 border border-neutral-300 rounded-xs focus:border-neutral-900 outline-none"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-neutral-100">
              <button
                onClick={() => setEditingTestimonial(null)}
                className="px-4 py-2 border border-neutral-300 text-neutral-700 text-xs uppercase tracking-wider rounded-xs hover:bg-neutral-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  await updateTestimonial(editingTestimonial);
                  setEditingTestimonial(null);
                  showToast('Review updated.');
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
