import { createAsyncThunk } from '@reduxjs/toolkit';
import { GET, POST, PUT } from '../../services/httpMethods';
import { toast } from 'react-toastify';

const getApiErrorMessage = (error, fallbackMessage) => {
  const payload = error?.response?.data || error;
  return payload?.message || fallbackMessage || error?.message || 'Request failed';
};

const normalizeCategoriesPayload = (payload) => {
  if (Array.isArray(payload)) return payload;
  if (!payload || typeof payload !== 'object') return [];
  if (Array.isArray(payload.data)) return payload.data;
  if (Array.isArray(payload.rows)) return payload.rows;
  return [];
};

export const fetchSportsCategories = createAsyncThunk(
  'sportsCategories/fetchAll',
  async (_, { rejectWithValue, signal }) => {
    try {
      const response = await GET('/api/sports-categories', {}, signal);
      const result = response?.data || response;
      return normalizeCategoriesPayload(result);
    } catch (error) {
      return rejectWithValue(error?.message || 'Failed to fetch categories');
    }
  }
);

export const createSportsCategory = createAsyncThunk(
  'sportsCategories/create',
  async (categoryData, { rejectWithValue, signal }) => {
    try {
      const response = await POST('/api/sports-categories', categoryData, signal);
      const result = response?.data || response;
      toast.success(result?.message || 'Category added successfully');
      return result?.data || result;
    } catch (error) {
      const message = getApiErrorMessage(error, 'Failed to add category');
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

export const updateSportsCategory = createAsyncThunk(
  'sportsCategories/update',
  async ({ id, name }, { rejectWithValue, signal }) => {
    try {
      const response = await PUT(`/api/sports-categories/${id}`, { name }, signal);
      const result = response?.data || response;
      toast.success(result?.message || 'Category updated successfully');
      return result?.data || result;
    } catch (error) {
      const message = getApiErrorMessage(error, 'Failed to update category');
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

