import React, { useState } from 'react';
import { X } from 'lucide-react';

const EventBanModal = ({ isOpen, onClose, onSubmit }) => {
    const [banReason, setBanReason] = useState('');

    const handleSubmit = () => {
        onSubmit(banReason);
        setBanReason('');
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg p-4 w-full max-w-xl mx-4">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-gray-900">Banned A Event</h2>
                    <button
                        onClick={onClose}
                        className="p-1 bg-[#D9D9D9] rounded-full transition-colors"
                    >
                        <X className="w-5 h-5 text-black" />
                    </button>
                </div>

                {/* Content */}
                <div className="space-y-4">
                    <div>
                        <label className="block text-lg font-semibold text-gray-900 mb-2">
                            Why Banned This Event
                        </label>
                        <textarea
                            value={banReason}
                            onChange={(e) => setBanReason(e.target.value)}
                            placeholder="Write why this event banned"
                            className="w-full h-64 p-3 bg-[#F9F9F9] rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-[#0f766e] focus:border-transparent resize-none"
                        />
                    </div>
                </div>

                {/* Footer */}
                <div className="flex justify-end gap-3 mt-6">
                    <button
                        onClick={handleSubmit}
                        className="px-4 py-2 text-sm font-semibold text-white bg-[#0f766e] rounded-lg hover:bg-teal-800 transition-colors"
                    >
                        Submit
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EventBanModal;
