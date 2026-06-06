import { createAsyncThunk, createSelector, createSlice } from '@reduxjs/toolkit';
import usersAPI from './usersAPI';

const EMPTY_ARRAY = Object.freeze([]);

const getErrorPayload = (error, fallbackMessage) => {
  return {
    message:
      error?.response?.data?.message ||
      error?.response?.data?.error ||
      error?.message ||
      fallbackMessage,
    status: error?.response?.status || 0,
  };
};

const normalizeFilters = (filters = {}) => {
  return Object.keys(filters)
    .sort()
    .reduce((acc, key) => {
      acc[key] = filters[key];
      return acc;
    }, {});
};

const serializeUsersQuery = ({ page = 1, limit = 100, filters = {} } = {}) => {
  return JSON.stringify({ page, limit, filters: normalizeFilters(filters) });
};

const initialState = {
  allUsers: [],
  suspendedUsers: [],
  loading: false,
  suspendedLoading: false,
  error: null,
  suspend: {
    loading: false,
    error: null,
  },
  requestMeta: {
    allUsersPendingKey: null,
    suspendedUsersPendingKey: null,
  },
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
  },
};

export const fetchSuspendedUsers = createAsyncThunk(
  'users/fetchSuspendedUsers',
  async ({ page = 1, limit = 100, filters = {} }, { rejectWithValue, signal }) => {
    try {
      const params = { page, limit, ...filters };
      const response = await usersAPI.getSuspendedUsers(params, signal);
      return response?.data ?? response;
    } catch (error) {
      return rejectWithValue(getErrorPayload(error, 'Failed to fetch suspended users'));
    }
  },
  {
    condition: (args, { getState }) => {
      const usersState = getState()?.users;
      if (!usersState) return true;

      const queryKey = serializeUsersQuery(args);
      const isSamePendingRequest =
        usersState.suspendedLoading &&
        usersState.requestMeta?.suspendedUsersPendingKey === queryKey;

      return !isSamePendingRequest;
    },
  }
);

export const fetchAllUsers = createAsyncThunk(
  'users/fetchAllUsers',
  async ({ page = 1, limit = 100, filters = {} }, { rejectWithValue, signal }) => {
    try {
      const params = { page, limit, ...filters };
      const response = await usersAPI.getAllUsers(params, signal);
      return response?.data ?? response;
    } catch (error) {
      return rejectWithValue(getErrorPayload(error, 'Failed to fetch users'));
    }
  },
  {
    condition: (args, { getState }) => {
      const usersState = getState()?.users;
      if (!usersState) return true;

      const queryKey = serializeUsersQuery(args);
      const isSamePendingRequest =
        usersState.loading && usersState.requestMeta?.allUsersPendingKey === queryKey;

      return !isSamePendingRequest;
    },
  }
);

export const suspendUser = createAsyncThunk(
  'users/suspendUser',
  async ({ userId, reason }, { rejectWithValue, signal }) => {
    try {
      const response = await usersAPI.suspendUser(userId, { reason }, signal);
      const payload = response?.data ?? response;
      return { userId, ...payload };
    } catch (error) {
      return rejectWithValue(getErrorPayload(error, 'Failed to suspend user'));
    }
  }
);

export const unsuspendUser = createAsyncThunk(
  'users/unsuspendUser',
  async ({ userId }, { rejectWithValue, signal }) => {
    try {
      const response = await usersAPI.unsuspendUser(userId, signal);
      const payload = response?.data ?? response;
      return { userId, ...payload };
    } catch (error) {
      return rejectWithValue(getErrorPayload(error, 'Failed to reinstate user'));
    }
  }
);

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    resetError: (state, action) => {
      const { type } = action.payload || {};
      if (type === 'users') state.error = null;
      if (type === 'suspend') state.suspend.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSuspendedUsers.pending, (state, action) => {
        state.suspendedLoading = true;
        state.suspend.error = null;
        state.requestMeta.suspendedUsersPendingKey = serializeUsersQuery(action.meta.arg);
      })
      .addCase(fetchSuspendedUsers.fulfilled, (state, action) => {
        state.suspendedLoading = false;
        state.suspendedUsers = action.payload?.data || action.payload || [];
        state.pagination = action.payload?.pagination || state.pagination;
        state.requestMeta.suspendedUsersPendingKey = null;
      })
      .addCase(fetchSuspendedUsers.rejected, (state, action) => {
        state.suspendedLoading = false;
        state.suspend.error =
          action.payload?.message || action.error?.message || 'Failed to fetch suspended users';
        state.requestMeta.suspendedUsersPendingKey = null;
      })
      .addCase(fetchAllUsers.pending, (state, action) => {
        state.loading = true;
        state.error = null;
        state.requestMeta.allUsersPendingKey = serializeUsersQuery(action.meta.arg);
      })
      .addCase(fetchAllUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.allUsers = action.payload?.data || action.payload || [];
        state.pagination = action.payload?.pagination || state.pagination;
        state.requestMeta.allUsersPendingKey = null;
      })
      .addCase(fetchAllUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || action.error?.message || 'Failed to fetch users';
        state.requestMeta.allUsersPendingKey = null;
      })
      .addCase(suspendUser.pending, (state) => {
        state.suspend.loading = true;
        state.suspend.error = null;
      })
      .addCase(suspendUser.fulfilled, (state) => {
        state.suspend.loading = false;
      })
      .addCase(suspendUser.rejected, (state, action) => {
        state.suspend.loading = false;
        state.suspend.error =
          action.payload?.message || action.error?.message || 'Failed to suspend user';
      })
      .addCase(unsuspendUser.pending, (state) => {
        state.suspend.loading = true;
        state.suspend.error = null;
      })
      .addCase(unsuspendUser.fulfilled, (state) => {
        state.suspend.loading = false;
      })
      .addCase(unsuspendUser.rejected, (state, action) => {
        state.suspend.loading = false;
        state.suspend.error =
          action.payload?.message || action.error?.message || 'Failed to reinstate user';
      });
  },
});

export const { resetError } = usersSlice.actions;

const selectUsersState = (state) => state.users;

export const selectAllUsers = createSelector(
  [selectUsersState],
  (usersState) => usersState?.allUsers || EMPTY_ARRAY
);
export const selectUsersLoading = createSelector(
  [selectUsersState],
  (usersState) => Boolean(usersState?.loading)
);
export const selectUsersError = createSelector(
  [selectUsersState],
  (usersState) => usersState?.error
);
export const selectSuspendLoading = createSelector(
  [selectUsersState],
  (usersState) => Boolean(usersState?.suspend?.loading)
);
export const selectPagination = createSelector(
  [selectUsersState],
  (usersState) => usersState?.pagination
);
export const selectSuspendedUsers = createSelector(
  [selectUsersState],
  (usersState) => usersState?.suspendedUsers || EMPTY_ARRAY
);
export const selectSuspendedLoading = createSelector(
  [selectUsersState],
  (usersState) => Boolean(usersState?.suspendedLoading)
);
export const selectSuspendedError = createSelector(
  [selectUsersState],
  (usersState) => usersState?.suspend?.error
);

const selectRoleUsers = (role) =>
  createSelector([selectAllUsers], (allUsers) => allUsers.filter((user) => user?.role === role));

export const selectPlayerUsers = selectRoleUsers('USER');
export const selectCoachUsers = selectRoleUsers('COACH');
export const selectProviderUsers = selectRoleUsers('PROVIDER');

const selectUnknownUsers = createSelector([selectAllUsers], () => EMPTY_ARRAY);

export const selectUsersByRole = (role) => {
  const normalizedRole = String(role || '').toUpperCase();

  if (normalizedRole === 'USER') return selectPlayerUsers;
  if (normalizedRole === 'COACH') return selectCoachUsers;
  if (normalizedRole === 'PROVIDER') return selectProviderUsers;

  return selectUnknownUsers;
};

export default usersSlice.reducer;
