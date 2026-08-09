import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useSearchParams, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import PageHeader from '../../../../components/ui/PageHeader';
import EventCard from '../../../../components/ui/EventCard';
import Pagination from '../../../../components/ui/Pagination';
import EventModal from '../../../../components/ui/EventModal';
import DeleteConfirmationModal from '../../../../components/ui/DeleteConfirmationModal';
import { useEvent } from '../../../../context/EventContext';
import { Plus } from 'lucide-react';
import { deleteOrganizerEvent, fetchOrganizerEvents } from '../../../../features/events/eventsAPI';
import {
    selectOrganizerEvents,
    selectOrganizerEventsLoading,
    selectOrganizerEventsError,
} from '../../../../features/events/eventsSlice';

const normalizeEventsList = (value) => {
    if (Array.isArray(value)) return value;
    if (!value || typeof value !== 'object') return [];

    if (Array.isArray(value.events)) return value.events;
    if (Array.isArray(value.data)) return value.data;
    if (Array.isArray(value.rows)) return value.rows;
    if (Array.isArray(value.items)) return value.items;

    return [];
};

const normalizeEventStatus = (rawStatus) => {
    const normalized = String(rawStatus || '')
        .trim()
        .toUpperCase();

    if (!normalized) return '';
    if (normalized.includes('PENDING')) return 'Pending';
    if (normalized.includes('APPROV')) return 'Approved';
    if (normalized.includes('REJECT')) return 'Rejected';
    if (normalized.includes('CANCEL')) return 'Cancelled';

    return normalized.charAt(0) + normalized.slice(1).toLowerCase();
};

const getEventSearchText = (event) =>
    [
        event?.title,
        event?.location,
        event?.fullAddress,
        event?.venueName,
        event?.venue?.name,
        event?.city,
        event?.sportType,
    ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();

const Event = ({
    filterComponent: FilterComponent,
    detailsRoute = '/coach/event',
    useOrganizerApi = false,
}) => {
    const dispatch = useDispatch();
    const { events: contextEvents, loading: contextLoading, error: contextError, fetchEvents, deleteEvent } = useEvent();
    const organizerEvents = useSelector(selectOrganizerEvents);
    const organizerLoading = useSelector(selectOrganizerEventsLoading);
    const organizerError = useSelector(selectOrganizerEventsError);
    const [searchParams] = useSearchParams();
    const location = useLocation();

    const events = normalizeEventsList(useOrganizerApi ? organizerEvents : contextEvents);
    const loading = useOrganizerApi ? organizerLoading : contextLoading;
    const error = useOrganizerApi ? organizerError : contextError;

    // Fetch events on component mount
    useEffect(() => {
        if (useOrganizerApi) {
            dispatch(fetchOrganizerEvents());
            return;
        }

        fetchEvents();
    }, [dispatch, fetchEvents, useOrganizerApi]);

    const [page, setPage] = useState(() => {
        const fromState = location.state?.currentPage;
        if (Number.isInteger(fromState) && fromState > 0) return fromState;
        return 1;
    });
    const [filter, setFilter] = useState(() => {
        const fromState = location.state?.filter;
        if (fromState && typeof fromState === 'object') {
            return {
                status: fromState.status || 'All',
                query: typeof fromState.query === 'string' ? fromState.query : '',
            };
        }

        const statusParam = searchParams.get('status');
        const queryParam = searchParams.get('query');
        return {
            status: statusParam || 'All',
            query: queryParam || '',
        };
    });

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingEvent, setEditingEvent] = useState(null);
    const [eventToDelete, setEventToDelete] = useState(null);
    const [modalMode, setModalMode] = useState('create');
    const perPage = 9;

    const handleEdit = (item) => {
        setEditingEvent(item);
        setModalMode('edit');
        setIsModalOpen(true);
    };

    const handleDelete = async (item) => {
        setEventToDelete(item);
    };

    const confirmDelete = async () => {
        if (eventToDelete) {
            if (useOrganizerApi) {
                const action = await dispatch(deleteOrganizerEvent(eventToDelete.id));
                if (deleteOrganizerEvent.fulfilled.match(action)) {
                    dispatch(fetchOrganizerEvents());
                }
            } else {
                await deleteEvent(eventToDelete.id);
            }
            setEventToDelete(null);
        }
    };

    const handleCreateNew = () => {
        setEditingEvent(null);
        setModalMode('create');
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingEvent(null);
        setModalMode('create');
    };

    const handleFilterChange = useCallback((nextFilter) => {
        setFilter({
            status: nextFilter?.status || 'All',
            query: typeof nextFilter?.query === 'string' ? nextFilter.query : '',
        });
        setPage(1);
    }, []);

    const filtered = useMemo(() => {
        const q = (filter.query || '').trim().toLowerCase();
        return events.filter((ev) => {
            const eventStatus = normalizeEventStatus(ev?.status);
            const matchesStatus =
                filter.status === 'All' || eventStatus === filter.status;
            const matchesQuery = !q || getEventSearchText(ev).includes(q);
            return matchesStatus && matchesQuery;
        });
    }, [events, filter]);

    const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
    const safePage = Math.min(page, totalPages);
    const paged = useMemo(
        () => filtered.slice((safePage - 1) * perPage, safePage * perPage),
        [filtered, safePage, perPage]
    );

    useEffect(() => {
        if (page !== safePage) setPage(safePage);
    }, [page, safePage]);

    return (
        <div className="dashboardPy dashboardSpaceY ">
            <div className='mb-6'>
             

                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl md:text-4xl font-semibold text-[#0B544E] mb-2">Create a New Event</h1>
            <p className="text-gray-600">Host matches, training sessions, trials, and community events for your club.</p>
            
          </div>
          <div>
            <button
                onClick={handleCreateNew}
              className="inline-flex w-full items-center justify-center gap-1.5 rounded-md bg-[#0F766E] px-4 py-3 text-base font-medium whitespace-nowrap text-white transition-colors hover:bg-[#0d655d]"
            >
              <Plus className="h-4 w-4 shrink-0" />
              Create Event
            </button>
          </div>
        </div>
            </div>

            {FilterComponent && (
                <div>
                    <FilterComponent
                        onFilter={handleFilterChange}
                        active={filter.status}
                        initialQuery={filter.query}
                    />
                </div>
            )}

            <div className="pt-4">
                {loading && (
                    <div className="text-center py-8">
                        <div className="text-gray-600">Loading events...</div>
                    </div>
                )}

                {error && (
                    <div className="text-center py-8">
                        <div className="text-red-600">
                            Error: {typeof error === 'string' ? error : error?.message || 'Something went wrong.'}
                        </div>
                    </div>
                )}

                {!loading && !error && paged.length === 0 && (
                    <div className="text-center py-20">
                        <div className="text-gray-500 text-lg mb-2">No events found</div>
                        <p className="text-gray-400 text-base">Create your first event to get started!</p>
                    </div>
                )}

                {!loading && !error && paged.length > 0 && (
                    <>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 xl:grid-cols-3  gap-6 2xl:grid-cols-4">
                            {paged.map((e, idx) => (
                                <EventCard
                                    key={e.id || `event-${idx}`}
                                    item={e}
                                    onEdit={() => handleEdit(e)}
                                    onDelete={() => handleDelete(e)}
                                    detailsRoute={detailsRoute}
                                    filter={filter}
                                    currentPage={safePage}
                                />
                            ))}
                        </div>
                        <Pagination page={safePage} total={totalPages} onChange={(p) => setPage(p)} />
                    </>
                )}
            </div>

            <EventModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                initialData={editingEvent}
                mode={modalMode}
                useOrganizerApi={useOrganizerApi}
                onSuccess={() => {
                    if (useOrganizerApi) {
                        dispatch(fetchOrganizerEvents());
                    }
                }}
            />

            <DeleteConfirmationModal
                isOpen={!!eventToDelete}
                onClose={() => setEventToDelete(null)}
                onConfirm={confirmDelete}
                itemName={eventToDelete?.title || 'this event'}
            />
        </div>
    );
};

export default Event;
