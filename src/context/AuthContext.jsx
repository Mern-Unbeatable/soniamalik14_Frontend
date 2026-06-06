import { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import {
  ROLES,
  fetchMe as fetchMeThunk,
  login as loginThunk,
  register as registerThunk,
  logout as logoutThunk,
  selectAuthError,
  selectAuthLoading,
  selectAuthUser,
  selectIsAuthenticated,
} from '../features/auth/authSlice';
import { getToken } from '../utils/storage';

export const useAuth = () => {
  const dispatch = useDispatch();
  const user = useSelector(selectAuthUser);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const loading = useSelector(selectAuthLoading);
  const error = useSelector(selectAuthError);

  const login = useCallback(async (email, password) => {
    try {
      const payload = await dispatch(loginThunk({ email, password })).unwrap();
      return { success: true, user: payload?.user, token: payload?.token };
    } catch (err) {
      const message = err?.message || err?.payload?.message || err?.payload || 'Login failed';
      toast.error(message);
      return { success: false, message };
    }
  }, [dispatch]);

  const fetchMe = useCallback(async () => {
    try {
      const payload = await dispatch(fetchMeThunk()).unwrap();
      return { success: true, user: payload?.user, token: payload?.token };
    } catch (err) {
      const message = err?.message || err?.payload?.message || err?.payload || 'Failed to fetch profile';
      return { success: false, message };
    }
  }, [dispatch]);

  const logout = useCallback(async () => {
    try {
      await dispatch(logoutThunk()).unwrap();
      return { success: true };
    } catch (err) {
      const message = err?.message || err?.payload?.message || err?.payload || 'Logout failed';
      toast.error(message);
      return { success: false, message };
    }
  }, [dispatch]);

  const register = useCallback(async (registrationPayload) => {
    try {
      const payload = await dispatch(registerThunk(registrationPayload)).unwrap();
      return { success: true, data: payload };
    } catch (err) {
      const message = err?.message || err?.payload?.message || err?.payload || 'Registration failed';
      toast.error(message);
      return { success: false, message };
    }
  }, [dispatch]);

  useEffect(() => {
    const token = getToken();

    if (!user && token) {
      const tryFetch = async () => {
        try {
          await fetchMe();
        } catch (e) {
          // noop
        }
      };

      tryFetch();
    }
  }, [fetchMe, user]);

  const hasRole = (role) => user?.role === role;
  const hasAnyRole = (roles = []) => roles.includes(user?.role);

  return { user, isAuthenticated, loading, error, login, register, logout, fetchMe, hasRole, hasAnyRole };
};

export { ROLES };

export default useAuth;
