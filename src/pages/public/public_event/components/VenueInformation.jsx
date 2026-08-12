import React from 'react';
import { MapPin, CalendarDays, Clock } from 'lucide-react';

const hasText = (value) => String(value || '').trim().length > 0;

const buildGoogleMapsSearchUrl = (query) => {
  const normalized = String(query || '').trim();
  if (!normalized) return '';
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(normalized)}`;
};

const TimingRow = ({ icon: Icon, label, value }) => (
  <div className="flex items-start gap-3">
    <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#EAF2F1] text-[#147B6B]">
      <Icon className="h-4 w-4" />
    </div>
    <div className="min-w-0">
      <p className="text-xs font-medium uppercase tracking-wide text-[#6B7280]">{label}</p>
      <p className="mt-0.5 wrap-break-word text-base text-[#1A1D1F]">{value}</p>
    </div>
  </div>
);

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
    hasText(event.endTime);
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
      <div className="flex h-auto flex-col overflow-hidden rounded-xl border border-gray-100 bg-white p-5 shadow-sm md:h-105">
        <div className="mb-5 space-y-5 md:flex-1">
          {hasAddress ? (
            <div>
              {addressLines.length > 0 ? (
                <div className="space-y-1 text-[#1A1D1F]">
                  {venueName ? (
                    <p className="wrap-break-word text-lg font-semibold leading-snug">
                      {venueName}
                    </p>
                  ) : null}
                  {addressLine1 ? (
                    <p className="wrap-break-word text-base leading-relaxed text-[#374151]">
                      {addressLine1}
                    </p>
                  ) : null}
                  {town ? (
                    <p className="wrap-break-word text-base leading-relaxed text-[#374151]">
                      {town}
                    </p>
                  ) : null}
                  {postcode ? (
                    <p className="wrap-break-word text-base font-medium leading-relaxed tracking-wide text-[#1A1D1F]">
                      {postcode}
                    </p>
                  ) : null}
                </div>
              ) : (
                <p className="wrap-break-word text-base leading-relaxed text-[#1A1D1F]">
                  {event.locationFull}
                </p>
              )}
            </div>
          ) : null}

          {hasTiming ? (
            <div className="space-y-3 border-t border-gray-100 pt-4">
              {hasText(event.startDate) ? (
                <TimingRow icon={CalendarDays} label="Start date" value={event.startDate} />
              ) : null}
              {hasText(event.endDate) ? (
                <TimingRow icon={CalendarDays} label="End date" value={event.endDate} />
              ) : null}
              {hasText(event.startTime) ? (
                <TimingRow icon={Clock} label="Start time" value={event.startTime} />
              ) : null}
              {hasText(event.endTime) ? (
                <TimingRow icon={Clock} label="End time" value={event.endTime} />
              ) : null}
            </div>
          ) : null}

          {mapsHref ? (
            <a
              href={mapsHref}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-lg bg-[#EAF2F1] px-3.5 py-2.5 text-sm font-medium text-[#0F766E] transition-colors hover:bg-[#D8EBE8]"
              aria-label={`Open ${locationLabel || 'location'} in Google Maps`}
            >
              <MapPin className="h-4 w-4 shrink-0" />
              Open in Maps
            </a>
          ) : null}
        </div>

        {hasMap ? (
          <div className="relative h-44 min-h-44 w-full shrink-0 overflow-hidden rounded-xl bg-gray-100 sm:h-50">
            <iframe
              src={event.mapEmbedUrl}
              title="Event location map"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
              className="absolute inset-0 block h-full w-full max-w-full border-0"
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
