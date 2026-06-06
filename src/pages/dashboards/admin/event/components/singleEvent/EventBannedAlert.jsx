import React from 'react';
import { AlertCircle } from 'lucide-react';

const EventBannedAlert = ({ reason }) => {
  return (
    <div className="flex gap-3 rounded-xl border border-red-100 bg-red-50/80 p-5">
      <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-500" />
      <div>
        <h3 className="mb-1 text-xl font-semibold text-red-600">This event was not approved</h3>
        <p className="text-base leading-relaxed text-red-500">
          {reason || 'Your event could not be published because it did not meet our guidelines.'}
        </p>
      </div>
    </div>
  );
};

export default EventBannedAlert;
