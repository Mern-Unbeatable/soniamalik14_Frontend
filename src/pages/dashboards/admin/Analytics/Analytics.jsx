import React, { useState } from 'react';
import AnalyticsHeader from './components/AnalyticsHeader';
import AnalyticsCharts from './components/AnalyticsCharts';
import AnalyticsTopSports from './components/AnalyticsTopSports';
import AnalyticsInsights from './components/AnalyticsInsights';
import AnalyticsConversionFunnel from './components/AnalyticsConversionFunnel';

const Analytics = () => {
    const [dateRange, setDateRange] = useState('Last 30 Days');
    const [userFilter, setUserFilter] = useState('This year');

    return (
        <div className="flex-1 overflow-auto bg-gray-50 dashboardPy dashboardSpaceY">
            <div className="">

                {/* Header */}
                <AnalyticsHeader
                    dateRange={dateRange}
                    onDateRangeChange={() => setDateRange('Last 30 Days')}
                />

                {/* Top Row: Charts */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                    <AnalyticsCharts
                        userFilter={userFilter}
                        onUserFilterChange={() => setUserFilter('This year')}
                    />
                    <AnalyticsTopSports />
                </div>

                {/* Bottom Row */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <AnalyticsInsights />
                    <AnalyticsConversionFunnel />
                </div>

            </div>
        </div>
    );
};

export default Analytics;