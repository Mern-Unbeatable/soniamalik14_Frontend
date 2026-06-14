import React from 'react';
import LoadingSpinner from '../../../../../components/ui/LoadingSpinner';

const DemandContactMetadataTable = ({ data = [], loading, error }) => {
    if (loading) {
        return (
            <div className="flex justify-center items-center py-12">
                <LoadingSpinner label="Loading contact metadata..." />
            </div>
        );
    }

    if (error) {
        return (
            <div className="px-6 py-12 text-center text-red-600">
                <p className="font-medium">{error}</p>
            </div>
        );
    }

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
                {data.length > 0 ? (
                    data.map(row => (
                        <tr key={row.id || row._id || Math.random().toString()} className="hover:bg-gray-50/50 transition-colors">
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
                    ))
                ) : (
                    <tr>
                        <td colSpan="6" className="px-6 py-12 text-center text-base text-gray-500">No contact metadata found.</td>
                    </tr>
                )}
            </tbody>
        </table>
    );
};

export default DemandContactMetadataTable;
