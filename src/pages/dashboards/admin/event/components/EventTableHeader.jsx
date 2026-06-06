import React from 'react';

const EventTableHeader = () => {
    const headers = [
        'Event Name',
        'Provider',
        'Sport',
        'Postcode',
        'Status',
        'Engagement',
        'Actions'
    ];

    return (
        <thead>
            <tr className="bg-[#E7F1F1] border-y border-gray-100">
                {headers.map((header) => (
                    <th key={header} className="px-6 py-3 text-base font-medium text-black  tracking-wider">
                        {header}
                    </th>
                ))}
            </tr>
        </thead>
    );
};

export default EventTableHeader;
