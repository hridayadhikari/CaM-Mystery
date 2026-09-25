import React, { useState } from 'react';
import { Plus, Edit2, Trash2, X } from 'lucide-react';
import { useCMS } from '../../../lib/cmsStore';
import { FaqItem } from '../../../types';

interface FaqsTabProps {
  showToast: (msg: string) => void;
  requestDeleteConfirm: (title: string, message: string, onConfirm: () => void) => void;
}

export const FaqsTab: React.FC<FaqsTabProps> = ({ showToast, requestDeleteConfirm }) => {
  const { faqItems, addFaqItem, updateFaqItem, deleteFaqItem } = useCMS();

  // Modals state
  const [newFaqModal, setNewFaqModal] = useState(false);
  const [newFaqForm, setNewFaqForm] = useState({
    id: '',
    question: '',
    answer: '',
  });
  const [editingFaq, setEditingFaq] = useState<FaqItem | null>(null);

  return (
    <div className="space-y-6">
      <div className="bg-white border border-neutral-200 p-6 shadow-xs rounded-xs flex items-center justify-between">
        <div>
          <h2 className="font-serif text-xl text-neutral-900">
            Frequently Asked Questions
          </h2>
          <p className="text-xs text-neutral-500">
            Questions displayed on the About page accordion.
          </p>
        </div>
        <button
          onClick={() => {
            setNewFaqForm({ id: `faq-${Date.now()}`, question: '', answer: '' });
            setNewFaqModal(true);
          }}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-neutral-900 hover:bg-neutral-800 text-white text-xs uppercase tracking-wider rounded-xs cursor-pointer transition-colors"
        >
          <Plus size={14} />
          <span>Add Question</span>
        </button>
      </div>

      <div className="space-y-4">
        {faqItems.map((faq) => (
          <div
            key={faq.id}
            className="bg-white border border-neutral-200 p-5 rounded-xs shadow-xs space-y-2"
          >
            <div className="flex items-start justify-between">
              <h4 className="font-serif text-base text-neutral-900 font-normal">
                {faq.question}
              </h4>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setEditingFaq({ ...faq })}
                  className="text-neutral-500 hover:text-black cursor-pointer p-1"
                  title="Edit Question"
                >
                  <Edit2 size={13} />
                </button>
                <button
                  onClick={() => {
                    requestDeleteConfirm(
                      'Delete FAQ',
                      `Delete question: "${faq.question}"?`,
                      async () => {
                        await deleteFaqItem(faq.id);
                        showToast('FAQ deleted.');
                      }
                    );
                  }}
                  className="text-neutral-400 hover:text-rose-600 cursor-pointer p-1"
                  title="Delete"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
            <p className="text-xs text-neutral-600 leading-relaxed font-sans">
              {faq.answer}
            </p>
          </div>
        ))}
      </div>

      {/* Modal: Add New FAQ */}
      {newFaqModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white border border-neutral-200 p-6 sm:p-8 rounded-sm shadow-2xl max-w-lg w-full space-y-5 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
              <h3 className="font-serif text-xl text-neutral-900 font-normal">
                Add New FAQ
              </h3>
              <button
                onClick={() => setNewFaqModal(false)}
                className="text-neutral-400 hover:text-neutral-700 p-1 cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs uppercase tracking-wider text-neutral-600 mb-1">
                  Question
                </label>
                <input
                  type="text"
                  placeholder="e.g. Do you deliver raw unedited footage?"
                  value={newFaqForm.question}
                  onChange={(e) =>
                    setNewFaqForm({
                      ...newFaqForm,
                      question: e.target.value,
                      id: `faq-${Date.now()}`,
                    })
                  }
                  className="w-full text-xs px-3 py-2 border border-neutral-300 rounded-xs focus:border-neutral-900 outline-none"
                />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wider text-neutral-600 mb-1">
                  Answer
                </label>
                <textarea
                  rows={4}
                  placeholder="Detailed answer..."
                  value={newFaqForm.answer}
                  onChange={(e) =>
                    setNewFaqForm({ ...newFaqForm, answer: e.target.value })
                  }
                  className="w-full text-xs px-3 py-2 border border-neutral-300 rounded-xs focus:border-neutral-900 outline-none"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-neutral-100">
              <button
                onClick={() => setNewFaqModal(false)}
                className="px-4 py-2 border border-neutral-300 text-neutral-700 text-xs uppercase tracking-wider rounded-xs hover:bg-neutral-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  if (!newFaqForm.question || !newFaqForm.answer) {
                    alert('Both question and answer are required.');
                    return;
                  }
                  await addFaqItem(newFaqForm);
                  setNewFaqModal(false);
                  showToast('FAQ created.');
                }}
                className="px-5 py-2 bg-neutral-900 hover:bg-neutral-800 text-white text-xs uppercase tracking-wider rounded-xs cursor-pointer font-medium"
              >
                Save FAQ
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Edit FAQ */}
      {editingFaq && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white border border-neutral-200 p-6 sm:p-8 rounded-sm shadow-2xl max-w-lg w-full space-y-5 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
              <h3 className="font-serif text-xl text-neutral-900 font-normal">
                Edit FAQ
              </h3>
              <button
                onClick={() => setEditingFaq(null)}
                className="text-neutral-400 hover:text-neutral-700 p-1 cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs uppercase tracking-wider text-neutral-600 mb-1">
                  Question
                </label>
                <input
                  type="text"
                  value={editingFaq.question}
                  onChange={(e) =>
                    setEditingFaq({ ...editingFaq, question: e.target.value })
                  }
                  className="w-full text-xs px-3 py-2 border border-neutral-300 rounded-xs focus:border-neutral-900 outline-none"
                />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wider text-neutral-600 mb-1">
                  Answer
                </label>
                <textarea
                  rows={4}
                  value={editingFaq.answer}
                  onChange={(e) =>
                    setEditingFaq({ ...editingFaq, answer: e.target.value })
                  }
                  className="w-full text-xs px-3 py-2 border border-neutral-300 rounded-xs focus:border-neutral-900 outline-none"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-neutral-100">
              <button
                onClick={() => setEditingFaq(null)}
                className="px-4 py-2 border border-neutral-300 text-neutral-700 text-xs uppercase tracking-wider rounded-xs hover:bg-neutral-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  await updateFaqItem(editingFaq);
                  setEditingFaq(null);
                  showToast('FAQ updated.');
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
