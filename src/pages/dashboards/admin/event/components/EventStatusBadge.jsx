import React from 'react';

const EventStatusBadge = ({ status }) => {
    switch (status) {
        case 'Featured':
            return <span className="px-3 py-1 text-sm font-medium text-[#F97316] bg-[#FFF1E6] rounded-full">Featured</span>;
        case 'Pending':
            return <span className="px-3 py-1 text-sm font-medium  text-[#F59E0B] bg-[#FFF3DF] rounded-full">Pending</span>;
        case 'Live':
            return <span className="px-3 py-1 text-sm font-medium text-[#0F766E] bg-[#E7F1F1] rounded-full">Live</span>;
        case 'Banned':
            return <span className="px-3 py-1 text-sm font-medium text-[#DC2626] bg-[#FEE2E2] rounded-full">Banned</span>;
        case 'Past':
            return <span className="px-3 py-1 text-sm font-medium text-gray-600 bg-gray-100 rounded-full">Past</span>;
        default:
            return null;
    }
};

export default EventStatusBadge;
