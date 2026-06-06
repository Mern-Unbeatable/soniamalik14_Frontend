import React from 'react';

const DemandMissingSportsTable = ({ data }) => {
    return (
        <table className="w-full text-left border-collapse">
            <thead>
                <tr className="bg-[#E7F1F1] border-b border-gray-100">
                    <th className="px-6 py-4 text-base font-semibold text-gray-600 whitespace-nowrap">User ID</th>
                    <th className="px-6 py-4 text-base font-semibold text-gray-600 whitespace-nowrap">Requested Sport</th>
                    <th className="px-6 py-4 text-base font-semibold text-gray-600 whitespace-nowrap">Postcode / Radius</th>
                    <th className="px-6 py-4 text-base font-semibold text-gray-600 whitespace-nowrap">Date</th>
                    <th className="px-6 py-4 text-base font-semibold text-gray-600 whitespace-nowrap">Notes</th>
                </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 bg-white">
                {data.map(row => (
                    <tr key={row.id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="px-6 py-5 text-base text-gray-700">{row.userId}</td>
                        <td className="px-6 py-5 whitespace-nowrap">
                            <span className="px-3 py-1.5 text-xs font-medium text-[#0f766e] bg-[#e2f3f1] rounded-full">
                                {row.requestedSport}
                            </span>
                        </td>
                        <td className="px-6 py-5 whitespace-nowrap text-base text-gray-700">
                            <div>{row.postcode}</div>
                            <div className="mt-1 text-gray-500 text-xs font-medium tracking-wide">{row.radius}</div>
                        </td>
                        <td className="px-6 py-5 text-base text-gray-700">{row.date}</td>
                        <td className="px-6 py-5 text-base text-gray-600">{row.notes}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
};

export default DemandMissingSportsTable;
