import React from 'react';
import { ArrowLeft } from 'lucide-react';

const EventErrorState = ({ error, onBack }) => {
  return (
    <div className="relative flex-1 overflow-auto bg-[#F8F9FA] p-6 pb-12 font-sans md:p-8">
      <button
        onClick={onBack}
        className="mb-4 inline-flex items-center gap-2 rounded-lg bg-white px-4 py-2 text-black shadow-sm"
      >
        <ArrowLeft className="h-4 w-4" />
        <span className="text-sm font-medium">Back</span>
      </button>
      <div className="rounded-xl border border-red-100 bg-red-50 p-5">
        <h3 className="mb-1 text-xl font-semibold text-red-600">Unable to load event</h3>
        <p className="text-base text-red-500">{error}</p>
      </div>
    </div>
  );
};

export default EventErrorState;
