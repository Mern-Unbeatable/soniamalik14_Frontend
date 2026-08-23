import React from 'react';
import { MapPin } from 'lucide-react';

const formatDate = (dateStr) => {
  if (!dateStr) return 'N/A';
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return dateStr;
  return date.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

const VenueInformation = ({ event, mapEmbedUrl }) => {
  if (!event) return null;

  return (
    <section>
      <h3 className="mb-3 text-[20px] font-semibold leading-8 text-black">Location & Timing.</h3>
      <div className="overflow-hidden rounded-xl bg-white p-4 shadow-sm">
        <p className="text-base font-medium text-[#101828]">
    <span className="text-base">{event.venueName || event.venue?.name || 'N/A'} </span>{' '}
        </p>
        <p className="mb-2 text-[14px] text-[#4a5565]"></p>

        <div className="mb-2 flex items-start gap-1 text-[14px] text-[#4a5565]">
          <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#4a5565]" />
          <span>{event.fullAddress || event.venue?.address || 'N/A'}</span>
        </div>

        <div className="mb-2 mt-4 space-y-2 text-base text-[#101828]">
          <p>
            {/* <span className="font-medium">Date:</span>{' '} */}
            {event.startDate
              ? event.endDate && event.startDate !== event.endDate
                ? `${formatDate(event.startDate)} - ${formatDate(event.endDate)}`
                : formatDate(event.startDate)
              : 'N/A'}
          </p>
          <p>
            {/* <span className="font-medium">Session Time:</span>{' '} */}
            {event.startTime && event.endTime ? `${event.startTime} - ${event.endTime}` : event.time || 'N/A'}
          </p>
          {String(event.frequency || event.sessionFrequency || '').trim() ? (
            <p>{event.frequency || event.sessionFrequency}</p>
          ) : null}
        </div>
        <div className="relative mt-3 h-55 w-full overflow-hidden rounded-lg bg-[#d9d9d9]">
          {mapEmbedUrl ? (
            <iframe
              src={mapEmbedUrl}
              title="Venue Location"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="absolute inset-0 block h-full w-full border-0"
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
