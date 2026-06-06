import { GET } from '../../../../../services/httpMethods';
import { ENDPOINT } from '../../../../../services/httpEndpoint';

export const isRequestCanceled = (error) => {
  return (
    error?.name === 'AbortError' ||
    error?.name === 'CanceledError' ||
    error?.code === 'ERR_CANCELED' ||
    String(error?.message || '').toLowerCase() === 'canceled'
  );
};

const unwrapData = (response) => response?.data?.data ?? response?.data ?? response;

const toMessage = (error, fallback) => {
  return error?.response?.data?.message || error?.message || fallback;
};

export const fetchDashboardStats = async (signal) => {
  const response = await GET(ENDPOINT.ADMIN.DASHBOARD_STATS, {}, signal);
  const payload = unwrapData(response);

  if (!payload || typeof payload !== 'object') {
    throw new Error('Invalid dashboard stats response');
  }

  return payload;
};

export const fetchUserTrends = async (period, signal) => {
  const response = await GET(ENDPOINT.ADMIN.USER_TRENDS, { period }, signal);
  const payload = unwrapData(response);

  if (!Array.isArray(payload)) {
    throw new Error('Invalid user trends response');
  }

  return payload.map((item) => ({
    month: item?.month || '',
    player: Number(item?.player || 0),
    provider: Number(item?.provider || 0),
    sport: Number(item?.sport || 0),
  }));
};

export const fetchDemandSupply = async (signal) => {
  const response = await GET(ENDPOINT.ADMIN.DEMAND_SUPPLY, {}, signal);
  const payload = unwrapData(response);

  if (!Array.isArray(payload)) {
    throw new Error('Invalid demand-supply response');
  }

  return payload.map((item) => ({
    name: item?.name || 'Unknown',
    demand: Number(item?.demand || 0),
    supply: Number(item?.supply || 0),
  }));
};

export const fetchHighDemandAlerts = async (signal) => {
  const response = await GET(ENDPOINT.ADMIN.HIGH_DEMAND_ALERTS, {}, signal);
  const payload = unwrapData(response);

  if (!Array.isArray(payload)) {
    throw new Error('Invalid high demand alerts response');
  }

  return payload.map((item) => ({
    sport: item?.sport || item?.name || 'Unknown sport',
    location: item?.location || item?.postcode || 'Unknown location',
    demand: item?.demand || 'N/A',
    supply: item?.supply || 'N/A',
  }));
};

export const fetchTopLocations = async (signal) => {
  const response = await GET(ENDPOINT.ADMIN.TOP_LOCATIONS, {}, signal);
  const payload = unwrapData(response);

  if (!Array.isArray(payload)) {
    throw new Error('Invalid top locations response');
  }

  return payload.map((item) => ({
    name: item?.name || 'Unknown location',
    value: Number(item?.value || 0),
    width: Number(item?.width || 0),
  }));
};

export const fetchStaticDashboardData = async (signal) => {
  const [statsResult, demandResult, alertsResult, locationsResult] = await Promise.allSettled([
    fetchDashboardStats(signal),
    fetchDemandSupply(signal),
    fetchHighDemandAlerts(signal),
    fetchTopLocations(signal),
  ]);

  return {
    stats: statsResult.status === 'fulfilled' ? statsResult.value : null,
    demandSupply: demandResult.status === 'fulfilled' ? demandResult.value : [],
    alerts: alertsResult.status === 'fulfilled' ? alertsResult.value : [],
    topLocations: locationsResult.status === 'fulfilled' ? locationsResult.value : [],
    errors: {
      stats:
        statsResult.status === 'rejected' && !isRequestCanceled(statsResult.reason)
          ? toMessage(statsResult.reason, 'Failed to load dashboard stats')
          : '',
      demandSupply:
        demandResult.status === 'rejected' && !isRequestCanceled(demandResult.reason)
          ? toMessage(demandResult.reason, 'Failed to load demand vs supply data')
          : '',
      alerts:
        alertsResult.status === 'rejected' && !isRequestCanceled(alertsResult.reason)
          ? toMessage(alertsResult.reason, 'Failed to load high demand alerts')
          : '',
      topLocations:
        locationsResult.status === 'rejected' && !isRequestCanceled(locationsResult.reason)
          ? toMessage(locationsResult.reason, 'Failed to load top locations')
          : '',
    },
  };
};
