import React from 'react';

const EventPagination = ({
    currentPage,
    totalPages,
    pageSize,
    totalResults,
    onPrev,
    onNext,
}) => {
    const start = totalResults === 0 ? 0 : (currentPage - 1) * pageSize + 1;
    const end = totalResults === 0 ? 0 : Math.min(currentPage * pageSize, totalResults);

    return (
        <div className="px-6 py-4 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4">
            <span className="text-sm text-btn-primary">
                Showing {start} to {end} of {totalResults} results
            </span>
            <div className="flex gap-2">
                <button
                    type="button"
                    onClick={onPrev}
                    disabled={currentPage <= 1}
                    className="px-4 py-2 text-sm font-medium text-btn-primary bg-white border border-btn-primary rounded-lg hover:bg-teal-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Previous
                </button>
                <button
                    type="button"
                    onClick={onNext}
                    disabled={currentPage >= totalPages || totalResults === 0}
                    className="px-4 py-2 text-sm font-medium text-btn-primary bg-white border border-btn-primary rounded-lg hover:bg-teal-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Next
                </button>
            </div>
        </div>
    );
};

export default EventPagination;
