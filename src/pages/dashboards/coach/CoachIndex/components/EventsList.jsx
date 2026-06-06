import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../../../../../components/ui/Button';

const EventsList = ({ onCreateEvent }) => {
    const events = [
        { id: 1, month: 'OCT', day: '21', title: 'Open Trial Morning', status: 'Approved' },
        { id: 2, month: 'NOV', day: '05', title: 'Winter Training Camp', status: 'Approved' },
        { id: 3, month: 'NOV', day: '18', title: 'Youth Skills Workshop', status: 'Pending' },
        { id: 4, month: 'DEC', day: '10', title: 'End of Season Showcase', status: 'Pending' },
    ];

    return (
        <div className="p-2 md:p-2">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold">Your Events</h3>
                <button onClick={onCreateEvent} className="text-btn-primary font-medium">+ Create Event</button>
            </div>

            <div className="space-y-4">
                {events.map((event) => (
                    <div key={event.id} className="flex flex-col lg:flex-row items-start lg:items-center justify-between bg-white border border-gray-100 rounded-lg p-4">
                        <div className="flex items-center gap-4 flex-1">
                            <div className="text-center bg-gray-50 rounded-lg w-14 h-14 flex flex-col items-center justify-center">
                                <div className="text-base text-[#676767]">{event.month}</div>
                                <div className="font-semibold !text-[#0F766E]">{event.day}</div>
                            </div>
                            <div>
                                <h4 className="font-medium">{event.title}</h4>
                                <p className={`text-base mt-1 ${event.status === 'Approved' ? 'text-[#0F766E]' : 'text-[#FF7700]'}`}>
                                    {event.status}
                                </p>
                            </div>
                        </div>

                        <div className="w-full lg:w-auto mt-3 lg:mt-0">
                            <Link to={`/coach/event/${event.id}`} state={{ item: event, from: 'dashboard' }}>
                                <Button variant="outline" className="w-full lg:w-auto !bg-[#0F766E] !text-white rounded-lg px-2 md:px-4 py-2">
                                    See Details
                                </Button>
                            </Link>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default EventsList;
