import React, { useCallback, useEffect, useState } from 'react';
import EventCard from './components/EventCard';
import Pagination from '../../../../components/ui/Pagination';
import { GET } from '../../../../services/httpMethods';
import { toast } from 'react-toastify';

const TAB_CONFIG = {
  interested: {
    label: 'Register Interest',
    endpoint: '/api/events/user/interested',
    emptyText: 'No interested events found',
  },
  book: {
    label: 'Book',
    endpoint: '/api/events/user/registered',
    emptyText: 'No booked events found',
  },
};

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

const MyEvents = () => {
  const [events, setEvents] = useState([]);
  const [activeTab, setActiveTab] = useState('interested');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  const fetchEvents = useCallback(async () => {
    const endpoint = TAB_CONFIG[activeTab]?.endpoint;
    if (!endpoint) return;

    try {
      setLoading(true);
      const res = await GET(endpoint, { page: currentPage, limit: 10 });
      const registrations = res?.data?.data?.events || [];
      const meta = res?.data?.data?.meta || {};

      setEvents((Array.isArray(registrations) ? registrations : []).map(mapRegistrationToEventCard));
      setTotalPages(Number(meta?.totalPage) > 0 ? Number(meta.totalPage) : 1);
    } catch (error) {
      console.error('Failed to fetch user events:', error);
      setEvents([]);
      setTotalPages(1);
      toast.error('Failed to load events');
    } finally {
      setLoading(false);
    }
  }, [activeTab, currentPage]);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  const handleViewDetails = (eventId) => {
    console.log('View details for event:', eventId);
  };

  const handleDeleteEvent = (eventId) => {
    const updatedEvents = events.filter((event) => event.id !== eventId);
    setEvents(updatedEvents);

    // Go back to first page only when current page becomes empty.
    if (updatedEvents.length === 0 && currentPage > 1) {
      setCurrentPage(1);
    }
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className="dashboardPy dashboardSpaceY">
      <div className="flex items-center gap-3 mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">My Events</h1>
      </div>

      <div className="mb-6 inline-flex w-fit items-center gap-2 rounded-xl border border-gray-200 bg-white p-1">
        {Object.entries(TAB_CONFIG).map(([tabKey, tabValue]) => (
          <button
            key={tabKey}
            type="button"
            onClick={() => handleTabChange(tabKey)}
            className={`rounded-lg px-4 py-2 text-sm font-semibold transition-colors ${
              activeTab === tabKey
                ? 'bg-[#147A73] text-white'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            {tabValue.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="py-16 text-center flex flex-col items-center justify-center">
          <div className="w-10 h-10 border-4 border-[#147A73] border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-gray-500 text-base">Loading events...</p>
        </div>
      ) : events.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-4 md:gap-6">
            {events.map((event) => (
              <EventCard
                key={event.id}
                id={event.id}
                title={event.title}
                location={event.location}
                time={event.time}
                imageSrc={event.imageSrc}
                onViewDetails={() => handleViewDetails(event.id)}
                onDelete={() => handleDeleteEvent(event.id)}
              />
            ))}
          </div>

          {totalPages > 1 && (
            <Pagination
              page={currentPage}
              total={totalPages}
              onChange={handlePageChange}
            />
          )}
        </>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">{TAB_CONFIG[activeTab]?.emptyText || 'No events found'}</p>
        </div>
      )}
    </div>
  );
};

export default MyEvents;
