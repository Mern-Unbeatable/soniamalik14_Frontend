import React from 'react';
import { MapPin } from 'lucide-react';

const VenueInformation = ({ event }) => {
  if (!event) return null;

  return (
    <div>
      <h3 className="mb-4 text-xl font-semibold text-[#1A1D1F]">Venue Information</h3>
      <div className="flex h-auto flex-col overflow-hidden rounded-lg border border-gray-100 bg-white p-4 shadow-sm md:h-105">
        <div className="mb-6 space-y-4 md:flex-1">
          <div className="flex flex-wrap gap-2">
            <span className="w-28 shrink-0 text-base text-[#1A1D1F]">Venue Name:</span>
            <span className="min-w-0 text-base wrap-break-word text-[#1A1D1F]">
              {event.location}
            </span>
          </div>

          <div className="flex min-w-0 items-start gap-2">
            <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gray-500" />
            <span className="text-base leading-tight wrap-break-word text-[#1A1D1F]">
              {event.locationFull}
            </span>
          </div>

          <div className="flex flex-wrap gap-2">
            <span className="w-28 shrink-0 text-base text-[#1A1D1F]">Day of session:</span>
            <span className="min-w-0 text-base wrap-break-word text-[#1A1D1F]">{event.day}</span>
          </div>

          <div className="flex flex-wrap gap-2">
            <span className="w-28 shrink-0 text-base text-[#1A1D1F]">Session Time:</span>
            <span className="min-w-0 text-base wrap-break-word text-[#1A1D1F]">{event.time}</span>
          </div>
        </div>

        {/* Map */}
        <div className="relative h-44 min-h-44 w-full shrink-0 overflow-hidden rounded-lg bg-gray-200 sm:h-50">
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

      <div className="mt-5 flex flex-col gap-3 sm:flex-row md:hidden">
        {!Array.isArray(event.responseMethods) ||
        event.responseMethods.length === 0 ||
        event.responseMethods.includes('Add booking link') ? (
          <button className="w-full rounded-lg bg-[#0F766E] px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#0D655D] sm:flex-1">
            Register
          </button>
        ) : (
          <button className="w-full rounded-lg bg-[#0F766E] px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#0D655D] sm:flex-1">
            Register Interest
          </button>
        )}
      </div>
    </div>
  );
};

export default VenueInformation;
