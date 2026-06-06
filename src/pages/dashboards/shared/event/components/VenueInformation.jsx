import React from 'react';
import { MapPin } from 'lucide-react';

const VenueInformation = ({ event, mapEmbedUrl }) => {
  if (!event) return null;

  return (
    <section>
      <h3 className="mb-3 text-[20px] font-semibold leading-8 text-black">Venue Information</h3>
      <div className="rounded-xl bg-white p-4 shadow-sm">
        <p className="text-base font-medium text-[#101828]">
          Venue Name : <span className="text-base">{event.venueName || event.venue?.name || 'N/A'} </span>{' '}
        </p>
        <p className="mb-2 text-[14px] text-[#4a5565]"></p>

        <div className="mb-2 flex items-start gap-1 text-[14px] text-[#4a5565]">
          <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#4a5565]" />
          <span>{event.fullAddress || event.venue?.address || 'N/A'}</span>
        </div>

        <div className="mb-2 mt-4 space-y-2 text-base text-[#101828]">
          <p>
            <span className="font-medium">Session Days:</span> Saturday
          </p>
          <p>
            <span className="font-medium">Session Time:</span>{' '}
            {event.startTime && event.endTime ? `${event.startTime} - ${event.endTime}` : event.time || 'N/A'}
          </p>
        </div>
        <div className="mt-3 h-55 w-full overflow-hidden rounded-lg bg-[#d9d9d9]">
          {mapEmbedUrl ? (
            <iframe
              src={mapEmbedUrl}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              loading="lazy"
              title="Venue Location"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-sm text-gray-500">Map not available</div>
          )}
        </div>
      </div>
    </section>
  );
};

export default VenueInformation;
