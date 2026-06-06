import React from 'react';
import { Info } from 'lucide-react';
import LoadingSpinner from '../../../../../components/ui/LoadingSpinner';

const HighDemandAlerts = ({ alerts = [], isLoading = false, error = '' }) => {

  return (
    <div className="rounded-lg bg-white p-6 shadow-sm min-w-0 lg:col-span-2">
      <h2 className="mb-6 text-xl font-bold text-gray-900">High Demand / Low Supply Alerts</h2>
      
      <div className="space-y-4">
        {alerts.map((alert, index) => (
          // Replaced border-b with a light gray background and padding
          <div key={`${alert.sport}-${alert.location}-${index}`} className="flex items-center gap-4 rounded-lg bg-gray-50 p-4">
            
            {/* Icon Container */}
            <div className="shrink-0">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#eef7f6]">
                <Info className="h-6 w-6 text-[#1b827b]" />
              </div>
            </div>
            
            {/* Text Content */}
            <div className="flex-1">
              <h3 className="text-[15px] font-semibold text-gray-900">
                {alert.sport} in {alert.location}
              </h3>
              
              {/* Status Indicators */}
              <div className="mt-1 flex items-center gap-3 text-sm text-gray-600">
                <div className="flex items-center gap-1.5">
                  <div className="h-2 w-2 rounded-full bg-[#1b827b]"></div>
                  Demand: {alert.demand}
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="h-2 w-2 rounded-full bg-[#1b827b]"></div>
                  Supply: {alert.supply}
                </div>
              </div>
            </div>
            
          </div>
        ))}

        {isLoading && (
          <LoadingSpinner
            label="Loading alerts..."
            containerClassName="justify-start py-1"
            spinnerClassName="h-6 w-6"
          />
        )}
        {!isLoading && error && <p className="text-sm text-red-600">{error}</p>}
        {!isLoading && !error && alerts.length === 0 && (
          <div className="rounded-xl border border-dashed border-gray-200 bg-gray-50/70 px-5 py-8 text-center">
            <p className="text-base font-medium text-gray-700">No high demand alerts found.</p>
            <p className="mt-1 text-sm text-gray-500">Everything looks balanced right now.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default HighDemandAlerts;