import React from 'react';
import { Code } from 'lucide-react';

const EventPendingBanner = () => {
  return (
    <div className="flex items-center justify-between bg-[#789bb4] px-6 py-2.5 text-white shadow-sm">
      <span className="text-sm font-semibold">Not approved by admin</span>
      <Code className="h-5 w-5 opacity-70" />
    </div>
  );
};

export default EventPendingBanner;
