import React from 'react';

const PaginationSection = ({ page = 1, limit = 10, total = 0, totalPages = 1, onPrev, onNext }) => {
    const start = (page - 1) * limit + 1;
    const end = Math.min(page * limit, total);

    return (
        <div className="flex flex-col sm:flex-row justify-between items-center mt-6 gap-4">
            <span className="text-sm text-gray-600">
                Showing {total === 0 ? 0 : `${start} to ${end}`} of {total} results
            </span>
            <div className="flex gap-2">
                <button
                    onClick={onPrev}
                    disabled={page <= 1}
                    className="px-4 py-2 border border-gray-200 rounded-md text-sm font-medium text-gray-600 hover:bg-gray-50 transition disabled:opacity-50"
                >
                    Previous
                </button>
                <button
                    onClick={onNext}
                    disabled={page >= totalPages}
                    className="px-4 py-2 border border-gray-200 rounded-md text-sm font-medium text-gray-600 hover:bg-gray-50 transition disabled:opacity-50"
                >
                    Next
                </button>
            </div>
        </div>
    );
};

export default PaginationSection;
