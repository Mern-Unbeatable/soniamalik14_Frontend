import React from 'react';
import Card from '../../../../components/ui/Card';
import Button from '../../../../components/ui/Button';
import { MapPin, Calendar } from 'lucide-react';
import {
  EVENT_PLACEHOLDER_PATH,
  handleImageLoadError,
  pickImageSource,
  resolveImageUrl,
} from '../../../../utils/resolveImageUrl';

const EventCard = ({ event, onViewDetails }) => {
  const coverSrc = resolveImageUrl(
    pickImageSource(event?.image, event?.imageUrl, event?.thumbnail),
    EVENT_PLACEHOLDER_PATH
  );

  return (
    <Card className="p-4 h-full flex flex-col justify-between" style={{ borderColor: '#B5D5D2' }}>
      <div>
        <div className="relative">
          {event.tag ? (
            <div className="absolute top-3 left-3 z-10">
              <span className="bg-[#EAF2F1] text-[#147B6B] px-3.5 py-1.5 rounded-full text-[12px] font-medium">
                {event.tag}
              </span>
            </div>
          ) : null}
          <div className="h-40 sm:h-48 lg:h-64 bg-gray-200 rounded-md mb-4 overflow-hidden">
            <img
              src={coverSrc}
              alt={event.title || 'Event'}
              className="w-full h-full object-cover rounded-md"
              onError={(e) => handleImageLoadError(e, EVENT_PLACEHOLDER_PATH)}
            />
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
