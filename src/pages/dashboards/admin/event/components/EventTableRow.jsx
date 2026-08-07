import React from 'react';
import EventStatusBadge from './EventStatusBadge';
import EventEngagementMetrics from './EventEngagementMetrics';
import EventActionButtons from './EventActionButtons';

const cellBase = 'px-6 py-4 align-middle min-w-0 max-w-0';

const TruncateText = ({ text, className = '' }) => {
    const value = text == null || text === '' ? '—' : String(text);
    return (
        <span className={`block min-w-0 truncate ${className}`} title={value === '—' ? undefined : value}>
            {value}
        </span>
    );
};

const EventTableRow = ({ row }) => {
    const providerLine =
        row.providerSub || row.provider || '';

    return (
        <tr className="transition-colors hover:bg-gray-50/50">
            <td className={cellBase}>
                <TruncateText text={row.name} className="text-base font-medium text-gray-800" />
                <TruncateText text={row.date} className="mt-1 text-sm text-gray-500" />
            </td>
            <td className={cellBase}>
                <TruncateText text={providerLine} className="text-base text-gray-600" />
            </td>
            <td className={cellBase}>
                <TruncateText text={row.sport} className="text-base text-gray-600" />
            </td>
            <td className={cellBase}>
                <TruncateText text={row.postcode} className="text-base text-gray-600" />
            </td>
            <td className={`${cellBase} whitespace-nowrap`}>
                <EventStatusBadge status={row.status} />
            </td>
            <td className={`${cellBase} whitespace-nowrap text-base text-gray-500`}>
                <EventEngagementMetrics engagement={row.engagement} />
            </td>
            <td className="whitespace-nowrap px-6 py-4 align-middle text-base w-[120px] min-w-[120px] max-w-[120px]">
                <EventActionButtons status={row.status} isFeatured={row.isFeatured} rowId={row.id} />
            </td>
        </tr>
    );
};

export default EventTableRow;
