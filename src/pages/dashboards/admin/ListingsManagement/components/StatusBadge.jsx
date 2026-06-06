import React from 'react';

const StatusBadge = ({ status }) => {
    const badgeStyles = {
        'Featured': 'px-3 py-1 text-sm  text-[#F59E0B] bg-[#FFF3DF] rounded-full',
        'Pending': 'px-3 py-1 text-sm  text-[#F97316] bg-[#FFF1E6] rounded-full',
        'Live': 'px-3 py-1 text-sm  text-[#0F766E] bg-[#E7F1F1] rounded-full',
        'Banned': 'px-3 py-1 text-sm  text-[#DC2626] bg-[#FEE2E2] rounded-full'
    };

    return (
        <span className={badgeStyles[status] || ''}>
            {status}
        </span>
    );
};

export default StatusBadge;
