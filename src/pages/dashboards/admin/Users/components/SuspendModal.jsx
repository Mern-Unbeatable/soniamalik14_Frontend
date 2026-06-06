import React, { useState } from 'react';
import { X } from 'lucide-react';

const SuspendModal = ({ isOpen, onClose, onSubmit, userId }) => {
    const [reason, setReason] = useState('');

    const handleSubmit = () => {
        if (reason.trim()) {
            onSubmit(userId, reason);
            setReason('');
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg max-w-md w-full mx-4 p-6">
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-medium text-gray-900">Suspend</h2>
                    <button
                        onClick={onClose}
                        className="text-black bg-[#D9D9D9] p-1 rounded-full"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Content */}
                <div className="mb-6">
                    <label className="block text-base  text-gray-700 mb-2">
                        Why suspend
                    </label>
                    <textarea
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                        placeholder="Write why suspend this user"
                        className="w-full px-3 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#117b73] resize-none"
                        rows="4"
                    />
                </div>

                {/* Submit Button */}
                <button
                    onClick={handleSubmit}
                    disabled={!reason.trim()}
                    className="w-full px-4 py-2 bg-btn-primary text-white font-medium rounded-lg hover:bg-teal-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Submit
                </button>
            </div>
        </div>
    );
};

export default SuspendModal;
