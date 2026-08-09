import React, { useState, useEffect } from 'react';
import Button from '../../../../components/ui/Button';

const CoachFilter = ({ onFilter, active = 'All', initialQuery = '' }) => {
    const types = ['All', 'Approved', 'Pending'];
    const [status, setStatus] = useState(active);
    const [query, setQuery] = useState(initialQuery);

    useEffect(() => {
        setStatus(active || 'All');
    }, [active]);

    useEffect(() => {
        setQuery(initialQuery || '');
    }, [initialQuery]);

    const publishFilter = (nextStatus, nextQuery) => {
        onFilter?.({
            status: nextStatus,
            query: nextQuery,
        });
    };

    return (
        <div className="w-full lg:w-1/2 bg-secondary p-4 rounded-xl">
            <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-4">
                <div className="flex-1 bg-white rounded-lg px-4 py-2.5 shadow-sm border border-gray-200">
                    <input
                        placeholder="Search By event name"
                        value={query}
                        onChange={(e) => {
                            const nextQuery = e.target.value;
                            setQuery(nextQuery);
                            publishFilter(status, nextQuery);
                        }}
                        className="w-full bg-transparent outline-none text-base text-gray-700 placeholder-gray-400"
                    />
                </div>

                <div className="md:hidden">
                    <select
                        value={status}
                        onChange={(e) => {
                            const nextStatus = e.target.value;
                            setStatus(nextStatus);
                            publishFilter(nextStatus, query);
                        }}
                        className="w-full bg-white rounded-lg px-4 py-2.5 shadow-sm border border-gray-200 outline-none text-base text-gray-700"
                    >
                        {types.map((t) => (
                            <option key={t} value={t}>
                                {t}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="hidden md:flex gap-2">
                    {types.map((t) => (
                        <Button
                            key={t}
                            variant={t === status ? 'primary' : 'outline'}
                            className={`rounded-lg px-5 py-2 text-base ${t === status ? 'shadow-md' : ''}`}
                            onClick={() => {
                                setStatus(t);
                                publishFilter(t, query);
                            }}
                        >
                            {t}
                        </Button>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default CoachFilter;
