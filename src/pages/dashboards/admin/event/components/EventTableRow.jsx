import React from 'react';
import EventStatusBadge from './EventStatusBadge';
import EventEngagementMetrics from './EventEngagementMetrics';
import EventActionButtons from './EventActionButtons';

const EventTableRow = ({ row }) => {
    return (
        <tr className="hover:bg-gray-50/50 transition-colors">
            <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-base font-medium text-gray-800">{row.name}</div>
                <div className="text-sm text-gray-500 mt-1">{row.date}</div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
                {/* <div className="text-base text-gray-800">{row.provider}</div> */}
                {row.providerSub && <div className="text-base text-gray-500">{row.providerSub}</div>}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-base text-gray-600">
                {row.sport}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-base text-gray-600">
                {row.postcode}
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
                <EventStatusBadge status={row.status} />
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-base text-gray-500">
                <EventEngagementMetrics engagement={row.engagement} />
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-base">
                <EventActionButtons status={row.status} isFeatured={row.isFeatured} rowId={row.id} />
            </td>
        </tr>
    );
};

export default EventTableRow;
