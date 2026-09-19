import React from 'react';
import BlankCalendarIcon from '../../../../../components/ui/BlankCalendarIcon';

const hasText = (value) => {
  const text = String(value || '').trim();
  return text.length > 0 && text.toLowerCase() !== 'n/a';
};

const buildGoogleMapsSearchUrl = (query) => {
  const normalized = String(query || '').trim();
  if (!normalized || normalized.toLowerCase() === 'n/a') return '';
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(normalized)}`;
};

const getMapEmbedUrl = (item, locationLabel) => {
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

  if (!locationLabel) return '';
  return `https://www.google.com/maps?q=${encodeURIComponent(locationLabel)}&z=15&output=embed`;
};

const VenueInformation = ({ item }) => {
  const addressParts = [
    item?.venueName,
    item?.addressLine1,
    item?.town || item?.location,
    item?.postcode,
  ]
    .map((part) => String(part || '').trim())
    .filter((part) => part && part.toLowerCase() !== 'n/a');

  let locationLabel = addressParts.join(', ');
  if (!locationLabel) {
    locationLabel = String(item?.fullAddress || '').trim();
  }

  const mapsHref =
    String(item?.googleMapLink || '').trim() || buildGoogleMapsSearchUrl(locationLabel);
  const mapEmbedUrl = getMapEmbedUrl(item, locationLabel);

  const dayLabel = item.typicalSessionDays || item.matchDays || item.day;
  const timeLabel = item.sessionTime || item.times || item.time;
  const frequencyLabel = item.frequency || item.sessionFrequency;

  return (
    <div className="flex h-full min-w-0 flex-col">
      <h3 className="mb-4 text-xl font-semibold text-[#1A1D1F]">Location & Timing</h3>
      <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-lg border border-gray-100 bg-white p-4 shadow-sm">
        <div className="mb-6 min-h-0 flex-1 space-y-4">
          {hasText(locationLabel) ? (
            mapsHref ? (
              <a
                href={mapsHref}
                target="_blank"
                rel="noopener noreferrer"
                className="group text-base leading-normal text-[#1A1D1F] transition-colors hover:text-[#0F766E]"
                aria-label={`Open ${locationLabel} in Google Maps`}
              >
                <span className="underline-offset-2 group-hover:underline">{locationLabel}</span>
              </a>
            ) : (
              <p className="break-words text-base text-[#1A1D1F]">{locationLabel}</p>
            )
          ) : null}

          {hasText(dayLabel) ? (
            <p className="flex items-center gap-2 text-base text-[#1A1D1F]">
              <span className="inline-flex h-5 w-5 shrink-0 items-center justify-center leading-none">
                <BlankCalendarIcon />
              </span>
              <span>{dayLabel}</span>
            </p>
          ) : null}

          {hasText(timeLabel) ? (
            <p className="flex items-center gap-2 text-base text-[#1A1D1F]">
              <span className="inline-flex h-5 w-5 shrink-0 items-center justify-center text-[1.125rem] leading-none">
                🕒
              </span>
              <span>{timeLabel}</span>
            </p>
          ) : null}

          {hasText(frequencyLabel) ? (
            <p className="flex items-center gap-2 text-base text-[#1A1D1F]">
              <span className="inline-flex h-5 w-5 shrink-0 items-center justify-center text-[1.125rem] leading-none">
                🔄
              </span>
              <span>{frequencyLabel}</span>
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
