import React from 'react';

const AnalyticsTopSports = () => {
    const sports = [
        { name: 'Football', count: '4500', color: 'bg-[#2dd4bf]' },
        { name: 'Tennis', count: '3800', color: 'bg-[#3b82f6]' },
        { name: 'Padel', count: '3200', color: 'bg-[#f59e0b]' },
        { name: 'Cricket', count: '2800', color: 'bg-[#a855f7]' },
        { name: 'Squash', count: '2400', color: 'bg-[#f472b6]' },
    ];

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8 flex flex-col">
            <h2 className="text-xl md:text-2xl font-semibold text-gray-900 mb-8">Top Sports by Interest</h2>

            {/* Custom SVG Donut Chart */}
            <div className="relative w-40 h-40 mx-auto mb-10">
                <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
                    {/* Teal (Football) - approx 25% */}
                    <circle cx="50" cy="50" r="40" fill="transparent" stroke="#2dd4bf" strokeWidth="12" strokeDasharray="50 200" strokeDashoffset="0" />

                    {/* Blue (Tennis) - approx 20% */}
                    <circle cx="50" cy="50" r="40" fill="transparent" stroke="#3b82f6" strokeWidth="12" strokeDasharray="40 211" strokeDashoffset="-55" />

                    {/* Purple (Cricket) - approx 20% */}
                    <circle cx="50" cy="50" r="40" fill="transparent" stroke="#a855f7" strokeWidth="12" strokeDasharray="40 211" strokeDashoffset="-100" />

                    {/* Pink (Squash) - approx 15% */}
                    <circle cx="50" cy="50" r="40" fill="transparent" stroke="#f472b6" strokeWidth="12" strokeDasharray="30 221" strokeDashoffset="-145" />

                    {/* Orange (Padel) - approx 20% */}
                    <circle cx="50" cy="50" r="40" fill="transparent" stroke="#f59e0b" strokeWidth="12" strokeDasharray="45 206" strokeDashoffset="-180" />
                </svg>
            </div>

            {/* Sport List */}
            <div className="space-y-4 mt-auto">
                {sports.map((sport) => (
                    <div key={sport.name} className="flex justify-between items-center text-sm md:text-base font-semibold text-gray-800">
                        <div className="flex items-center gap-3">
                            <span className={`w-2.5 h-2.5 rounded-full ${sport.color}`}></span>
                            {sport.name}
                        </div>
                        <span className="text-gray-600 font-medium">{sport.count}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AnalyticsTopSports;
