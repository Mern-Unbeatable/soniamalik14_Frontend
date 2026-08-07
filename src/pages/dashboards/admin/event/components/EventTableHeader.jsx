import React from 'react';

const EventTableHeader = () => {
    const headers = [
        { label: 'Event Name', className: 'w-[26%] min-w-[8rem]' },
        { label: 'Provider', className: 'w-[18%] min-w-[6rem]' },
        { label: 'Sport', className: 'w-[14%] min-w-[5rem]' },
        { label: 'Postcode', className: 'w-[10%] min-w-[4.5rem]' },
        { label: 'Status', className: 'w-[10%] min-w-[5rem]' },
        { label: 'Engagement', className: 'w-[10%] min-w-[5.5rem]' },
        { label: 'Actions', className: 'w-[120px] min-w-[120px]' },
    ];

    return (
        <thead>
            <tr className="bg-[#E7F1F1] border-y border-gray-100">
                {headers.map(({ label, className }) => (
                    <th
                        key={label}
                        scope="col"
                        className={`px-6 py-3 text-left text-base font-medium tracking-wider text-black ${className}`}
                    >
                        {label}
                    </th>
                ))}
            </tr>
        </thead>
    );
};

export default EventTableHeader;
