import React, { useState, useMemo } from 'react';
import Table from '../../../../../components/ui/Table';
import Pagination from '../../../../../components/ui/Pagination';
import { Eye } from 'lucide-react';

const SessionsTable = ({ sessions = [], resultsPerPage = 6 }) => {
    const [currentPage, setCurrentPage] = useState(1);

    const columns = ['User', 'Service', 'Date', 'Status','Action'];

    const sampleSessions = [
        { id: 's1', user: 'Darlene Robertson', service: 'Physio', date: 'Jan 10', status: 'Completed' },
        { id: 's2', user: 'Jane Cooper', service: 'Physio', date: 'Jan 10', status: 'Upcoming' },
        { id: 's3', user: 'Savannah Nguyen', service: 'Physio', date: 'Jan 10', status: 'Completed' },
        { id: 's4', user: 'Brooklyn Simmons', service: 'Physio', date: 'Jan 11', status: 'Upcoming' },
        { id: 's5', user: 'Kristin Watson', service: 'Physio', date: 'Jan 12', status: 'Completed' },
        { id: 's6', user: 'Eleanor Pena', service: 'Physio', date: 'Jan 12', status: 'Upcoming' }
    ];

    const effectiveSessions = (sessions && sessions.length > 0) ? sessions : sampleSessions;

    const totalResults = effectiveSessions.length;
    const totalPages = Math.max(1, Math.ceil(totalResults / resultsPerPage));

    const paginated = useMemo(() => {
        const start = (currentPage - 1) * resultsPerPage;
        return effectiveSessions.slice(start, start + resultsPerPage);
    }, [effectiveSessions, currentPage, resultsPerPage]);

    const renderRow = (session) => (
        <>
            <td className="px-4 py-4 text-tableText">{session.user}</td>
            <td className="px-4 py-4 text-tableText">{session.service}</td>
            <td className="px-4 py-4 text-tableText">{session.date}</td>
            <td className="px-4 py-4 text-tableText">  <span
                    className={`${session.status === 'Completed'
                        ? 'text-teal-600'
                        : 'text-blue-600'
                        }`}
                >
                    {session.status}
                </span></td>
            <td className="px-8 py-4">
               <button> <Eye className="w-4 h-4 text-gray-600 cursor-pointer" /></button>
            </td>
        </>
    );

    return (
        <div>
            <div className="hidden md:block overflow-x-auto">
                <Table
                    columns={columns}
                    data={paginated}
                    renderRow={renderRow}
                />
            </div>

            <div className="md:hidden space-y-4">
                {paginated.map((session) => (
                    <div key={session.id} className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
                        <h3 className="text-base font-semibold text-cardTitle">{session.user}</h3>
                        <div className="mt-3 grid grid-cols-2 gap-3 text-sm">
                            <div>
                                <p className="text-gray-500">Service</p>
                                <p className="text-cardTitle font-medium">{session.service}</p>
                            </div>
                            <div>
                                <p className="text-gray-500">Date</p>
                                <p className="text-cardTitle font-medium">{session.date}</p>
                            </div>
                            <div>
                                <p className="text-gray-500">Status</p>
                                <p className={`${session.status === 'Completed' ? 'text-teal-600' : 'text-blue-600'} font-medium`}>
                                    {session.status}
                                </p>
                            </div>
                        </div>
                        <div className="mt-4 flex justify-end">
                            <button type="button" aria-label="View session details">
                                <Eye className="w-4 h-4 text-gray-600 cursor-pointer" />
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            <div>
                <Pagination
                    page={currentPage}
                    total={totalPages}
                    onChange={(p) => setCurrentPage(Math.max(1, Math.min(totalPages, p)))}
                />
            </div>
        </div>
    );
};

export default SessionsTable;
