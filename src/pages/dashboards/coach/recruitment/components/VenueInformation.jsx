import React from 'react';

const getMapEmbedUrl = (item) => {
  const townPostcode = [item?.town, item?.postcode]
    .map((part) => String(part || '').trim())
    .filter((part) => part && part !== 'N/A')
    .join(', ');

  const locationText =
    String(item?.fullAddress || '').trim() ||
    townPostcode ||
    String(item?.venueName || '').trim() ||
    String(item?.location || '').trim() ||
    String(item?.town || '').trim() ||
    '';

  if (!locationText || locationText === 'N/A') return '';
  return `https://www.google.com/maps?q=${encodeURIComponent(locationText)}&z=15&output=embed`;
};

const VenueInformation = ({ item }) => {
  const mapEmbedUrl = getMapEmbedUrl(item);

  return (
    <div>
      <h3 className="mb-4 text-xl font-semibold text-[#1A1D1F]">Location & Timing.</h3>
      <div className="flex h-auto flex-col rounded-lg border border-gray-100 bg-white p-4 shadow-sm md:h-100">
        <div className="mb-6 flex-1 space-y-3">
          <p className="flex text-base">
            <span className="w-28 shrink-0 font-medium text-[#1A1D1F]">Venue Name:</span>
            <span className="text-[#1A1D1F]">
              {item.venueName || item.trialLocation || item.location || 'N/A'}
            </span>
          </p>
          <p className="flex text-base">
            <span className="w-28 shrink-0 font-medium text-[#1A1D1F]">Postcode:</span>
            <span className="text-[#1A1D1F]">{item.postcode || 'N/A'}</span>
          </p>
          {/* <p className="flex text-base">
            <span className="w-28 shrink-0 font-medium text-[#1A1D1F]">Town/City:</span>
            <span className="text-[#1A1D1F]">{item.town || 'N/A'}</span>
          </p> */}
          <p className="flex text-base">
            <span className="w-28 shrink-0 font-medium text-[#1A1D1F]">Day:</span>
            <span className="text-[#1A1D1F]">
              {item.typicalSessionDays || item.matchDays || item.day || 'N/A'}
            </span>
          </p>
          <p className="flex text-base">
            <span className="w-28 shrink-0 font-medium text-[#1A1D1F]">Session Time:</span>
            <span className="text-[#1A1D1F]">
              {item.sessionTime || item.times || item.time || 'N/A'}
            </span>
          </p>
        </div>

        {/* Map */}
        <div className="h-50 w-full shrink-0 overflow-hidden rounded-lg">
          {mapEmbedUrl ? (
            <iframe
              src={mapEmbedUrl}
              title="Map View"
              className="h-full w-full border-0 rounded-lg"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-sm text-gray-400">
              Map unavailable
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VenueInformation;
