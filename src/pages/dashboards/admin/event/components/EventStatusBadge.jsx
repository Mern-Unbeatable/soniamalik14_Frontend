import React from 'react';

const EventStatusBadge = ({ status }) => {
    const normalized = String(status || '').trim().toLowerCase();

    switch (normalized) {
        case 'featured':
            return <span className="px-3 py-1 text-sm font-medium text-[#F97316] bg-[#FFF1E6] rounded-full">Featured</span>;
        case 'pending':
            return <span className="px-3 py-1 text-sm font-medium text-[#F59E0B] bg-[#FFF3DF] rounded-full">Pending</span>;
        case 'live':
        case 'ongoing':
            return <span className="px-3 py-1 text-sm font-medium text-[#0F766E] bg-[#E7F1F1] rounded-full">{status}</span>;
        case 'banned':
            return <span className="px-3 py-1 text-sm font-medium text-[#DC2626] bg-[#FEE2E2] rounded-full">Banned</span>;
        case 'past':
            return <span className="px-3 py-1 text-sm font-medium text-gray-600 bg-gray-100 rounded-full">Past</span>;
        default:
            return status ? (
                <span className="px-3 py-1 text-sm font-medium text-gray-600 bg-gray-100 rounded-full">
                    {status}
                </span>
            ) : null;
    }
};

export default EventStatusBadge;
