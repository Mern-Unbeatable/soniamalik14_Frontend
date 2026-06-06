import { createAsyncThunk } from '@reduxjs/toolkit';
import { GET, DELETE } from '../../services/httpMethods';
import { apiExecutor } from '../../services/apiExecutor';
import { toast } from 'react-toastify';

export const fetchProviderListings = createAsyncThunk(
  'providerListing/fetchProviderListings',
  async (_, { rejectWithValue, signal }) => {
    try {
      const response = await apiExecutor(
        (signal) => GET('/api/services/provider/my', {}, signal),
        rejectWithValue,
        signal
      );
      return response?.data?.data || response?.data || response || [];
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch provider listings');
    }
  }
);

export const deleteProviderListing = createAsyncThunk(
  'providerListing/deleteProviderListing',
  async (id, { rejectWithValue, signal }) => {
    try {
      await apiExecutor(
        (signal) => DELETE(`/api/services/${id}`, signal),
        rejectWithValue,
        signal
      );
      toast.success('Listing deleted successfully');
      return id;
    } catch (error) {
      toast.error(error.message || 'Failed to delete provider listing');
      return rejectWithValue(error.message || 'Failed to delete provider listing');
    }
  }
);
