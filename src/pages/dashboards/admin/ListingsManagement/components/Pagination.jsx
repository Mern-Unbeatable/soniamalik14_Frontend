import React from 'react';

const Pagination = ({ filteredDataLength }) => {
    return (
        <div className="px-6 py-4 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4">
            <span className="text-sm text-[#0f766e]">
                Showing {filteredDataLength > 0 ? 1 : 0} to {filteredDataLength} of {filteredDataLength} results
            </span>
            <div className="flex gap-2">
                <button className="px-4 py-2 text-sm font-medium text-[#0f766e] bg-white border border-[#0f766e] rounded-lg hover:bg-teal-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                    Previous
                </button>
                <button className="px-4 py-2 text-sm font-medium text-[#0f766e] bg-white border border-[#0f766e] rounded-lg hover:bg-teal-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                    Next
                </button>
            </div>
        </div>
    );
};

export default Pagination;
