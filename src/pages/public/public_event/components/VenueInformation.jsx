import React from 'react';

const hasText = (value) => String(value || '').trim().length > 0;

const CalendarIcon = () => (
  <img
    src="/calendar-icon.webp"
    alt=""
    aria-hidden="true"
    className="mt-0.5 h-4 w-4 shrink-0 object-contain"
  />
);

const buildGoogleMapsSearchUrl = (query) => {
  const normalized = String(query || '').trim();
  if (!normalized) return '';
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(normalized)}`;
};

const VenueInformation = ({ event }) => {
  if (!event) return null;

  const venueName = String(event.location || '').trim();
  const addressLine1 = String(event.addressLine1 || '').trim();
  const town = String(event.town || '').trim();
  const postcode = String(event.postcode || '').trim();

  const addressLines = [venueName, addressLine1, town, postcode].filter(Boolean);
  const locationLabel =
    addressLines.join(', ') || String(event.locationFull || '').trim();

  const mapsHref =
    String(event.googleMapLink || '').trim() ||
    buildGoogleMapsSearchUrl(locationLabel);

  const hasAddress = addressLines.length > 0 || hasText(event.locationFull);
  const hasTiming =
    hasText(event.startDate) ||
    hasText(event.endDate) ||
    hasText(event.startTime) ||
    hasText(event.endTime) ||
    hasText(event.day) ||
    hasText(event.time);
  const hasMap = hasText(event.mapEmbedUrl);

  if (!hasAddress && !hasTiming && !hasMap && !mapsHref) return null;

  const isInterestAction =
    event.responseType === 'INTERESTED' ||
    event.responseType === 'REGISTER_INTEREST' ||
    (Array.isArray(event.responseMethods) &&
      event.responseMethods.includes('Allow users to register interest') &&
      !event.responseMethods.includes('Add booking link'));

  return (
    <div>
      <h3 className="mb-4 text-xl font-semibold text-[#1A1D1F]">Location & Timing</h3>
      <div className="flex h-auto flex-col overflow-hidden rounded-lg border border-gray-100 bg-white p-4 shadow-sm">
        <div className="mb-6 min-h-0 flex-1 space-y-3">
          {hasText(venueName) ? (
            <p className="wrap-break-word text-base text-[#1A1D1F]">{venueName}</p>
          ) : null}

          {hasText(addressLine1) ? (
            <p className="wrap-break-word text-base text-[#1A1D1F]">{addressLine1}</p>
          ) : null}

          {hasText(town) ? (
            <p className="wrap-break-word text-base text-[#1A1D1F]">{town}</p>
          ) : null}

          {hasText(postcode) ? (
            <p className="wrap-break-word text-base text-[#1A1D1F]">{postcode}</p>
          ) : null}

          {!addressLines.length && hasText(event.locationFull) ? (
            <p className="wrap-break-word text-base text-[#1A1D1F]">{event.locationFull}</p>
          ) : null}

          {mapsHref && locationLabel ? (
            <a
              href={mapsHref}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-start gap-2 text-base text-[#1A1D1F] transition-colors hover:text-[#0F766E]"
              aria-label={`Open ${locationLabel} in Google Maps`}
            >
              <span className="underline-offset-2 group-hover:underline">{locationLabel}</span>
            </a>
          ) : null}

          {hasText(event.startDate) ? (
            <p className="flex items-start gap-2 text-base text-[#1A1D1F]">
              <CalendarIcon />
              <span className="wrap-break-word">{event.startDate}</span>
            </p>
          ) : hasText(event.day) ? (
            <p className="flex items-start gap-2 text-base text-[#1A1D1F]">
              <CalendarIcon />
              <span className="wrap-break-word">{event.day}</span>
            </p>
          ) : null}

          {hasText(event.endDate) ? (
            <p className="flex items-start gap-2 text-base text-[#1A1D1F]">
              <CalendarIcon />
              <span className="wrap-break-word">{event.endDate}</span>
            </p>
          ) : null}

          {hasText(event.startTime) || hasText(event.endTime) ? (
            <p className="flex items-start gap-2 text-base text-[#1A1D1F]">
              <span className="shrink-0 font-medium">🕒</span>
              <span className="wrap-break-word">
                {[event.startTime, event.endTime].filter(Boolean).join(' - ') || event.time}
              </span>
            </p>
          ) : hasText(event.time) ? (
            <p className="flex items-start gap-2 text-base text-[#1A1D1F]">
              <span className="shrink-0 font-medium">🕒</span>
              <span className="wrap-break-word">{event.time}</span>
            </p>
          ) : null}
        </div>

        {hasMap ? (
          <div className="relative h-50 w-full shrink-0 overflow-hidden rounded-lg bg-gray-100">
            <iframe
              src={event.mapEmbedUrl}
              title="Event location map"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
              className="absolute inset-0 block h-full w-full border-0"
            />
          </div>
        ) : null}
      </div>

      <div className="mt-5 flex flex-col gap-3 sm:flex-row md:hidden">
        {isInterestAction ? (
          <button className="w-full rounded-lg bg-[#0F766E] px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#0D655D] sm:flex-1">
            Register Interest
          </button>
        ) : (
          <button className="w-full rounded-lg bg-[#0F766E] px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#0D655D] sm:flex-1">
            Register
          </button>
        )}
      </div>
    </div>
  );
};

export default VenueInformation;
