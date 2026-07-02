import React from 'react';
import StatusBadge from './StatusBadge';
import EngagementMetrics from './EngagementMetrics';
import ActionButtons from './ActionButtons';

const TableRow = ({ row, onActionDone }) => {
    return (
        <tr className="hover:bg-gray-50/50 transition-colors">
            <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-base font-medium text-gray-800">{row.listing}</div>
                <div className="text-sm text-gray-500 mt-1">{row.date}</div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-base text-gray-600">
                {row.provider}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-base text-gray-600">
                {row.category}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-base text-gray-600">
                {row.postcode}
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
                <StatusBadge status={row.status} />
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                <EngagementMetrics engagement={row.engagement} />
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-base">
                <ActionButtons status={row.status} isFeatured={row.isFeatured} rowId={row.id} providerType={row.providerType} onActionDone={onActionDone} />
            </td>
        </tr>
    );
};

export default TableRow;
