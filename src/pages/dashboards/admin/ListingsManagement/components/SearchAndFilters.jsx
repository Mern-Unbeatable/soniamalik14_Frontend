import React from 'react';
import { Search, ChevronDown, Calendar } from 'lucide-react';

const SearchAndFilters = ({
    activeTab,
    setActiveTab,
    searchQuery,
    setSearchQuery,
    selectedSport,
    setSelectedSport,
    selectedStatus,
    setSelectedStatus,
    uniqueSports,
    uniqueStatuses
}) => {
    return (
        <div className="p-6">
            {/* Search and Top Toggles */}
            <div className="flex flex-col lg:flex-row gap-4 justify-between items-start lg:items-center mb-6">

                {/* Search Bar */}
                <div className="flex items-center flex-1 w-full max-w-xl bg-gray-50 border border-gray-100 rounded-lg px-4 py-2.5 focus-within:ring-2 focus-within:ring-[#0f766e]/20 transition-all">
                    <Search className="w-5 h-5 text-gray-400 mr-3" />
                    <input
                        type="text"
                        placeholder="Search listings, providers or categories"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="bg-transparent border-none outline-none w-full text-base text-gray-700 placeholder-gray-400"
                    />
                </div>

                {/* Toggles */}
                <div className="flex bg-gray-50 p-1 rounded-lg border border-gray-100">
                    {['All', 'Sport Providers', 'Service Provider'].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-4 py-1.5 text-base font-medium rounded-md transition-colors ${activeTab === tab
                                ? 'bg-[#0f766e] text-white shadow-sm'
                                : 'text-gray-600 hover:bg-gray-100'
                                }`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>
            </div>

            {/* Dropdown Filters */}
            <div className="flex flex-wrap gap-4 mb-6">

                {/* Sport Filter Dropdown */}
                <div className="relative">
                    <select
                        value={selectedSport}
                        onChange={(e) => setSelectedSport(e.target.value)}
                        className="appearance-none flex items-center justify-between w-40 px-4 py-2 pr-10 text-base text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 focus:outline-none focus:border-[#0f766e] cursor-pointer"
                    >
                        {uniqueSports.map(sport => (
                            <option key={sport} value={sport}>{sport === 'All Sports' ? 'Select sports' : sport}</option>
                        ))}
                    </select>
                    <ChevronDown className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>

                {/* Status Filter Dropdown */}
                <div className="relative">
                    <select
                        value={selectedStatus}
                        onChange={(e) => setSelectedStatus(e.target.value)}
                        className="appearance-none flex items-center justify-between w-36 px-4 py-2 pr-10 text-base text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 focus:outline-none focus:border-[#0f766e] cursor-pointer"
                    >
                        {uniqueStatuses.map(status => (
                            <option key={status} value={status}>{status === 'All Status' ? 'Status' : status}</option>
                        ))}
                    </select>
                    <ChevronDown className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>

                {/* Dummy Date Buttons (Non-functional for now to keep design) */}
                <button className="flex items-center justify-between w-40 px-4 py-2 text-base text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50">
                    Form date
                    <Calendar className="w-4 h-4 ml-2 text-gray-400" />
                </button>

                <button className="flex items-center justify-between w-40 px-4 py-2 text-base text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50">
                    To date
                    <Calendar className="w-4 h-4 ml-2 text-gray-400" />
                </button>
            </div>
        </div>
    );
};

export default SearchAndFilters;
