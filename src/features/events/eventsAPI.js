import { createAsyncThunk } from '@reduxjs/toolkit';
import { DELETE, GET, PATCH, POST, PUT } from '../../services/httpMethods';
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

const normalizeEventListPayload = (payload) => {
  if (Array.isArray(payload)) return payload;
  if (!payload || typeof payload !== 'object') return [];

  if (Array.isArray(payload.data)) return payload.data;
  if (Array.isArray(payload.events)) return payload.events;
  if (Array.isArray(payload.rows)) return payload.rows;
  if (Array.isArray(payload.items)) return payload.items;
  if (Array.isArray(payload.data?.events)) return payload.data.events;
  if (Array.isArray(payload.data?.rows)) return payload.data.rows;
  if (Array.isArray(payload.data?.items)) return payload.data.items;
  if (Array.isArray(payload.data?.data)) return payload.data.data;
  if (Array.isArray(payload.data?.data?.events)) return payload.data.data.events;
  if (Array.isArray(payload.data?.data?.rows)) return payload.data.data.rows;
  if (Array.isArray(payload.data?.data?.items)) return payload.data.data.items;

  return [];
};

// Fetch approved public events
export const fetchEvents = createAsyncThunk(
  'events/fetchAll',
  async (_, { rejectWithValue, signal }) => {
    try {
      const response = await apiExecutor(
        (signal) => GET(ENDPOINT.EVENTS.APPROVED, {}, signal, { skipAuth: true, withCredentials: false }),
        rejectWithValue,
        signal
      );
      return normalizeEventListPayload(response);
    } catch (error) {
      return rejectWithValue(error?.message || 'Failed to fetch events');
    }
  }
);

export const fetchAdminEvents = createAsyncThunk(
  'events/fetchAdminEvents',
  async (_, { rejectWithValue, signal }) => {
    try {
      const response = await apiExecutor(
        (signal) => GET(ENDPOINT.EVENTS.LIST, {}, signal),
        rejectWithValue,
        signal
      );
      return response?.data?.data || response?.data || response || [];
    } catch (error) {
      return rejectWithValue(error?.message || 'Failed to fetch admin events');
    }
  }
);

export const approveAdminEvent = createAsyncThunk(
  'events/approveAdminEvent',
  async (eventId, { rejectWithValue, signal }) => {
    try {
      if (!eventId) {
        return rejectWithValue('Event id is required');
      }

      const response = await apiExecutor(
        (signal) => PATCH(ENDPOINT.EVENTS.APPROVAL_STATUS(eventId), { action: 'approve' }, signal),
        rejectWithValue,
        signal
      );
      const result = response?.data || response;
      toast.success(result?.message || 'Event approved successfully');
      return result?.data || result || { id: eventId, status: 'Approved' };
    } catch (error) {
      const message = getApiErrorMessage(error, 'Failed to approve event');
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

export const featureAdminEvent = createAsyncThunk(
  'events/featureAdminEvent',
  async (eventId, { rejectWithValue, signal }) => {
    try {
      if (!eventId) {
        return rejectWithValue('Event id is required');
      }

      let response;
      try {
        response = await PATCH(ENDPOINT.EVENTS.FEATURE(eventId), {}, signal);
      } catch (error) {
        const statusCode = error?.response?.status;
        if (statusCode !== 404) {
          throw error;
        }

        response = await PATCH(ENDPOINT.EVENTS.ADMIN_FEATURE(eventId), {}, signal);
      }

      const result = response?.data || response;
      toast.success(result?.message || 'Event featured successfully');
      return result?.data || result || { id: eventId, status: 'Featured' };
    } catch (error) {
      const message = getApiErrorMessage(error, 'Failed to feature event');
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

export const rejectAdminEvent = createAsyncThunk(
  'events/rejectAdminEvent',
  async ({ eventId, reason }, { rejectWithValue, signal }) => {
    try {
      if (!eventId) {
        return rejectWithValue('Event id is required');
      }

      const response = await apiExecutor(
        (signal) => PATCH(ENDPOINT.EVENTS.APPROVAL_STATUS(eventId), { action: 'reject', reason }, signal),
        rejectWithValue,
        signal
      );
      const result = response?.data || response;
      toast.success(result?.message || 'Event banned successfully');
      return result?.data || result || { id: eventId, status: 'Banned' };
    } catch (error) {
      const message = getApiErrorMessage(error, 'Failed to ban event');
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

// Fetch organizer event analytics list
export const fetchEventAnalytics = createAsyncThunk(
  'events/fetchAnalytics',
  async (_, { rejectWithValue, signal }) => {
    try {
      const response = await apiExecutor(
        (signal) => GET('/api/events/my/list', {}, signal),
        rejectWithValue,
        signal
      );
      return normalizeEventListPayload(response);
    } catch (error) {
      return rejectWithValue(error?.message || 'Failed to fetch event analytics');
    }
  }
);

// TODO: Add more event-related API calls when backend is ready
// Example endpoints to add:
// - fetchEventById(id)
// - createEvent(eventData)
// - updateEvent(id, eventData)
// - deleteEvent(id)
// - registerForEvent(eventId)

export const fetchProviderEvents = createAsyncThunk(
  'events/fetchProviderEvents',
  async (_, { rejectWithValue, signal }) => {
    try {
      const response = await apiExecutor(
        (signal) => GET('/api/events/my/list', {}, signal),
        rejectWithValue,
        signal
      );
      return normalizeEventListPayload(response);
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch provider events');
    }
  }
);

export const fetchOrganizerEvents = createAsyncThunk(
  'events/fetchOrganizerEvents',
  async (_, { rejectWithValue, signal }) => {
    try {
      const response = await apiExecutor(
        (signal) => GET('/api/events/my/list', {}, signal),
        rejectWithValue,
        signal
      );
      return normalizeEventListPayload(response);
    } catch (error) {
      return rejectWithValue(error?.message || 'Failed to fetch organizer events');
    }
  }
);

export const fetchOrganizerEventById = createAsyncThunk(
  'events/fetchOrganizerEventById',
  async (eventId, { rejectWithValue, signal }) => {
    try {
      if (!eventId) {
        return rejectWithValue('Event id is required');
      }

      const response = await GET(`/api/events/${eventId}`, {}, signal);
      const result = response?.data || response;
      return result?.data || result;
    } catch (error) {
      return rejectWithValue(getApiErrorMessage(error, 'Failed to fetch event details'));
    }
  }
);

export const createOrganizerEvent = createAsyncThunk(
  'events/createOrganizerEvent',
  async (eventData, { rejectWithValue, signal }) => {
    try {
      const response = await POST('/api/events', eventData, signal);
      const result = response?.data || response;
      toast.success(result?.message || 'Event created successfully');
      return result?.data || result;
    } catch (error) {
      const message = getApiErrorMessage(error, 'Failed to create event');
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

export const updateOrganizerEvent = createAsyncThunk(
  'events/updateOrganizerEvent',
  async ({ id, eventData }, { rejectWithValue, signal }) => {
    try {
      if (!id) {
        return rejectWithValue('Event id is required');
      }

      const response = await PUT(`/api/events/${id}`, eventData, signal);
      const result = response?.data || response;
      toast.success(result?.message || 'Event updated successfully');
      return result?.data || result;
    } catch (error) {
      const message = getApiErrorMessage(error, 'Failed to update event');
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

export const deleteOrganizerEvent = createAsyncThunk(
  'events/deleteOrganizerEvent',
  async (eventId, { rejectWithValue, signal }) => {
    try {
      if (!eventId) {
        return rejectWithValue('Event id is required');
      }

      const response = await DELETE(`/api/events/${eventId}`, signal);
      const result = response?.data || response;
      toast.success(result?.message || 'Event deleted successfully');
      return eventId;
    } catch (error) {
      const message = getApiErrorMessage(error, 'Failed to delete event');
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);
