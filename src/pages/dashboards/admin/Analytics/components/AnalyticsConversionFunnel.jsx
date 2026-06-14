import React, { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { GET } from '../../../../../services/httpMethods';

const AnalyticsConversionFunnel = () => {
    const [funnelSteps, setFunnelSteps] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(function initConversionFunnel() {
        const fetchFunnelData = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await GET('/api/admin/dashboard/conversion-funnel');
                const payload = response?.data || response;
                if (payload?.success && Array.isArray(payload?.data)) {
                    setFunnelSteps(payload.data);
                } else if (Array.isArray(payload)) {
                    setFunnelSteps(payload);
                } else {
                    setFunnelSteps([]);
                }
            } catch (err) {
                console.error('Error fetching conversion funnel:', err);
                setError('Failed to load funnel data');
            } finally {
                setLoading(false);
            }
        };
        fetchFunnelData();
    }, []);

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8 min-h-[350px] flex flex-col">
            <h2 className="text-xl md:text-2xl font-semibold text-black mb-8">Conversion Funnel</h2>

            {loading ? (
                <div className="flex-1 flex items-center justify-center">
                    <Loader2 className="w-8 h-8 text-[#0f766e] animate-spin" />
                </div>
            ) : error ? (
                <div className="flex-1 flex items-center justify-center text-red-500 font-medium text-sm">
                    {error}
                </div>
            ) : (
                <div className="space-y-7 flex-1">
                    {funnelSteps.map((step, index) => (
                        <div key={index}>
                            <div className="flex justify-between items-center mb-2">
                                <p className="text-base font-medium text-gray-700">{step.label}</p>
                                <p className="text-sm font-semibold text-[#0f766e]">{step.percentage}%</p>
                            </div>
                            <div className="w-full bg-gray-100 rounded-full h-3.5">
                                <div
                                    className="bg-[#0f766e] h-3.5 rounded-full transition-all duration-500 ease-out"
                                    style={{ width: `${step.percentage}%` }}
                                ></div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default AnalyticsConversionFunnel;
