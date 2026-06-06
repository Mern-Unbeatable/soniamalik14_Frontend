import React from 'react';
import { ChevronDown } from 'lucide-react';

const AnalyticsCharts = ({ userFilter, onUserFilterChange }) => {
    return (
        <div className="lg:col-span-2 bg-white rounded-lg md:rounded-2xl shadow-sm border border-gray-100 p-4 md:p-6 lg:p-8">
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

            {/* Chart Area */}
            <div className="relative h-[200px] md:h-[280px] w-full">
                {/* Y Axis Grid & Labels */}
                <div className="absolute inset-0 flex flex-col justify-between text-xs text-gray-400 pb-8">
                    {['50K', '40K', '30K', '20K', '10K', '1k'].map((label, i) => (
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
                        {[0, 83.33, 166.67, 250, 333.33, 416.67, 500, 583.33, 666.67, 750, 833.33, 916.67].map((x, i) => (
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
                        ))}

                        {/* Navy Line (Sport Providers) */}
                        <path
                            d="M 0 240 C 200 150, 400 130, 600 140 C 800 150, 900 120, 1000 80"
                            fill="none" stroke="#111827" strokeWidth="2.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                        {/* Yellow Line (Service Provider) */}
                        <path
                            d="M 0 240 C 200 160, 300 90, 500 120 C 700 150, 800 140, 1000 40"
                            fill="none" stroke="#fde047" strokeWidth="2.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                        {/* Teal Line (Player) */}
                        <path
                            d="M 0 240 C 150 50, 300 80, 450 100 C 600 120, 700 -20, 850 60 C 900 90, 950 160, 1000 170"
                            fill="none" stroke="#2dd4bf" strokeWidth="2.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </svg>
                </div>

                {/* X Axis Labels */}
                <div className="absolute bottom-0 left-5 md:left-10 right-0 flex justify-between text-[10px] md:text-xs text-gray-400 font-medium pr-2">
                    {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'July', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map(m => (
                        <span key={m}>{m}</span>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default AnalyticsCharts;
