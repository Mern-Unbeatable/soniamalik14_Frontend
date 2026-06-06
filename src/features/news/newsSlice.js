import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  list: [],
  success: null,
  error: null,
  loading: false,
};

const newsSlice = createSlice({
  name: 'news',
  initialState,
  reducers: {
    resetNewsError: (state) => {
      state.error = null;
    },
    resetNews: () => initialState,
    setNewsList: (state, action) => {
      state.list = action.payload || [];
      state.loading = false;
      state.error = null;
      state.success = true;
    },
    setLoading: (state, action) => {
      state.loading = !!action.payload;
    },
    addNewsItem: (state, action) => {
      state.list.unshift(action.payload);
    },
    updateNewsItem: (state, action) => {
      const { id, data } = action.payload;
      const index = state.list.findIndex((item) => item.id === id);
      if (index !== -1) state.list[index] = { ...state.list[index], ...data };
    },
    removeNewsItem: (state, action) => {
      state.list = state.list.filter((item) => item.id !== action.payload);
    },
  },
});

export const { resetNewsError, resetNews, setNewsList, setLoading, addNewsItem, updateNewsItem, removeNewsItem } = newsSlice.actions;

// Selectors
export const selectAllNews = (state) => state.news.list;
export const selectNewsLoading = (state) => state.news.loading;
export const selectNewsError = (state) => state.news.error;
export const selectNewsSuccess = (state) => state.news.success;

export default newsSlice.reducer;
