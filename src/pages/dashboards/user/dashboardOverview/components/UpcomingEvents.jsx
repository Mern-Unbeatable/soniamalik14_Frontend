import React, { useEffect, useMemo, useState } from 'react';
import EventCard from '../../myEvents/components/EventCard';
import { GET } from '../../../../../services/httpMethods';

const formatEventTime = (event) => {
  const datePart = event?.startDate ? new Date(event.startDate).toLocaleDateString() : '';
  const timePart = event?.startTime || '';

  return [datePart, timePart].filter(Boolean).join(' • ') || 'Time not available';
};

const mapRegistrationToEventCard = (item) => {
  const event = item?.event || {};

  return {
    id: event?.id || item?.registrationId,
    title: event?.title || 'Untitled event',
    location: event?.venueName || event?.city || event?.fullAddress || 'Location not specified',
    time: formatEventTime(event),
    imageSrc: event?.image || '',
  };
};

const UpcomingEvents = ({ events = [] }) => {
  const [apiEvents, setApiEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();

    const fetchUpcomingEvents = async () => {
      try {
        setLoading(true);
        const res = await GET(
          '/api/events/user/registered',
          { page: 1, limit: 4 },
          controller.signal
        );
        const registrations = res?.data?.data?.events || [];
        setApiEvents(
          (Array.isArray(registrations) ? registrations : []).map(mapRegistrationToEventCard)
        );
      } catch (error) {
        if (error?.name !== 'AbortError') {
          console.error('Failed to fetch upcoming events:', error);
          setApiEvents([]);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUpcomingEvents();

    return () => controller.abort();
  }, []);

  const eventsList = useMemo(() => {
    if (events.length > 0) return events;
    return apiEvents;
  }, [events, apiEvents]);

  return (
    <div className="mb-12">
      <h2 className="mb-6 text-2xl font-bold text-[#111827]">Upcoming Event</h2>
      {loading ? (
        <div className="py-10 text-center text-gray-500">Loading events...</div>
      ) : eventsList.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
          {eventsList.map((event) => (
            <EventCard
              key={event.id}
              id={event.id}
              title={event.title}
              location={event.location}
              time={event.time}
              imageSrc={event.imageSrc}
            />
          ))}
        </div>
      ) : (
        <div className="py-10 text-center text-gray-500">No upcoming events found.</div>
      )}
    </div>
  );
};

export default UpcomingEvents;
