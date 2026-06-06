import axios from 'axios';
import { API_CONFIG } from '../config/constants';
import { getToken } from '../utils/storage';

// Always use direct backend URL (no Vite proxy)
const baseURL = String(API_CONFIG.BASE_URL || '').replace(/\/+$/, '');

// Debug: Log environment info to help diagnose production issues
// eslint-disable-next-line no-console
console.log('[axios] Environment Debug:', {
  isDev: import.meta.env.DEV,
  isProd: import.meta.env.PROD,
  mode: import.meta.env.MODE,
  rawEnvVar: import.meta.env.VITE_API_BASE_URL,
  configBaseUrl: API_CONFIG.BASE_URL,
  finalBaseURL: baseURL,
});

const axiosInstance = axios.create({
  baseURL,
  timeout: API_CONFIG.TIMEOUT,
  withCredentials: API_CONFIG.WITH_CREDENTIALS,
});

// Request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    const skipAuth = Boolean(config?.skipAuth);
    const token = getToken();
    // Temporary debug: log whether a token was found (masked)
    try {
      const masked = token ? `${String(token).slice(0, 6)}...` : null;
      // eslint-disable-next-line no-console
      console.debug('[axios] auth token (masked):', masked);
    } catch (e) {
      // noop
    }

    if (token && !skipAuth) {
      config.headers.Authorization = `Bearer ${token}`;
    } else if (skipAuth && config.headers?.Authorization) {
      delete config.headers.Authorization;
    }

    if (config.data instanceof FormData) {
      const formDataEntries = [];
      const formDataObject = {};

      for (const [key, value] of config.data.entries()) {
        const normalizedValue = value instanceof File ? `[File: ${value.name}]` : value;
        formDataEntries.push([key, normalizedValue]);

        if (formDataObject[key] !== undefined) {
          formDataObject[key] = Array.isArray(formDataObject[key])
            ? [...formDataObject[key], normalizedValue]
            : [formDataObject[key], normalizedValue];
        } else {
          formDataObject[key] = normalizedValue;
        }
      }

      config.headers.setContentType(undefined);
      console.log('[axios] FormData request:', {
        url: config.url,
        method: config.method,
        timeout: config.timeout,
        headers: config.headers,
        formDataEntries,
        formDataObject,
      });
    } else if (config.method?.toUpperCase() === 'PUT') {
      config.headers.setContentType('application/json');
      console.log('[axios] PUT request with JSON:', {
        url: config.url,
        method: config.method,
        data: config.data,
        headers: config.headers,
      });
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - Only for non-error responses

axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    const isCanceled =
      axios.isCancel(error) ||
      error?.code === 'ERR_CANCELED' ||
      error?.name === 'CanceledError' ||
      String(error?.message || '').toLowerCase() === 'canceled';

    if (isCanceled) {
      // Request cancellation is expected during unmounts/filter changes.
      return Promise.reject(error);
    }

    // Detailed error logging for debugging network/auth issues
    try {
      const isTimeout = error?.code === 'ECONNABORTED' || /timeout/i.test(error?.message || '');
      // eslint-disable-next-line no-console
      console.error('[axios][error]', {
        url: error?.config?.url,
        method: error?.config?.method,
        status: error?.response?.status,
        response: error?.response?.data,
        message: error?.message,
        timeout: error?.config?.timeout,
        isTimeout,
        hint: isTimeout
          ? 'Request timed out before backend responded. Verify API/proxy reachability and backend latency.'
          : undefined,
      });
    } catch (e) {
      // noop
    }

    // Pass through errors to be handled by callers
    return Promise.reject(error);
  }
);

export default axiosInstance;
