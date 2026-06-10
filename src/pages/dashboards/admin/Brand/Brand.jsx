import React, { useState, useEffect } from 'react';
import { GET } from '../../../../services/httpMethods';
import LoadingSpinner from '../../../../components/ui/LoadingSpinner';

const Brands = () => {
    const [brands, setBrands] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 6;

    useEffect(() => {
        const fetchBrands = async () => {
            setLoading(true);
            setError('');
            try {
                const response = await GET('/api/brands');
                const payload = response?.data || response;
                const data = Array.isArray(payload?.data)
                    ? payload.data
                    : Array.isArray(payload)
                        ? payload
                        : [];
                setBrands(data);
            } catch (err) {
                console.error('Failed to fetch brands:', err);
                setError(err?.response?.data?.message || err?.message || 'Failed to load brands');
            } finally {
                setLoading(false);
            }
        };

        fetchBrands();
    }, []);

    if (loading) {
        return (
            <div className="flex-1 overflow-auto bg-gray-50 dashboardPy dashboardSpaceY">
                <div className="flex min-h-[50vh] items-center justify-center">
                    <LoadingSpinner label="Loading brands..." containerClassName="py-0" />
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex-1 overflow-auto bg-gray-50 dashboardPy dashboardSpaceY">
                <div className="flex min-h-[50vh] flex-col items-center justify-center p-6 text-center">
                    <p className="text-red-600 font-medium mb-4">Error: {error}</p>
                    <button 
                        onClick={() => window.location.reload()}
                        className="px-5 py-2 text-sm font-medium text-white bg-[#0f766e] rounded-lg hover:bg-teal-700 transition-colors"
                    >
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    // Pagination calculations
    const totalItems = brands.length;
    const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));
    const validCurrentPage = Math.min(currentPage, totalPages);
    const startIndex = (validCurrentPage - 1) * itemsPerPage;
    const endIndex = Math.min(startIndex + itemsPerPage, totalItems);
    const currentBrands = brands.slice(startIndex, endIndex);

    const handlePrevPage = () => {
        setCurrentPage((prev) => Math.max(1, prev - 1));
    };

    const handleNextPage = () => {
        setCurrentPage((prev) => Math.min(totalPages, prev + 1));
    };

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
                                    <th className="px-6 py-4 text-base font-semibold text-black whitespace-nowrap">Email</th>
                                    <th className="px-6 py-4 text-base font-semibold text-black whitespace-nowrap">Phone number</th>
                                    <th className="px-6 py-4 text-base font-semibold text-black whitespace-nowrap">Sport</th>
                                    <th className="px-6 py-4 text-base font-semibold text-black whitespace-nowrap">Postcode</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 bg-white">
                                {currentBrands.length > 0 ? (
                                    currentBrands.map((row, idx) => (
                                        <tr key={row.id || idx} className="hover:bg-gray-50/50 transition-colors">
                                            <td className="px-6 py-5 whitespace-nowrap text-base text-gray-800">
                                                {row.name || 'N/A'}
                                            </td>
                                            <td className="px-6 py-5 whitespace-nowrap text-base text-gray-600">
                                                {row.email || 'N/A'}
                                            </td>
                                            <td className="px-6 py-5 whitespace-nowrap text-base text-gray-600">
                                                {row.phone || 'N/A'}
                                            </td>
                                            <td className="px-6 py-5 whitespace-nowrap text-base text-gray-600">
                                                {row.sports || row.sport || 'N/A'}
                                            </td>
                                            <td className="px-6 py-5 whitespace-nowrap text-base text-gray-600">
                                                {row.postCode || row.postcode || 'N/A'}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="5" className="px-6 py-10 text-center text-gray-500 text-base">
                                            No brands found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    <div className="px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-gray-100">
                        <span className="text-sm font-medium text-[#0f766e]">
                            Showing {totalItems > 0 ? startIndex + 1 : 0} to {endIndex} of {totalItems} results
                        </span>
                        <div className="flex gap-2">
                            <button 
                                onClick={handlePrevPage}
                                disabled={validCurrentPage === 1}
                                className="px-5 py-2 text-sm font-medium text-[#0f766e] bg-white border border-[#0f766e] rounded-lg hover:bg-teal-50 transition-colors focus:outline-none focus:ring-2 focus:ring-teal-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Previous
                            </button>
                            <button 
                                onClick={handleNextPage}
                                disabled={validCurrentPage === totalPages}
                                className="px-5 py-2 text-sm font-medium text-[#0f766e] bg-white border border-[#0f766e] rounded-lg hover:bg-teal-50 transition-colors focus:outline-none focus:ring-2 focus:ring-teal-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
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