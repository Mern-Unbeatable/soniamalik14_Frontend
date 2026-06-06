import { createAsyncThunk } from '@reduxjs/toolkit';
import { GET, POST, PUT, DELETE } from '../../services/httpMethods';
import { ENDPOINT } from '../../services/httpEndpoint';
import { apiExecutor } from '../../services/apiExecutor';
import { toast } from 'react-toastify';

const getApiErrorMessage = (error, fallbackMessage) => {
  const payload = error?.response?.data || error;
  const fallback = fallbackMessage || error?.message || 'Request failed';

  if (!payload || typeof payload !== 'object') {
    return fallback;
  }

  if (Array.isArray(payload?.errors) && payload.errors.length > 0) {
    const details = payload.errors
      .map((entry) => {
        if (typeof entry === 'string') return entry;
        const field = entry?.path || entry?.field || entry?.param || entry?.name;
        const message = entry?.msg || entry?.message || entry?.error;
        if (field && message) return `${field}: ${message}`;
        return message || field || null;
      })
      .filter(Boolean)
      .join(' | ');

    if (details) {
      return `${payload?.message || 'Validation error'}: ${details}`;
    }
  }

  return payload?.message || fallback;
};

/**
 * Professional Service API Layer
 * Handles all service-related API calls with proper error handling and toast notifications
 */

// Fetch all approved services (public)
export const fetchApprovedServices = createAsyncThunk(
  'service/fetchApproved',
  async (_, { rejectWithValue, signal }) => {
    try {
      const response = await apiExecutor(
        (signal) => GET(ENDPOINT.SERVICES.APPROVED, {}, signal),
        rejectWithValue,
        signal
      );
      return response?.data || response || [];
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch services');
    }
  }
);

// Fetch provider's own services (all statuses)
export const fetchProviderServices = createAsyncThunk(
  'service/fetchProviderServices',
  async (providerId, { rejectWithValue, signal }) => {
    try {
      const endpoint = providerId
        ? ENDPOINT.SERVICES.PROVIDER_SERVICES(providerId)
        : '/api/services/provider/my';
      const response = await apiExecutor(
        (signal) => GET(endpoint, {}, signal),
        rejectWithValue,
        signal
      );
      return response?.data || response || [];
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch provider services');
    }
  }
);


// Fetch pending services (admin only)
export const fetchPendingServices = createAsyncThunk(
  'service/fetchPending',
  async (_, { rejectWithValue, signal }) => {
    try {
      const response = await apiExecutor(
        (signal) => GET(ENDPOINT.SERVICES.PENDING, {}, signal),
        rejectWithValue,
        signal
      );
      return response?.data || response || [];
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch pending services');
    }
  }
);

// Create new service (provider)
export const createService = createAsyncThunk(
  'service/create',
  async (serviceData, { rejectWithValue, signal }) => {
    try {
      const response = await POST(ENDPOINT.SERVICES.CREATE, serviceData, signal);
      const result = response?.data || response;
      toast.success('Service submitted for approval');
      return result;
    } catch (error) {
      const message = getApiErrorMessage(error, 'Failed to create service');
      console.error('[service/create] request failed', {
        url: error?.config?.url,
        method: error?.config?.method,
        status: error?.response?.status,
        response: error?.response?.data,
        message,
      });
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

// Update service (provider)
export const updateService = createAsyncThunk(
  'service/update',
  async ({ id, serviceData }, { rejectWithValue, signal }) => {
    try {
      const response = await PUT(ENDPOINT.SERVICES.UPDATE(id), serviceData, signal);
      const result = response?.data || response;
      toast.success('Service updated successfully');
      return result;
    } catch (error) {
      const message = getApiErrorMessage(error, 'Failed to update service');
      console.error('[service/update] request failed', {
        url: error?.config?.url,
        method: error?.config?.method,
        status: error?.response?.status,
        response: error?.response?.data,
        message,
      });
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

// Delete service (provider)
export const deleteService = createAsyncThunk(
  'service/delete',
  async (id, { rejectWithValue, signal }) => {
    try {
      try {
        await apiExecutor(
          (signal) => DELETE(ENDPOINT.SERVICES.DELETE(id), signal),
          rejectWithValue,
          signal
        );
      } catch (error) {
        const status = error?.status || error?.response?.status;
        if (status !== 403) throw error;

        let deleted = false;
        const fallbackUrls = [
          `/api/services/provider/my/${id}`,
          `/api/services/provider/${id}`,
        ];

        for (const url of fallbackUrls) {
          try {
            await apiExecutor(
              (signal) => DELETE(url, signal),
              rejectWithValue,
              signal
            );
            deleted = true;
            break;
          } catch (fallbackError) {
            const fallbackStatus = fallbackError?.status || fallbackError?.response?.status;
            if (fallbackStatus === 403 || fallbackStatus === 404) {
              continue;
            }
            throw fallbackError;
          }
        }

        if (!deleted) {
          throw error;
        }
      }

      toast.success('Service deleted successfully');
      return id;
    } catch (error) {
      const status = error?.status || error?.response?.status;
      const message =
        status === 403
          ? 'You do not have permission to delete this service.'
          : error?.message || 'Failed to delete service';
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

// Approve service (admin)
export const approveService = createAsyncThunk(
  'service/approve',
  async (id, { rejectWithValue, signal }) => {
    try {
      const response = await apiExecutor(
        (signal) => POST(ENDPOINT.SERVICES.APPROVE(id), {}, signal),
        rejectWithValue,
        signal
      );
      const result = response?.data || response;
      toast.success('Service approved successfully');
      return result;
    } catch (error) {
      toast.error(error.message || 'Failed to approve service');
      return rejectWithValue(error.message || 'Failed to approve service');
    }
  }
);

// Reject service (admin)
export const rejectService = createAsyncThunk(
  'service/reject',
  async ({ id, reason }, { rejectWithValue, signal }) => {
    try {
      const response = await apiExecutor(
        (signal) => POST(ENDPOINT.SERVICES.REJECT(id), { reason }, signal),
        rejectWithValue,
        signal
      );
      const result = response?.data || response;
      toast.success('Service rejected');
      return result;
    } catch (error) {
      toast.error(error.message || 'Failed to reject service');
      return rejectWithValue(error.message || 'Failed to reject service');
    }
  }
);
