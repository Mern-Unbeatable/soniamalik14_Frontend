import React from 'react';
import { Eye, TrendingUp, MessageSquare, ExternalLink } from 'lucide-react';

const EngagementMetrics = ({ engagement }) => {
    if (!engagement) {
        return <span className="text-gray-400">N/A</span>;
    }

    return (
        <div className="flex items-center gap-3">
            <span className="flex items-center gap-1" title="Views">
                <Eye className="w-3.5 h-3.5" /> {engagement.views}
            </span>
            <span className="flex items-center gap-1" title="Trend">
                <TrendingUp className="w-3.5 h-3.5" /> {engagement.trend}
            </span>
            <span className="flex items-center gap-1" title="Messages">
                <MessageSquare className="w-3.5 h-3.5" /> {engagement.messages}
            </span>
            <span className="flex items-center gap-1" title="Shares">
                <ExternalLink className="w-3.5 h-3.5" /> {engagement.shares}
            </span>
        </div>
    );
};

export default EngagementMetrics;
