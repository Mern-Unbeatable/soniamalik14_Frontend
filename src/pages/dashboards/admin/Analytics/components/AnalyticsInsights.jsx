import React from 'react';
import { Zap } from 'lucide-react';

const AnalyticsInsights = () => {
    const insights = [
        {
            label: 'Highest Interest / Lowest Supply',
            value: null
        },
        {
            label: 'Fastest Growing Sport',
            value: 'Padel (+45% MoM)',
            valueColor: 'text-blue-400'
        },
        {
            label: 'Top Converting Listing',
            value: "Sarah's Tennis Academy",
            valueColor: 'text-amber-500'
        },
        {
            label: 'Unresponsive Providers',
            value: '12 accounts flagged',
            valueColor: 'text-red-400'
        }
    ];

    return (
        <div className="bg-white rounded-2xl shadow-sm p-6 md:p-8 text-white flex flex-col">
            <div className="flex items-center gap-3 mb-8">
                <div className="w-8 h-8 rounded-md bg-[#0f766e]/20 flex items-center justify-center border border-[#0f766e]/30">
                    <Zap className="w-4 h-4 text-[#2dd4bf]" fill="currentColor" />
                </div>
                <h2 className="text-xl md:text-2xl font-semibold text-black">Strategic Insights</h2>
            </div>

            <div className="space-y-6">
                {insights.map((insight, index) => (
                    <div key={index} className="border-b border-gray-800 pb-5 last:border-b-0">
                        <p className="text-sm font-semibold text-black/60 uppercase tracking-wider mb-1">
                            {insight.label}
                        </p>
                        {insight.value && (
                            <p className={`text-base font-medium ${insight.valueColor}`}>
                                {insight.value}
                            </p>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AnalyticsInsights;
