import { createAsyncThunk } from '@reduxjs/toolkit';
import { GET } from '../../services/httpMethods';
import { ENDPOINT } from '../../services/httpEndpoint';
import { apiExecutor } from '../../services/apiExecutor';

export const fetchProducts = createAsyncThunk(
  'products/fetchAll',
  async (_, { rejectWithValue, signal }) => {
    if (!ENDPOINT?.PUBLIC?.PRODUCTS) {
      // No products endpoint configured â€” return empty list to avoid axios calls with undefined URL
      return [];
    }
    return apiExecutor(
      (signal) => GET(ENDPOINT.PUBLIC.PRODUCTS, { signal }),
      rejectWithValue,
      signal
    );
  },
  {
    condition: (_, { getState }) => {
      const { status } = getState().products;
      return status !== 'loading' && status !== 'succeeded';
    },
  }
);
