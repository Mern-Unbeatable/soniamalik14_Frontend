import React, { useMemo, useState } from 'react';
import TablePagination from '../../../../../components/ui/TablePagination';

const BookingsTable = ({ bookings = [], resultsPerPage = 6 }) => {
    const [currentPage, setCurrentPage] = useState(1);

    const totalResults = bookings.length;
    const totalPages = Math.max(1, Math.ceil(totalResults / resultsPerPage));

    const paginated = useMemo(() => {
        const start = (currentPage - 1) * resultsPerPage;
        return bookings.slice(start, start + resultsPerPage);
    }, [bookings, currentPage, resultsPerPage]);

    return (
        <div className="mt-10">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <div className="px-6 py-5 border-b bg-white border-gray-200">
                    <h2 className="text-xl font-semibold text-gray-900">Bookings</h2>
                </div>

                {/* Card view for mobile only */}
                <div className="block md:hidden">
                    {paginated.map((b, idx) => (
                        <div key={idx} className="px-6 py-4 border-b border-gray-200 last:border-b-0">
                            <div className="grid grid-cols-2 gap-2 items-start">
                                <div className="text-xs text-gray-500">Name</div>
                                <div className="text-base text-gray-800 font-medium text-right">{b.name}</div>
                            </div>
                            <div className="grid grid-cols-2 gap-2 items-start mt-3">
                                <div className="text-xs text-gray-500">Phone Number</div>
                                <div className="text-base text-gray-700 text-right">{b.phone}</div>
                            </div>
                            <div className="grid grid-cols-2 gap-2 items-start mt-3">
                                <div className="text-xs text-gray-500">Email</div>
                                <div className="text-base text-gray-700 wrap-break-word text-right">{b.email}</div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Table view for tablet and larger screens */}
                <div className="hidden md:block overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-[#F8F8F8]">
                            <tr>
                                <th scope="col" className="text-left px-6 py-3 text-base font-medium text-gray-700">Name</th>
                                <th scope="col" className="text-center px-6 py-3 text-base font-medium text-gray-700">Phone Number</th>
                                <th scope="col" className="text-center px-6 py-3 text-base font-medium text-gray-700">Email</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {paginated.map((b, idx) => (
                                <tr key={idx} className="odd:bg-white even:bg-white">
                                    <td className="px-6 py-6 text-base text-gray-800 font-medium">{b.name}</td>
                                    <td className="px-6 py-6 text-base text-center text-gray-700">{b.phone}</td>
                                    <td className="px-6 py-6 text-base text-gray-700 wrap-break-word text-center">{b.email}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="border-t border-gray-200">
                    <TablePagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        totalResults={totalResults}
                        resultsPerPage={resultsPerPage}
                        onPageChange={(p) => {
                            if (p < 1 || p > totalPages) return;
                            setCurrentPage(p);
                        }}
                    />
                </div>
            </div>
        </div>
    );
};

export default BookingsTable;
