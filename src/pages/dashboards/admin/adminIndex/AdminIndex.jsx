import React, { useState } from 'react';
import { Download } from 'lucide-react';
import StatsGrid from './components/StatsGrid';
import UserTrendsChart from './components/UserTrendsChart';
import DemandVsSupply from './components/DemandVsSupply';
import HighDemandAlerts from './components/HighDemandAlerts';
import TopLocationsByDemand from './components/TopLocationsByDemand';
import { useAdminDashboardData } from './hooks/useAdminDashboardData';
import { GET } from '../../../../services/httpMethods';
import { ENDPOINT } from '../../../../services/httpEndpoint';

const AdminIndex = () => {
  const [isExporting, setIsExporting] = useState(false);
  const {
    period,
    setPeriod,
    statsData,
    demandSupplyData,
    alertsData,
    topLocationsData,
    trendsData,
    loading,
    errors,
    refreshAll,
    refreshTrends,
  } = useAdminDashboardData();

  const handleExportCsv = async () => {
    try {
      setIsExporting(true);

      const response = await GET(
        ENDPOINT.ADMIN.DASHBOARD_EXPORT,
        {},
        undefined,
        { responseType: 'blob' }
      );

      const csvBlob = response?.data;
      if (!(csvBlob instanceof Blob)) {
        throw new Error('Invalid export file response');
      }

      const disposition = response?.headers?.['content-disposition'] || '';
      const filenameMatch = disposition.match(/filename\*?=(?:UTF-8''|"?)([^";]+)/i);
      const filename = filenameMatch?.[1]
        ? decodeURIComponent(filenameMatch[1].replace(/"/g, '').trim())
        : 'admin-dashboard-export.csv';

      const downloadUrl = window.URL.createObjectURL(csvBlob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      console.error('Failed to export dashboard CSV:', error);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="flex-1 overflow-auto bg-gray-50 dashboardPy dashboardSpaceY">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
        <div className="text-center sm:text-left">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-sm sm:text-base text-gray-600 mt-1 sm:mt-2">Welcome back, Admin. Here's what's happening today.</p>
        </div>
        <button
          type="button"
          onClick={handleExportCsv}
          disabled={isExporting}
          className="flex items-center justify-center gap-2 px-4 sm:px-6 py-2 sm:py-3 bg-btn-primary text-white text-sm sm:text-base font-medium rounded-lg hover:bg-teal-700 transition-colors whitespace-nowrap disabled:opacity-70 disabled:cursor-not-allowed"
        >
          <Download className="w-5 h-5 sm:w-6 sm:h-6" />
          <span className="hidden sm:inline">{isExporting ? 'Exporting...' : 'Export CSV'}</span>
          <span className="sm:hidden">{isExporting ? 'Exporting...' : 'Export'}</span>
        </button>
      </div>
      {/* Stats Grid */}
      <StatsGrid
        statsData={statsData}
        isLoading={loading.staticData}
        error={errors.stats}
        onRetry={refreshAll}
      />
      <div className="grid grid-cols-1 gap-3 lg:gap-6 xl:grid-cols-3">
        <UserTrendsChart
          period={period}
          onPeriodChange={setPeriod}
          chartData={trendsData}
          isLoading={loading.trends}
          error={errors.trends}
          onRetry={refreshTrends}
        />
        <DemandVsSupply
          sportsData={demandSupplyData}
          isLoading={loading.staticData}
          error={errors.demandSupply}
        />
      </div>
      <div className="grid grid-cols-1 gap-3 lg:gap-6 xl:grid-cols-3">
        <HighDemandAlerts
          alerts={alertsData}
          isLoading={loading.staticData}
          error={errors.alerts}
        />
        <TopLocationsByDemand
          locations={topLocationsData}
          isLoading={loading.staticData}
          error={errors.topLocations}
        />
      </div>
    </div>
  );
};

export default AdminIndex;
