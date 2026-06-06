import React from 'react';
import { X } from 'lucide-react';

const ApplicantModal = ({ applicant, onClose }) => {
    if (!applicant) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
            onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}
        >
            <div className="bg-white rounded-lg shadow-xl w-full max-w-lg mx-4 sm:mx-6">
                <div className="flex items-start justify-between p-4 border-b border-gray-100">
                    <div>
                        <h3 className="text-lg font-semibold">Applicant Details</h3>
                    </div>
                    <button onClick={onClose} className="text-gray-600 bg-gray-100 rounded-full p-1">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
                    <div className="text-sm">
                        <div className="font-medium">{applicant.name}</div>
                        <div className="text-gray-600 mt-1">{applicant.phone}</div>
                        <div className="text-gray-600 mt-1">{applicant.email}</div>
                    </div>

                    {applicant.eventName && (
                        <div className="text-sm">
                            <div className="font-medium">Event Name:</div>
                            <div className="text-gray-700">{applicant.eventName}</div>
                        </div>
                    )}

                    <div>
                        <p className="text-sm text-gray-700 leading-relaxed">{applicant.message}</p>
                    </div>
                </div>

                <div className="p-4 border-t border-gray-100 flex justify-end gap-3">
                    <button onClick={onClose} className="px-4 py-2 rounded-md bg-[#F3FBF9] text-[#0f766e] font-medium">Close</button>
                </div>
            </div>
        </div>
    );
};

export default ApplicantModal;
