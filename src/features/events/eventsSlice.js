import { createSlice } from '@reduxjs/toolkit';
import {
  fetchEvents,
  fetchAdminEvents,
  fetchEventAnalytics,
  fetchProviderEvents,
  fetchOrganizerEvents,
  fetchOrganizerEventById,
  createOrganizerEvent,
  updateOrganizerEvent,
  deleteOrganizerEvent,
  approveAdminEvent,
  featureAdminEvent,
  rejectAdminEvent,
} from './eventsAPI';

const normalizeEventsList = (value) => {
  if (Array.isArray(value)) return value;
  if (!value || typeof value !== 'object') return [];
  if (Array.isArray(value.events)) return value.events;
  if (Array.isArray(value.data)) return value.data;
  if (Array.isArray(value.rows)) return value.rows;
  if (Array.isArray(value.items)) return value.items;
  return [];
};

const initialState = {
  events: {
    list: [],
    success: null,
    error: null,
    loading: false,
  },
  adminEvents: {
    list: [],
    success: null,
    error: null,
    loading: false,
  },
  analytics: {
    list: [],
    success: null,
    error: null,
    loading: false,
  },
  providerEvents: {
    list: [],
    success: null,
    error: null,
    loading: false,
  },
  organizerEvents: {
    list: [],
    success: null,
    error: null,
    loading: false,
  },
  organizerEventDetails: {
    item: null,
    loading: false,
    success: null,
    error: null,
  },
  createOrganizerEvent: {
    loading: false,
    success: null,
    error: null,
  },
  updateOrganizerEvent: {
    loading: false,
    success: null,
    error: null,
  },
  deleteOrganizerEvent: {
    loading: false,
    success: null,
    error: null,
  },
};

const eventsSlice = createSlice({
  name: 'events',
  initialState,
  reducers: {
    resetEventsError: (state) => {
      state.events.error = null;
      state.adminEvents.error = null;
      state.analytics.error = null;
      state.providerEvents.error = null;
      state.organizerEvents.error = null;
      state.organizerEventDetails.error = null;
      state.createOrganizerEvent.error = null;
      state.updateOrganizerEvent.error = null;
      state.deleteOrganizerEvent.error = null;
    },
    resetEvents: () => initialState,
  },
  extraReducers: (builder) => {
    // Fetch Events
    builder
      .addCase(fetchEvents.pending, (state) => {
        state.events.loading = true;
        state.events.error = null;
        state.events.success = null;
      })
      .addCase(fetchEvents.fulfilled, (state, action) => {
        state.events.loading = false;
        state.events.success = true;
        state.events.error = null;
        state.events.list = action.payload || [];
      })
      .addCase(fetchEvents.rejected, (state, action) => {
        state.events.loading = false;
        state.events.success = false;
        state.events.error = action.payload || 'Failed to fetch events';
      });

    builder
      .addCase(fetchAdminEvents.pending, (state) => {
        state.adminEvents.loading = true;
        state.adminEvents.error = null;
        state.adminEvents.success = null;
      })
      .addCase(fetchAdminEvents.fulfilled, (state, action) => {
        state.adminEvents.loading = false;
        state.adminEvents.success = true;
        state.adminEvents.error = null;
        state.adminEvents.list = normalizeEventsList(action.payload);
      })
      .addCase(fetchAdminEvents.rejected, (state, action) => {
        state.adminEvents.loading = false;
        state.adminEvents.success = false;
        state.adminEvents.error = action.payload || 'Failed to fetch admin events';
      });

    builder
      .addCase(approveAdminEvent.pending, (state) => {
        state.adminEvents.loading = true;
        state.adminEvents.error = null;
        state.adminEvents.success = null;
      })
      .addCase(approveAdminEvent.fulfilled, (state, action) => {
        state.adminEvents.loading = false;
        state.adminEvents.success = true;
        state.adminEvents.error = null;
        const updated = action.payload;
        if (updated && typeof updated === 'object' && updated.id) {
          state.adminEvents.list = normalizeEventsList(state.adminEvents.list).map((event) =>
            String(event?.id) === String(updated.id) ? { ...event, ...updated } : event
          );
        }
      })
      .addCase(approveAdminEvent.rejected, (state, action) => {
        state.adminEvents.loading = false;
        state.adminEvents.success = false;
        state.adminEvents.error = action.payload || 'Failed to approve event';
      });

    builder
      .addCase(featureAdminEvent.pending, (state) => {
        state.adminEvents.loading = true;
        state.adminEvents.error = null;
        state.adminEvents.success = null;
      })
      .addCase(featureAdminEvent.fulfilled, (state, action) => {
        state.adminEvents.loading = false;
        state.adminEvents.success = true;
        state.adminEvents.error = null;
        const updated = action.payload;
        if (updated && typeof updated === 'object' && updated.id) {
          state.adminEvents.list = normalizeEventsList(state.adminEvents.list).map((event) =>
            String(event?.id) === String(updated.id)
              ? { ...event, ...updated, isFeatured: updated?.isFeatured ?? true }
              : event
          );
        }
      })
      .addCase(featureAdminEvent.rejected, (state, action) => {
        state.adminEvents.loading = false;
        state.adminEvents.success = false;
        state.adminEvents.error = action.payload || 'Failed to feature event';
      });

    builder
      .addCase(rejectAdminEvent.pending, (state) => {
        state.adminEvents.loading = true;
        state.adminEvents.error = null;
        state.adminEvents.success = null;
      })
      .addCase(rejectAdminEvent.fulfilled, (state, action) => {
        state.adminEvents.loading = false;
        state.adminEvents.success = true;
        state.adminEvents.error = null;
        const updated = action.payload;
        if (updated && typeof updated === 'object' && updated.id) {
          state.adminEvents.list = normalizeEventsList(state.adminEvents.list).map((event) =>
            String(event?.id) === String(updated.id) ? { ...event, ...updated } : event
          );
        }
      })
      .addCase(rejectAdminEvent.rejected, (state, action) => {
        state.adminEvents.loading = false;
        state.adminEvents.success = false;
        state.adminEvents.error = action.payload || 'Failed to ban event';
      });

    // Fetch Event Analytics
    builder
      .addCase(fetchEventAnalytics.pending, (state) => {
        state.analytics.loading = true;
        state.analytics.error = null;
        state.analytics.success = null;
      })
      .addCase(fetchEventAnalytics.fulfilled, (state, action) => {
        state.analytics.loading = false;
        state.analytics.success = true;
        state.analytics.error = null;
        state.analytics.list = action.payload || [];
      })
      .addCase(fetchEventAnalytics.rejected, (state, action) => {
        state.analytics.loading = false;
        state.analytics.success = false;
        state.analytics.error = action.payload || 'Failed to fetch event analytics';
      });

    // Fetch Provider Events
    builder
      .addCase(fetchProviderEvents.pending, (state) => {
        state.providerEvents.loading = true;
        state.providerEvents.error = null;
        state.providerEvents.success = null;
      })
      .addCase(fetchProviderEvents.fulfilled, (state, action) => {
        state.providerEvents.loading = false;
        state.providerEvents.success = true;
        state.providerEvents.error = null;
        state.providerEvents.list = action.payload || [];
      })
      .addCase(fetchProviderEvents.rejected, (state, action) => {
        state.providerEvents.loading = false;
        state.providerEvents.success = false;
        state.providerEvents.error = action.payload || 'Failed to fetch provider events';
      })

      // Fetch Organizer Own Events
      .addCase(fetchOrganizerEvents.pending, (state) => {
        state.organizerEvents.loading = true;
        state.organizerEvents.error = null;
        state.organizerEvents.success = null;
      })
      .addCase(fetchOrganizerEvents.fulfilled, (state, action) => {
        state.organizerEvents.loading = false;
        state.organizerEvents.success = true;
        state.organizerEvents.error = null;
        state.organizerEvents.list = action.payload || [];
      })
      .addCase(fetchOrganizerEvents.rejected, (state, action) => {
        state.organizerEvents.loading = false;
        state.organizerEvents.success = false;
        state.organizerEvents.error = action.payload || 'Failed to fetch organizer events';
      })

      // Fetch Organizer Event Details
      .addCase(fetchOrganizerEventById.pending, (state) => {
        state.organizerEventDetails.loading = true;
        state.organizerEventDetails.error = null;
        state.organizerEventDetails.success = null;
      })
      .addCase(fetchOrganizerEventById.fulfilled, (state, action) => {
        state.organizerEventDetails.loading = false;
        state.organizerEventDetails.success = true;
        state.organizerEventDetails.error = null;
        state.organizerEventDetails.item = action.payload || null;
      })
      .addCase(fetchOrganizerEventById.rejected, (state, action) => {
        state.organizerEventDetails.loading = false;
        state.organizerEventDetails.success = false;
        state.organizerEventDetails.error = action.payload || 'Failed to fetch event details';
        state.organizerEventDetails.item = null;
      })

      // Create Organizer Event
      .addCase(createOrganizerEvent.pending, (state) => {
        state.createOrganizerEvent.loading = true;
        state.createOrganizerEvent.error = null;
        state.createOrganizerEvent.success = null;
      })
      .addCase(createOrganizerEvent.fulfilled, (state, action) => {
        state.createOrganizerEvent.loading = false;
        state.createOrganizerEvent.success = true;
        state.createOrganizerEvent.error = null;
        const created = action.payload;
        if (created && typeof created === 'object') {
          state.organizerEvents.list = [created, ...(Array.isArray(state.organizerEvents.list) ? state.organizerEvents.list : [])];
        }
      })
      .addCase(createOrganizerEvent.rejected, (state, action) => {
        state.createOrganizerEvent.loading = false;
        state.createOrganizerEvent.success = false;
        state.createOrganizerEvent.error = action.payload || 'Failed to create organizer event';
      })

      // Update Organizer Event
      .addCase(updateOrganizerEvent.pending, (state) => {
        state.updateOrganizerEvent.loading = true;
        state.updateOrganizerEvent.error = null;
        state.updateOrganizerEvent.success = null;
      })
      .addCase(updateOrganizerEvent.fulfilled, (state, action) => {
        state.updateOrganizerEvent.loading = false;
        state.updateOrganizerEvent.success = true;
        state.updateOrganizerEvent.error = null;
        const updated = action.payload;
        if (updated && typeof updated === 'object' && updated.id) {
          state.organizerEvents.list = (Array.isArray(state.organizerEvents.list)
            ? state.organizerEvents.list
            : []
          ).map((event) => String(event?.id) === String(updated.id) ? updated : event);
        }
      })
      .addCase(updateOrganizerEvent.rejected, (state, action) => {
        state.updateOrganizerEvent.loading = false;
        state.updateOrganizerEvent.success = false;
        state.updateOrganizerEvent.error = action.payload || 'Failed to update organizer event';
      })

      // Delete Organizer Event
      .addCase(deleteOrganizerEvent.pending, (state) => {
        state.deleteOrganizerEvent.loading = true;
        state.deleteOrganizerEvent.error = null;
        state.deleteOrganizerEvent.success = null;
      })
      .addCase(deleteOrganizerEvent.fulfilled, (state, action) => {
        state.deleteOrganizerEvent.loading = false;
        state.deleteOrganizerEvent.success = true;
        state.deleteOrganizerEvent.error = null;
        const deletedId = action.payload;
        state.organizerEvents.list = (Array.isArray(state.organizerEvents.list)
          ? state.organizerEvents.list
          : []
        ).filter((event) => String(event?.id) !== String(deletedId));
      })
      .addCase(deleteOrganizerEvent.rejected, (state, action) => {
        state.deleteOrganizerEvent.loading = false;
        state.deleteOrganizerEvent.success = false;
        state.deleteOrganizerEvent.error = action.payload || 'Failed to delete organizer event';
      });
  },
});

export const { resetEventsError, resetEvents } = eventsSlice.actions;

// Selectors
export const selectAllEvents = (state) => state.events.events.list;
export const selectEventsLoading = (state) => state.events.events.loading;
export const selectEventsError = (state) => state.events.events.error;

export const selectAdminEvents = (state) => state.events.adminEvents.list;
export const selectAdminEventsLoading = (state) => state.events.adminEvents.loading;
export const selectAdminEventsError = (state) => state.events.adminEvents.error;

export const selectEventAnalytics = (state) => state.events.analytics.list;
export const selectAnalyticsLoading = (state) => state.events.analytics.loading;
export const selectAnalyticsError = (state) => state.events.analytics.error;

export const selectProviderEvents = (state) => state.events.providerEvents.list;
export const selectProviderEventsLoading = (state) => state.events.providerEvents.loading;
export const selectProviderEventsError = (state) => state.events.providerEvents.error;

export const selectOrganizerEvents = (state) => state.events.organizerEvents.list;
export const selectOrganizerEventsLoading = (state) => state.events.organizerEvents.loading;
export const selectOrganizerEventsError = (state) => state.events.organizerEvents.error;

export const selectOrganizerEventDetails = (state) => state.events.organizerEventDetails.item;
export const selectOrganizerEventDetailsLoading = (state) => state.events.organizerEventDetails.loading;
export const selectOrganizerEventDetailsError = (state) => state.events.organizerEventDetails.error;

export const selectCreateOrganizerEventLoading = (state) => state.events.createOrganizerEvent.loading;
export const selectCreateOrganizerEventError = (state) => state.events.createOrganizerEvent.error;

export const selectUpdateOrganizerEventLoading = (state) => state.events.updateOrganizerEvent.loading;
export const selectUpdateOrganizerEventError = (state) => state.events.updateOrganizerEvent.error;

export const selectDeleteOrganizerEventLoading = (state) => state.events.deleteOrganizerEvent.loading;
export const selectDeleteOrganizerEventError = (state) => state.events.deleteOrganizerEvent.error;

export default eventsSlice.reducer;
