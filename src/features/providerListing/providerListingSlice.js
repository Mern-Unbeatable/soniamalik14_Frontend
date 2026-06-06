import { createSlice } from '@reduxjs/toolkit';
import { fetchProviderListings, deleteProviderListing } from './providerListingAPI';

const initialState = {
  listings: {
    list: [],
    loading: false,
    error: null,
    success: null,
  },
};

const providerListingSlice = createSlice({
  name: 'providerListing',
  initialState,
  reducers: {
    resetProviderListingError: (state) => {
      state.listings.error = null;
    },
    resetProviderListings: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProviderListings.pending, (state) => {
        state.listings.loading = true;
        state.listings.error = null;
        state.listings.success = null;
      })
      .addCase(fetchProviderListings.fulfilled, (state, action) => {
        state.listings.loading = false;
        state.listings.success = true;
        state.listings.error = null;
        state.listings.list = action.payload || [];
      })
      .addCase(fetchProviderListings.rejected, (state, action) => {
        state.listings.loading = false;
        state.listings.success = false;
        state.listings.error = action.payload || 'Failed to fetch provider listings';
      });

    builder
      .addCase(deleteProviderListing.pending, (state) => {
        // optional: state.listings.loading = true;
      })
      .addCase(deleteProviderListing.fulfilled, (state, action) => {
        state.listings.list = state.listings.list.filter((item) => item.id !== action.payload);
      })
      .addCase(deleteProviderListing.rejected, (state, action) => {
        state.listings.error = action.payload || 'Failed to delete provider listing';
      });
  },
});

export const { resetProviderListingError, resetProviderListings } = providerListingSlice.actions;

export const selectProviderListings = (state) => state.providerListing.listings.list;
export const selectProviderListingsLoading = (state) => state.providerListing.listings.loading;
export const selectProviderListingsError = (state) => state.providerListing.listings.error;

export default providerListingSlice.reducer;
