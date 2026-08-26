import React from 'react';

const getMapEmbedUrl = (item) => {
  const googleMapLink = String(item?.googleMapLink || '').trim();
  if (googleMapLink) {
    if (googleMapLink.includes('output=embed') || googleMapLink.includes('/maps/embed')) {
      return googleMapLink;
    }
    try {
      const url = new URL(googleMapLink);
      if (url.hostname.includes('google') || url.hostname.includes('maps')) {
        const query = url.searchParams.get('q') || url.searchParams.get('query');
        if (query) {
          return `https://www.google.com/maps?q=${encodeURIComponent(query)}&z=15&output=embed`;
        }
        url.searchParams.set('output', 'embed');
        return url.toString();
      }
    } catch {
      // Fall through to address-based embed.
    }
  }

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
    <div className="flex h-full min-w-0 flex-col">
      <h3 className="mb-4 text-xl font-semibold text-[#1A1D1F]">Location & Timing.</h3>
      <div className="flex min-h-0 flex-1 flex-col rounded-lg border border-gray-100 bg-white p-4 shadow-sm">
        <div className="mb-4 space-y-3">
          <p className="break-words text-base text-[#1A1D1F]">
            {item.venueName || item.trialLocation || item.location || 'N/A'}
          </p>
          <p className="break-words text-base text-[#1A1D1F]">{item.postcode || 'N/A'}</p>
          <p className="break-words text-base text-[#1A1D1F]">
            {item.typicalSessionDays || item.matchDays || item.day || 'N/A'}
          </p>
          <p className="break-words text-base text-[#1A1D1F]">
            {item.sessionTime || item.times || item.time || 'N/A'}
          </p>
          {String(item.frequency || item.sessionFrequency || '').trim() ? (
            <p className="break-words text-base text-[#1A1D1F]">
              {item.frequency || item.sessionFrequency}
            </p>
          ) : null}
        </div>

        <div className="relative mt-auto h-[220px] w-full shrink-0 overflow-hidden rounded-lg bg-gray-100 sm:h-50">
          {mapEmbedUrl ? (
            <iframe
              src={mapEmbedUrl}
              title="Map View"
              className="absolute inset-0 block h-full w-full border-0"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-sm text-gray-400">
              Map unavailable
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VenueInformation;
