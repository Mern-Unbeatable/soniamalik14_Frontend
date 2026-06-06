import React from 'react';

const StatsCard = ({ icon, label, value, change, positive = true, className = '' }) => {
  return (
    <div className={`rounded-lg bg-white p-6 shadow-md ${className}`}>
      <div className="mb-4 flex items-center justify-between">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100">
          {icon}
        </div>
        <div className={`flex items-center gap-1 text-base ${positive ? 'text-btn-primary' : 'text-red-600'}`}>
          <span>{change}</span>
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
            />
          </svg>
        </div>
      </div>

      <div className="mb-1 text-base text-gray-500">{label}</div>
      <div className="text-2xl font-bold text-gray-900">{value}</div>
    </div>
  );
};

export default StatsCard;
