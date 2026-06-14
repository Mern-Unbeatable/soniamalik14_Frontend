import React, { useState, useEffect } from 'react';
import { Zap, Loader2, AlertCircle } from 'lucide-react';
import { GET } from '../../../../../services/httpMethods';

const AnalyticsInsights = () => {
    const [alerts, setAlerts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(function initHighDemandAlerts() {
        const fetchAlerts = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await GET('/api/admin/dashboard/high-demand-alerts');
                const payload = response?.data || response;
                const rawData = payload?.success && Array.isArray(payload?.data) ? payload.data : (Array.isArray(payload) ? payload : []);
                
                const mappedAlerts = rawData.map((item) => ({
                    sport: item?.sport || item?.name || 'Unknown Sport',
                    location: item?.location || item?.postcode || 'Unknown Location',
                    demand: item?.demand || 0,
                    supply: item?.supply || 0,
                }));
                
                setAlerts(mappedAlerts);
            } catch (err) {
                console.error('Error fetching high demand alerts:', err);
                setError('Failed to load strategic insights');
            } finally {
                setLoading(false);
            }
        };
        fetchAlerts();
    }, []);

    return (
        <div className="bg-white rounded-2xl shadow-sm p-6 md:p-8 flex flex-col min-h-[350px]">
            <div className="flex items-center gap-3 mb-8">
                <div className="w-8 h-8 rounded-md bg-[#0f766e]/20 flex items-center justify-center border border-[#0f766e]/30">
                    <Zap className="w-4 h-4 text-[#2dd4bf]" fill="currentColor" />
                </div>
                <h2 className="text-xl md:text-2xl font-semibold text-black">Strategic Insights</h2>
            </div>

            {loading ? (
                <div className="flex-1 flex items-center justify-center">
                    <Loader2 className="w-8 h-8 text-[#0f766e] animate-spin" />
                </div>
            ) : error ? (
                <div className="flex-1 flex items-center justify-center text-red-500 font-medium text-sm">
                    {error}
                </div>
            ) : (
                <div className="space-y-6 flex-1">
                    {alerts.length === 0 ? (
                        <div className="flex-1 flex flex-col items-center justify-center py-12 text-center text-gray-500 gap-2">
                            <AlertCircle className="w-8 h-8 text-gray-400" />
                            <p className="text-base font-semibold text-gray-800">All supply is matching demand</p>
                            <p className="text-sm text-gray-500">No high-demand location gaps have been flagged at the moment.</p>
                        </div>
                    ) : (
                        alerts.map((alert, index) => (
                            <div key={index} className="border-b border-gray-100 pb-5 last:border-b-0 last:pb-0">
                                <p className="text-sm font-semibold text-[#0f766e] uppercase tracking-wider mb-1">
                                    High Demand Alert: {alert.sport}
                                </p>
                                <p className="text-base font-medium text-gray-900 mb-0.5">
                                    {alert.location}
                                </p>
                                <p className="text-sm text-gray-500">
                                    Interest: <span className="font-semibold text-gray-800">{alert.demand} players</span> | Supply: <span className="font-semibold text-gray-800">{alert.supply} listings</span>
                                </p>
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
    );
};

export default AnalyticsInsights;
