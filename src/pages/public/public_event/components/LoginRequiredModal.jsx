import React from 'react';
import { AlertTriangle, X } from 'lucide-react';

const LoginRequiredModal = ({ isOpen, onClose, onLogin }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-110 flex items-center justify-center bg-black/50 px-4" role="dialog" aria-modal="true" aria-labelledby="login-required-title">
      <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
        <div className="mb-4 flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-amber-100 p-2">
              <AlertTriangle className="h-5 w-5 text-amber-600" />
            </div>
            <h3 id="login-required-title" className="text-lg font-semibold text-gray-900">
              Login Required
            </h3>
          </div>
          <button
            onClick={onClose}
            className="rounded-md p-1 text-gray-500 transition-colors hover:bg-gray-100"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <p className="mb-6 text-sm leading-relaxed text-gray-600">
          Please log in first to view event details.
        </p>

        <div className="flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={onLogin}
            className="rounded-lg bg-btn-primary px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#0d655d]"
          >
            Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginRequiredModal;
