import React from 'react';
import { ExternalLink, Mail, MapPin, Phone } from 'lucide-react';

const EventVenueCard = ({
  venueName,
  fullAddress,
  city,
  mapEmbedUrl,
  googleMapLink,
  organizerPhone,
  organizerEmail,
  organizerName,
}) => {
  const organizerInitials = (organizerName || 'NA').slice(0, 2).toUpperCase();

  return (
    <div className="sticky top-6 rounded-xl border border-[#91C0BC] bg-white p-6 shadow-sm">
      <div className="mb-4 text-base">
        <span className="mr-2 font-semibold text-gray-900">Venue:</span>
        <span className="text-gray-600">{venueName || 'N/A'}</span>
      </div>

      <div className="mb-4 flex items-start gap-2">
        <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-gray-400" />
        <span className="text-base leading-snug text-gray-600">{fullAddress || city || 'N/A'}</span>
      </div>

      {mapEmbedUrl && (
        <div className="mb-3 overflow-hidden rounded-lg border border-gray-100">
          <iframe
            title="Venue Map"
            src={mapEmbedUrl}
            className="h-44 w-full"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      )}

      {googleMapLink && (
        <a
          href={googleMapLink}
          target="_blank"
          rel="noreferrer"
          className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-teal-700 hover:text-teal-800"
        >
          <ExternalLink className="h-4 w-4" />
          Open in Google Maps
        </a>
      )}

      <div className="mb-6">
        <h3 className="mb-3 text-lg font-semibold text-gray-900">Contact Information</h3>
        <div className="space-y-3">
          <div className="flex items-center gap-3 text-base text-gray-600">
            <Phone className="h-5 w-5 text-gray-400" />
            <span>{organizerPhone || 'N/A'}</span>
          </div>
          <div className="flex items-center gap-3 text-base break-all text-gray-600">
            <Mail className="h-5 w-5 shrink-0 text-gray-400" />
            <span>{organizerEmail || 'N/A'}</span>
          </div>
        </div>
      </div>

      <div>
        <h3 className="mb-3 text-base font-bold text-gray-900">Organized By:</h3>
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#111827] shadow-sm">
            <span className="text-sm font-bold tracking-wider text-white">{organizerInitials}</span>
          </div>
          <span className="text-base font-medium text-gray-900">{organizerName || 'N/A'}</span>
        </div>
      </div>
    </div>
  );
};

export default EventVenueCard;
