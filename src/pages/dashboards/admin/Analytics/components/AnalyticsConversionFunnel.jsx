import React from 'react';

const AnalyticsConversionFunnel = () => {
    const funnelSteps = [
        { label: 'Visits to Search', percentage: 45 },
        { label: 'Search to Listing View', percentage: 45 },
        { label: 'View to Register Interest', percentage: 45 },
        { label: 'Interest to Contact', percentage: 35 }
    ];

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
            <h2 className="text-xl md:text-2xl font-semibold text-black mb-8">Conversion Funnel</h2>

            <div className="space-y-7">
                {funnelSteps.map((step, index) => (
                    <div key={index}>
                        <p className="text-base font-medium text-gray-700 mb-2">{step.label}</p>
                        <div className="w-full bg-gray-100 rounded-full h-3.5">
                            <div
                                className="bg-[#0f766e] h-3.5 rounded-full transition-all duration-300"
                                style={{ width: `${step.percentage}%` }}
                            ></div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AnalyticsConversionFunnel;
