import React from 'react';
import Card from '../../../../components/ui/Card';
import Button from '../../../../components/ui/Button';
import { MapPin, Calendar } from 'lucide-react';

const FALLBACK_IMAGE =
  'data:image/svg+xml;charset=UTF-8,%3Csvg xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22 width%3D%22960%22 height%3D%22640%22 viewBox%3D%220 0 960 640%22%3E%3Crect width%3D%22960%22 height%3D%22640%22 rx%3D%2232%22 fill%3D%22%23EAF2F1%22%2F%3E%3Cpath d%3D%22M320 250h320v170H320z%22 fill%3D%22%23C9DDDA%22%2F%3E%3Cpath d%3D%22M365 385l70-82 55 62 48-52 92 72H365z%22 fill%3D%22%239FC9C5%22%2F%3E%3Ccircle cx%3D%22412%22 cy%3D%22300%22 r%3D%2230%22 fill%3D%22%23B7D6D2%22%2F%3E%3Ctext x%3D%2255%25%22 y%3D%2253%25%22 text-anchor%3D%22middle%22 font-family%3D%22Arial%2C sans-serif%22 font-size%3D%2230%22 fill%3D%22%2353736F%22%3EEvent image unavailable%3C%2Ftext%3E%3C%2Fsvg%3E';

const EventCard = ({ event, onViewDetails }) => {
  return (
    <Card className="p-4 h-full flex flex-col justify-between" style={{ borderColor: '#B5D5D2' }}>
      <div>
        <div className="relative">
          <div className="absolute top-3 left-3 bg-secondary text-btn-primary rounded-md px-3 py-1.5 text-base font-semibold">{event.tag}</div>
          <div className="h-40 sm:h-48 lg:h-64 bg-gray-200 rounded-md mb-4 overflow-hidden flex items-center justify-center">
            {event.image ? (
              <img
                src={event.image}
                alt={event.title}
                className="w-full h-full object-cover rounded-md"
                onError={(eventImage) => {
                  eventImage.currentTarget.onerror = null;
                  eventImage.currentTarget.src = FALLBACK_IMAGE;
                }}
              />
            ) : (
              <div className="text-gray-400">Image</div>
            )}
          </div>
        </div>

        <h3 className="font-semibold text-lg mb-2" style={{ color: event.titleColor || '#282828' }}>
          {event.title}
        </h3>

        <div className="text-base text-[#363636] mb-1 flex items-center gap-2">
          <MapPin className="w-4 h-4 text-[#363636]" />
          <span className="text-base">{event.location}</span>
        </div>

        <div className="text-base text-[#363636] mb-3 flex items-start gap-2">
          <div className="flex items-center gap-2"><Calendar className="w-4 h-4 text-[#363636]" /> <span className="text-base">{event.date}</span></div>
        </div>

        {/* Intentionally show only View Details button; signin will receive return state */}
      </div>

      <div className="mt-2">
        <Button
          variant="primary"
          className="w-full rounded-md bg-btn-primary text-white hover:bg-[#0d655d]"
          onClick={() => onViewDetails?.(event)}
        >
          View Details
        </Button>
      </div>
    </Card>
  );
};

export default EventCard;
