import React from 'react';
import { ChevronDown } from 'lucide-react';
import LoadingSpinner from '../../../../../components/ui/LoadingSpinner';

const DemandRegisterInterestTable = ({ data = [], loading, error }) => {
    if (loading) {
        return (
            <div className="flex justify-center items-center py-12">
                <LoadingSpinner label="Loading register interests..." />
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
                    <th className="px-6 py-4 text-base font-semibold text-gray-600 whitespace-nowrap">User / Listing</th>
                    <th className="px-6 py-4 text-base font-semibold text-gray-600 whitespace-nowrap">Sport / Location</th>
                    <th className="px-6 py-4 text-base font-semibold text-gray-600 whitespace-nowrap">Date</th>
                    <th className="px-6 py-4 text-base font-semibold text-gray-600 whitespace-nowrap">Response Time</th>
                    <th className="px-6 py-4 text-base font-semibold text-gray-600 whitespace-nowrap">Status</th>
                </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 bg-white">
                {data.length > 0 ? (
                    data.map(row => (
                        <tr key={row.id} className="hover:bg-gray-50/50 transition-colors">
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-base font-medium text-gray-800">{row.user}</div>
                                <div className="text-base text-[#0f766e] mt-1 hover:underline cursor-pointer">{row.listing}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-base text-gray-700">{row.sport}</div>
                                <div className="text-base text-gray-700 mt-1">{row.location}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-base text-gray-700">
                                {row.date}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-base text-gray-700">{row.responseTime}</div>
                                <div className="text-base text-[#0f766e] mt-1">{row.provider}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <span className={`inline-flex items-center justify-between gap-2 px-3 py-1.5 text-xs font-medium rounded-md cursor-pointer w-28 ${row.status === 'Contacted' ? 'bg-[#e2f3f1] text-[#0f766e]' : 'bg-orange-50 text-orange-600'
                                    }`}>
                                    {row.status} <ChevronDown className="w-3 h-3" />
                                </span>
                            </td>
                        </tr>
                    ))
                ) : (
                    <tr>
                        <td colSpan="5" className="px-6 py-12 text-center text-base text-gray-500">No signals found matching your filters.</td>
                    </tr>
                )}
            </tbody>
        </table>
    );
};

export default DemandRegisterInterestTable;
