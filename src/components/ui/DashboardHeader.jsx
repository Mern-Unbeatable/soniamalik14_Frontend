import React from 'react';

const DashboardHeader = ({ title, subtitle, className = '' }) => {
  return (
    <div className={`mb-3 lg:mb-4 ${className}`}>
      <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
      {subtitle && <p className="text-base text-gray-500 mt-1">{subtitle}</p>}
    </div>
  );
};

export default DashboardHeader;
