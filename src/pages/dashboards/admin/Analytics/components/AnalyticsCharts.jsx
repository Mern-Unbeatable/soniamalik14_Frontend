import React, { useState, useEffect } from 'react';
import { ChevronDown, Loader2 } from 'lucide-react';
import { GET } from '../../../../../services/httpMethods';

const getNiceMax = (maxVal) => {
    if (maxVal <= 5) return 5;
    if (maxVal <= 10) return 10;
    if (maxVal <= 50) return 50;
    if (maxVal <= 100) return 100;
    if (maxVal <= 500) return 500;
    if (maxVal <= 1000) return 1000;
    if (maxVal <= 5000) return 5000;
    if (maxVal <= 10000) return 10000;
    if (maxVal <= 50000) return 50000;
    return Math.ceil(maxVal / 100000) * 100000;
};

const generatePath = (data, key, maxVal) => {
    if (!data || data.length === 0) return '';
    const points = data.map((d, i) => {
        const x = i * (1000 / (data.length - 1 || 1));
        const val = d[key] || 0;
        const y = 240 - (val / (maxVal || 1)) * 240;
        return `${x},${y}`;
    });
    return `M ${points.map((p, idx) => (idx === 0 ? p : `L ${p}`)).join(' ')}`;
};

const AnalyticsCharts = ({ userFilter, onUserFilterChange }) => {
    const [chartData, setChartData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(function fetchUserTrends() {
        const fetchTrends = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await GET('/api/admin/dashboard/user-trends');
                const payload = response?.data || response;
                if (payload?.success && Array.isArray(payload?.data)) {
                    setChartData(payload.data);
                } else if (Array.isArray(payload)) {
                    setChartData(payload);
                } else {
                    setChartData([]);
                }
            } catch (err) {
                console.error('Error fetching user trends:', err);
                setError('Failed to load user trends');
            } finally {
                setLoading(false);
            }
        };
        fetchTrends();
    }, []);

    // Calculate maximum value across all series to dynamically scale the Y-axis
    const maxVal = Math.max(
        ...chartData.map(d => Math.max(d.player || 0, d.provider || 0, d.sport || 0)),
        10 // default minimum max to prevent division by zero
    );
    const niceMax = getNiceMax(maxVal);

    // Generate 6 Y-axis labels from high to low
    const yLabels = [];
    for (let i = 5; i >= 0; i--) {
        const val = (niceMax / 5) * i;
        if (val >= 1000) {
            yLabels.push(`${(val / 1000).toFixed(val % 1000 === 0 ? 0 : 1)}K`);
        } else {
            yLabels.push(Math.round(val).toString());
        }
    }

    const months = chartData.map(d => d.month) || [];

    return (
        <div className="lg:col-span-2 bg-white rounded-lg md:rounded-2xl shadow-sm border border-gray-100 p-4 md:p-6 lg:p-8 relative min-h-[350px]">
            <div className="flex flex-col sm:flex-row justify-between items-start gap-4 sm:gap-0 sm:items-center mb-6">
                <h2 className="text-lg md:text-xl lg:text-2xl font-semibold text-gray-900">User</h2>
                <button
                    onClick={onUserFilterChange}
                    className="flex items-center gap-2 bg-gray-50 border border-gray-100 px-3 py-1.5 rounded-md text-sm text-gray-600 font-medium hover:bg-gray-100 transition-colors w-full sm:w-auto"
                >
                    {userFilter} <ChevronDown className="w-4 h-4 text-gray-400" />
                </button>
            </div>

            {/* Legend */}
            <div className="flex flex-col gap-3 md:flex-row md:flex-wrap md:items-center md:gap-6 mb-6 md:mb-8 text-sm md:text-base font-medium text-gray-700">
                <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#14B8A6]"></span>Player
                </div>
                <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#FDE68A]"></span>Service Provider
                </div>
                <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#1E293B]"></span>Sport Providers
                </div>
            </div>

            {loading ? (
                <div className="h-[200px] md:h-[280px] flex items-center justify-center">
                    <Loader2 className="w-8 h-8 text-[#14B8A6] animate-spin" />
                </div>
            ) : error ? (
                <div className="h-[200px] md:h-[280px] flex items-center justify-center text-red-500 font-medium text-sm">
                    {error}
                </div>
            ) : (
                /* Chart Area */
                <div className="relative h-[200px] md:h-[280px] w-full">
                    {/* Y Axis Grid & Labels */}
                    <div className="absolute inset-0 flex flex-col justify-between text-xs text-gray-400 pb-8">
                        {yLabels.map((label, i) => (
                            <div className="flex items-center w-full gap-2 md:gap-4" key={i}>
                                <span className="w-5 md:w-6 text-right text-[10px] md:text-xs">{label}</span>
                                <div className="flex-1 border-b border-dashed border-gray-100"></div>
                            </div>
                        ))}
                    </div>

                    {/* SVG Lines */}
                    <div className="absolute inset-0 left-5 md:left-10 bottom-8">
                        <svg viewBox="0 0 1000 240" preserveAspectRatio="none" className="w-full h-full overflow-visible">
                            {/* Vertical Grid Lines - aligned with months */}
                            {chartData.map((_, i) => {
                                const x = i * (1000 / (chartData.length - 1 || 1));
                                return (
                                    <line
                                        key={`vline-${i}`}
                                        x1={x}
                                        y1="0"
                                        x2={x}
                                        y2="240"
                                        stroke="#e5e7eb"
                                        strokeWidth="1.5"
                                        strokeDasharray="3,3"
                                    />
                                );
                            })}

                            {/* Navy Line (Sport Providers) */}
                            <path
                                d={generatePath(chartData, 'sport', niceMax)}
                                fill="none" stroke="#1E293B" strokeWidth="2.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                            {/* Yellow Line (Service Provider) */}
                            <path
                                d={generatePath(chartData, 'provider', niceMax)}
                                fill="none" stroke="#FDE68A" strokeWidth="2.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                            {/* Teal Line (Player) */}
                            <path
                                d={generatePath(chartData, 'player', niceMax)}
                                fill="none" stroke="#14B8A6" strokeWidth="2.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>
                    </div>

                    {/* X Axis Labels */}
                    <div className="absolute bottom-0 left-5 md:left-10 right-0 flex justify-between text-[10px] md:text-xs text-gray-400 font-medium pr-2">
                        {months.map(m => (
                            <span key={m}>{m}</span>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default AnalyticsCharts;
