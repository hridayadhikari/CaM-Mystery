import React, { useEffect } from 'react';
import { AlertTriangle, Trash2, CheckCircle, LogOut, X } from 'lucide-react';

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  type?: 'danger' | 'primary' | 'success';
  onConfirm: () => void;
  onClose: () => void;
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  type = 'danger',
  onConfirm,
  onClose,
}) => {
  const closedByPopstateRef = React.useRef(false);

  useEffect(() => {
    if (!isOpen) return;
    window.history.pushState({ modal: 'confirm-dialog' }, '');
    closedByPopstateRef.current = false;

    const handlePopState = () => {
      closedByPopstateRef.current = true;
      onClose();
    };

    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('popstate', handlePopState);
      if (!closedByPopstateRef.current && window.history.state?.modal === 'confirm-dialog') {
        window.history.back();
      }
    };
  }, [isOpen, onClose]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const isDanger = type === 'danger';
  const isSuccess = type === 'success';

  return (
    <div
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md bg-white border border-neutral-200 shadow-2xl rounded-sm p-6 space-y-4 animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                isDanger
                  ? 'bg-rose-50 text-rose-600'
                  : isSuccess
                  ? 'bg-emerald-50 text-emerald-600'
                  : 'bg-neutral-100 text-neutral-800'
              }`}
            >
              {isDanger ? (
                <Trash2 size={18} />
              ) : isSuccess ? (
                <CheckCircle size={18} />
              ) : (
                <AlertTriangle size={18} />
              )}
            </div>
            <div>
              <h3 className="font-serif text-lg text-neutral-900 font-normal">
                {title}
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-neutral-400 hover:text-neutral-700 p-1 cursor-pointer"
            aria-label="Close dialog"
          >
            <X size={18} />
          </button>
        </div>

        <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed font-sans pl-1">
          {message}
        </p>

        <div className="flex justify-end gap-3 pt-3 border-t border-neutral-100">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs tracking-wider uppercase text-neutral-600 hover:bg-neutral-100 rounded-xs transition-colors cursor-pointer"
          >
            {cancelText}
          </button>
          <button
            type="button"
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className={`px-5 py-2 text-xs tracking-wider uppercase font-medium text-white rounded-xs transition-colors cursor-pointer ${
              isDanger
                ? 'bg-rose-600 hover:bg-rose-700'
                : isSuccess
                ? 'bg-emerald-600 hover:bg-emerald-700'
                : 'bg-neutral-950 hover:bg-neutral-800'
            }`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};
