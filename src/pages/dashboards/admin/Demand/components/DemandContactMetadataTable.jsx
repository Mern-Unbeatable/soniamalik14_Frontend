import React from 'react';

const DemandContactMetadataTable = ({ data }) => {
    return (
        <table className="w-full text-left border-collapse">
            <thead>
                <tr className="bg-[#E7F1F1] border-b border-gray-100">
                    <th className="px-6 py-4 text-base font-semibold text-gray-600 whitespace-nowrap">LISTING / PROVIDER</th>
                    <th className="px-6 py-4 text-base font-semibold text-gray-600 whitespace-nowrap">RECEIVED</th>
                    <th className="px-6 py-4 text-base font-semibold text-gray-600 whitespace-nowrap">REPLIES</th>
                    <th className="px-6 py-4 text-base font-semibold text-gray-600 whitespace-nowrap">AVG RESPONSE</th>
                    <th className="px-6 py-4 text-base font-semibold text-gray-600 whitespace-nowrap">UNANSWERED</th>
                    <th className="px-6 py-4 text-base font-semibold text-gray-600 whitespace-nowrap">Flagged</th>
                </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 bg-white">
                {data.map(row => (
                    <tr key={row.id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="px-6 py-5 whitespace-nowrap">
                            <div className="text-base text-gray-700">{row.listing}</div>
                            <div className="text-base text-gray-700 mt-1">{row.provider}</div>
                        </td>
                        <td className="px-6 py-5 text-base text-gray-700">{row.received}</td>
                        <td className="px-6 py-5 text-base text-gray-700">{row.replies}</td>
                        <td className="px-6 py-5 text-base text-gray-700">{row.avgResponse}</td>
                        <td className="px-6 py-5 text-base text-gray-700">{row.unanswered}</td>
                        <td className="px-6 py-5 whitespace-nowrap">
                            <span className="px-3 py-1.5 text-xs font-medium text-red-600 bg-red-50 border border-red-100 rounded-full">
                                {row.flagged} Flagged
                            </span>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
};

export default DemandContactMetadataTable;
