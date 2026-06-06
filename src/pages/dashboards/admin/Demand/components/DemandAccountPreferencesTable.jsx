import React from 'react';

const DemandAccountPreferencesTable = ({ data }) => {
    return (
        <table className="w-full text-left border-collapse">
            <thead>
                <tr className="bg-[#E7F1F1] border-b border-gray-100">
                    <th className="px-6 py-4 text-base font-semibold text-gray-600 whitespace-nowrap">User ID</th>
                    <th className="px-6 py-4 text-base font-semibold text-gray-600 whitespace-nowrap">Sport</th>
                    <th className="px-6 py-4 text-base font-semibold text-gray-600 whitespace-nowrap">Postcode</th>
                    <th className="px-6 py-4 text-base font-semibold text-gray-600 whitespace-nowrap">Date Joined</th>
                </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 bg-white">
                {data.map(row => (
                    <tr key={row.id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="px-6 py-5 text-base text-gray-700">{row.userId}</td>
                        <td className="px-6 py-5 text-base text-gray-700">{row.sport}</td>
                        <td className="px-6 py-5 text-base text-gray-700">{row.postcode}</td>
                        <td className="px-6 py-5 text-base text-gray-700">{row.dateJoined}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
};

export default DemandAccountPreferencesTable;
