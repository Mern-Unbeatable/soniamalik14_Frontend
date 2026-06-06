import { createSlice } from '@reduxjs/toolkit';
import {
  fetchApprovedServices,
  fetchProviderServices,
  fetchPendingServices,
  createService,
  updateService,
  deleteService,
  approveService,
  rejectService,
} from './serviceApi';

/**
 * Professional Service State Management
 * Separates approved, provider-owned, and pending services for better organization
 */
const initialState = {
  approved: {
    list: [],
    loading: false,
    error: null,
  },
  providerServices: {
    list: [],
    loading: false,
    error: null,
  },

  pending: {
    list: [],
    loading: false,
    error: null,
  },
  create: {
    loading: false,
    error: null,
    success: false,
  },
  update: {
    loading: false,
    error: null,
  },
  delete: {
    loading: false,
    error: null,
  },
};

const serviceSlice = createSlice({
  name: 'service',
  initialState,
  reducers: {
    resetServiceError: (state) => {
      state.approved.error = null;
      state.providerServices.error = null;
      state.pending.error = null;
      state.create.error = null;
      state.update.error = null;
      state.delete.error = null;
    },
    resetServiceSuccess: (state) => {
      state.create.success = false;
    },
    resetService: () => initialState,
  },
  extraReducers: (builder) => {
    // Fetch Approved Services (public)
    builder
      .addCase(fetchApprovedServices.pending, (state) => {
        state.approved.loading = true;
        state.approved.error = null;
      })
      .addCase(fetchApprovedServices.fulfilled, (state, action) => {
        state.approved.loading = false;
        state.approved.list = action.payload || [];
      })
      .addCase(fetchApprovedServices.rejected, (state, action) => {
        state.approved.loading = false;
        state.approved.error = action.payload || 'Failed to fetch approved services';
      });

    // Fetch Provider Services
    builder
      .addCase(fetchProviderServices.pending, (state) => {
        state.providerServices.loading = true;
        state.providerServices.error = null;
      })
      .addCase(fetchProviderServices.fulfilled, (state, action) => {
        state.providerServices.loading = false;
        state.providerServices.list = action.payload || [];
      })
      .addCase(fetchProviderServices.rejected, (state, action) => {
        state.providerServices.loading = false;
        state.providerServices.error = action.payload || 'Failed to fetch provider services';
      });


    // Fetch Pending Services (admin)
    builder
      .addCase(fetchPendingServices.pending, (state) => {
        state.pending.loading = true;
        state.pending.error = null;
      })
      .addCase(fetchPendingServices.fulfilled, (state, action) => {
        state.pending.loading = false;
        state.pending.list = action.payload || [];
      })
      .addCase(fetchPendingServices.rejected, (state, action) => {
        state.pending.loading = false;
        state.pending.error = action.payload || 'Failed to fetch pending services';
      });

    // Create Service
    builder
      .addCase(createService.pending, (state) => {
        state.create.loading = true;
        state.create.error = null;
        state.create.success = false;
      })
      .addCase(createService.fulfilled, (state, action) => {
        state.create.loading = false;
        state.create.success = true;
        // Add to provider services list
        state.providerServices.list.unshift(action.payload);
      })
      .addCase(createService.rejected, (state, action) => {
        state.create.loading = false;
        state.create.error = action.payload || 'Failed to create service';
        state.create.success = false;
      });

    // Update Service
    builder
      .addCase(updateService.pending, (state) => {
        state.update.loading = true;
        state.update.error = null;
      })
      .addCase(updateService.fulfilled, (state, action) => {
        state.update.loading = false;
        // Update in provider services list
        const index = state.providerServices.list.findIndex((s) => s.id === action.payload.id);
        if (index !== -1) {
          state.providerServices.list[index] = action.payload;
        }
      })
      .addCase(updateService.rejected, (state, action) => {
        state.update.loading = false;
        state.update.error = action.payload || 'Failed to update service';
      });

    // Delete Service
    builder
      .addCase(deleteService.pending, (state) => {
        state.delete.loading = true;
        state.delete.error = null;
      })
      .addCase(deleteService.fulfilled, (state, action) => {
        state.delete.loading = false;
        // Remove from provider services list
        state.providerServices.list = state.providerServices.list.filter(
          (s) => s.id !== action.payload
        );
      })
      .addCase(deleteService.rejected, (state, action) => {
        state.delete.loading = false;
        state.delete.error = action.payload || 'Failed to delete service';
      });

    // Approve Service (admin)
    builder
      .addCase(approveService.pending, (state) => {
        // Loading state handled by pending services
      })
      .addCase(approveService.fulfilled, (state, action) => {
        // Remove from pending list
        state.pending.list = state.pending.list.filter((s) => s.id !== action.payload.id);
        // Add to approved list if available
        if (state.approved.list) {
          state.approved.list.unshift(action.payload);
        }
      })
      .addCase(approveService.rejected, (state, action) => {
        state.pending.error = action.payload || 'Failed to approve service';
      });

    // Reject Service (admin)
    builder
      .addCase(rejectService.pending, (state) => {
        // Loading state handled by pending services
      })
      .addCase(rejectService.fulfilled, (state, action) => {
        // Remove from pending list
        state.pending.list = state.pending.list.filter((s) => s.id !== action.payload.id);
      })
      .addCase(rejectService.rejected, (state, action) => {
        state.pending.error = action.payload || 'Failed to reject service';
      });
  },
});

export const { resetServiceError, resetServiceSuccess, resetService } = serviceSlice.actions;

// Selectors - Professional and organized
export const selectApprovedServices = (state) => state.service.approved.list;
export const selectApprovedLoading = (state) => state.service.approved.loading;
export const selectApprovedError = (state) => state.service.approved.error;

export const selectProviderServices = (state) => state.service.providerServices.list;
export const selectProviderServicesLoading = (state) => state.service.providerServices.loading;
export const selectProviderServicesError = (state) => state.service.providerServices.error;


export const selectPendingServices = (state) => state.service.pending.list;
export const selectPendingLoading = (state) => state.service.pending.loading;
export const selectPendingError = (state) => state.service.pending.error;

export const selectCreateLoading = (state) => state.service.create.loading;
export const selectCreateError = (state) => state.service.create.error;
export const selectCreateSuccess = (state) => state.service.create.success;

// Helper selectors for filtered data
export const selectServicesByStatus = (state, status) => {
  return state.service.providerServices.list.filter((s) => s.status === status);
};

export default serviceSlice.reducer;
