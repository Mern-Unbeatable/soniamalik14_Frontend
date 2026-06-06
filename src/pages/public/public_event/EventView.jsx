import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Container from '../../../components/layout/Container';
import { X, Filter } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import EventFilters from './components/EventFilters';
import EventCard from './components/EventCard';
import LoginRequiredModal from './components/LoginRequiredModal';
import Pagination from '../../../components/ui/Pagination';
import PageHeader from '../../../components/ui/PageHeader';
import { ENV } from '../../../config/env';
import { fetchEvents } from '../../../features/events/eventsAPI';
import {
  selectAllEvents,
  selectEventsLoading,
  selectEventsError,
} from '../../../features/events/eventsSlice';

const normalizeEventsList = (value) => {
  if (Array.isArray(value)) return value;
  if (!value || typeof value !== 'object') return [];
  if (Array.isArray(value.events)) return value.events;
  if (Array.isArray(value.data)) return value.data;
  if (Array.isArray(value.rows)) return value.rows;
  if (Array.isArray(value.items)) return value.items;
  return [];
};

const formatDate = (value) => {
  if (!value) return 'Date not set';
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return String(value);
  return parsed.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
};

const formatEventTypeTag = (value) => {
  if (!value) return 'Event';
  return String(value)
    .toLowerCase()
    .split('_')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
};

const normalizeEventImageUrl = (value) => {
  if (!value) return null;

  const imageUrl = String(value).trim();
  if (!imageUrl) return null;

  if (/^https?:\/\//i.test(imageUrl)) {
    try {
      const parsedImageUrl = new URL(imageUrl);
      const apiBaseUrl = String(ENV.API_BASE_URL || '').trim();
      const parsedApiBaseUrl = apiBaseUrl ? new URL(apiBaseUrl) : null;

      if (
        parsedApiBaseUrl &&
        parsedImageUrl.pathname.includes('/uploads/') &&
        parsedImageUrl.hostname !== parsedApiBaseUrl.hostname
      ) {
        return `${parsedApiBaseUrl.origin}${parsedImageUrl.pathname}${parsedImageUrl.search}${parsedImageUrl.hash}`;
      }

      return imageUrl;
    } catch {
      return imageUrl;
    }
  }

  const apiBaseUrl = String(ENV.API_BASE_URL || '').replace(/\/+$/, '');
  if (apiBaseUrl && imageUrl.startsWith('/uploads/')) {
    return `${apiBaseUrl}${imageUrl}`;
  }

  return imageUrl;
};

const EventView = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const reduxEvents = useSelector(selectAllEvents);
  const loading = useSelector(selectEventsLoading);
  const error = useSelector(selectEventsError);

  const [page, setPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [selectedEventId, setSelectedEventId] = useState(null);
  const [filters, setFilters] = useState({
    city: '',
    eventTypes: [],
    date: [],
    sport: '',
  });
  const perPage = 9;

  useEffect(() => {
    dispatch(fetchEvents());
  }, [dispatch]);

  useEffect(() => {
    if (showFilters) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [showFilters]);

  const events = normalizeEventsList(reduxEvents).map((event) => ({
    id: event.id,
    title: event.title || 'Untitled Event',
    titleColor: '#0B544E',
    date: formatDate(event.startDate || event.date),
    location: event.fullAddress || event.location || event.city || event.venueName || 'Location not set',
    tag: formatEventTypeTag(event.eventType),
    image: normalizeEventImageUrl(event.image),
    sport: event.sportType || '',
  }));

  // apply simple client-side filtering
  const filtered = events.filter((e) => {
    // city / search
    if (filters.city) {
      const q = filters.city.toLowerCase();
      if (
        !((e.title || '').toLowerCase().includes(q) || (e.location || '').toLowerCase().includes(q))
      )
        return false;
    }

    // event type
    const types = filters.eventTypes || [];
    if (types.length > 0 && !types.includes('All events')) {
      const tag = (e.tag || '').toLowerCase();
      const matched = types.some((t) => {
        const key = t.toLowerCase();
        return tag.includes(key.split(' ')[0]) || key.includes(tag);
      });
      if (!matched) return false;
    }

    // sport
    const selectedSports = Array.isArray(filters.sport)
      ? filters.sport.filter(Boolean)
      : filters.sport
        ? [filters.sport]
        : [];
    if (selectedSports.length > 0) {
      const sport = String(e.sport || '').toLowerCase();
      const matchedSport = selectedSports.some((s) => String(s).toLowerCase() === sport);
      if (!matchedSport) return false;
    }

    return true;
  });

  const total = Math.ceil(filtered.length / perPage);
  const paged = filtered.slice((page - 1) * perPage, page * perPage);

  const handleViewDetails = (event) => {
    if (!event?.id) return;

    if (isAuthenticated) {
      navigate(`/events/${event.id}`, { state: { event } });
      return;
    }

    setSelectedEventId(event.id);
    setShowLoginModal(true);
  };

  const handleModalLogin = () => {
    const targetPath = selectedEventId ? `/events/${selectedEventId}` : '/events';
    setShowLoginModal(false);
    navigate('/signin', { state: { from: targetPath } });
  };

  return (
    <div className="bg-[#F8FAFC] py-6 lg:py-10">
      <Container>
        {/* Custom Header Section */}
        <div className="mb-6 flex flex-col items-start justify-between gap-4 lg:mb-8 lg:flex-row lg:items-center">
          {/* Header Section */}
          <div className="">
            <PageHeader
              title="Events"
              description={'Explore women-focused events and workshops near you. '}
            />
          </div>

          <div className="flex w-full items-center justify-end gap-2 lg:w-auto">
            {/* Mobile Filter Button */}
            <button
              onClick={() => setShowFilters(true)}
              className="flex w-full items-center justify-between rounded-lg border border-[#B9DAD7] bg-white px-5 py-4 text-left lg:hidden"
            >
              <span className="text-base font-semibold leading-none text-gray-900">Filters</span>
              <Filter className="h-6 w-6 shrink-0 text-gray-900" strokeWidth={2.2} />
            </button>
          </div>
        </div>

        {/* Mobile Filter Side-Drawer */}
        {showFilters && (
          <div
            className="fixed inset-0 z-100 flex justify-end lg:hidden"
            onWheel={(e) => e.stopPropagation()} // Stop scroll leakage
          >
            {/* Overlay Backdrop */}
            <div
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
              onClick={() => setShowFilters(false)}
            />

            {/* Drawer Content */}
            <div
              className="relative flex h-full w-[85%] max-w-sm flex-col bg-white shadow-xl"
              onClick={(e) => e.stopPropagation()} // Stop click through to backdrop
            >
              {/* Drawer Header */}
              <div className="flex shrink-0 items-center justify-between border-b border-gray-200 p-4">
                <h4 className="text-lg font-bold text-gray-900">Filters</h4>
                <button
                  onClick={() => setShowFilters(false)}
                  className="rounded-full p-2 transition-colors hover:bg-gray-100"
                >
                  <X className="h-6 w-6 text-gray-500" />
                </button>
              </div>

              {/* Scrollable Filters Body */}
              <div className="flex-1 overflow-x-hidden overflow-y-auto p-4">
                <div className="pb-24">
                  {' '}
                  {/* Extra padding bottom for the fixed button gap */}
                  <EventFilters
                    filters={filters}
                    onChange={(f) => {
                      setFilters(f);
                      setPage(1);
                    }}
                  />
                </div>
              </div>

              {/* Fixed Bottom Action Button */}
              <div className="absolute right-0 bottom-0 left-0 shrink-0 border-t border-gray-200 bg-white p-4">
                <button
                  onClick={() => setShowFilters(false)}
                  className="w-full rounded-xl bg-[#5EA39E] py-3.5 font-bold text-white shadow-lg transition-transform active:scale-95"
                >
                  Show Results
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Content Grid */}
        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-4">
          {/* Desktop Sidebar */}
          <aside className="hidden lg:col-span-1 lg:block">
            <div className="sticky top-22">
              <EventFilters
                filters={filters}
                onChange={(f) => {
                  setFilters(f);
                  setPage(1);
                }}
              />
            </div>
          </aside>

          {/* Main Events List */}
          <div className="lg:col-span-3">
            {loading && (
              <div className="rounded-md border border-gray-200 bg-white p-6 text-center text-gray-600">
                Loading events...
              </div>
            )}

            {error && !loading && (
              <div className="rounded-md border border-red-200 bg-red-50 p-6 text-center text-red-600">
                Error: {error}
              </div>
            )}

            {!loading && !error && (
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:gap-6 xl:grid-cols-3">
                {paged.map((e) => (
                  <EventCard key={e.id} event={e} onViewDetails={handleViewDetails} />
                ))}
              </div>
            )}

            {/* Pagination Area */}
            {!loading && !error && filtered.length === 0 ? (
              <div className="mt-10 rounded-md border border-dashed border-gray-200 bg-white p-6 text-center text-gray-600">
                No events match your filters yet — try widening your search or exploring all events.
              </div>
            ) : !loading && !error ? (
              <div className="mt-10 flex justify-center">
                <Pagination page={page} total={total} onChange={(p) => setPage(p)} />
              </div>
            ) : null}
          </div>
        </div>

        <LoginRequiredModal
          isOpen={showLoginModal}
          onClose={() => setShowLoginModal(false)}
          onLogin={handleModalLogin}
        />
      </Container>
    </div>
  );
};

export default EventView;
