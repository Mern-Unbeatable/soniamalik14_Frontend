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
                {row.hasPendingChanges ? (
                    <span className="mt-2 block w-fit rounded-full bg-amber-100 px-3 py-1 text-xs font-medium text-amber-800">
                        Changes awaiting approval
                    </span>
                ) : null}
                {row.isExample ? (
                    <span className="mt-2 block w-fit rounded-full bg-[#E7F1F1] px-3 py-1 text-xs font-medium text-[#0F766E]">
                        Example listing
                    </span>
                ) : null}
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
