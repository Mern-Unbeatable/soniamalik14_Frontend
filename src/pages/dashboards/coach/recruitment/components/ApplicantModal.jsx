import React from 'react';
import { X } from 'lucide-react';

const ApplicantModal = ({ enquiry, onClose }) => {
  if (!enquiry) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
      <div className="relative mx-2 w-full max-w-xl rounded-xl bg-white p-8 shadow-lg">
        <button
          className="absolute top-5 right-5 rounded-full p-2 hover:bg-gray-100"
          onClick={onClose}
          aria-label="Close"
        >
          <X className="h-6 w-6 text-gray-500" />
        </button>
        <h2 className="mb-2 text-xl font-semibold">Applicant Details</h2>
        <div className="mb-2 text-lg font-semibold text-gray-900">{enquiry.name}</div>
        <div className="mb-1 text-base font-semibold text-gray-900">{enquiry.phone}</div>
        <div className="mb-1 text-base font-semibold text-gray-900">{enquiry.email}</div>
        {enquiry.event && (
          <div className="mb-3 text-base font-semibold text-gray-900">
            Event Name: <span className="font-semibold">{enquiry.event}</span>
          </div>
        )}
        <div className="mb-2 text-[16px] whitespace-pre-line text-gray-800">{enquiry.msg}</div>
        {enquiry.date && <div className="mt-2 text-sm text-gray-500">{enquiry.date}</div>}
      </div>
    </div>
  );
};

export default ApplicantModal;
