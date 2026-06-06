import React from 'react';

const TableHeader = () => {
    const headers = ['Listing', 'Provider', 'Category', 'Postcode', 'Status', 'Engagement', 'Actions'];

    return (
        <thead>
            <tr className="bg-[#E7F1F1] border-y border-gray-100 rounded-t-xl">
                {headers.map((header) => (
                    <th
                        key={header}
                        className="px-6 py-3 text-base font-medium text-gray-700 tracking-wider"
                    >
                        {header}
                    </th>
                ))}
            </tr>
        </thead>
    );
};

export default TableHeader;
