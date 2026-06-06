import React from 'react';
import { ChevronDown } from 'lucide-react';

const AnalyticsHeader = ({ dateRange, onDateRangeChange }) => {
    return (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Growth Intelligence</h1>
                <p className="text-sm md:text-base text-gray-600 mt-2">Deep dive into platform performance and demand trends.</p>
            </div>
            <button
                onClick={onDateRangeChange}
                className="flex items-center justify-between gap-2 px-4 py-2.5 bg-white border border-gray-200 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors shadow-sm min-w-[140px]"
            >
                {dateRange}
                <ChevronDown className="w-4 h-4 text-gray-400" />
            </button>
        </div>
    );
};

export default AnalyticsHeader;
