import React from 'react';

const StatsCard = ({ icon, label, value, change, positive }) => {
    return (
        <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="mb-3">
                <h3 className="text-base font-medium text-gray-600">{label}</h3>
            </div>

            <div className="flex items-center justify-between mb-1">
                <p className="text-2xl font-semibold text-gray-900">{value}</p>
                <div className="flex p-4 items-center justify-center rounded-lg bg-[#E7F1F1] shrink-0 text-[#0F766E]">
                    {icon}
                </div>
            </div>

            <p className={`text-sm font-medium ${positive ? 'text-btn-primary' : 'text-red-500'}`}>
                {change}
            </p>
        </div>
    );
};

export default StatsCard;


