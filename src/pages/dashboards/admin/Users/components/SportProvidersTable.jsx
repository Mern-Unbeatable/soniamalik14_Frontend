import React from 'react';
import InviteStatusBadge from './InviteStatusBadge';
import { getInviteStatus } from '../inviteStatus';

const SportProvidersTable = ({ data, activeSubTab, onSuspend, onResendInvite }) => {
    return (
        <div className="overflow-x-auto rounded-lg border border-gray-100">
            <table className="w-full whitespace-nowrap">
                <thead className="bg-[#f2f8f7]">
                    <tr>
                        <th className="px-4 py-3 text-left text-base font-medium text-gray-700">Business name</th>
                        <th className="px-4 py-3 text-left text-base font-medium text-gray-700">Contact name</th>
                        <th className="px-4 py-3 text-left text-base font-medium text-gray-700">Email</th>
                        <th className="px-4 py-3 text-left text-base font-medium text-gray-700">Postcode</th>
                        <th className="px-4 py-3 text-left text-base font-medium text-gray-700">Sport</th>
                        <th className="px-4 py-3 text-left text-base font-medium text-gray-700">Joined</th>
                        <th className="px-4 py-3 text-left text-base font-medium text-gray-700">Listings count</th>
                        <th className="px-4 py-3 text-left text-base font-medium text-gray-700">Events count</th>
                        <th className="px-4 py-3 text-left text-base font-medium text-gray-700">Interest received</th>
                        <th className="px-4 py-3 text-left text-base font-medium text-gray-700 w-24">External link clicks received</th>
                        <th className="px-4 py-3 text-left text-base font-medium text-gray-700">Average response time</th>
                        <th className="px-4 py-3 text-left text-base font-medium text-gray-700">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 bg-white">
                    {data.map((row) => (
                        <tr key={row.id} className="hover:bg-gray-50">
                            <td className="px-4 py-4 text-base text-gray-800 break-words w-32">
                                <div>{row.businessName}</div>
                                <InviteStatusBadge row={row} />
                            </td>
                            <td className="px-4 py-4 text-base text-gray-600">{row.contactName}</td>
                            <td className="px-4 py-4 text-base text-gray-600 break-all w-32">{row.email}</td>
                            <td className="px-4 py-4 text-base text-gray-600">{row.postcode}</td>
                            <td className="px-4 py-4 text-base">
                                <span className="bg-[#e6f2f1] text-[#117b73] px-3 py-1 rounded-full text-xs font-medium">{row.sport}</span>
                            </td>
                            <td className="px-4 py-4 text-base text-gray-600">
                                {getInviteStatus(row) === 'pending' ? `Invited ${row.invitedOn}` : row.joined}
                            </td>
                            <td className="px-4 py-4 text-base text-gray-600 text-center">{row.listingsCount}</td>
                            <td className="px-4 py-4 text-base text-gray-600 text-center">{row.eventsCount}</td>
                            <td className="px-4 py-4 text-base text-gray-600 text-center">{row.interestReceived}</td>
                            <td className="px-4 py-4 text-base text-gray-600 text-center">{row.externalLinkClicks}</td>
                            <td className="px-4 py-4 text-base text-gray-600">{row.avgResponseTime}</td>
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

export default SportProvidersTable;
