import React from 'react';

const FilterSection = ({
    fromDate,
    setFromDate,
    toDate,
    setToDate,
    sportsCategories = [],
    selectedSport,
    setSelectedSport,
    selectedStatus,
    setSelectedStatus
}) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="relative">
                <input
                    type="date"
                    placeholder="From date"
                    value={fromDate || ''}
                    onChange={(e) => setFromDate(e.target.value)}
                    className="w-full pl-3 pr-10 py-2 border border-gray-200 rounded-md text-base focus:outline-none focus:ring-1 focus:ring-[#117b73]"
                />
            </div>
            <div className="relative">
                <input
                    type="date"
                    placeholder="To date"
                    value={toDate || ''}
                    onChange={(e) => setToDate(e.target.value)}
                    className="w-full pl-3 pr-10 py-2 border  border-gray-200 rounded-md text-base focus:outline-none focus:ring-1 focus:ring-[#117b73]"
                />
            </div>
            <div className="relative">
                <select
                    value={selectedSport}
                    onChange={(e) => setSelectedSport(e.target.value)}
                    className="w-full pl-3 pr-10 py-2 border border-gray-200 rounded-md text-base appearance-none focus:outline-none focus:ring-1 focus:ring-[#117b73] text-[#373737] cursor-pointer"
                >
                    <option value="All Sports">Select Sport</option>
                    {sportsCategories && sportsCategories.map((sport) => {
                        const name = typeof sport === 'object' ? sport.name : sport;
                        return (
                            <option key={sport?.id || name} value={name}>
                                {name}
                            </option>
                        );
                    })}
                </select>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="absolute right-3 top-2.5 w-4 h-4 text-[#373737] pointer-events-none">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                </svg>
            </div>
            <div className="relative">
                <select
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    className="w-full pl-3 pr-10 py-2 border border-gray-200 rounded-md text-base appearance-none focus:outline-none focus:ring-1 focus:ring-[#117b73] text-[#373737] cursor-pointer"
                >
                    <option value="All Status">Status</option>
                    <option value="Live">Live</option>
                    <option value="Pending">Pending</option>
                    <option value="Banned">Banned</option>
                </select>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="absolute right-3 top-2.5 w-4 h-4 text-[#373737] pointer-events-none">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                </svg>
            </div>
        </div>
    );
};

export default FilterSection;
