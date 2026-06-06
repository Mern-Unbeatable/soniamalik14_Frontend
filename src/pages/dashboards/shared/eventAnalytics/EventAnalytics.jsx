import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Table from '../../../../components/ui/Table';
import Pagination from '../../../../components/ui/Pagination';
import { Eye, ChevronLeft, ChevronRight } from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';
import { fetchEventAnalytics } from '../../../../features/events/eventsAPI';
import { selectEventAnalytics, selectAnalyticsLoading, selectAnalyticsError } from '../../../../features/events/eventsSlice';

const EventAnalytics = ({ baseRoute = '/coach' }) => {
    const dispatch = useDispatch();
    const [searchParams, setSearchParams] = useSearchParams();
    const allEvents = useSelector(selectEventAnalytics);
    const loading = useSelector(selectAnalyticsLoading);
    const error = useSelector(selectAnalyticsError);

    const getInitialTab = () => {
        const tab = searchParams.get('tab');
        const validTabs = ['all', 'complete', 'upcoming', 'pending', 'cancel'];
        return validTabs.includes(tab) ? tab : 'all';
    };

    const [activeTab, setActiveTab] = useState(getInitialTab);
    const [currentPage, setCurrentPage] = useState(1);
    const resultsPerPage = 6;

    const scrollContainerRef = useRef(null);
    const activeTabRef = useRef(null);

    const tabs = [
        { id: 'all', label: 'All Event List' },
        { id: 'complete', label: 'Complete Event' },
        { id: 'upcoming', label: 'Upcoming Event' },
        { id: 'pending', label: 'Pending Event' },
        { id: 'cancel', label: 'Cancel Event' },
    ];

    useEffect(() => {
        dispatch(fetchEventAnalytics());
    }, [dispatch]);

    const formatLabel = (value) => {
        if (!value) return '-';
        return String(value)
            .toLowerCase()
            .split('_')
            .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
            .join(' ');
    };

    const normalizedEvents = useMemo(() => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const source = Array.isArray(allEvents) ? allEvents : [];

        return source.map((event) => {
            const analyticsEntry = Array.isArray(event?.analytics) ? event.analytics[0] : event?.analytics;
            const startDate = event?.startDate ? new Date(event.startDate) : null;
            const endDate = event?.endDate ? new Date(event.endDate) : startDate;
            const normalizedStatus = String(event?.status || '').trim().toLowerCase();
            const isCancelled = normalizedStatus === 'cancelled' || normalizedStatus === 'canceled';
            const isPending = normalizedStatus === 'pending';
            const isComplete = normalizedStatus === 'completed' || (!!endDate && endDate < today && !isCancelled && !isPending);
            const isUpcoming = !isCancelled && !isPending && !isComplete;

            return {
                ...event,
                type: formatLabel(event?.eventType || event?.type),
                organizer: event?.organizerName || event?.organizer?.name || '-',
                sport: event?.sportType || event?.sport || '-',
                date: event?.startDate || event?.date || event?.createdAt || null,
                status: formatLabel(event?.status || (event?.isApproved ? 'approved' : '')),
                joined: Number(
                    analyticsEntry?.registrations ?? event?.currentParticipants ?? event?.registrations?.length ?? 0
                ),
                eventType: formatLabel(event?.eventType || event?.type),
                eventSubType: formatLabel(event?.eventType || event?.type),
                venue: {
                    name: event?.venueName || '-',
                    address: event?.fullAddress || [event?.venueName, event?.city].filter(Boolean).join(', ') || '-',
                },
                time: [event?.startTime, event?.endTime].filter(Boolean).join(' - '),
                isComplete,
                isUpcoming,
                isPending,
                isCancelled,
            };
        });
    }, [allEvents]);

    //  Effect to center the active tab whenever it changes
    useEffect(() => {
        if (activeTabRef.current) {
            activeTabRef.current.scrollIntoView({
                behavior: 'smooth',
                block: 'nearest',
                inline: 'center'
            });
        }
    }, [activeTab]);

    const scroll = (direction) => {
        if (scrollContainerRef.current) {
            const { scrollLeft } = scrollContainerRef.current;
            const scrollTo = direction === 'left' ? scrollLeft - 150 : scrollLeft + 150;
            scrollContainerRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
        }
    };

    const columns = ['Event Title', 'Type', 'Organizer', 'Sport', 'Date', 'Status', 'Joined', 'Action'];

    const filteredEvents = normalizedEvents.filter(event => {
        if (activeTab === 'all') return true;
        if (activeTab === 'complete') return event.isComplete;
        if (activeTab === 'upcoming') return event.isUpcoming;
        if (activeTab === 'pending') return event.isPending;
        if (activeTab === 'cancel') return event.isCancelled;
        return true;
    });

    const totalResults = filteredEvents.length;
    const totalPages = Math.max(1, Math.ceil(totalResults / resultsPerPage));
    const safeCurrentPage = Math.min(currentPage, totalPages);
    const paginatedEvents = filteredEvents.slice((safeCurrentPage - 1) * resultsPerPage, safeCurrentPage * resultsPerPage);

    const handlePageChange = (page) => setCurrentPage(Math.max(1, Math.min(totalPages, page)));

    const handleTabChange = (tabId) => {
        setActiveTab(tabId);
        setCurrentPage(1);

        const next = new URLSearchParams(searchParams);
        next.set('tab', tabId);
        setSearchParams(next);
    };

    const renderRow = (event) => {
        const getStatusStyle = (status) => {
            const s = status.toLowerCase();
            if (s === 'approved') return ' text-[#0F766E] ';
            if (s === 'pending') return 'text-[#FF7700] ';
            if (s === 'cancelled') return ' text-red-600 ';
            return ' text-gray-600 ';
        };

        const formattedDate = event.date && event.date.includes('-')
            ? new Date(event.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: '2-digit' })
            : event.date;

        return (
            <>
                <td className="px-4 py-4"><div className="text-cardTitle font-medium">{event.title}</div></td>
                <td className="px-4 py-4 text-cardTitle">{event.type}</td>
                <td className="px-4 py-4 text-cardTitle">{event.organizer}</td>
                <td className="px-4 py-4 text-cardTitle">{event.sport}</td>
                <td className="px-4 py-4 text-cardTitle">{formattedDate}</td>
                <td className="px-4 py-4">
                    <span className={`rounded-md px-3 py-1 text-base font-medium ${getStatusStyle(event.status)}`}>
                        {event.status}
                    </span>
                </td>
                <td className="px-4 py-4"><span className="text-btn-primary font-medium">{event.joined}</span></td>
                <td className="px-4 py-4">
                    <Link
                        to={`${baseRoute}/event-analytics/event/${event.id}`}
                        state={{ item: event, from: 'analytics', tab: activeTab }}
                        className="text-gray-600 hover:text-btn-primary transition-colors inline-flex items-center"
                    >
                        <Eye className="w-5 h-5" />
                    </Link>
                </td>
            </>
        );
    };

    const getStatusStyle = (status = '') => {
        const s = status.toLowerCase();
        if (s === 'approved') return 'text-[#0F766E]';
        if (s === 'pending') return 'text-[#FF7700]';
        if (s === 'cancelled') return 'text-red-600';
        return 'text-gray-600';
    };

    const formatDate = (dateValue) => {
        if (!dateValue) return '-';
        if (typeof dateValue === 'string' && dateValue.includes('-')) {
            return new Date(dateValue).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: '2-digit' });
        }
        return dateValue;
    };

    return (
        <div className="dashboardPy dashboardSpaceY">
            <div className="relative border-b border-gray-200 group">
                <button onClick={() => scroll('left')} className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white p-1 shadow-sm rounded-full md:hidden">
                    <ChevronLeft className="w-5 h-5 text-gray-600" />
                </button>

                <div
                    ref={scrollContainerRef}
                    className="flex gap-8 px-10 overflow-x-auto scrollbar-hide scroll-smooth"
                >
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            ref={activeTab === tab.id ? activeTabRef : null} // Assign ref to the active button
                            onClick={() => handleTabChange(tab.id)}
                            className={`py-4 text-base font-medium transition-colors relative whitespace-nowrap ${activeTab === tab.id
                                ? 'text-btn-primary'
                                : 'text-gray-500 hover:text-gray-700'
                                }`}
                        >
                            {tab.label}
                            {activeTab === tab.id && (
                                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-btn-primary"></span>
                            )}
                        </button>
                    ))}
                </div>

                <button onClick={() => scroll('right')} className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white p-1 shadow-sm rounded-full md:hidden">
                    <ChevronRight className="w-5 h-5 text-gray-600" />
                </button>
            </div>

            <div className="">

                {loading && <div className="text-center py-8 text-gray-600">Loading analytics...</div>}
                {error && (
                    <div className="text-center py-8 text-red-600">
                        Error: {typeof error === 'string' ? error : (error && (error.message || JSON.stringify(error)))}
                    </div>
                )}
                {!loading && !error && (
                    <>
                        {filteredEvents.length === 0 ? (
                            <div className="rounded-xl border border-dashed border-gray-300 bg-white py-16 text-center text-gray-500">
                                No events found for this tab.
                            </div>
                        ) : (
                            <>
                                <div className="hidden md:block overflow-x-auto">
                                    <Table columns={columns} data={paginatedEvents} renderRow={renderRow} />
                                </div>

                                <div className="md:hidden space-y-4">
                                    {paginatedEvents.map((event) => (
                                        <div key={event.id} className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
                                            <div className="flex items-start justify-between gap-3">
                                                <div>
                                                    <h3 className="text-base font-semibold text-cardTitle">{event.title}</h3>
                                                    <p className="text-sm text-gray-500 mt-1">{event.type} • {event.sport}</p>
                                                </div>
                                                <span className={`text-sm font-medium ${getStatusStyle(event.status)}`}>
                                                    {event.status}
                                                </span>
                                            </div>

                                            <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                                                <div>
                                                    <p className="text-gray-500">Organizer</p>
                                                    <p className="text-cardTitle font-medium">{event.organizer}</p>
                                                </div>
                                                <div>
                                                    <p className="text-gray-500">Date</p>
                                                    <p className="text-cardTitle font-medium">{formatDate(event.date)}</p>
                                                </div>
                                                <div>
                                                    <p className="text-gray-500">Joined</p>
                                                    <p className="text-btn-primary font-semibold">{event.joined}</p>
                                                </div>
                                            </div>

                                            <div className="mt-4 flex justify-end">
                                                <Link
                                                    to={`${baseRoute}/event-analytics/event/${event.id}`}
                                                    state={{ item: event, from: 'analytics', tab: activeTab }}
                                                    className="inline-flex items-center gap-1 text-sm text-gray-600 hover:text-btn-primary transition-colors"
                                                >
                                                    <Eye className="w-4 h-4" />
                                                    <span>View</span>
                                                </Link>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </>
                        )}

                        {filteredEvents.length > 0 && totalPages > 1 && (
                            <Pagination
                                page={safeCurrentPage}
                                total={totalPages}
                                onChange={handlePageChange}
                            />
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default EventAnalytics;