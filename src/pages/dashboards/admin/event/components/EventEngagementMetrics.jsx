import React from 'react';
import { Users } from 'lucide-react';

const EventEngagementMetrics = ({ engagement }) => {
    if (!engagement) {
        return <span className="text-gray-900 font-medium text-sm">N/A</span>;
    }

    const current = engagement.currentParticipants ?? 0;

    return (
        <div className="flex items-center gap-1.5 text-gray-800 font-medium">
            <Users className="w-4 h-4 text-gray-400" />
            <span>{current}</span>
        </div>
    );
};

export default EventEngagementMetrics;
