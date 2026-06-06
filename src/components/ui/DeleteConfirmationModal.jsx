import React, { useState } from 'react';
import { X, AlertTriangle } from 'lucide-react';
import Button from './Button';

const DeleteConfirmationModal = ({ isOpen, onClose, onConfirm, title = "Delete Event", message = "Are you sure you want to delete this event? This action cannot be undone." }) => {
    const [isProcessing, setIsProcessing] = useState(false);
    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
            onMouseDown={(e) => {
                if (e.target === e.currentTarget) onClose();
            }}
        >
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-gray-200">
                    <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
                    <button
                        onClick={onClose}
                        className="text-[#000000] bg-[#D9D9D9] rounded-full p-1 transition-colors hover:bg-gray-300"
                        aria-label="Close"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Content */}
                <div className=" p-4 md:p-6">
                    <div className="flex flex-col items-center justify-center gap-4">
                        <AlertTriangle className="w-8 h-8 text-red-600 mb-2" />
                        <p className="text-gray-700 text-base text-center">{message}</p>
                    </div>
                </div>

                {/* Footer */}
                <div className="p-4 border-t border-gray-200 flex gap-3">
                    <Button
                        onClick={onClose}
                        variant="outline"
                        className="flex-1 rounded-lg py-2 !border-2 !border-gray-300 !bg-white !text-gray-700 hover:!bg-gray-50"
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={async () => {
                            if (isProcessing) return;
                            setIsProcessing(true);
                            try {
                                await onConfirm();
                                // Ensure modal closes after successful confirm.
                                try {
                                    onClose && onClose();
                                } catch (e) { }
                            } catch (e) {
                                // parent handles toast/errors
                            } finally {
                                setIsProcessing(false);
                            }
                        }}
                        disabled={isProcessing}
                        variant="primary"
                        className="flex-1 rounded-lg py-2 !bg-red-600 !border-red-600 hover:!bg-red-700"
                    >
                        {isProcessing ? 'Deleting...' : 'Delete'}
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default DeleteConfirmationModal;
