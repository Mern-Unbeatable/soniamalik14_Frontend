import React from 'react';
import { getInviteStatus } from '../inviteStatus';

const InviteStatusBadge = ({ row }) => {
    const status = getInviteStatus(row);
    if (!status) return null;

    if (status === 'pending') {
        return (
            <span className="mt-1 inline-block rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-medium text-amber-700">
                Invite pending
            </span>
        );
    }

    return (
        <span className="mt-1 inline-block rounded-full bg-[#e6f2f1] px-2.5 py-0.5 text-xs font-medium text-[#117b73]">
            Joined via invite
        </span>
    );
};

export default InviteStatusBadge;
