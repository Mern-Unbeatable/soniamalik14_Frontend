import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Button from '../../../../../components/ui/Button';
import { fetchOrganizerEvents } from '../../../../../features/events/eventsAPI';
import {
    selectOrganizerEvents,
    selectOrganizerEventsLoading,
    selectOrganizerEventsError,
} from '../../../../../features/events/eventsSlice';

const STATUS_MAP = {
    APPROVED: { label: 'Approved', color: 'text-[#0F766E]' },
    PENDING_APPROVAL: { label: 'Pending', color: 'text-[#FF7700]' },
    REJECTED: { label: 'Rejected', color: 'text-red-500' },
    BANNED: { label: 'Banned', color: 'text-red-600' },
};

const getMonthDay = (dateStr) => {
    if (!dateStr) return { month: '---', day: '--' };
    const date = new Date(dateStr);
    const month = date.toLocaleString('en-US', { month: 'short' }).toUpperCase();
    const day = String(date.getDate()).padStart(2, '0');
    return { month, day };
};

const EventsList = ({ onCreateEvent }) => {
    const dispatch = useDispatch();
    const events = useSelector(selectOrganizerEvents);
    const loading = useSelector(selectOrganizerEventsLoading);
    const error = useSelector(selectOrganizerEventsError);

    useEffect(() => {
        dispatch(fetchOrganizerEvents());
    }, [dispatch]);

    const displayedEvents = Array.isArray(events) ? events.slice(0, 4) : [];

    return (
        <div className="p-2 md:p-2">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold">Your Events</h3>
                <button onClick={onCreateEvent} className="text-btn-primary font-medium">
                    + Create Event
                </button>
            </div>

            {loading && (
                <div className="space-y-4">
                    {[1, 2, 3, 4].map((i) => (
                        <div
                            key={i}
                            className="flex items-center gap-4 bg-white border border-gray-100 rounded-lg p-4 animate-pulse"
                        >
                            <div className="w-14 h-14 bg-gray-100 rounded-lg" />
                            <div className="flex-1 space-y-2">
                                <div className="h-4 bg-gray-100 rounded w-3/4" />
                                <div className="h-3 bg-gray-100 rounded w-1/4" />
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {!loading && error && (
                <p className="text-red-500 text-sm text-center py-4">{error}</p>
            )}

            {!loading && !error && displayedEvents.length === 0 && (
                <p className="text-gray-400 text-sm text-center py-6">No events found.</p>
            )}

            {!loading && !error && displayedEvents.length > 0 && (
                <div className="space-y-3">
                    {displayedEvents.map((event) => {
                        const { month, day } = getMonthDay(event.startDate);
                        const statusInfo = STATUS_MAP[event.status] || {
                            label: event.status || 'Unknown',
                            color: 'text-gray-500',
                        };

                        return (
                            <div
                                key={event.id}
                                className="flex items-center gap-3 bg-white border border-gray-100 rounded-lg p-3"
                            >
                                {/* Date box */}
                                <div className="text-center bg-gray-50 rounded-lg w-12 h-12 flex flex-col items-center justify-center shrink-0">
                                    <div className="text-xs text-[#676767] leading-none">{month}</div>
                                    <div className="font-semibold text-sm !text-[#0F766E] leading-none mt-0.5">{day}</div>
                                </div>

                                {/* Title + Status */}
                                <div className="min-w-0 flex-1">
                                    <h4 className="font-medium text-sm leading-snug line-clamp-2">{event.title}</h4>
                                    <p className={`text-xs mt-0.5 ${statusInfo.color}`}>
                                        {statusInfo.label}
                                    </p>
                                </div>

                                {/* Button */}
                                <div className="shrink-0">
                                    <Link
                                        to={`/coach/event/${event.id}`}
                                        state={{ item: event, from: 'dashboard' }}
                                    >
                                        <Button
                                            variant="outline"
                                            className="!bg-[#0F766E] !text-white rounded-lg !text-xs px-2 py-1.5 whitespace-nowrap"
                                        >
                                            See Details
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default EventsList;
