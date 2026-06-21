import React from 'react';
import { MapPin } from 'lucide-react';

const VenueInformation = ({ event }) => {
  if (!event) return null;

  return (
    <div>
      <h3 className="text-xl font-semibold text-[#1A1D1F] mb-4">Venue Information</h3>
      <div className="overflow-hidden bg-white p-4 rounded-lg shadow-sm border border-gray-100 h-auto md:h-105 flex flex-col">
        <div className="space-y-4 mb-6 md:flex-1">
          
          <div className="flex flex-wrap gap-2">
            <span className="text-[#1A1D1F] w-28 shrink-0 text-base">Venue Name:</span> 
            <span className="text-[#1A1D1F] text-base min-w-0 wrap-break-word">{event.location}</span>
          </div>

          <div className="flex gap-2 items-start min-w-0">
            <MapPin className="w-4 h-4 text-gray-500 shrink-0 mt-0.5" />
            <span className="text-[#1A1D1F] text-base leading-tight wrap-break-word">
              {event.locationFull}
            </span>
          </div>

          <div className="flex flex-wrap gap-2">
            <span className="text-[#1A1D1F] w-28 shrink-0 text-base">Session Days:</span> 
            <span className="text-[#1A1D1F] text-base min-w-0 wrap-break-word">{event.day}</span>
          </div>
          
          <div className="flex flex-wrap gap-2">
            <span className="text-[#1A1D1F] w-28 shrink-0 text-base">Session Time:</span> 
            <span className="text-[#1A1D1F] text-base min-w-0 wrap-break-word">{event.time}</span>
          </div>
          
        </div>
        
        {/* Map */}
        <div className="relative w-full h-44 min-h-44 sm:h-50 rounded-lg overflow-hidden bg-gray-200 shrink-0">
          {event.mapEmbedUrl ? (
            <iframe
              src={event.mapEmbedUrl}
              title="Event location map"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
              className="absolute inset-0 block h-full w-full max-w-full border-0"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-sm text-gray-600">
              Map not available
            </div>
          )}
        </div>
      </div>

      <div className="mt-5 flex flex-col sm:flex-row gap-3 md:hidden">
        {(!Array.isArray(event.responseMethods) || event.responseMethods.length === 0 || event.responseMethods.includes('Add booking link')) ? (
          <button className="w-full sm:flex-1 bg-[#0F766E] hover:bg-[#0D655D] text-white px-4 py-2.5 rounded-lg text-sm font-medium transition-colors">
            Register
          </button>
        ) : (
          <button className="w-full sm:flex-1 bg-[#0F766E] hover:bg-[#0D655D] text-white px-5 py-2.5 rounded-lg text-sm font-medium transition-colors">
            Register Interest
          </button>
        )}
      </div>
    </div>
  );
};

export default VenueInformation;
