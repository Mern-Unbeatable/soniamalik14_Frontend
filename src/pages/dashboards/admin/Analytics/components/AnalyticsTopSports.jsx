import React, { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { GET } from '../../../../../services/httpMethods';

const COLORS = [
    { stroke: '#2dd4bf', bg: 'bg-[#2dd4bf]' },
    { stroke: '#3b82f6', bg: 'bg-[#3b82f6]' },
    { stroke: '#f59e0b', bg: 'bg-[#f59e0b]' },
    { stroke: '#a855f7', bg: 'bg-[#a855f7]' },
    { stroke: '#f472b6', bg: 'bg-[#f472b6]' },
    { stroke: '#ec4899', bg: 'bg-[#ec4899]' },
    { stroke: '#ef4444', bg: 'bg-[#ef4444]' },
    { stroke: '#10b981', bg: 'bg-[#10b981]' },
];

const AnalyticsTopSports = () => {
    const [sportsData, setSportsData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(function initDemandSupply() {
        const fetchDemandSupply = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await GET('/api/admin/dashboard/demand-supply');
                const payload = response?.data || response;
                if (payload?.success && Array.isArray(payload?.data)) {
                    setSportsData(payload.data);
                } else if (Array.isArray(payload)) {
                    setSportsData(payload);
                } else {
                    setSportsData([]);
                }
            } catch (err) {
                console.error('Error fetching demand/supply:', err);
                setError('Failed to load data');
            } finally {
                setLoading(false);
            }
        };
        fetchDemandSupply();
    }, []);

    const totalDemand = sportsData.reduce((acc, curr) => acc + (curr.demand || 0), 0);
    let accumulatedOffset = 0;

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8 flex flex-col min-h-[400px]">
            <h2 className="text-xl md:text-2xl font-semibold text-gray-900 mb-8">Top Sports by Interest</h2>

            {loading ? (
                <div className="flex-1 flex items-center justify-center">
                    <Loader2 className="w-8 h-8 text-[#14B8A6] animate-spin" />
                </div>
            ) : error ? (
                <div className="flex-1 flex items-center justify-center text-red-500 font-medium text-sm">
                    {error}
                </div>
            ) : (
                <>
                    {/* Custom SVG Donut Chart */}
                    <div className="relative w-40 h-40 mx-auto mb-10">
                        <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
                            {totalDemand === 0 ? (
                                <circle cx="50" cy="50" r="40" fill="transparent" stroke="#e5e7eb" strokeWidth="12" />
                            ) : (
                                sportsData.map((sport, i) => {
                                    const color = COLORS[i % COLORS.length];
                                    const percentage = (sport.demand || 0) / totalDemand;
                                    const segmentLength = percentage * 251.327;
                                    const offset = -accumulatedOffset;
                                    accumulatedOffset += segmentLength;

                                    if (segmentLength === 0) return null;

                                    return (
                                        <circle
                                            key={sport.name}
                                            cx="50"
                                            cy="50"
                                            r="40"
                                            fill="transparent"
                                            stroke={color.stroke}
                                            strokeWidth="12"
                                            strokeDasharray={`${segmentLength} 251.327`}
                                            strokeDashoffset={offset}
                                            className="transition-all duration-500 ease-out"
                                        />
                                    );
                                })
                            )}
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <span className="text-2xl font-bold text-gray-900">{totalDemand}</span>
                            <span className="text-xs text-gray-500 font-medium text-center px-2">Total Interest</span>
                        </div>
                    </div>

                    {/* Sport List */}
                    <div className="space-y-4 mt-auto">
                        {sportsData.map((sport, i) => {
                            const color = COLORS[i % COLORS.length];
                            return (
                                <div key={sport.name} className="flex justify-between items-center text-sm md:text-base font-semibold text-gray-800">
                                    <div className="flex items-center gap-3">
                                        <span className={`w-2.5 h-2.5 rounded-full ${color.bg}`}></span>
                                        {sport.name}
                                    </div>
                                    <span className="text-gray-600 font-medium">{sport.demand || 0}</span>
                                </div>
                            );
                        })}
                    </div>
                </>
            )}
        </div>
    );
};

export default AnalyticsTopSports;
