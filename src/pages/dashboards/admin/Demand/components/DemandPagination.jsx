import React from 'react';

const DemandPagination = () => {
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
};

export default DemandPagination;
