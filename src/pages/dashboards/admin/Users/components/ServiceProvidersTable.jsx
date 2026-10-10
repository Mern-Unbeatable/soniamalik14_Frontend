import React from 'react';
import InviteStatusBadge from './InviteStatusBadge';
import { getInviteStatus } from '../inviteStatus';

const ServiceProvidersTable = ({ data, activeSubTab, onSuspend, onResendInvite }) => {
    return (
        <div className="overflow-x-auto rounded-lg border border-gray-100">
            <table className="w-full whitespace-nowrap">
                <thead className="bg-[#f2f8f7]">
                    <tr>
                        <th className="px-4 py-3 text-left text-base font-medium text-gray-700">Provider Name</th>
                        <th className="px-4 py-3 text-left text-base font-medium text-gray-700">Email</th>
                        <th className="px-4 py-3 text-left text-base font-medium text-gray-700">Postcode</th>
                        <th className="px-4 py-3 text-left text-base font-medium text-gray-700">Sports selected</th>
                        <th className="px-4 py-3 text-left text-base font-medium text-gray-700">Joined</th>
                        <th className="px-4 py-3 text-left text-base font-medium text-gray-700">Last login</th>
                        <th className="px-4 py-3 text-left text-base font-medium text-gray-700">Phone Number</th>
                        <th className="px-4 py-3 text-left text-base font-medium text-gray-700">Organization Name</th>
                        <th className="px-4 py-3 text-left text-base font-medium text-gray-700">Status</th>
                        <th className="px-4 py-3 text-left text-base font-medium text-gray-700">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 bg-white">
                    {data.map((row) => (
                        <tr key={row.id} className="hover:bg-gray-50">
                            <td className="px-4 py-4 text-base text-gray-800">
                                <div>{row.providerName}</div>
                                <InviteStatusBadge row={row} />
                            </td>
                            <td className="px-4 py-4 text-base text-gray-600 break-all w-40">{row.email}</td>
                            <td className="px-4 py-4 text-base text-gray-600">{row.postcode}</td>
                            <td className="px-4 py-4 text-base">
                                <span className="bg-[#e6f2f1] text-[#117b73] px-3 py-1 rounded-full text-xs font-medium">{row.sport}</span>
                            </td>
                            <td className="px-4 py-4 text-base text-gray-600">
                                {getInviteStatus(row) === 'pending' ? `Invited ${row.invitedOn}` : row.joined}
                            </td>
                            <td className="px-4 py-4 text-base text-gray-600">{row.lastLogin}</td>
                            <td className="px-4 py-4 text-base text-gray-600">{row.phone}</td>
                            <td className="px-4 py-4 text-base text-gray-600">{row.organization}</td>
                            <td className="px-4 py-4 text-base text-gray-600">{row.status}</td>
                            <td className="px-4 py-4 text-base">
                                <div className="flex items-center gap-2">
                                    {getInviteStatus(row) === 'pending' && (
                                        <button
                                            onClick={() => onResendInvite?.(row)}
                                            className="bg-btn-primary text-white px-3 py-1.5 rounded text-xs font-medium hover:bg-teal-700 transition"
                                        >
                                            Resend invite
                                        </button>
                                    )}
                                    <button
                                        onClick={() => onSuspend(row.id, row.status)}
                                        className="bg-[#E7F1F1] text-black px-3 py-1.5 rounded text-xs font-medium hover:bg-gray-200 transition"
                                    >
                                        {String(row.status || '').toUpperCase() === 'SUSPENDED' ? 'Reinstate' : 'Suspend'}
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ServiceProvidersTable;
