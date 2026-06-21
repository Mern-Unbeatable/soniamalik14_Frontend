import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SavedCard from './components/SavedCard';
import Pagination from '../../../../components/ui/Pagination';
import { GET, POST } from '../../../../services/httpMethods';
import { ENDPOINT } from '../../../../services/httpEndpoint';
import { toast } from 'react-toastify';

const ITEMS_PER_PAGE = 6;

const formatEventTime = (event) => {
  const datePart = event?.startDate ? new Date(event.startDate).toLocaleDateString() : '';
  const timePart = event?.startTime || '';
  return [datePart, timePart].filter(Boolean).join(' • ') || 'Time not available';
};

const mapSavedEventToCard = (item) => {
  const event = item?.event || {};
  return {
    id: event?.id,
    title: event?.title || 'Untitled event',
    location: event?.venueName || event?.city || event?.fullAddress || 'Location not specified',
    time: formatEventTime(event),
    imageSrc: event?.image || '',
  };
};

const Saved = () => {
  const navigate = useNavigate();
  const [savedItems, setSavedItems] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [removingId, setRemovingId] = useState(null);

  const fetchSavedEvents = useCallback(async () => {
    try {
      setLoading(true);
      const res = await GET(ENDPOINT.EVENTS.USER_SAVED, { page: currentPage, limit: ITEMS_PER_PAGE });
      const savedEvents = res?.data?.data?.savedEvents || [];
      const meta = res?.data?.data?.meta || {};

      setSavedItems((Array.isArray(savedEvents) ? savedEvents : []).map(mapSavedEventToCard));
      setTotalPages(Number(meta?.totalPage) > 0 ? Number(meta.totalPage) : 1);
    } catch (error) {
      console.error('Failed to fetch saved events:', error);
      setSavedItems([]);
      setTotalPages(1);
      toast.error('Failed to load saved events');
    } finally {
      setLoading(false);
    }
  }, [currentPage]);

  useEffect(() => {
    fetchSavedEvents();
  }, [fetchSavedEvents]);

  const handleViewDetails = (eventId) => {
    if (!eventId) return;
    navigate(`/events/${eventId}`);
  };

  const handleRemoveItem = async (eventId) => {
    if (!eventId || removingId) return;

    try {
      setRemovingId(eventId);
      await POST(ENDPOINT.EVENTS.SAVE(eventId), {});
      toast.success('Event removed from saved');

      if (savedItems.length === 1 && currentPage > 1) {
        setCurrentPage((prev) => prev - 1);
      } else {
        await fetchSavedEvents();
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Failed to remove saved event');
    } finally {
      setRemovingId(null);
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className="dashboardPy dashboardSpaceY">
      <div className="flex items-center gap-3 mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Saved Event</h1>
      </div>

      {loading ? (
        <div className="py-16 text-center flex flex-col items-center justify-center">
          <div className="w-10 h-10 border-4 border-[#147A73] border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-gray-500 text-base">Loading saved events...</p>
        </div>
      ) : savedItems.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-4 md:gap-6">
            {savedItems.map((item) => (
              <SavedCard
                key={item.id}
                title={item.title}
                location={item.location}
                time={item.time}
                imageSrc={item.imageSrc}
                onViewDetails={() => handleViewDetails(item.id)}
                onRemove={() => handleRemoveItem(item.id)}
                isRemoving={removingId === item.id}
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
          <p className="text-gray-500 text-lg">No saved items found</p>
        </div>
      )}
    </div>
  );
};

export default Saved;
