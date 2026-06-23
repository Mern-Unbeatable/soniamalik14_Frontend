import React from 'react';
import { ArrowRight } from 'lucide-react';

const CollaborateListingButton = ({ label, onClick, disabled = false }) => (
  <button
    type="button"
    onClick={onClick}
    disabled={disabled}
    className="bg-[#107C66] hover:bg-[#0c6150] transition-colors duration-200 text-white text-[15px] font-medium py-3 px-6 rounded-md inline-flex items-center group shadow-sm disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:bg-[#107C66]"
  >
    {label}
    <ArrowRight
      className="w-4 h-4 ml-2 mt-[1px] transform group-hover:translate-x-1 transition-transform duration-200"
      strokeWidth={2.5}
    />
  </button>
);

export default CollaborateListingButton;
