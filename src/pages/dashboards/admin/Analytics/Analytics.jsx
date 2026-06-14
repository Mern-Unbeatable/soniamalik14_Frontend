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
    <div className="dashboardPy dashboardSpaceY flex-1 overflow-auto bg-gray-50">
      <div className="">
        {/* Header */}
        <AnalyticsHeader
          dateRange={dateRange}
          onDateRangeChange={() => setDateRange('Last 30 Days')}
        />

        {/* Top Row: Charts */}
        <div className="mb-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
          <AnalyticsCharts
            userFilter={userFilter}
            onUserFilterChange={() => setUserFilter('This year')}
          />
          <AnalyticsTopSports />
        </div>

        {/* Bottom Row */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <AnalyticsInsights />
          <AnalyticsConversionFunnel />
        </div>
      </div>
    </div>
  );
};

export default Analytics;
