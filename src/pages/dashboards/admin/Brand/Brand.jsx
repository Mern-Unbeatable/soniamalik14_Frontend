import React from 'react';

const Brands = () => {
    // Dummy data matching the exact rows from the uploaded image
    const brandData = [
        { id: 1, name: 'Guy Hawkins', phone: '(505) 555-0125', sport: 'Tennis', postcode: 'SW1A 1AA' },
        { id: 2, name: 'Leslie Alexander', phone: '(704) 555-0127', sport: 'Football', postcode: 'EC1A 1BB' },
        { id: 3, name: 'Courtney Henry', phone: '(629) 555-0129', sport: 'Badminton', postcode: 'M1 1AE' },
        { id: 4, name: 'Ralph Edwards', phone: '(239) 555-0108', sport: 'Cricket', postcode: 'B1 1AA' },
        { id: 5, name: 'Jenny Wilson', phone: '(229) 555-0109', sport: 'Football', postcode: 'LS1 1UR' },
        { id: 6, name: 'Cameron Williamson', phone: '(209) 555-0104', sport: 'Padel', postcode: 'G1 1AA' },
    ];

    return (
        <div className="flex-1 overflow-auto bg-gray-50 dashboardPy dashboardSpaceY">
            <div className="">

                {/* Header Section */}
                <div className="mb-6">
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Brands</h1>
                </div>

                {/* Main Content Area */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">

                    {/* Table Area */}
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-[#E7F1F1] border-b border-gray-100">
                                    <th className="px-6 py-4 text-base font-semibold text-black whitespace-nowrap">User Name</th>
                                    <th className="px-6 py-4 text-base font-semibold text-black whitespace-nowrap">Phone number</th>
                                    <th className="px-6 py-4 text-base font-semibold text-black whitespace-nowrap">Sport</th>
                                    <th className="px-6 py-4 text-base font-semibold text-black whitespace-nowrap">Postcode</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 bg-white">
                                {brandData.map((row) => (
                                    <tr key={row.id} className="hover:bg-gray-50/50 transition-colors">
                                        <td className="px-6 py-5 whitespace-nowrap text-base text-gray-800">
                                            {row.name}
                                        </td>
                                        <td className="px-6 py-5 whitespace-nowrap text-base text-gray-600">
                                            {row.phone}
                                        </td>
                                        <td className="px-6 py-5 whitespace-nowrap text-base text-gray-600">
                                            {row.sport}
                                        </td>
                                        <td className="px-6 py-5 whitespace-nowrap text-base text-gray-600">
                                            {row.postcode}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    <div className="px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-gray-100">
                        <span className="text-sm font-medium text-[#0f766e]">
                            Showing 1 to {brandData.length} of {brandData.length} results
                        </span>
                        <div className="flex gap-2">
                            <button className="px-5 py-2 text-sm font-medium text-[#0f766e] bg-white border border-[#0f766e] rounded-lg hover:bg-teal-50 transition-colors focus:outline-none focus:ring-2 focus:ring-teal-500/20">
                                Previous
                            </button>
                            <button className="px-5 py-2 text-sm font-medium text-[#0f766e] bg-white border border-[#0f766e] rounded-lg hover:bg-teal-50 transition-colors focus:outline-none focus:ring-2 focus:ring-teal-500/20">
                                Next
                            </button>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default Brands;