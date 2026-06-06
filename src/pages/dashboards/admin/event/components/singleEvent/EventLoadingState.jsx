import React from 'react';

const EventLoadingState = () => {
  return (
    <div className="relative flex min-h-[70vh] flex-1 items-center justify-center overflow-auto bg-[#F8F9FA] p-6 font-sans md:p-8">
      <div className="flex flex-col items-center gap-3">
        <div className="border-t-btn-primary h-10 w-10 animate-spin rounded-full border-4 border-[#91C0BC]" />
        <p className="text-sm font-medium text-gray-600">Loading event details...</p>
      </div>
    </div>
  );
};

export default EventLoadingState;
