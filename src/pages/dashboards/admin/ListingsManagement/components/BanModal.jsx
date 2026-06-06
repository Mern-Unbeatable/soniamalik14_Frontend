import React, { useState } from 'react';
import { X } from 'lucide-react';

const BanModal = ({ isOpen, onClose, onSubmit, isSubmitting = false }) => {
    const [banReason, setBanReason] = useState('');

    const handleSubmit = () => {
        if (!banReason.trim()) return;
        onSubmit(banReason);
    };

    const handleClose = () => {
        setBanReason('');
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg p-4  w-full max-w-xl mx-4">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-semibold text-gray-900">Reject Listing</h2>
                    <button
                        onClick={handleClose}
                        className="p-1 bg-[#D9D9D9] rounded-full transition-colors"
                        disabled={isSubmitting}
                    >
                        <X className="w-5 h-5 text-black" />
                    </button>
                </div>

                {/* Content */}
                <div className="space-y-4">
                    <div>
                        <label className="block text-lg font-medium text-gray-900 mb-2">
                            Reject reason
                        </label>
                        <textarea
                            value={banReason}
                            onChange={(e) => setBanReason(e.target.value)}
                            placeholder="Write reject reason"
                            className="w-full h-64 p-3 bg-[#F9F9F9] rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-[#0F766E] focus:border-transparent resize-none"
                            disabled={isSubmitting}
                        />
                    </div>
                </div>

                {/* Footer */}
                <div className="flex justify-end gap-3 mt-6">
                    <button
                        onClick={handleClose}
                        className="px-4 py-2 text-sm font-medium text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50"
                        disabled={isSubmitting}
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        className="px-4 py-2 text-sm font-semibold text-white bg-btn-primary rounded-lg hover:bg-teal-800 transition-colors disabled:opacity-60"
                        disabled={isSubmitting || !banReason.trim()}
                    >
                        {isSubmitting ? 'Submitting...' : 'Submit'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default BanModal;
