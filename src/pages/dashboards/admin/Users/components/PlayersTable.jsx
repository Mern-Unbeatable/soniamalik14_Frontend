import React from 'react';

const PlayersTable = ({ data, onSuspend }) => {
  return (
    <div className="overflow-x-auto rounded-lg border border-gray-100">
      <table className="w-full whitespace-nowrap">
        <thead className="bg-[#E7F1F1]">
          <tr>
            <th className="px-4 py-3 text-left text-base font-medium text-gray-700">Name</th>
            <th className="px-4 py-3 text-left text-base font-medium text-gray-700">Email</th>
            <th className="px-4 py-3 text-left text-base font-medium text-gray-700">Postcode</th>
            <th className="px-4 py-3 text-left text-base font-medium text-gray-700">
              Sports selected
            </th>
            <th className="px-4 py-3 text-left text-base font-medium text-gray-700">Joined</th>
            <th className="px-4 py-3 text-left text-base font-medium text-gray-700">Last login</th>
            <th className="px-4 py-3 text-left text-base font-medium text-gray-700">
              Events attended
            </th>
            <th className="px-4 py-3 text-left text-base font-medium text-gray-700">
              Register interest
            </th>
            <th className="px-4 py-3 text-left text-base font-medium text-gray-700">Status</th>
            <th className="px-4 py-3 text-left text-base font-medium text-gray-700">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 bg-white">
          {data.map((row) => (
            <tr key={row.id} className="hover:bg-gray-50">
              <td className="px-4 py-4 text-base text-gray-800">{row.name}</td>
              <td className="w-40 px-4 py-4 text-base break-all text-gray-600">{row.email}</td>
              <td className="px-4 py-4 text-base text-gray-600">{row.postcode}</td>
              <td className="px-4 py-4 text-base">
                <span className="rounded-full bg-[#e6f2f1] px-3 py-1 text-xs font-medium text-[#117b73]">
                  {row.sport}
                </span>
              </td>
              <td className="px-4 py-4 text-base text-gray-600">{row.joined}</td>
              <td className="px-4 py-4 text-base text-gray-600">{row.lastLogin}</td>
              <td className="px-4 py-4 text-base text-gray-600">{row.events}</td>
              <td className="px-4 py-4 text-base text-gray-600">{row.interest}</td>
              <td className="px-4 py-4 text-base text-gray-600">{row.status}</td>
              <td className="px-4 py-4 text-base">
                <button
                  onClick={() => onSuspend(row.id, row.status)}
                  className="rounded bg-[#E7F1F1] px-3 py-1.5 text-xs font-medium text-black transition hover:bg-gray-200"
                >
                  {String(row.status || '').toUpperCase() === 'SUSPENDED' ? 'Reinstate' : 'Suspend'}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PlayersTable;
