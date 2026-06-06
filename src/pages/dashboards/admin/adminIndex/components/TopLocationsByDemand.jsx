import React from 'react';
import LoadingSpinner from '../../../../../components/ui/LoadingSpinner';

const TopLocationsByDemand = ({ locations = [], isLoading = false, error = '' }) => {

  return (
    <div className="rounded-lg bg-white p-6 shadow-sm min-w-0 ">
      <h2 className="mb-6 text-xl font-bold text-gray-900 leading-tight">
        Top Locations by Demand
      </h2>
      
      <div className="space-y-4">
        {locations.map((location, index) => (
          <div key={`${location.name}-${index}`} className="flex flex-col gap-1.5">
            
            {/* Text Row */}
            <div className="flex items-center justify-between text-base text-gray-700">
              <span className="font-medium">{location.name}</span>
              <span>{location.value} Interest</span>
            </div>
            
            {/* Progress Bar Row */}
            <div className="h-3 w-full bg-gray-200 rounded-full">
              <div 
                className="h-full bg-[#137466] rounded-full" 
                style={{ width: `${Math.max(0, Math.min(location.width, 100))}%` }}
              ></div>
            </div>
            
          </div>
        ))}

        {isLoading && (
          <LoadingSpinner
            label="Loading top locations..."
            containerClassName="justify-start py-1"
            spinnerClassName="h-6 w-6"
          />
        )}
        {!isLoading && error && <p className="text-sm text-red-600">{error}</p>}
        {!isLoading && !error && locations.length === 0 && (
          <p className="text-sm text-gray-500">No top locations found.</p>
        )}
      </div>
    </div>
  );
};

export default TopLocationsByDemand;