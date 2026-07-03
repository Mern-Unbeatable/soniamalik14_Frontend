import { createSlice } from '@reduxjs/toolkit';
import { fetchSportsCategories, createSportsCategory, updateSportsCategory, deleteSportsCategory } from './sportsCategoriesAPI';

const initialState = {
  list: [],
  loading: false,
  error: null,
  success: null,
  createLoading: false,
  createError: null,
  createSuccess: null,
};

const sportsCategoriesSlice = createSlice({
  name: 'sportsCategories',
  initialState,
  reducers: {
    resetCategoryError: (state) => {
      state.error = null;
      state.createError = null;
    },
    resetCategorySuccess: (state) => {
      state.success = null;
      state.createSuccess = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch categories
      .addCase(fetchSportsCategories.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = null;
      })
      .addCase(fetchSportsCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.list = action.payload || [];
      })
      .addCase(fetchSportsCategories.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error = action.payload || 'Failed to fetch categories';
      })
      // Create category
      .addCase(createSportsCategory.pending, (state) => {
        state.createLoading = true;
        state.createError = null;
        state.createSuccess = null;
      })
      .addCase(createSportsCategory.fulfilled, (state, action) => {
        state.createLoading = false;
        state.createSuccess = true;
        const created = action.payload;
        if (created) {
          state.list.push(created);
        }
      })
      .addCase(createSportsCategory.rejected, (state, action) => {
        state.createLoading = false;
        state.createSuccess = false;
        state.createError = action.payload || 'Failed to add category';
      })
      // Update category name
      .addCase(updateSportsCategory.fulfilled, (state, action) => {
        const updated = action.payload;
        if (updated && updated.id) {
          const index = state.list.findIndex((item) => item.id === updated.id);
          if (index !== -1) {
            state.list[index] = updated;
          }
        }
      })
      // Delete category
      .addCase(deleteSportsCategory.fulfilled, (state, action) => {
        const deletedId = action.payload;
        if (deletedId) {
          state.list = state.list.filter((item) => item.id !== deletedId);
        }
      });
  }
});

export const { resetCategoryError, resetCategorySuccess } = sportsCategoriesSlice.actions;

// Selectors
export const selectSportsCategories = (state) => state.sportsCategories.list;
export const selectSportsCategoriesLoading = (state) => state.sportsCategories.loading;
export const selectSportsCategoriesError = (state) => state.sportsCategories.error;
export const selectCreateCategoryLoading = (state) => state.sportsCategories.createLoading;

export default sportsCategoriesSlice.reducer;
