import React from 'react';
import { Download } from 'lucide-react';

const EventHeaderSection = ({ onExport }) => {
    return (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Events</h1>
                <p className="text-base text-gray-600 mt-1 sm:mt-2">Events are time-based listings (may be created by providers / ESSA).</p>
            </div>
            <button onClick={onExport} className="flex items-center justify-center gap-2 px-4 sm:px-6 py-2 sm:py-3 bg-btn-primary text-white text-sm sm:text-base font-medium rounded-lg hover:bg-teal-700 transition-colors whitespace-nowrap">
                <Download className="w-5 h-5 sm:w-6 sm:h-6" />
                <span className="hidden sm:inline">Export CSV</span>
                <span className="sm:hidden">Export</span>
            </button>
        </div>
    );
};

export default EventHeaderSection;
