import React from 'react';

const DemandPagination = ({
    currentPage = 1,
    totalPages = 1,
    totalResults = 0,
    limit = 20,
    onPageChange
}) => {
    // If no page change handler is provided, fall back to the original static mock layout.
    if (!onPageChange) {
        return (
            <div className="px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-gray-100 bg-white">
                <span className="text-base font-medium text-[#0f766e]">
                    Showing 1 to 6 of 6 results
                </span>
                <div className="flex gap-2">
                    <button className="px-5 py-2 text-base font-medium text-[#0f766e] bg-white border border-[#0f766e] rounded-lg hover:bg-teal-50 transition-colors focus:outline-none focus:ring-2 focus:ring-teal-500/20">
                        Previous
                    </button>
                    <button className="px-5 py-2 text-base font-medium text-[#0f766e] bg-white border border-[#0f766e] rounded-lg hover:bg-teal-50 transition-colors focus:outline-none focus:ring-2 focus:ring-teal-500/20">
                        Next
                    </button>
                </div>
            </div>
        );
    }

    if (totalResults === 0) return null;

    const startResult = (currentPage - 1) * limit + 1;
    const endResult = Math.min(currentPage * limit, totalResults);

    return (
        <div className="px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-gray-100 bg-white">
            <span className="text-base font-medium text-[#0f766e]">
                Showing {startResult} to {endResult} of {totalResults} results
            </span>
            <div className="flex gap-2">
                <button
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-5 py-2 text-base font-medium text-[#0f766e] bg-white border border-[#0f766e] rounded-lg hover:bg-teal-50 transition-colors focus:outline-none focus:ring-2 focus:ring-teal-500/20 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                    Previous
                </button>
                <button
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="px-5 py-2 text-base font-medium text-[#0f766e] bg-white border border-[#0f766e] rounded-lg hover:bg-teal-50 transition-colors focus:outline-none focus:ring-2 focus:ring-teal-500/20 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                    Next
                </button>
            </div>
        </div>
    );
};

export default DemandPagination;
