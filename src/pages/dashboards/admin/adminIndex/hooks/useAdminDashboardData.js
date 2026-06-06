import { useCallback, useEffect, useRef, useState } from 'react';
import {
  fetchStaticDashboardData,
  fetchUserTrends,
  isRequestCanceled,
} from '../api/dashboardApi';

const CACHE_TTL_MS = 60_000;

let staticCache = {
  data: null,
  errors: {
    stats: '',
    demandSupply: '',
    alerts: '',
    topLocations: '',
  },
  fetchedAt: 0,
};

const trendsCache = new Map();

const isFresh = (timestamp) => Date.now() - timestamp < CACHE_TTL_MS;

export const useAdminDashboardData = () => {
  const [period, setPeriod] = useState('year');
  const [statsData, setStatsData] = useState(null);
  const [demandSupplyData, setDemandSupplyData] = useState([]);
  const [alertsData, setAlertsData] = useState([]);
  const [topLocationsData, setTopLocationsData] = useState([]);
  const [trendsData, setTrendsData] = useState([]);

  const [loading, setLoading] = useState({
    staticData: true,
    trends: true,
  });

  const [errors, setErrors] = useState({
    stats: '',
    demandSupply: '',
    alerts: '',
    topLocations: '',
    trends: '',
  });

  const staticControllerRef = useRef(null);
  const trendsControllerRef = useRef(null);

  const loadStaticData = useCallback(async (options = {}) => {
    const { force = false } = options;

    if (!force && staticCache.data && isFresh(staticCache.fetchedAt)) {
      setStatsData(staticCache.data.stats);
      setDemandSupplyData(staticCache.data.demandSupply);
      setAlertsData(staticCache.data.alerts);
      setTopLocationsData(staticCache.data.topLocations);
      setErrors((prev) => ({ ...prev, ...staticCache.errors }));
      setLoading((prev) => ({ ...prev, staticData: false }));
      return;
    }

    staticControllerRef.current?.abort();
    const controller = new AbortController();
    staticControllerRef.current = controller;

    setLoading((prev) => ({ ...prev, staticData: true }));

    const result = await fetchStaticDashboardData(controller.signal);

    if (controller.signal.aborted) return;

    setStatsData(result.stats);
    setDemandSupplyData(result.demandSupply);
    setAlertsData(result.alerts);
    setTopLocationsData(result.topLocations);
    setErrors((prev) => ({ ...prev, ...result.errors }));
    setLoading((prev) => ({ ...prev, staticData: false }));

    staticCache = {
      data: {
        stats: result.stats,
        demandSupply: result.demandSupply,
        alerts: result.alerts,
        topLocations: result.topLocations,
      },
      errors: result.errors,
      fetchedAt: Date.now(),
    };
  }, []);

  const loadTrends = useCallback(async (nextPeriod, options = {}) => {
    const { force = false } = options;
    const cacheKey = String(nextPeriod || 'year');
    const cached = trendsCache.get(cacheKey);

    if (!force && cached && isFresh(cached.fetchedAt)) {
      setTrendsData(cached.data);
      setErrors((prev) => ({ ...prev, trends: cached.error }));
      setLoading((prev) => ({ ...prev, trends: false }));
      return;
    }

    trendsControllerRef.current?.abort();
    const controller = new AbortController();
    trendsControllerRef.current = controller;

    setLoading((prev) => ({ ...prev, trends: true }));
    setErrors((prev) => ({ ...prev, trends: '' }));

    try {
      const data = await fetchUserTrends(cacheKey, controller.signal);

      if (controller.signal.aborted) return;

      setTrendsData(data);
      setErrors((prev) => ({ ...prev, trends: '' }));
      trendsCache.set(cacheKey, {
        data,
        error: '',
        fetchedAt: Date.now(),
      });
    } catch (error) {
      if (isRequestCanceled(error)) return;
      if (controller.signal.aborted) return;

      const message =
        error?.response?.data?.message || error?.message || 'Failed to load user trends';
      setTrendsData([]);
      setErrors((prev) => ({ ...prev, trends: message }));
      trendsCache.set(cacheKey, {
        data: [],
        error: message,
        fetchedAt: Date.now(),
      });
    } finally {
      if (!controller.signal.aborted) {
        setLoading((prev) => ({ ...prev, trends: false }));
      }
    }
  }, []);

  useEffect(() => {
    loadStaticData();

    return () => {
      staticControllerRef.current?.abort();
    };
  }, [loadStaticData]);

  useEffect(() => {
    loadTrends(period);

    return () => {
      trendsControllerRef.current?.abort();
    };
  }, [period, loadTrends]);

  const refreshAll = useCallback(() => {
    loadStaticData({ force: true });
    loadTrends(period, { force: true });
  }, [loadStaticData, loadTrends, period]);

  const refreshTrends = useCallback(() => {
    loadTrends(period, { force: true });
  }, [loadTrends, period]);

  return {
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
  };
};
